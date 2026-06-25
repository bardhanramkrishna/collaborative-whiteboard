import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import config from "../config";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  Home, Users, Layout, PenTool,
  TrendingUp, RefreshCw, Pencil
} from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="glass rounded-2xl p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-gray-400 text-sm">{label}</span>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${color}22` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
    </div>
    <p className="text-3xl font-bold text-white">{value ?? "—"}</p>
    {sub && <p className="text-xs text-gray-500">{sub}</p>}
  </div>
);

export default function Analytics() {
  const navigate  = useNavigate();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [roomRes, boardRes] = await Promise.all([
  fetch(`${config.SERVER_URL}/api/rooms/stats/all`),
  fetch(`${config.SERVER_URL}/api/boards/stats/all`),
]);
      const roomData  = await roomRes.json();
      const boardData = await boardRes.json();
      setStats({ ...roomData, ...boardData });
      setLastRefresh(new Date());
    } catch (err) {
      console.error("Stats fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Mock chart data — replace with real time-series from DB in future
  const chartData = [
    { day: "Mon", rooms: 3, drawings: 24 },
    { day: "Tue", rooms: 5, drawings: 41 },
    { day: "Wed", rooms: 2, drawings: 18 },
    { day: "Thu", rooms: 8, drawings: 67 },
    { day: "Fri", rooms: 6, drawings: 53 },
    { day: "Sat", rooms: 11, drawings: 89 },
    { day: "Sun", rooms: 7, drawings: 62 },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Navbar */}
      <nav className="glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <Home size={18} />
          </button>
          <div className="flex items-center gap-2">
            <Pencil size={18} className="text-violet-400" />
            <span className="font-bold tracking-tight">DrawTogether</span>
          </div>
          <span className="text-gray-600">·</span>
          <span className="text-gray-400 text-sm">Analytics</span>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 glass glass-hover rounded-xl text-sm text-gray-300 hover:text-white transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-1">Platform Analytics</h1>
          <p className="text-gray-500 text-sm">
            Last updated: {lastRefresh.toLocaleTimeString()}
            {" · "}Auto-refreshes every 30s
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={Layout}
            label="Total Rooms"
            value={loading ? "…" : stats?.totalRooms}
            color="#a78bfa"
            sub="All time"
          />
          <StatCard
            icon={TrendingUp}
            label="Active Rooms"
            value={loading ? "…" : stats?.activeRooms}
            color="#34d399"
            sub="Currently open"
          />
          <StatCard
            icon={PenTool}
            label="Total Drawings"
            value={loading ? "…" : stats?.totalDrawings}
            color="#60a5fa"
            sub="Strokes saved"
          />
          <StatCard
            icon={Users}
            label="Saved Boards"
            value={loading ? "…" : stats?.totalBoards}
            color="#fb923c"
            sub="Unique boards"
          />
        </div>

        {/* Chart */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold">Weekly Activity</h2>
              <p className="text-gray-500 text-xs mt-0.5">Rooms created and drawings per day</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-violet-500 inline-block" />
                Rooms
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />
                Drawings
              </span>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="day"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "#fff",
                  fontSize: 13,
                }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="rooms"    fill="#7c3aed" radius={[6,6,0,0]} />
              <Bar dataKey="drawings" fill="#3b82f6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}