import dotenv from "dotenv";
import Image from "../Models/image.js";

dotenv.config();

const DEFAULT_IMAGE_MODEL = "black-forest-labs/flux.1-schnell";
const DEFAULT_IMAGE_SIZE = "1024x1024";
const MAX_PROMPT_LENGTH = 2000;
const MAX_IMAGE_DIMENSION = 4096;
const IMAGE_REQUEST_TIMEOUT_MS = 120_000;
const POLLINATIONS_IMAGE_ENDPOINT =
  "https://gen.pollinations.ai/v1/images/generations";

class PollinationsError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const generateImage = async (req, res) => {
  const body = req.body ?? {};
  const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

  if (!prompt) {
    return res.status(400).json({ error: "A prompt is required." });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res
      .status(400)
      .json({ error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer.` });
  }

  const size = body.size ?? DEFAULT_IMAGE_SIZE;
  if (
    typeof size !== "string" ||
    !/^([1-9]\d{0,3})x([1-9]\d{0,3})$/.test(size) ||
    size.split("x").some((dimension) => Number(dimension) > MAX_IMAGE_DIMENSION)
  ) {
    return res
      .status(400)
      .json({ error: "Size must use WIDTHxHEIGHT format, such as 1024x1024." });
  }

  const configuredModel =
    process.env.POLLINATIONS_IMAGE_MODEL?.trim() || DEFAULT_IMAGE_MODEL;
  const model = body.model ?? configuredModel;
  if (typeof model !== "string" || !model.trim() || model.trim().length > 200) {
    return res.status(400).json({ error: "Model must be a non-empty string." });
  }

  const apiKey = process.env.POLLINATIONS_API_KEY?.trim();
  if (!apiKey) {
    return res
      .status(503)
      .json({ error: "Image generation is not configured on the server." });
  }

  try {
    const imageUrl = await requestPollinationsImage({
      prompt,
      size,
      model: model.trim(),
      apiKey,
    });

    await Image.create({
      imageUrl,
      prompt,
      userId: req.userId,
    });

    return res.status(200).json({ imageUrl });
  } catch (error) {
    if (error instanceof PollinationsError) {
      return res.status(error.status).json({ error: error.message });
    }

    console.error("Image generation or history storage failed:", error);
    return res.status(500).json({ error: "Unable to generate the image." });
  }
};

async function requestPollinationsImage({ prompt, size, model, apiKey }) {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    IMAGE_REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(POLLINATIONS_IMAGE_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        prompt,
        size,
        n: 1,
        response_format: "url",
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const upstreamErrors = {
        400: "Pollinations rejected the prompt, size, or model.",
        401: "Pollinations rejected the API key. Check that it is valid and configured.",
        402: "Pollinations Pollen balance or budget is exhausted.",
      };
      throw new PollinationsError(
        upstreamErrors[response.status] ? response.status : 502,
        upstreamErrors[response.status] ||
          "Image generation service returned an error.",
      );
    }

    let result;
    try {
      result = await response.json();
    } catch (error) {
      if (error instanceof PollinationsError) {
        throw error;
      }
      if (controller.signal.aborted) {
        throw new PollinationsError(
          504,
          "Image generation timed out. Please try again.",
        );
      }
      throw new PollinationsError(
        502,
        "Image generation service returned an invalid response.",
      );
    }

    const image = result?.data?.[0];
    if (typeof image?.url === "string" && image.url.trim()) {
      let imageUrl;
      try {
        imageUrl = new URL(image.url);
      } catch {
        throw new PollinationsError(
          502,
          "Image generation service returned an invalid image URL.",
        );
      }
      if (imageUrl.protocol === "https:" || imageUrl.protocol === "http:") {
        return image.url;
      }
    }

    if (typeof image?.b64_json === "string" && image.b64_json.trim()) {
      return `data:image/png;base64,${image.b64_json}`;
    }

    throw new PollinationsError(
      502,
      "Image generation service did not return an image.",
    );
  } catch (error) {
    if (error instanceof PollinationsError) {
      throw error;
    }
    if (controller.signal.aborted) {
      throw new PollinationsError(
        504,
        "Image generation timed out. Please try again.",
      );
    }
    throw new PollinationsError(
      502,
      "Unable to reach the image generation service.",
    );
  } finally {
    clearTimeout(timeout);
  }
}

export const generateImageHistory = async (req, res) => {
  try {
    const images = await Image.find({ userId: req.userId })
      .select("_id imageUrl prompt")
      .lean();
    return res.status(200).json({
      message: "image generated successfully",
      images,
    });
  } catch (error) {
    console.error("Unable to load generated image history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
