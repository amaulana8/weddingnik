import { createServerSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: inv } = await supabase.from('invitation_details').select('*').eq('tenant_id', id).single()

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Invitation</h1><p className="text-xs text-navy-400/60 mt-0.5">Digital wedding invitation</p></div>
        <Link href={`/invitation/${id}`} target="_blank" className="h-9 px-4 rounded-xl bg-rose-gold-50 text-rose-gold-600 text-xs font-semibold flex items-center gap-2 hover:bg-rose-gold-100 transition-all">Preview <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg></Link>
      </div>
      {inv ? (
        <div className="bg-white rounded-xl border border-navy-100/20 p-5 space-y-3">
          <div><p className="text-[10px] text-navy-400/40 uppercase tracking-wider">Couple</p><p className="text-sm font-medium text-navy-700">{inv.bride_name} & {inv.groom_name}</p></div>
          {inv.event_date && <div><p className="text-[10px] text-navy-400/40 uppercase tracking-wider">Date</p><p className="text-sm font-medium text-navy-700">{new Date(inv.event_date).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })}</p></div>}
          {inv.location && <div><p className="text-[10px] text-navy-400/40 uppercase tracking-wider">Location</p><p className="text-sm font-medium text-navy-700">{inv.location}</p></div>}
        </div>
      ) : <div className="text-center py-16 text-sm text-navy-400/40">No invitation details yet. Configure in the project settings.</div>}
    </div>
  )
}