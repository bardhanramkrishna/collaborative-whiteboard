import Navbar from "../components/Navbar";
import HomeHero from "../components/HomeHero";
import RoomPanel from "../components/RoomPanel";
import { Users, Zap, Shield, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Zap,
    label: "Instant sync",
    desc: "Drawing updates appear in under 50ms for all users",
  },
  {
    icon: Users,
    label: "Multi-user",
    desc: "Invite teammates with a simple room code",
  },
  {
    icon: Shield,
    label: "Persistent",
    desc: "Your board is saved and reloads when you return",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <Navbar />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-16">
        <HomeHero />
        <RoomPanel />

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="glass rounded-2xl px-5 py-4 flex items-start gap-3 max-w-[220px]"
            >
              <Icon
                size={18}
                className="text-violet-400 mt-0.5 shrink-0"
              />
              <div>
                <p className="text-white text-sm font-medium">{label}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics link */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/analytics")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors mx-auto"
          >
            <TrendingUp size={14} />
            View platform analytics
          </button>
        </div>
      </main>
    </div>
  );
}