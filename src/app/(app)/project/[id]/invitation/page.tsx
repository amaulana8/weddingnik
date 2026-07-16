import { createServerSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'
import InvitationForm from '@/components/InvitationForm'

export default async function InvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: inv } = await supabase.from('invitation_details').select('*').eq('tenant_id', id).maybeSingle()

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Invitation</h1><p className="text-xs text-navy-400/60 mt-0.5">Digital wedding invitation</p></div>
        <Link href={`/invitation/${id}`} target="_blank" className="h-9 px-4 rounded-xl border border-navy-100/20 text-navy-500 text-xs font-semibold flex items-center gap-2 hover:bg-navy-50/40 transition-all">Preview <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg></Link>
      </div>
      <InvitationForm tenantId={id} invitation={inv} />
    </div>
  )
}