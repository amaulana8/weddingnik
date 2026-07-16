import { createServerSupabase } from '@/lib/supabaseServer'

export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: items } = await supabase.from('payment_timelines').select('*').eq('tenant_id', id).order('due_date', { ascending: true })
  const done = items?.filter(i => i.status === 'paid').length || 0
  const total = items?.length || 0

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Checklist</h1><p className="text-xs text-navy-400/60 mt-0.5">{done}/{total} completed</p></div>
      {total > 0 && (
        <div className="bg-white rounded-xl border border-navy-100/20 p-5">
          <div className="flex justify-between text-xs text-navy-400/60 mb-2"><span>Progress</span><span>{Math.round(done/total*100)}%</span></div>
          <div className="h-2 bg-navy-50 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 rounded-full transition-all" style={{width: `${Math.round(done/total*100)}%`}} /></div>
        </div>
      )}
      {items && items.length > 0 ? (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-navy-100/20 p-4 flex items-center gap-4">
              <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${item.status === 'paid' ? 'bg-emerald-500 border-emerald-500' : 'border-navy-200'}`}>
                {item.status === 'paid' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>}
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-medium ${item.status === 'paid' ? 'text-navy-400/50 line-through' : 'text-navy-700'}`}>{item.description || 'Task'}</p>
                {item.due_date && <p className="text-[10px] text-navy-400/40">{new Date(item.due_date).toLocaleDateString('id-ID')}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-center py-16 text-sm text-navy-400/40">No checklist items yet.</div>}
    </div>
  )
}