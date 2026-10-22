
import React from "react";
 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";
import { useState } from "react";
import { generateContent } from "../services/content";
import { useParams } from "react-router-dom";

const PAGE ={
    rewrite :{
    header : "Creative AI content Studio",
    subheader : "Describe what you want to rewrite, and let AI bring it to life.",
    inputplaceholder : "e.g. Write a short, friendly product description for a reusable water bottle...",
    loadingmessage : "Generating your content...",
    button_content :  "✨ Generate",
    Output_header : "Rewritten Content",
    handler : generateContent
    },
    extends :{
    header : "Creative AI content Studio",
    subheader : "Describe what you want to extend, and let AI bring it to life.",
    inputplaceholder : "e.g. convert this  , friendly product description for a reusable water bottle...",
    loadingmessage : "Generating your content...",
    button_content :  "✨ Generate",
    Output_header : " extends Content",
    handler : generateContent
    }
    ,
    


    
}
 
const schema = zod.object({
  // resolution: zod.string().min(1, "Resolution is required"),
  prompt: zod.string().min(1, "Prompt is required"),
});
 
/* shared field styles (dark theme, same as generate image page) */
const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60";
 
const Rewrite = () => {
  const [generatedContent, setGeneratedContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const {Action} = useParams();
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    //  defaultValues: { resolution: imageresolution?.[0]?.value ?? "" },
  });
 
  const formHandleSubmit = async (data) => {
    console.log("Form Submitted data:", data);
    setLoading(true);
    setError(null);
    setGeneratedContent(null);
 
    try {
      const res = await PAGE.handler(data);
      if (res?.data?.content) {
        console.log("Content generated ", res.data.content);
        setGeneratedContent(res.data.content);
      } else {
        setError("No content was returned. Please try again.");
      }
    } catch (e) {
      console.log("Error occurred", e);
      setError("Something went wrong while rewriting the content. Please try again.");
    } finally {
      setLoading(false);
    }
  };
 
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopied(true);
 
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Could not copy content:", error);
    }
  };
 
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b14] px-4 py-12 text-zinc-100 sm:px-6">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-28 left-[6%] h-96 w-96 animate-pulse rounded-full bg-violet-500 opacity-30 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-28 right-[6%] h-80 w-80 animate-pulse rounded-full bg-cyan-400 opacity-30 blur-[90px] [animation-delay:-2s]" />
 
      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <header className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-zinc-400">
            ✍️ Content Studio
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
            {PAGE.header}
            </span>

          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            {PAGE.subheader}
          </p>
        </header>
 
        {/* two columns: form (left) + result (right) */}
        <div className="grid items-start gap-6 lg:grid-cols-2">
          {/* ---------- FORM ---------- */}
          <section className="rounded-[20px] border border-white/10 bg-[#14141f]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <form
              onSubmit={handleSubmit(formHandleSubmit)}
              className="space-y-5"
              noValidate
            >
              {/* Prompt */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="prompt" className="text-sm font-medium text-zinc-300">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  placeholder="e.g. Write a short, friendly product description for a reusable water bottle..."
                  rows={10}
                  disabled={loading}
                  className={`${fieldClass} resize-none`}
                  {...register("prompt")}
                />
                {errors?.prompt?.message && (
                  <p className="mt-0.5 text-xs text-red-400">{errors.prompt.message}</p>
                )}
              </div>
 
              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
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
                  "✨ Generate"
                )}
              </button>
            </form>
 
            {/* Error */}
            {error && (
              <div
                className="mt-5 flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                <span className="mt-0.5">⚠</span>
                <span>{error}</span>
              </div>
            )}
          </section>
 
          {/* ---------- RESULT (beside the form on desktop) ---------- */}
          <section
            className="rounded-[20px] border border-white/10 bg-[#14141f]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:sticky lg:top-6"
            aria-live="polite"
          >
            <h2 className="mb-4 text-lg font-semibold text-zinc-100">Result</h2>
 
            {loading ? (
              <div
                className="flex aspect-square animate-pulse items-center justify-center rounded-2xl border border-white/10 bg-[#1b1b2b]"
                role="status"
              >
                <span className="text-sm text-zinc-400">Generating your content...</span>
              </div>
            ) : generatedContent ? (
              <div className="space-y-4">
                <div className="max-h-[420px] overflow-y-auto whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-zinc-200">
                  {generatedContent}
                </div>
 
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    {copied ? "✅ Copied!" : "📋 Copy Content"}
                  </button>
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(generatedContent)}`}
                    download="generated_content.txt"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-cyan-600 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-cyan-950 shadow-lg shadow-cyan-400/25 transition duration-200 hover:-translate-y-0.5"
                  >
                    ⬇️ Download Content
                  </a>
                  <button
                    type="button"
                    onClick={() => setGeneratedContent(null)}
                    className="cursor-pointer text-sm font-semibold text-violet-400 hover:underline"
                  >
                    Generate Again
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 text-center">
                <span className="text-4xl">📝</span>
                <p className="text-sm text-zinc-500">No content generated yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};
 
export default Rewrite;
