import { createServerSupabase } from '@/lib/supabaseServer'

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tenantId } = await params
  const supabase = await createServerSupabase()
  const { data: guests } = await supabase.from('guests').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false })
  const { data: rsvps } = await supabase.from('rsvps').select('*').eq('tenant_id', tenantId)
  const attending = rsvps?.filter(r => r.is_attending).length || 0
  const declined = rsvps?.filter(r => !r.is_attending).length || 0

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Guests</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">Manage your guest list and RSVPs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-navy-100/20 p-5">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Total Invited</p>
          <p className="text-xl font-semibold text-navy-800">{guests?.length || 0}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100/20 p-5">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Attending</p>
          <p className="text-xl font-semibold text-emerald-500">{attending}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100/20 p-5">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Declined</p>
          <p className="text-xl font-semibold text-red-400">{declined}</p>
        </div>
      </div>

      {guests && guests.length > 0 && (
        <div className="bg-white rounded-xl border border-navy-100/20 overflow-hidden">
          <div className="px-5 py-3 border-b border-navy-100/10">
            <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider">Guest List ({guests.length})</p>
          </div>
          <div className="divide-y divide-navy-100/10">
            {guests.map((guest) => {
              const rsvp = rsvps?.find(r => r.guest_id === guest.id)
              return (
                <div key={guest.id} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-navy-700 truncate">{guest.name}</p>
                    {guest.phone && <p className="text-[10px] text-navy-400/40">{guest.phone}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {rsvp ? (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rsvp.is_attending ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
                        {rsvp.is_attending ? 'Attending' : 'Declined'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-navy-400/40 bg-navy-50/40 px-2 py-0.5 rounded-full">Pending</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {(!guests || guests.length === 0) && (
        <div className="text-center py-16 text-sm text-navy-400/40">No guests yet. Start building your guest list.</div>
      )}
    </div>
  )
}
