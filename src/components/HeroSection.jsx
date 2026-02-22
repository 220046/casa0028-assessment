/**
 * HeroSection: full-width header, narrative entry point.
 */
export default function HeroSection(props) {

  const fa = props.typeBreakdown['False Alarm'] || 0
  const fire = props.typeBreakdown['Fire'] || 0
  const ss = props.typeBreakdown['Special Service'] || 0
  const total = fa + fire + ss

  const pct = (n) => total > 0 ? ((n / total) * 100).toFixed(1) : '0'

  return (
    <header className="relative min-h-[520px] flex items-center overflow-hidden">
      {/* Background layer: flipped horizontally, smoke on left */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}hero-bg.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: '15% center',
          transform: 'scaleX(-1)',
        }}
      />

      {/* Left gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="relative w-full px-8 py-16">
        <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-4">
          London Fire Brigade &middot; 942,730 Incidents Analysed
        </p>

        <h1 className="text-5xl font-extrabold text-white leading-tight max-w-xl drop-shadow-lg">
          Fewer Fires,<br />Never Busier
        </h1>

        <p className="mt-5 text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow">
          Between 2018 and 2025, actual fires accounted for only <span className="text-red-400 font-bold text-xl">{pct(fire)}%</span> of
          all LFB callouts. Nearly half were false alarms, while special service demand
          surged by <span className="text-blue-400 font-bold text-xl">69%</span>.
        </p>

        <div className="grid grid-cols-3 gap-4 mt-10 max-w-lg">
          <div className="bg-black/50 backdrop-blur rounded-lg p-4 border border-white/20 text-center">
            <p className="text-3xl font-extrabold text-amber-400">{pct(fa)}%</p>
            <p className="text-xs text-slate-300 mt-1">False Alarms</p>
          </div>
          <div className="bg-black/50 backdrop-blur rounded-lg p-4 border border-white/20 text-center">
            <p className="text-3xl font-extrabold text-red-400">{pct(fire)}%</p>
            <p className="text-xs text-slate-300 mt-1">Fires</p>
          </div>
          <div className="bg-black/50 backdrop-blur rounded-lg p-4 border border-white/20 text-center">
            <p className="text-3xl font-extrabold text-blue-400">{pct(ss)}%</p>
            <p className="text-xs text-slate-300 mt-1">Special Services</p>
          </div>
        </div>
      </div>
    </header>
  )
}
