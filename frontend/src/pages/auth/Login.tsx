import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const inputCls =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition";

// ─── Forgot Password Dialog ───────────────────────────────────────────────────
type DialogState = "idle" | "loading" | "sent";

const ForgotPasswordDialog = ({ onClose }: { onClose: () => void }) => {
    const [fpEmail, setFpEmail] = useState("");
    const [state, setState] = useState<DialogState>("idle");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setState("loading");

        try {
            setTimeout(() => {
            }, 200000);
            setState("sent");
        } catch (err: any) {
            setError(err.message);
            setState("idle");
        }
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">

                {state === "sent" ? (
                    // ── Success screen ──
                    <div className="flex flex-col items-center gap-4 py-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-gray-900">Check your inbox</h3>
                        <p className="text-sm text-gray-500">
                            We've sent a password reset link to{" "}
                            <span className="font-medium text-gray-700">{fpEmail}</span>.
                            Check your email and follow the instructions.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    // ── Form ──
                    <>
                        <div className="mb-5">
                            <h3 className="text-base font-semibold text-gray-900">Forgot password</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Enter your email and we'll send you a reset link.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={fpEmail}
                                    onChange={(e) => setFpEmail(e.target.value)}
                                    required
                                    className={inputCls}
                                />
                            </div>

                            {error && (
                                <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                    {error}
                                </p>
                            )}

                            <div className="flex gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={state === "loading"}
                                    className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
                                >
                                    {state === "loading" ? "Sending…" : "Send link"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Login ────────────────────────────────────────────────────────────────────
const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForgot, setShowForgot] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            localStorage.setItem("token", data.token);
            login(data.user, data.token);
            navigate("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showForgot && <ForgotPasswordDialog onClose={() => setShowForgot(false)} />}

            <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-sm">

                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Welcome back</h1>
                        <p className="mt-1 text-sm text-gray-500">Sign in to your FleetFlow account.</p>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputCls}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-600">Password</label>
                                <button
                                    type="button"
                                    onClick={() => setShowForgot(true)}
                                    className="text-xs font-medium text-blue-600 hover:underline"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputCls}
                            />
                        </div>

                        {error && (
                            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-3">
                        <div className="flex-grow border-t border-gray-200" />
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="flex-grow border-t border-gray-200" />
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                        Create an account
                    </button>

                </div>
            </div>
        </>
    );
};

export default Login;