import { createServerSupabase } from '@/lib/supabaseServer'

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: members } = await supabase.from('wedding_memberships').select('*, profiles(email)').eq('tenant_id', id)

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Team</h1><p className="text-xs text-navy-400/60 mt-0.5">Project members</p></div>
      {members && members.length > 0 ? (
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-navy-100/20 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-navy-700">{(m as any).profiles?.email || 'Member'}</p>
                <p className="text-[10px] text-navy-400/40 capitalize">{m.role}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${m.role === 'admin' ? 'bg-rose-gold-50 text-rose-gold-600' : 'bg-navy-50/40 text-navy-400/60'}`}>{m.role}</span>
            </div>
          ))}
        </div>
      ) : <div className="text-center py-16 text-sm text-navy-400/40">No team members yet.</div>}
    </div>
  )
}