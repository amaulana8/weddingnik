import { createServerSupabase } from '@/lib/supabaseServer'
import GuestForm from './GuestForm'
import { deleteGuest } from '@/app/actions/weddingActions'

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tenantId } = await params
  const supabase = await createServerSupabase()
  const { data: guests } = await supabase.from('guests').select('*').eq('tenant_id', tenantId).order('name')
  const attending = guests?.filter(g => g.status === 'attended').length || 0

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Guests</h1>
          <p className="text-xs text-navy-400/60 mt-0.5">{guests?.length || 0} invited, {attending} attending</p>
        </div>
        <GuestForm tenantId={tenantId} />
      </div>

      {guests && guests.length > 0 ? (
        <div className="bg-white rounded-xl border border-navy-100/20 divide-y divide-navy-100/10 overflow-hidden">
          {guests.map(guest => (
            <div key={guest.id} className="px-5 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-navy-700">{guest.name}</p>
                <p className="text-[10px] text-navy-400/40">{guest.category || 'General'} · {guest.qr_code_token?.substring(0, 8)}</p>
              </div>
              <div className="flex items-center gap-2">
                {guest.status === 'attended' ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Checked in</span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy-50/40 text-navy-400/60">Pending</span>
                )}
                <form action={deleteGuest.bind(null, tenantId, guest.id)}>
                  <button className="h-7 w-7 rounded-lg text-navy-400/40 hover:text-red-400 hover:bg-red-50 transition-all flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-sm text-navy-400/40">No guests yet.</div>
      )}
    </div>
  )
}
