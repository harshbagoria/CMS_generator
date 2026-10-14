import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   useTheme – keeps "light" | "dark" in state, saves it in localStorage
   and adds/removes the `dark` class on <html> (Tailwind darkMode: "class").
   First visit follows the user's system preference.
------------------------------------------------------------------ */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      /* storage blocked – ignore */
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}

/* ------------------------------------------------------------------
   ThemeToggle – floating round button (top-right). Drop it anywhere.
   Usage:  <ThemeToggle />
------------------------------------------------------------------ */
export default function ThemeToggle({ className = "" }) {
  const [theme, toggle] = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`fixed right-4 top-4 z-40 grid h-11 w-11 cursor-pointer place-items-center overflow-hidden rounded-full border border-zinc-300 bg-white/80 text-xl shadow-lg backdrop-blur transition duration-200 hover:scale-110 dark:border-white/10 dark:bg-white/10 ${className}`}
    >
      {/* sun */}
      <span
        className={`absolute transition-all duration-500 ${
          isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
        }`}
      >
        ☀️
      </span>
      {/* moon */}
      <span
        className={`absolute transition-all duration-500 ${
          isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      >
        🌙
      </span>
    </button>
  );
}