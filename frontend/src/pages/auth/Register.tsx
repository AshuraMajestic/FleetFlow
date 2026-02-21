import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "./mockUser";

const RegisterUser = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const existingUser = mockUsers.find(
            (u) => u.email.toLowerCase() === form.email.toLowerCase()
        );

        if (!existingUser) {
            setError("You are not invited by Admin.");
            return;
        }

        if (existingUser.isRegistered) {
            setError("Account already registered. Please login.");
            return;
        }

        // Complete registration
        existingUser.name = form.name;
        existingUser.phone = form.phone;
        existingUser.address = form.address;
        existingUser.password = form.password;
        existingUser.isRegistered = true;

        setSuccess("Registration successful! Redirecting to login...");

        setTimeout(() => {
            navigate("/login");
        }, 1500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Complete Registration
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <button className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700">
                        Register
                    </button>
                    <div className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="cursor-pointer font-medium text-blue-600 hover:underline"
                        >
                            Login here
                        </span>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="rounded-lg bg-green-100 px-3 py-2 text-sm text-green-600">
                            {success}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default RegisterUser;