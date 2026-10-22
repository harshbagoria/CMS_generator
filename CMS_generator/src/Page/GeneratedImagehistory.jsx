// import React, { useCallback, useEffect, useState } from 'react';
// import { getGeneratedImageHistory } from '../services/Image';
// import { downloadImage } from '../Utils/global';

// const GeneratedImagehistory = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [generatedImage, setGeneratedImage] = useState([]);
//     const [downloadError, setDownloadError] = useState(null);

//     const loadGeneratedImages = useCallback(async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const res = await getGeneratedImageHistory();
//             setGeneratedImage(Array.isArray(res?.data?.images) ? res.data.images : []);
//         } catch (requestError) {
//             console.error("Error loading generated image history", requestError);
//             setError("We couldn't load your image history. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         loadGeneratedImages();
//     }, [loadGeneratedImages]);

//     const handleDownload = async (imageUrl, id) => {
//         setDownloadError(null);
//         try {
//             await downloadImage(imageUrl, id);
//         } catch (downloadRequestError) {
//             console.error("Error downloading generated image", downloadRequestError);
//             setDownloadError("We couldn't download this image. Please try again.");
//         }
//     };

//     return (
//         <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 sm:py-12">
//             <div className="mx-auto max-w-6xl">
//                 <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
//                     <div>
//                         <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
//                             Generated Image History
//                         </h1>
//                         <p className="mt-2 text-sm text-slate-500 sm:text-base">
//                             Revisit and download the images you have created.
//                         </p>
//                     </div>
//                     {!loading && !error && generatedImage.length > 0 && (
//                         <span className="text-sm font-medium text-slate-500">
//                             {generatedImage.length} {generatedImage.length === 1 ? "image" : "images"}
//                         </span>
//                     )}
//                 </header>

//                 {loading ? (
//                     <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
//                         <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
//                             <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
//                             Loading your images...
//                         </div>
//                     </div>
//                 ) : error ? (
//                     <div className="rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
//                         <p className="text-sm text-red-600">{error}</p>
//                         <button
//                             type="button"
//                             onClick={loadGeneratedImages}
//                             className="mt-4 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
//                         >
//                             Try again
//                         </button>
//                     </div>
//                 ) : generatedImage.length === 0 ? (
//                     <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
//                         <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600" aria-hidden="true">
//                             <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
//                                 <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
//                                 <circle cx="8.5" cy="8.5" r="1.5" />
//                                 <path d="m20.5 15-5-5L5 20.5" />
//                             </svg>
//                         </div>
//                         <h2 className="mt-4 text-lg font-semibold text-slate-800">No generated images yet</h2>
//                         <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
//                             Images you create will appear here, ready to revisit or download.
//                         </p>
//                         <a
//                             href="/generateimage"
//                             className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
//                         >
//                             Generate an image
//                         </a>
//                     </div>
//                 ) : (
//                     <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Generated images">
//                         {generatedImage.map((item) => (
//                             <article
//                                 key={item._id || item.imageUrl}
//                                 className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5"
//                             >
//                                 <a href={item.imageUrl} target="_blank" rel="noreferrer" aria-label={`Open generated image: ${item.prompt}`}>
//                                     <img
//                                         src={item.imageUrl}
//                                         alt={item.prompt || "Generated image"}
//                                         loading="lazy"
//                                         className="aspect-square w-full bg-slate-100 object-cover transition-transform duration-300 hover:scale-[1.02]"
//                                     />
//                                 </a>
//                                 <div className="space-y-4 p-4">
//                                     <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600" title={item.prompt}>
//                                         {item.prompt || "No prompt available"}
//                                     </p>
//                                     <button
//                                         type="button"
//                                         onClick={() => handleDownload(item.imageUrl, item._id)}
//                                         className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
//                                     >
//                                         <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
//                                             <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
//                                             <path d="M5 16v4h14v-4" />
//                                         </svg>
//                                         Download image
//                                     </button>
//                                     {downloadError && (
//                                         <p className="text-sm text-red-600" role="alert">{downloadError}</p>
//                                     )}
//                                 </div>
//                             </article>
//                         ))}
//                     </section>
//                 )}
//             </div>
//         </main>
//     );
// };

// export default GeneratedImagehistory;




import React, { useCallback, useEffect, useState } from 'react';
import { getGeneratedImageHistory } from '../services/Image';
import { downloadImage } from '../Utils/global';

/* shared card surface (dark theme, same as the other pages) */
const cardSurface =
    "rounded-[20px] border border-white/10 bg-[#14141f]/90 shadow-2xl backdrop-blur-xl";

const btnPrimary =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/50";

const GeneratedImagehistory = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generatedImage, setGeneratedImage] = useState([]);
    const [downloadError, setDownloadError] = useState(null);

    const loadGeneratedImages = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await getGeneratedImageHistory();
            setGeneratedImage(Array.isArray(res?.data?.images) ? res.data.images : []);
        } catch (requestError) {
            console.error("Error loading generated image history", requestError);
            setError("We couldn't load your image history. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGeneratedImages();
    }, [loadGeneratedImages]);

    const handleDownload = async (imageUrl, id) => {
        setDownloadError(null);
        try {
            await downloadImage(imageUrl, id);
        } catch (downloadRequestError) {
            console.error("Error downloading generated image", downloadRequestError);
            setDownloadError("We couldn't download this image. Please try again.");
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#0b0b14] px-4 py-10 text-zinc-100 sm:px-6 sm:py-12">
            {/* background blobs */}
            <div className="pointer-events-none absolute -top-28 left-[6%] h-96 w-96 animate-pulse rounded-full bg-violet-500 opacity-30 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-28 right-[6%] h-80 w-80 animate-pulse rounded-full bg-cyan-400 opacity-30 blur-[90px] [animation-delay:-2s]" />

            <div className="relative mx-auto max-w-6xl">
                <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="text-center sm:text-left">
                        <span className="mb-4 inline-block rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-zinc-400">
                            🕘 Your Library
                        </span>
                        <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                            Generated Image{" "}
                            <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                                History
                            </span>
                        </h1>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:mx-0 sm:text-base sm:leading-7">
                            Revisit and download the images you have created.
                        </p>
                    </div>



                   



                    {!loading && !error && generatedImage.length > 0 && (
                        <span className="w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-zinc-300">
                            {generatedImage.length} {generatedImage.length === 1 ? "image" : "images"}
                        </span>
                    )}
                </header>

                {loading ? (
                    <div className={`flex min-h-64 items-center justify-center ${cardSurface}`}>
                        <div className="flex items-center gap-3 text-sm font-medium text-zinc-300" role="status">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400" />
                            Loading your images...
                        </div>
                    </div>
                ) : error ? (
                    <div className={`p-8 text-center ${cardSurface}`}>
                        <p className="text-sm text-red-400">{error}</p>
                        <button
                            type="button"
                            onClick={loadGeneratedImages}
                            className={`mt-4 ${btnPrimary} !px-5 !py-2.5`}
                        >
                            Try again
                        </button>
                    </div>
                ) : generatedImage.length === 0 ? (
                    <div className={`px-6 py-14 text-center ${cardSurface}`}>
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-violet-400" aria-hidden="true">
                            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="m20.5 15-5-5L5 20.5" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-zinc-100">No generated images yet</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
                            Images you create will appear here, ready to revisit or download.
                        </p>
                        <a href="/generateimage" className={`mt-5 ${btnPrimary}`}>
                            ✨ Generate an image
                        </a>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Generated images">
                        {generatedImage.map((item) => (
                            <article
                                key={item._id || item.imageUrl}
                                className="group overflow-hidden rounded-[20px] border border-white/10 bg-[#14141f]/90 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-500/60"
                            >
                                <a
                                    href={item.imageUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`Open generated image: ${item.prompt}`}
                                    className="block overflow-hidden"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.prompt || "Generated image"}
                                        loading="lazy"
                                        className="aspect-square w-full bg-[#1b1b2b] object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </a>
                                <div className="space-y-4 p-4">
                                    <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-zinc-400" title={item.prompt}>
                                        {item.prompt || "No prompt available"}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => handleDownload(item.imageUrl, item._id)}
                                        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-semibold text-zinc-100 transition duration-200 hover:-translate-y-0.5 hover:bg-white/10"
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                            <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                                            <path d="M5 16v4h14v-4" />
                                        </svg>
                                        Download image
                                    </button>
                                    {downloadError && (
                                        <p className="text-sm text-red-400" role="alert">{downloadError}</p>
                                    )}
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </div>
        </main>
    );
};

export default GeneratedImagehistory;