import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function FinanceDashboard() {
  const token = localStorage.getItem("fleet_token");
  const {logout} = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    profit: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinance();
  }, []);

  const fetchFinance = async () => {
    const res = await fetch(
      "http://localhost:5000/api/finance",
      {
        headers: { Authorization: token || "" },
      }
    );

    const data = await res.json();

    setSummary(data.summary);
    setChartData(data.chartData);
    setLoading(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 text-white bg-black min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        💰 Finance Dashboard
      </h1>
      <div className="border-t border-gray-700 p-4">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full rounded-lg bg-red-600 py-2 font-semibold hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-400 text-sm">Revenue</p>
          <p className="text-3xl font-bold text-green-400 mt-2">
            ₹{summary.totalRevenue.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-400 text-sm">Expense</p>
          <p className="text-3xl font-bold text-red-400 mt-2">
            ₹{summary.totalExpense.toLocaleString()}
          </p>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl shadow">
          <p className="text-gray-400 text-sm">Profit</p>
          <p
            className={`text-3xl font-bold mt-2 ${summary.profit >= 0
                ? "text-green-500"
                : "text-red-500"
              }`}
          >
            ₹{summary.profit.toLocaleString()}
          </p>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="bg-gray-900 p-6 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Breakdown
        </h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#16a34a" />
            <Bar dataKey="expense" fill="#dc2626" />
            <Bar dataKey="profit" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}