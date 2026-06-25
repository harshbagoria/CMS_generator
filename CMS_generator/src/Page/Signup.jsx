import { useState } from "react";
import { Link } from "react-router-dom";
import { signup } from "../services/auth";


const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup submitted", { name, email, password });

    try {
      setIsSubmitting(true);
      await signup({ name, email, password });
    } catch (error) {
      console.error("signup failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-slate-800/80 bg-slate-900/90 p-8 shadow-[0_35px_60px_-15px_rgba(15,23,42,0.8)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-sky-400/80">Create your account</p>
          <h1 className="mt-4 text-3xl font-semibold text-white">Sign up to CMS Generator</h1>
          <p className="mt-3 text-sm text-slate-400">
            Securely manage your content, users, and workflows in one place.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Name</span>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Email</span>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 text-sm font-medium text-slate-300">Password</span>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-3xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
          >
            {isSubmitting ? "Submitting..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-300 hover:text-sky-200">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;