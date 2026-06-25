export default function HomeHero() {
  return (
    <div className="text-center mb-16 animate-fade-in">
      {/* Glow blobs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600 rounded-full blur-3xl opacity-10 pointer-events-none"></div>
      <div className="absolute top-40 left-1/4 w-64 h-64 bg-blue-600 rounded-full blur-3xl opacity-8 pointer-events-none"></div>

      <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm text-gray-300 mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Real-time • Multi-user • Persistent
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
        Draw together,{" "}
        <span className="text-gradient">anywhere</span>
      </h1>

      <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
        Create a whiteboard room and invite anyone to draw, sketch, and collaborate in real time — no sign-up needed.
      </p>
    </div>
  );
}