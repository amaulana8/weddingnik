import Link from 'next/link'

const features = [
  { title: 'Guest Management', desc: 'RSVPs, seating, and invitations in one place' },
  { title: 'Budget Tracking', desc: 'Real-time expense tracking with categories' },
  { title: 'Timeline Planner', desc: 'Day-of coordination and vendor schedules' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#faf5f0] via-[#fdf8f5] to-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full border-[60px] border-rose-gold-200/10" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full border-[40px] border-rose-gold-100/10" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-5">
        <header className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-rose-gold-400 to-rose-gold-500 flex items-center justify-center shadow-lg shadow-rose-gold-200/30">
              <span className="text-white font-bold text-xs">N</span>
            </div>
            <span className="text-lg font-semibold text-navy-800 tracking-tight">WeddingNik</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-medium text-navy-400/70 hover:text-navy-600 transition-colors">Sign In</Link>
            <Link href="/login" className="px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 hover:from-rose-gold-500 hover:to-rose-gold-600 shadow-md hover:shadow-lg transition-all active:scale-[0.97]">
              Get Started
            </Link>
          </nav>
        </header>

        <section className="pt-20 sm:pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-gold-50 border border-rose-gold-200/40 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-gold-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-rose-gold-600 tracking-wide">Wedding Management Platform</span>
          </div>
          <h1 className="text-[2rem] sm:text-5xl font-bold tracking-tight text-navy-800 leading-[1.15]">
            Every Detail<br />
            <span className="bg-gradient-to-r from-rose-gold-400 via-rose-gold-500 to-rose-gold-600 bg-clip-text text-transparent">Beautifully Organized</span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-navy-500/60 max-w-md mx-auto leading-relaxed">
            From guest lists to budgets, timelines to vendors — manage your wedding with elegance and ease.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login" className="w-full sm:w-auto h-11 px-7 rounded-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-rose-gold-200/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.97] transition-all">
              Start Planning
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </Link>
            <Link href="#features" className="w-full sm:w-auto h-11 px-7 rounded-full border border-rose-gold-200 text-navy-500 text-sm font-medium flex items-center justify-center hover:bg-rose-gold-50 active:scale-[0.97] transition-all">Learn More</Link>
          </div>
        </section>

        <section id="features" className="pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <div key={i} className="group p-5 sm:p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-rose-gold-100/40 hover:bg-white hover:border-rose-gold-200 hover:shadow-lg hover:shadow-rose-gold-100/20 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-rose-gold-50 text-rose-gold-500 flex items-center justify-center mb-3 group-hover:bg-rose-gold-500 group-hover:text-white transition-all duration-300">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {i === 0 ? <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></> : i === 1 ? <><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></> : <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></>}
                  </svg>
                </div>
                <h3 className="font-semibold text-navy-700 text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-navy-400/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="border-t border-rose-gold-100/20 py-6">
          <p className="text-center text-xs text-navy-400/40 font-medium">&copy; {new Date().getFullYear()} WeddingNik</p>
        </footer>
      </div>
    </div>
  )
}
