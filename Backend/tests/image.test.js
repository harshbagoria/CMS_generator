import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import Image from "../Models/image.js";
import { generateImage } from "../Controller/image.js";

const originalFetch = globalThis.fetch;
const originalSetTimeout = globalThis.setTimeout;
const originalCreate = Image.create;
const originalApiKey = process.env.POLLINATIONS_API_KEY;
const originalModel = process.env.POLLINATIONS_IMAGE_MODEL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  globalThis.setTimeout = originalSetTimeout;
  Image.create = originalCreate;
  if (originalApiKey === undefined) {
    delete process.env.POLLINATIONS_API_KEY;
  } else {
    process.env.POLLINATIONS_API_KEY = originalApiKey;
  }
  if (originalModel === undefined) {
    delete process.env.POLLINATIONS_IMAGE_MODEL;
  } else {
    process.env.POLLINATIONS_IMAGE_MODEL = originalModel;
  }
});

function makeResponse() {
  return {
    statusCode: 200,
    body: undefined,
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

async function invoke(body) {
  const response = makeResponse();
  await generateImage({ body, userId: "507f1f77bcf86cd799439011" }, response);
  return response;
}

test("generates an image with the configured model and persists it", async () => {
  process.env.POLLINATIONS_API_KEY = "sk_test_only";
  delete process.env.POLLINATIONS_IMAGE_MODEL;
  let savedImage;
  Image.create = async (image) => {
    savedImage = image;
    return image;
  };
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://gen.pollinations.ai/v1/images/generations");
    assert.equal(options.method, "POST");
    assert.equal(options.headers.Authorization, "Bearer sk_test_only");
    assert.deepEqual(JSON.parse(options.body), {
      model: "black-forest-labs/flux.1-schnell",
      prompt: "A quiet mountain lake",
      size: "1024x1024",
      n: 1,
      response_format: "url",
    });
    return Response.json({
      data: [{ url: "https://images.pollinations.ai/generated.png" }],
    });
  };

  const response = await invoke({
    prompt: "  A quiet mountain lake  ",
    size: "1024x1024",
  });

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    imageUrl: "https://images.pollinations.ai/generated.png",
  });
  assert.deepEqual(savedImage, {
    imageUrl: "https://images.pollinations.ai/generated.png",
    prompt: "A quiet mountain lake",
    userId: "507f1f77bcf86cd799439011",
  });
});

test("returns base64 image responses as a data URL", async () => {
  process.env.POLLINATIONS_API_KEY = "sk_test_only";
  Image.create = async (image) => image;
  globalThis.fetch = async () =>
    Response.json({ data: [{ b64_json: "ZmFrZS1pbWFnZQ==" }] });

  const response = await invoke({ prompt: "A watercolor bird" });

  assert.equal(response.statusCode, 200);
  assert.equal(response.body.imageUrl, "data:image/png;base64,ZmFrZS1pbWFnZQ==");
});

test("rejects blank or overlong prompts and malformed sizes before fetching", async () => {
  process.env.POLLINATIONS_API_KEY = "sk_test_only";
  globalThis.fetch = async () => {
    assert.fail("Invalid input must not be sent to Pollinations");
  };

  for (const body of [
    { prompt: "  " },
    { prompt: "a".repeat(2001) },
    { prompt: "A valid prompt", size: "1024*1024" },
    { prompt: "A valid prompt", size: "0x1024" },
  ]) {
    const response = await invoke(body);
    assert.equal(response.statusCode, 400);
    assert.equal(typeof response.body.error, "string");
  }
});

test("maps Pollinations client errors without returning upstream payloads", async () => {
  process.env.POLLINATIONS_API_KEY = "sk_test_only";

  for (const [upstreamStatus, expectedStatus] of [
    [400, 400],
    [401, 401],
    [402, 402],
    [503, 502],
  ]) {
    globalThis.fetch = async () =>
      Response.json(
        { error: "upstream-secret-detail" },
        { status: upstreamStatus },
      );

    const response = await invoke({ prompt: "A valid prompt" });
    assert.equal(response.statusCode, expectedStatus);
    assert.equal(JSON.stringify(response.body).includes("upstream-secret-detail"), false);
  }
});

test("returns safe errors for missing credentials and network failures", async () => {
  delete process.env.POLLINATIONS_API_KEY;
  globalThis.fetch = async () => {
    assert.fail("Requests without a configured key must not be sent");
  };

  const missingKeyResponse = await invoke({ prompt: "A valid prompt" });
  assert.equal(missingKeyResponse.statusCode, 503);
  assert.equal(JSON.stringify(missingKeyResponse.body).includes("sk_"), false);

  process.env.POLLINATIONS_API_KEY = "sk_test_only";
  globalThis.fetch = async () => {
    throw new Error("upstream-secret-detail");
  };
  const networkResponse = await invoke({ prompt: "A valid prompt" });
  assert.equal(networkResponse.statusCode, 502);
  assert.equal(JSON.stringify(networkResponse.body).includes("upstream-secret-detail"), false);
});

test("aborts Pollinations requests after 120 seconds", async () => {
  process.env.POLLINATIONS_API_KEY = "sk_test_only";
  globalThis.setTimeout = (callback, delay) => {
    assert.equal(delay, 120_000);
    callback();
    return 0;
  };
  globalThis.fetch = async (_url, { signal }) => {
    assert.equal(signal.aborted, true);
    throw new Error("aborted");
  };

  const response = await invoke({ prompt: "A valid prompt" });

  assert.equal(response.statusCode, 504);
  assert.equal(response.body.error, "Image generation timed out. Please try again.");

  globalThis.fetch = async () => ({
    ok: true,
    json: async () => {
      throw new Error("aborted while reading response");
    },
  });
  const responseBodyTimeout = await invoke({ prompt: "A valid prompt" });
  assert.equal(responseBodyTimeout.statusCode, 504);
});
