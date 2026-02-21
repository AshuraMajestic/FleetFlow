import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole =
  | "MANAGER"
  | "DISPATCHER"
  | "SAFETY"
  | "FINANCE";

const RegisterUser = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<{
        name: string;
        phone: string;
        address: string;
        email: string;
        password: string;
        role: UserRole;
    }>({
        name: "",
        phone: "",
        address: "",
        email: "",
        password: "",
        role: "DISPATCHER", // default role
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    setSuccess(data.message);

    setTimeout(() => {
      navigate("/login");
    }, 1500);

  } catch (err: any) {
    setError(err.message);
  }
};
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                    Register Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        required
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    />

                    {/* ✅ Role Select Dropdown */}
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                        <option value="MANAGER">Manager</option>
                        <option value="DISPATCHER">Dispatcher</option>
                        <option value="SAFETY">Safety Officer</option>
                        <option value="FINANCE">Finance Analyst</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 transition"
                    >
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