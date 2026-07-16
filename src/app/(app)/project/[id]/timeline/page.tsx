import { createServerSupabase } from '@/lib/supabaseServer'

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: items } = await supabase.from('payment_timelines').select('*, budget_categories(name)').eq('tenant_id', id).order('due_date', { ascending: true })

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Timeline</h1><p className="text-xs text-navy-400/60 mt-0.5">Payment milestones</p></div>
      {items && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-navy-100/20 p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-navy-700">{item.description || 'Milestone'}</h3>
                <span className="text-sm font-semibold text-rose-gold-500">Rp {item.amount?.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-navy-400/40">
                {item.due_date && <span>Due: {new Date(item.due_date).toLocaleDateString('id-ID')}</span>}
                {item.budget_categories?.name && <span>{item.budget_categories.name}</span>}
                {item.status && <span className={`px-2 py-0.5 rounded-full font-semibold ${item.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : item.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-navy-50/40 text-navy-400/60'}`}>{item.status}</span>}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-center py-16 text-sm text-navy-400/40">No timeline items yet.</div>}
    </div>
  )
}