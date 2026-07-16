import { createServerSupabase } from '@/lib/supabaseServer'

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tenantId } = await params
  const supabase = await createServerSupabase()
  const { data: guests } = await supabase.from('guests').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false })
  const { data: rsvps } = await supabase.from('rsvps').select('*').eq('tenant_id', tenantId)

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Guests</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">{guests?.length || 0} guests, {rsvps?.length || 0} RSVPs</p>
      </div>
      {(!guests || guests.length === 0) && (
        <div className="text-center py-16 text-sm text-navy-400/40">No guests yet.</div>
      )}
    </div>
  )
}