import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as authenticate } from "../services/auth";
import { useAuth } from "../Auth/AuthContext.js";
import images from '../assets/images.png';

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            setIsSubmitting(true);
            const res = await authenticate({ email, password });

            const token = res?.data?.token;
            login(res?.data?.user, token);

            navigate("/home");
        } catch (err) {
            console.error("Login failed", err);
            setError(
                err?.response?.data?.message || "Login failed. Please check your email and password."
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

            <form
                onSubmit={handleSubmit}
                className="relative w-full max-w-md rounded-[20px] border border-white/10 bg-[#14141f]/90 p-8 shadow-2xl backdrop-blur-xl sm:p-10"
            >
                {/* logo */}
                <div className="mb-6 flex flex-col items-center text-center">
                    <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-2xl shadow-lg shadow-violet-500/30">
                     <img src={images} alt="" className="w-14 h-14 object-contain shrink-0" />
                    </span>
                    <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                        Welcome{" "}
                        <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                            back
                        </span>
                    </h1>
                    <p className="mt-2 text-sm text-zinc-400">
                        Login to Creative AI to create images &amp; content with AI.
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

                {/* email */}
                <label className="mb-1.5 block text-sm font-medium text-zinc-300" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`${inputClass} mb-4`}
                />

                {/* password */}
                <label className="mb-1.5 block text-sm font-medium text-zinc-300" htmlFor="password">
                    Password
                </label>
                <div className="relative mb-6">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
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

                {/* submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                    {isSubmitting ? (
                        <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                            Logging in...
                        </>
                    ) : (
                        "Login"
                    )}
                </button>

                <p className="mt-6 text-center text-sm text-zinc-400">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="font-semibold text-violet-400 hover:text-violet-300">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;