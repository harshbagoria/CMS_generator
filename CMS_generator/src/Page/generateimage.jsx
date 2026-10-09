import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";
import { imageresolution } from "../Constant";
import { generatedImage } from "../services/Image";

const schema = zod.object({
  resolution: zod.string().min(1, "Resolution is required"),
  prompt: zod
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(2000, "Prompt must be 2,000 characters or fewer"),
});

const GenerateImage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { resolution: "1024x1024", prompt: "" },
  });

  const formHandleSubmit = async ({ prompt, resolution }) => {
    setLoading(true);
    setError("");
    setImageUrl("");

    try {
      const response = await generatedImage({
        prompt: prompt.trim(),
        size: resolution,
      });
      if (typeof response?.data?.imageUrl !== "string") {
        setError("No image was returned. Please try again.");
        return;
      }
      setImageUrl(response.data.imageUrl);
    } catch (requestError) {
      const message =
        requestError?.response?.data?.error ??
        requestError?.response?.data?.message;
      setError(
        typeof message === "string"
          ? message
          : "Unable to generate the image. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            AI Image Generator
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Describe what you want to see, and let AI bring it to life.
          </p>
        </header>

        <section className="space-y-6 rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5 sm:p-8">
          <form
            onSubmit={handleSubmit(formHandleSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="resolution"
                className="text-sm font-semibold text-slate-700"
              >
                Resolution
              </label>
              <select
                id="resolution"
                disabled={loading}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                {...register("resolution")}
              >
                {imageresolution.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.resolution?.message && (
                <p className="mt-0.5 text-xs text-red-600">
                  {errors.resolution.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prompt"
                className="text-sm font-semibold text-slate-700"
              >
                Prompt
              </label>
              <textarea
                id="prompt"
                placeholder="e.g. A cyberpunk city street at night, neon lights, rain-slicked pavement..."
                rows={4}
                maxLength={2000}
                disabled={loading}
                className="resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
                {...register("prompt")}
              />
              {errors.prompt?.message && (
                <p className="mt-0.5 text-xs text-red-600">
                  {errors.prompt.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-400"
            >
              {loading ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                    aria-hidden="true"
                  />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </button>
          </form>

          {error && (
            <p
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          )}

          <section className="border-t border-slate-200 pt-6" aria-live="polite">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Result
            </h2>
            {loading ? (
              <div
                className="flex aspect-square items-center justify-center animate-pulse rounded-lg border border-slate-200 bg-slate-100 text-sm text-slate-500"
                role="status"
              >
                Generating your image...
              </div>
            ) : imageUrl ? (
              <div className="space-y-4">
                <img
                  src={imageUrl}
                  alt="Generated from your prompt"
                  className="h-auto w-full rounded-lg border border-slate-200 object-cover shadow-sm"
                />
                <a
                  href={imageUrl}
                  download="generated-image.png"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Download Image
                </a>
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-slate-300">
                <p className="text-sm text-slate-400">No image generated yet.</p>
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
};

export default GenerateImage;
