import { useState } from "react";
import { useNavigate } from "react-router-dom";

export type UserRole = "MANAGER" | "DISPATCHER" | "SAFETY" | "FINANCE";

const ROLES = [
  { value: "MANAGER", label: "Manager" },
  { value: "DISPATCHER", label: "Dispatcher" },
  { value: "SAFETY", label: "Safety Officer" },
  { value: "FINANCE", label: "Finance Analyst" },
];

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    {children}
  </div>
);

const inputCls =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition";

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
    role: "DISPATCHER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setSuccess(data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in your details to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <Field label="Full Name">
            <input type="text" name="name" placeholder="John Doe"
              value={form.name} onChange={handleChange} required className={inputCls} />
          </Field>

          <Field label="Phone Number">
            <input type="tel" name="phone" placeholder="+1 (555) 000-0000"
              value={form.phone} onChange={handleChange} required className={inputCls} />
          </Field>

          <Field label="Address">
            <input type="text" name="address" placeholder="123 Main St, City"
              value={form.address} onChange={handleChange} required className={inputCls} />
          </Field>

          <Field label="Email">
            <input type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} required className={inputCls} />
          </Field>

          <Field label="Password">
            <input type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} required className={inputCls} />
          </Field>

          <Field label="Role">
            <select name="role" value={form.role} onChange={handleChange} className={inputCls}>
              {ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </Field>

          {/* Feedback */}
          {error && (
            <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-md bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-600">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {loading ? "Registering…" : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="cursor-pointer font-medium text-blue-600 hover:underline"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;