import React, { useCallback, useEffect, useState } from 'react';
import { generatedContenthistory } from '../services/content';


const GeneratedContentHistory = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generatedContent, setGeneratedContent] = useState([]);
    const [downloadError, setDownloadError] = useState(null);

    const loadGeneratedContent = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await generatedContenthistory();
            setGeneratedContent(Array.isArray(res?.data?.content) ? res.data.content : []);
        } catch (requestError) {
            console.error("Error loading generated content history", requestError);
            setError("We couldn't load your content history. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadGeneratedContent();
    }, [loadGeneratedContent]);

    const handleDownload = (generatedText, id) => {
        setDownloadError(null);
        try {
            const blob = new Blob([generatedText], { type: "text/plain;charset=utf-8" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `generated-content-${id || "content"}.txt`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        } catch (downloadRequestError) {
            console.error("Error downloading generated content", downloadRequestError);
            setDownloadError("We couldn't download this content. Please try again.");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-10 sm:py-12">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Generated Content History
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 sm:text-base">
                            Revisit and download the Content you have created.
                        </p>
                    </div>
                    {!loading && !error && generatedContent.length > 0 && (
                        <span className="text-sm font-medium text-slate-500">
                            {generatedContent.length} {generatedContent.length === 1 ? "content" : "content"}
                        </span>
                    )}
                </header>

                {loading ? (
                    <div className="flex min-h-64 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
                        <div className="flex items-center gap-3 text-sm font-medium text-slate-600" role="status">
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
                            Loading your content...
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-2xl bg-white p-8 text-center shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
                        <p className="text-sm text-red-600">{error}</p>
                        <button
                            type="button"
                            onClick={loadGeneratedContent}
                            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                        >
                            Try again
                        </button>
                    </div>
                ) : generatedContent.length === 0 ? (
                    <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600" aria-hidden="true">
                            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                                <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <path d="m20.5 15-5-5L5 20.5" />
                            </svg>
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-slate-800">No generated content yet</h2>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            Content you create will appear here, ready to revisit or download.
                        </p>
                        <a
                            href="/generatecontent"
                            className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
                        >
                            Generate content
                        </a>
                    </div>
                ) : (
                    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Generated content">
                        {generatedContent.map((item) => (
                            <article
                                key={item._id}
                                className="rounded-2xl bg-white p-5 shadow-xl shadow-slate-200/60 ring-1 ring-slate-900/5"
                            >
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your prompt</h2>
                                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                            {item.Input_prompt}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Generated content</h3>
                                        <p className="mt-1 max-h-64 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                            {item.generated_content}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleDownload(item.generated_content, item._id)}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                                    >
                                        Download as text
                                    </button>
                                    {downloadError && (
                                        <p className="text-sm text-red-600" role="alert">{downloadError}</p>
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

export default GeneratedContentHistory;
