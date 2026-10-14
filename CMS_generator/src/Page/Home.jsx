import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import paint from '../assets/paint.png';
import pencil from '../assets/pencil.png';
import ThemeToggle from "./Themetoggle";
import Navbar from "./Navbar";

/* ------------------------------------------------------------------
   CONFIG – change these to match your project
------------------------------------------------------------------ */
const API_BASE = import.meta.env?.VITE_API_URL || ""; // CRA: process.env.REACT_APP_API_URL
const HISTORY_ENDPOINT = `${API_BASE}/api/images/history?limit=8`;
const ROUTES = {
    image: "/generate-image",
    content: "/generate-content",
    history: "/history",
};

/* Map whatever your API returns to { id, url, prompt, createdAt } */
const normalizeImage = (item) => ({
    id: item._id || item.id,
    url: item.imageUrl || item.url,
    prompt: item.prompt || "Untitled image",
    createdAt: item.createdAt,
});

/* ------------------------------------------------------------------
   Reusable button styles
------------------------------------------------------------------ */
const btnBase =
    "inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 cursor-pointer";
const btnPrimary = `${btnBase} bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50`;
const btnSecondary = `${btnBase} bg-gradient-to-br from-cyan-600 to-cyan-400 text-cyan-950 shadow-lg shadow-cyan-400/25`;
const btnGhost = `${btnBase} border border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10`;

/* ------------------------------------------------------------------
   Action cards (main navigation of the home page)
   Full class names are written out so Tailwind can detect them.
------------------------------------------------------------------ */
const ACTIONS = [
    {
        key: "image",
        title: "Generate Images",
        desc: "Turn a text prompt into stunning visuals in seconds.",
        cta: "Create image",
        to: ROUTES.image,
        icon: "🎨",
        iconBg: "bg-violet-500/20",
        text: "text-violet-400",
        border: "hover:border-violet-500/60",
        glow: "rgba(139,92,246,0.22)",
    },
    {
        key: "content",
        title: "Generate Content",
        desc: "Blog posts, captions, product copy – written by AI.",
        cta: "Write content",
        to: ROUTES.content,
        icon: "✍️",
        iconBg: "bg-cyan-400/20",
        text: "text-cyan-400",
        border: "hover:border-cyan-400/60",
        glow: "rgba(34,211,238,0.22)",
    },
    {
        key: "history",
        title: "Image History",
        desc: "Browse, preview and reuse everything you've made.",
        cta: "View history",
        to: ROUTES.history,
        icon: "🕘",
        iconBg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "hover:border-amber-500/60",
        glow: "rgba(245,158,11,0.22)",
    },
];

/* 3D tilt + glow that follows the cursor */
function ActionCard({ action }) {
    const ref = useRef(null);

    const onMove = (e) => {
        const el = ref.current;
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        const rx = (y / r.height - 0.5) * -10;
        const ry = (x / r.width - 0.5) * 10;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
        el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    };
    const onLeave = () => {
        ref.current.style.transform = "";
    };

    return (
        <Link
            to={action.to}
            ref={ref}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className={`group relative block overflow-hidden rounded-[20px] border border-white/10 bg-[#14141f] p-7 transition-[transform,border-color] duration-150 ease-out will-change-transform ${action.border}`}
        >
            {/* cursor glow */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(260px circle at var(--mx,50%) var(--my,50%), ${action.glow}, transparent 70%)`,
                }}
            />
            <div className="relative">
                <span
                    className={`mb-4 grid h-14 w-14 place-items-center rounded-2xl text-2xl ${action.iconBg}`}
                >
                    {action.icon}
                </span>
                <h3 className="mb-2 text-xl font-semibold">{action.title}</h3>
                <p className="mb-5 leading-relaxed text-zinc-400">{action.desc}</p>
                <span className={`font-semibold ${action.text}`}>
                    {action.cta}{" "}
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                        →
                    </span>
                </span>
            </div>
        </Link>
    );
}

/* ------------------------------------------------------------------
   Recent images gallery
------------------------------------------------------------------ */
const galleryGrid = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

function RecentImages({ images, loading, error, onOpen }) {
    if (loading) {
        return (
            <div className={galleryGrid}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-2xl bg-[#1b1b2b]" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <p className="rounded-[20px] border border-dashed border-white/10 px-5 py-10 text-center text-zinc-400">
                Couldn't load your history. Please try again later.
            </p>
        );
    }

    if (!images.length) {
        return (
            <div className="rounded-[20px] border border-dashed border-white/10 px-5 py-10 text-center text-zinc-400">
                <p className="mb-4">You haven't generated any images yet.</p>
                <Link to={ROUTES.image} className={btnPrimary}>
                    Generate your first image
                </Link>
            </div>
        );
    }

    return (
        <div className={galleryGrid}>
            {images.map((img) => (
                <button
                    key={img.id}
                    onClick={() => onOpen(img)}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#14141f] p-0"
                >
                    <img
                        src={img.url}
                        alt={img.prompt}
                        loading="lazy"
                        className="block h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute inset-x-0 bottom-0 line-clamp-2 translate-y-full bg-gradient-to-t from-black/85 to-transparent px-3.5 pb-3 pt-9 text-left text-sm text-white transition-transform duration-300 group-hover:translate-y-0">
                        {img.prompt}
                    </span>
                </button>
            ))}
        </div>
    );
}

/* Preview modal */
function Lightbox({ image, onClose, onReuse }) {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    if (!image) return null;
    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-5 backdrop-blur-sm"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-xl overflow-hidden rounded-[20px] border border-white/10 bg-[#14141f]"
                onClick={(e) => e.stopPropagation()}
            >
                <img src={image.url} alt={image.prompt} className="block max-h-[60vh] w-full bg-black object-contain" />
                <div className="px-5 pb-5 pt-4">
                    <p className="mb-4 leading-relaxed text-zinc-400">{image.prompt}</p>
                    <div className="flex flex-wrap gap-2.5">
                        <button className={`${btnPrimary} !px-4 !py-2.5`} onClick={() => onReuse(image)}>
                            Reuse prompt
                        </button>
                        <a
                            className={`${btnGhost} !px-4 !py-2.5`}
                            href={image.url}
                            download
                            target="_blank"
                            rel="noreferrer"
                        >
                            Download
                        </a>
                        <button className={`${btnGhost} !px-4 !py-2.5`} onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------
   Home page
------------------------------------------------------------------ */
export default function Home() {
    const navigate = useNavigate();
    const heroRef = useRef(null);

    const [mounted, setMounted] = useState(false);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selected, setSelected] = useState(null);

    /* entrance animation */
    useEffect(() => {
        const t = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(t);
    }, []);

    /* fetch recent history */
    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const token = localStorage.getItem("token"); // adjust to your auth
                const res = await fetch(HISTORY_ENDPOINT, {
                    signal: controller.signal,
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                if (!res.ok) throw new Error("Request failed");
                const data = await res.json();
                const list = Array.isArray(data) ? data : data.images || data.data || [];
                setImages(list.map(normalizeImage));
            } catch (err) {
                if (err.name !== "AbortError") setError(true);
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, []);

    /* spotlight that follows the cursor in the hero */
    const onHeroMove = useCallback((e) => {
        const el = heroRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--hx", `${e.clientX - r.left}px`);
        el.style.setProperty("--hy", `${e.clientY - r.top}px`);
    }, []);

    /* send the prompt to the generate page so it can prefill it */
    const reusePrompt = (img) => {
        setSelected(null);
        navigate(ROUTES.image, { state: { prompt: img.prompt } });
    };

    return (
        <main className="min-h-screen bg-[#0b0b14] pb-20 text-zinc-100">
            <Navbar />
            {/* HERO */}
            <section
                ref={heroRef}
                onMouseMove={onHeroMove}
                className="relative overflow-hidden px-6 pb-[90px] pt-20 text-center sm:pt-[110px]"
            >
                {/* cursor spotlight */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(500px circle at var(--hx,50%) var(--hy,50%), rgba(139,92,246,0.18), transparent 60%)",
                    }}
                />
                {/* blobs */}
                <div className="absolute -top-28 left-[8%] h-96 w-96 animate-pulse rounded-full bg-violet-500 opacity-40 blur-[90px]" />
                <div className="absolute -bottom-28 right-[8%] h-80 w-80 animate-pulse rounded-full bg-cyan-400 opacity-40 blur-[90px] [animation-delay:-2s]" />

                <div
                    className={`relative mx-auto max-w-3xl transition-all duration-700 ease-out ${mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                        }`}
                >
                    <span className="mb-5 inline-block rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-zinc-400">
                        ✨ AI Creative Studio
                    </span>
                    <h1 className="mb-4 text-4xl font-extrabold leading-tight sm:text-6xl">
                        Create images &amp; content <br />
                        <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                            with the power of AI
                        </span>
                    </h1>
                    <p className="mx-auto mb-9 max-w-lg text-lg text-zinc-400">
                        One place to generate visuals, write content and revisit everything you've created.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3.5 h-12">
                        <Link
                            to={ROUTES.image}
                            className={`${btnPrimary} inline-flex items-center justify-center gap-2`}
                        >
                           <img src={paint} alt="" className="w-4 h-4 object-contain shrink-0" />
                            <span>Generate Image</span>
                        </Link>
                        <Link to={ROUTES.content} className={btnSecondary}>
                            Generate Content
                        </Link>
                    </div>
                </div>
            </section>

            {/* ACTION CARDS */}
            <section className="mx-auto max-w-6xl px-4 pt-11 sm:px-6 sm:pt-14">
                <h2 className="mb-6 text-2xl font-bold">What do you want to do?</h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {ACTIONS.map((a) => (
                        <ActionCard key={a.key} action={a} />
                    ))}
                </div>
            </section>

            {/* RECENT HISTORY */}
            <section className="mx-auto max-w-6xl px-4 pt-11 sm:px-6 sm:pt-14">
                <div className="mb-6 flex items-baseline justify-between">
                    <h2 className="text-2xl font-bold">Recent images</h2>
                    <Link to={ROUTES.history} className="font-semibold text-violet-400 hover:underline">
                        View all →
                    </Link>
                </div>
                <RecentImages images={images} loading={loading} error={error} onOpen={setSelected} />
            </section>

            <Lightbox image={selected} onClose={() => setSelected(null)} onReuse={reusePrompt} />
        </main>
    );
}