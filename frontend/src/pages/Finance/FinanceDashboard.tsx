import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend,
} from "recharts";

export default function FinanceDashboard() {
  const token = localStorage.getItem("fleet_token") || "";
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    profit: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/finance", {
      headers: { Authorization: token },
    })
      .then((r) => { if (!r.ok) throw new Error("Failed to fetch finance data"); return r.json(); })
      .then((data) => { setSummary(data.summary); setChartData(data.chartData);console.log(data.chartData) })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center gap-2 p-6 text-sm text-gray-400">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
      Loading finance data…
    </div>
  );

  if (error) return (
    <div className="p-6">
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
    </div>
  );

  const profitPositive = summary.profit >= 0;

  // Derived: cumulative profit for trend line
  const cumulativeData = chartData.reduce((acc: any[], item, i) => {
    const prev = acc[i - 1]?.cumulative ?? 0;
    acc.push({ ...item, cumulative: prev + item.profit });
    return acc;
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Finance Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Monthly revenue, expense, and profit overview.</p>
        </div>
        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-100 transition"
        >
          Log out
        </button>
      </div>

      {/* ── Summary Cards ── */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total Revenue</p>
          <p className="mt-2 text-3xl font-bold text-green-600">₹{summary.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total Expense</p>
          <p className="mt-2 text-3xl font-bold text-red-500">₹{summary.totalExpense.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Net Profit</p>
          <p className={`mt-2 text-3xl font-bold ${profitPositive ? "text-green-600" : "text-red-500"}`}>
            {profitPositive ? "" : "-"}₹{Math.abs(summary.profit).toLocaleString()}
          </p>
        </div>
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* 1. Grouped Bar – Revenue vs Expense */}
        <ChartCard title="Revenue vs Expense" subtitle="Monthly comparison">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" name="Revenue" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Area Chart – Monthly Profit */}
        <ChartCard title="Monthly Profit" subtitle="Profit trend over time">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Area
                type="monotone"
                dataKey="profit"
                name="Profit"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#profitGrad)"
                dot={{ r: 4, fill: "#2563eb" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Line Chart – Revenue & Expense Trends */}
        <ChartCard title="Revenue & Expense Trends" subtitle="Line view for pattern analysis">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Area Chart – Cumulative Profit */}
        <ChartCard title="Cumulative Profit" subtitle="Running total across months">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={cumulativeData}>
              <defs>
                <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#16a34a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Cumulative Profit"
                stroke="#16a34a"
                strokeWidth={2}
                fill="url(#cumGrad)"
                dot={{ r: 4, fill: "#16a34a" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>
    </div>
  );
}

/* ── Chart Card Wrapper ── */
function ChartCard({ title, subtitle, children }: {
  title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}