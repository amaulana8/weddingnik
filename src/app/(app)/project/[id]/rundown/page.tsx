import { createServerSupabase } from '@/lib/supabaseServer'

export default async function RundownPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: rundowns } = await supabase.from('wedding_rundowns').select('*').eq('tenant_id', id).order('start_time', { ascending: true })
  const fmt = (t: string) => t ? t.substring(0, 5) : ''

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Rundown</h1><p className="text-xs text-navy-400/60 mt-0.5">Event schedule</p></div>
      {rundowns && rundowns.length > 0 ? (
        <div className="space-y-4">
          {rundowns.map((r, i) => (
            <div key={r.id} className="bg-white rounded-xl border border-navy-100/20 p-5 group hover:border-rose-gold-200/50 transition-all">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-8 w-0.5 bg-rose-gold-300 rounded-full" />
                <span className="text-xs font-bold text-rose-gold-500">{fmt(r.start_time)}{r.end_time ? ` - ${fmt(r.end_time)}` : ''}</span>
              </div>
              <h3 className="text-sm font-semibold text-navy-700 mb-1">{r.activity}</h3>
              {r.location && <p className="text-xs text-navy-400/50">{r.location}{r.pic ? ` · ${r.pic}` : ''}</p>}
              {r.notes && <p className="text-xs text-navy-400/40 mt-1">{r.notes}</p>}
            </div>
          ))}
        </div>
      ) : <div className="text-center py-16 text-sm text-navy-400/40">No rundown items yet.</div>}
    </div>
  )
}