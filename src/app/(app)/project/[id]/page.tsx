import { createServerSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'

export default async function ProjectOverviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: project } = await supabase.from('tenants').select('*').eq('id', id).single()
  const { data: expenses } = await supabase.from('expenses').select('amount').eq('tenant_id', id)
  const { count: guestCount } = await supabase.from('guests').select('*', { count: 'exact', head: true }).eq('tenant_id', id)
  const { data: rsvps } = await supabase.from('rsvps').select('*').eq('tenant_id', id)

  const totalSpent = expenses?.reduce((a, b) => a + (b.amount || 0), 0) || 0
  const rsvpRate = guestCount && guestCount > 0 ? Math.round((rsvps?.length || 0) / guestCount * 100) : 0
  const attendingCount = rsvps?.filter(r => r.is_attending).length || 0

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">{project?.name || 'Project'}</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">Project overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href={`/project/${id}/budget`} className="bg-white rounded-xl border border-navy-100/20 p-5 hover:border-rose-gold-200/50 hover:shadow-sm transition-all group">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Budget</p>
          <p className="text-xl font-semibold text-navy-800">Rp {totalSpent.toLocaleString('id-ID')}</p>
          <p className="text-[10px] text-navy-400/40 mt-1 group-hover:text-rose-gold-500 transition-colors">View details →</p>
        </Link>

        <Link href={`/project/${id}/guests`} className="bg-white rounded-xl border border-navy-100/20 p-5 hover:border-rose-gold-200/50 hover:shadow-sm transition-all group">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Guests</p>
          <p className="text-xl font-semibold text-navy-800">{attendingCount} / {guestCount || 0}</p>
          <p className="text-[10px] text-navy-400/40 mt-1 group-hover:text-rose-gold-500 transition-colors">RSVP rate: {rsvpRate}% →</p>
        </Link>

        <Link href={`/project/${id}/checklist`} className="bg-white rounded-xl border border-navy-100/20 p-5 hover:border-rose-gold-200/50 hover:shadow-sm transition-all group">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Overview</p>
          <p className="text-xl font-semibold text-navy-800">Active</p>
          <p className="text-[10px] text-navy-400/40 mt-1 group-hover:text-rose-gold-500 transition-colors">Manage project →</p>
        </Link>
      </div>

    </div>
  )
}
