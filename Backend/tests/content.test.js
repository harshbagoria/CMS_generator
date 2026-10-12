import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import Content from "../Models/content.js";
import { Getcontenthistory } from "../Controller/rewrite.js";

const originalFind = Content.find;

afterEach(() => {
  Content.find = originalFind;
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

test("returns only the signed-in user's content history, newest first", async () => {
  const userId = "507f1f77bcf86cd799439011";
  const records = [{
    _id: "507f191e810c19729de860ea",
    Input_prompt: "A prompt",
    generated_content: "Generated text",
    type: "generate",
  }];
  const query = {
    select(fields) {
      assert.equal(fields, "_id Input_prompt generated_content type");
      return this;
    },
    sort(order) {
      assert.deepEqual(order, { _id: -1 });
      return this;
    },
    async lean() {
      return records;
    },
  };
  Content.find = (filter) => {
    assert.deepEqual(filter, { userId });
    return query;
  };

  const response = makeResponse();
  await Getcontenthistory({ userId }, response);

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, {
    message: "Content history loaded successfully",
    content: records,
  });
});

test("returns an internal server error if content history lookup fails", async () => {
  Content.find = () => {
    throw new Error("database unavailable");
  };

  const response = makeResponse();
  await Getcontenthistory({ userId: "507f1f77bcf86cd799439011" }, response);

  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, { message: "Internal server error" });
});
