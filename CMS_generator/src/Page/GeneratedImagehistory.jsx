import React, { useCallback, useEffect, useState } from 'react';
import { getGeneratedImageHistory } from '../services/Image';

const GeneratedImagehistory = () => {
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatedImage, setGeneratedImage] = useState([]);

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

  return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 sm:py-12">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Generated Image History
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Revisit and download the images you have created.
                        </p>
          </div>
                    {!loading && !error && generatedImage.length > 0 && (
                        <span className="text-sm font-medium text-slate-500">
                            {generatedImage.length} {generatedImage.length === 1 ? "image" : "images"}
                        </span>
                    )}
                </header>

                {loading ? (
                    <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                            Loading your images...
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
                        <p className="text-sm text-red-600">{error}</p>
                        <button
                            type="button"
                            onClick={loadGeneratedImages}
                            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                        >
                            Try again
                        </button>
                    </div>
                ) : generatedImage.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600" aria-hidden="true">
                            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="m20.5 15-5-5L5 20.5" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-slate-800">No generated images yet</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            Images you create will appear here, ready to revisit or download.
                        </p>
                        <a
                            href="/generateimage"
                            className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                        >
                            Generate an image
                        </a>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Generated images">
                        {generatedImage.map((item) => (
                            <article
                                key={item._id || item.imageUrl}
                                className="overflow-hidden rounded-2xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5"
                            >
                                <a href={item.imageUrl} target="_blank" rel="noreferrer" aria-label={`Open generated image: ${item.prompt}`}>
                                    <img
                                        src={item.imageUrl}
                                        alt={item.prompt || "Generated image"}
                                        loading="lazy"
                                        className="aspect-square w-full bg-slate-100 object-cover transition-transform duration-300 hover:scale-[1.02]"
                                    />
                                </a>
                                <div className="space-y-4 p-4">
                                    <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-slate-600" title={item.prompt}>
                                        {item.prompt || "No prompt available"}
                                    </p>
                                    <a
                                        href={item.imageUrl}
                                        download={`generated-image-${item._id || "image"}.jpg`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                    >
                                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                                            <path d="M12 3v12m0 0 4-4m-4 4-4-4" />
                                            <path d="M5 16v4h14v-4" />
                                        </svg>
                                        Download image
                                    </a>
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
