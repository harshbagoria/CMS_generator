import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
//import ThemeToggle from "./ThemeToggle";
import images from '../assets/images.png';
import { useAuth} from "../Auth/AuthContext.js";
 
/* ------------------------------------------------------------------
   CONFIG – change these to match your project
------------------------------------------------------------------ */
const ROUTES = {
  home: "/",
  image: "/generateimage",
  content: "/generatecontent",
  image_history: "/generatedimagehistory",
  content_history: "/generatedcontenthistory",
  login: "/login",
};
 
const NAV_LINKS = [
  { label: "Home", to: ROUTES.home, end: true },
  { label: "Images", to: ROUTES.image },
  { label: "Content", to: ROUTES.content },
  { label: "History", to: ROUTES.image_history },
  { label: "Content History", to: ROUTES.content_history },
];
 
/* Reads the logged-in user. Adjust to your auth (context, redux, etc.)
   Expected shape: { name: "Harsh Bhagoria", email: "harsh@mail.com" } */

 
/* ------------------------------------------------------------------
   Navbar
   Props (all optional – if you already have user/logout in context,
   pass them in; otherwise it reads localStorage):
     user     : { name, email }
     onLogout : () => void
------------------------------------------------------------------ */
export default function Navbar() {
  const navigate = useNavigate();
  //const [user] = useState(() => userProp || getStoredUser());
  const [open, setOpen] = useState(false); // profile dropdown
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu
  const dropdownRef = useRef(null);
  const {user , logout} = useAuth();

  const name = user?.name?.trim() || "User";
  const initial = name.charAt(0).toUpperCase();
 
  /* close dropdown on outside click / Escape */
  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);
 
  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate(ROUTES.login);
  };
 
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-zinc-100"
    }`;
 
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-transparent transition-colors duration-300 dark:border-white/10 dark:bg-transparent">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link to={ROUTES.home} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl">
           
         <img src={images} alt="" className="w-14 h-14 object-contain shrink-0" />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-zinc-600 dark:text-zinc-500  w-10 h-5">
            Creative<span className="text-#111827">AI</span>
          </span>
        </Link>
 
        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>
 
        {/* Right side */}
        <div className="flex items-center gap-2.5">
          
 
          {/* Profile + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="Open profile menu"
              className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-base font-bold text-white shadow-lg shadow-violet-500/30 ring-2 ring-offset-2 ring-offset-white transition duration-200 hover:scale-105 dark:ring-offset-[#0b0b14] ${
                open ? "ring-violet-500" : "ring-transparent"
              }`}
            >
              {initial}
            </button>
 
            <div
              role="menu"
              className={`absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl transition duration-200 dark:border-white/10 dark:bg-[#14141f] ${
                open
                  ? "visible translate-y-0 scale-100 opacity-100"
                  : "invisible -translate-y-2 scale-95 opacity-0"
              }`}
            >
              {/* user info */}
              <div className="flex items-center gap-3 border-b border-zinc-100 px-4 py-4 dark:border-white/10">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-lg font-bold text-white">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-zinc-900 dark:text-zinc-100">{name}</p>
                  {user?.email && (
                    <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                  )}
                </div>
              </div>
 
              {/* links */}
              <div className="p-2">
                <Link
                  to={ROUTES.history}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5"
                >
                  🕘 <span>My image history</span>
                </Link>


                <Link
                  to={ROUTES.history}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/5"
                >
                  🕘 <span>My content history</span>
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                >
                  🚪 <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
 
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((m) => !m)}
            aria-label="Toggle menu"
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-xl border border-zinc-300 text-lg text-zinc-700 dark:border-white/10 dark:text-zinc-200 md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>
 
      {/* Mobile links */}
      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-zinc-200 px-4 py-3 dark:border-white/10 md:hidden">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}