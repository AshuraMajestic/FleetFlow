import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "../../types/authTypes";
import { mockUsers } from "./mockUser";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await new Promise((res) => setTimeout(res, 1000));

            const foundUser = mockUsers.find((u) => u.email === email);

            if (!foundUser) {
                throw new Error("User not found.");
            }

            if (!foundUser.isRegistered) {
                throw new Error("Please complete registration first.");
            }

            if (foundUser.password !== password) {
                throw new Error("Invalid credentials.");
            }

            login(foundUser);
            navigate("/");
        } catch (err: any) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    FleetFlow Login
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="admin@fleet.com"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Divider */}
                    <div className="my-4 flex items-center">
                        <div className="flex-grow border-t border-gray-300" />
                        <span className="mx-3 text-sm text-gray-500">OR</span>
                        <div className="flex-grow border-t border-gray-300" />
                    </div>

                    {/* Register Redirect */}
                    <button
                        type="button"
                        onClick={() => navigate("/register")}
                        className="w-full rounded-lg border border-blue-600 py-2 font-semibold text-blue-600 transition hover:bg-blue-50"
                    >
                        Complete Registration
                    </button>
                </form>
            </div>
        </div >
    );
};

export default Login;