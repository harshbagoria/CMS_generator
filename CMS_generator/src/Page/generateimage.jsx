// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import zod from "zod";
// import { imageresolution } from "../Constant";
// import { generatedImage } from "../services/Image";
// import { downloadImage } from '../Utils/global';

// const schema = zod.object({
//   resolution: zod.string().min(1, "Resolution is required"),
//   prompt: zod
//     .string()
//     .trim()
//     .min(1, "Prompt is required")
//     .max(2000, "Prompt must be 2,000 characters or fewer"),
// });

// const GenerateImage = () => {
//   const [imageUrl, setImageUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//     defaultValues: { resolution: "1024x1024", prompt: "" },
//   });

//   const formHandleSubmit = async ({ prompt, resolution }) => {
//     setLoading(true);
//     setError("");
//     setImageUrl("");

//     try {
//       const response = await generatedImage({
//         prompt: prompt.trim(),
//         size: resolution,
//       });
//       if (typeof response?.data?.imageUrl !== "string") {
//         setError("No image was returned. Please try again.");
//         return;
//       }
//       setImageUrl(response.data.imageUrl);
//     } catch (requestError) {
//       const message =
//         requestError?.response?.data?.error ??
//         requestError?.response?.data?.message;
//       setError(
//         typeof message === "string"
//           ? message
//           : "Unable to generate the image. Please try again.",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-12">
//       <div className="mx-auto max-w-2xl">
//         <header className="mb-8 text-center">
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//             AI Image Generator
//           </h1>
//           <p className="mt-2 text-sm text-slate-500 sm:text-base">
//             Describe what you want to see, and let AI bring it to life.
//           </p>
//         </header>

//         <section className="space-y-6 rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5 sm:p-8">
//           <form
//             onSubmit={handleSubmit(formHandleSubmit)}
//             className="space-y-5"
//             noValidate
//           >
//             <div className="flex flex-col gap-1.5">
//               <label
//                 htmlFor="resolution"
//                 className="text-sm font-semibold text-slate-700"
//               >
//                 Resolution
//               </label>
//               <select
//                 id="resolution"
//                 disabled={loading}
//                 className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-slate-800 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
//                 {...register("resolution")}
//               >
//                 {imageresolution.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//               {errors.resolution?.message && (
//                 <p className="mt-0.5 text-xs text-red-600">
//                   {errors.resolution.message}
//                 </p>
//               )}
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label
//                 htmlFor="prompt"
//                 className="text-sm font-semibold text-slate-700"
//               >
//                 Prompt
//               </label>
//               <textarea
//                 id="prompt"
//                 placeholder="e.g. A cyberpunk city street at night, neon lights, rain-slicked pavement..."
//                 rows={4}
//                 maxLength={2000}
//                 disabled={loading}
//                 className="resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-slate-800 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
//                 {...register("prompt")}
//               />
//               {errors.prompt?.message && (
//                 <p className="mt-0.5 text-xs text-red-600">
//                   {errors.prompt.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 font-medium text-white shadow-sm shadow-indigo-200 transition-colors hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-400"
//             >
//               {loading ? (
//                 <>
//                   <span
//                     className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
//                     aria-hidden="true"
//                   />
//                   Generating...
//                 </>
//               ) : (
//                 "Generate"
//               )}
//             </button>
//           </form>

//           {error && (
//             <p
//               className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
//               role="alert"
//             >
//               {error}
//             </p>
//           )}

//           <section className="border-t border-slate-200 pt-6" aria-live="polite">
//             <h2 className="mb-4 text-lg font-semibold text-slate-800">
//               Result
//             </h2>
//             {loading ? (
//               <div
//                 className="flex aspect-square items-center justify-center animate-pulse rounded-lg border border-slate-200 bg-slate-100 text-sm text-slate-500"
//                 role="status"
//               >
//                 Generating your image...
//               </div>
//             ) : imageUrl ? (
//               <div className="space-y-4">
//                 <img
//                   src={imageUrl}
//                   alt="Generated from your prompt"
//                   className="h-auto w-full rounded-lg border border-slate-200 object-cover shadow-sm"
//                 />
//                 {/* <a
//                   href={imageUrl}
//                   download="generated-image.png"
//                   target="_blank"
//                   rel="noreferrer"
//                   className="inline-flex rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
//                 >
//                   Download Image
//                 </a> */}
//                 <button
//                   type="button"
//                   onClick={() => downloadImage(item.imageUrl, item._id)}
//                   className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
//                   Download image
//                 </button>
//               </div>
//             ) : (
//               <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-slate-300">
//                 <p className="text-sm text-slate-400">No image generated yet.</p>
//               </div>
//             )}
//           </section>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default GenerateImage;




import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import zod from "zod";
import { imageresolution } from "../Constant";
import { generatedImage } from "../services/Image";
import { downloadImage } from "../Utils/global";

const schema = zod.object({
  resolution: zod.string().min(1, "Resolution is required"),
  prompt: zod
    .string()
    .trim()
    .min(1, "Prompt is required")
    .max(2000, "Prompt must be 2,000 characters or fewer"),
});

/* shared field styles (dark theme, same as home page) */
const fieldClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60";

const GenerateImage = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { resolution: "1024x1024", prompt: "" },
  });

  const promptLength = watch("prompt")?.length || 0;

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
    <main className="relative min-h-screen overflow-hidden bg-[#0b0b14] px-4 py-12 text-zinc-100 sm:px-6">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-28 left-[6%] h-96 w-96 animate-pulse rounded-full bg-violet-500 opacity-30 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-28 right-[6%] h-80 w-80 animate-pulse rounded-full bg-cyan-400 opacity-30 blur-[90px] [animation-delay:-2s]" />

      <div className="relative mx-auto max-w-6xl">
        <header className="mb-10 text-center">
          <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-zinc-400">
            🎨 Image Studio
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            AI Image{" "}
            <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Generator
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 sm:text-base">
            Describe what you want to see, and let AI bring it to life.
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
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="resolution"
                  className="text-sm font-medium text-zinc-300"
                >
                  Resolution
                </label>
                <select
                  id="resolution"
                  disabled={loading}
                  className={fieldClass}
                  {...register("resolution")}
                >
                  {imageresolution.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-[#14141f] text-zinc-100"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.resolution?.message && (
                  <p className="mt-0.5 text-xs text-red-400">
                    {errors.resolution.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <label
                    htmlFor="prompt"
                    className="text-sm font-medium text-zinc-300"
                  >
                    Prompt
                  </label>
                  <span className="text-xs text-zinc-500">
                    {promptLength}/2000
                  </span>
                </div>
                <textarea
                  id="prompt"
                  placeholder="e.g. A cyberpunk city street at night, neon lights, rain-slicked pavement..."
                  rows={8}
                  maxLength={2000}
                  disabled={loading}
                  className={`${fieldClass} resize-none`}
                  {...register("prompt")}
                />
                {errors.prompt?.message && (
                  <p className="mt-0.5 text-xs text-red-400">
                    {errors.prompt.message}
                  </p>
                )}
              </div>

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

            {error && (
              <p
                className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                role="alert"
              >
                {error}
              </p>
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
                className="flex aspect-square animate-pulse items-center justify-center rounded-2xl border border-white/10 bg-[#1b1b2b] text-sm text-zinc-400"
                role="status"
              >
                Generating your image...
              </div>
            ) : imageUrl ? (
              <div className="space-y-4">
                <img
                  src={imageUrl}
                  alt="Generated from your prompt"
                  className="h-auto w-full rounded-2xl border border-white/10 object-cover shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => downloadImage(imageUrl, "generated-image")}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                >
                  ⬇️ Download image
                </button>
              </div>
            ) : (
              <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 text-center">
                <span className="text-4xl">🖼️</span>
                <p className="text-sm text-zinc-500">No image generated yet.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default GenerateImage;