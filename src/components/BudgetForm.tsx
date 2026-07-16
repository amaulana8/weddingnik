'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function BudgetForm({ tenantId, categories }: { tenantId: string; categories: any[] }) {
  const [open, setOpen] = useState(false)
  const [desc, setDesc] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!desc.trim() || !amount) return
    setLoading(true)

    await supabase.from('expenses').insert({
      tenant_id: tenantId,
      description: desc.trim(),
      amount: parseInt(amount),
      category_id: categoryId || null,
      expense_date: new Date().toISOString(),
    })

    setLoading(false)
    setOpen(false)
    setDesc('')
    setAmount('')
    setCategoryId('')
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="h-8 px-3 rounded-lg bg-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-600 active:scale-[0.97] transition-all shadow-sm"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Expense
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[100] bg-navy-900/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-sm px-4 animate-scale-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-navy-100/20 p-6">
              <h2 className="text-sm font-semibold text-navy-800 mb-1">Add Expense</h2>
              <p className="text-xs text-navy-400/60 mb-5">Record a new transaction</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium placeholder:text-navy-400/30 focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 focus:border-rose-gold-400 transition-all" />
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (Rp)" required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium placeholder:text-navy-400/30 focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 focus:border-rose-gold-400 transition-all" />
                <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 focus:border-rose-gold-400 transition-all">
                  <option value="">No category</option>
                  {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="h-9 px-4 rounded-xl text-xs font-semibold text-navy-400/60 hover:text-navy-600 transition-all">Cancel</button>
                  <button type="submit" disabled={loading} className="h-9 px-5 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50 transition-all">{loading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
