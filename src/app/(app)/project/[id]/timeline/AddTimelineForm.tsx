'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createTimeline } from '@/app/actions/weddingActions'

export default function AddTimelineForm({ tenantId, categories }: { tenantId: string; categories?: any[] }) {
  const [open, setOpen] = useState(false); const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    await createTimeline(tenantId, new FormData(e.currentTarget))
    setLoading(false); setOpen(false); router.refresh()
  }
  return (<>
    <button onClick={() => setOpen(true)} className="h-9 px-4 rounded-xl bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-navy-900 transition-all shadow-sm">+ Add Milestone</button>
    {open && <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between mb-4">
          <div><h2 className="text-sm font-semibold text-navy-800">Add Schedule</h2><p className="text-[10px] text-navy-400/50 mt-0.5">Payment milestone</p></div>
          <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-lg bg-navy-50/40 text-navy-400/60 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Description</label>
            <input type="text" name="description" required placeholder="e.g. Catering payment" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Amount (Rp)</label>
              <input type="number" name="amount_due" required placeholder="0" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Category</label>
              <select name="category_id" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all">
                <option value="">General</option>
                {categories?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Due Date</label>
            <input type="date" name="due_date" required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
          </div>
          <button type="submit" disabled={loading} className="w-full h-10 rounded-xl bg-navy-800 text-white text-xs font-semibold hover:bg-navy-900 disabled:opacity-50 transition-all">{loading ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </div>}
  </>)
}
