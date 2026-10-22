// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { signup } from "../services/auth";


// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Signup submitted", { name, email, password });

//     try {
//       setIsSubmitting(true);
//       await signup({ name, email, password });
//     } catch (error) {
//       console.error("signup failed", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
//       <div className="mx-auto w-full max-w-md rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-[0_35px_60px_-15px_rgba(15,23,42,0.8)] backdrop-blur-xl">
//         <div className="mb-8 text-center">
//           <p className="text-xs uppercase tracking-[0.4em] text-sky-400/80">Create your account</p>
//           <h1 className="mt-4 text-3xl font-semibold text-white">Sign up to CMS Generator</h1>
//           <p className="mt-3 text-sm text-slate-400">
//             Securely manage your content, users, and workflows in one place.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <label className="block">
//             <span className="mb-2 text-sm font-medium text-slate-300">Name</span>
//             <input
//               type="text"
//               placeholder="Enter your name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//               className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
//             />
//           </label>

//           <label className="block">
//             <span className="mb-2 text-sm font-medium text-slate-300">Email</span>
//             <input
//               type="email"
//               placeholder="name@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
//             />
//           </label>

//           <label className="block">
//             <span className="mb-2 text-sm font-medium text-slate-300">Password</span>
//             <input
//               type="password"
//               placeholder="Create a strong password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
//             />
//           </label>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
//           >
//             {isSubmitting ? "Submitting..." : "Create account"}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-sm text-slate-400">
//           Already have an account?{' '}
//           <Link to="/login" className="font-semibold text-sky-300 hover:text-sky-200">
//             Log In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;



import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/auth";
import images from '../assets/images.png';

/* shared input style (dark theme, same as login + generate pages) */
const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Signup submitted", { name, email, password });

    try {
      setIsSubmitting(true);
      await signup({ name, email, password });
    } catch (err) {
      console.error("signup failed", err);
      setError(
        err?.response?.data?.message || "Signup failed. Please check your details and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0b0b14] px-4 py-10 text-zinc-100">
      {/* background blobs */}
      <div className="pointer-events-none absolute -top-28 left-[6%] h-96 w-96 animate-pulse rounded-full bg-violet-500 opacity-40 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-28 right-[6%] h-80 w-80 animate-pulse rounded-full bg-cyan-400 opacity-40 blur-[90px] [animation-delay:-2s]" />

      <div className="relative w-full max-w-md rounded-[20px] border border-white/10 bg-[#14141f]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
        {/* header */}
        <div className="mb-7 flex flex-col items-center text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-2xl shadow-lg shadow-violet-500/30">
            
             <img src={images} alt="" className="w-14 h-14 object-contain shrink-0" />
          </span>
          <span className="mb-3 inline-block rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs text-zinc-400">
            Create your account
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Sign up to{" "}
            <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
              Creative AI
            </span>
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Securely manage your content, users, and workflows in one place.
          </p>
        </div>

        {/* error */}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-300">Name</span>
            <input
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-300">Email</span>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-zinc-300">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputClass} pr-16`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-xs font-semibold text-violet-400 hover:underline"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Submitting...
              </>
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-violet-400 hover:text-violet-300 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;