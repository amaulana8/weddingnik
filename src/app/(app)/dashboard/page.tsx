import { createServerSupabase } from '@/lib/supabaseServer'

export default async function DashboardPage() {
  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  const { count: projectCount } = await supabase
    .from('tenants')
    .select('*', { count: 'exact', head: true })
    .eq('admin_id', user?.id)

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Dashboard</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">Welcome back, {user?.email?.split('@')[0]}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-navy-100/20 p-5 hover:shadow-sm transition-all">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-2">Total Projects</p>
          <p className="text-2xl font-semibold text-navy-800">{projectCount || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100/20 p-5 hover:shadow-sm transition-all">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-2">Quick Links</p>
          <a href="/project" className="text-sm text-rose-gold-500 font-medium hover:text-rose-gold-600 transition-colors">View all projects →</a>
        </div>
        <div className="bg-white rounded-xl border border-navy-100/20 p-5 hover:shadow-sm transition-all">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-2">Account</p>
          <p className="text-sm font-medium text-navy-700 truncate">{user?.email}</p>
        </div>
      </div>
    </div>
  )
}
