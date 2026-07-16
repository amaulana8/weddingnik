'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

type Tab = 'overview' | 'categories' | 'history' | 'schedule'

export default function BudgetContainer({ id, globalBudgetLimit, categories, expenses, timelines }: {
  id: string; globalBudgetLimit: number; categories: any[]; expenses: any[]; timelines: any[]
}) {
  const [tab, setTab] = useState<Tab>('overview')
  const [showAdd, setShowAdd] = useState(false)
  const [addType, setAddType] = useState<'expense' | 'category' | 'schedule'>('expense')
  const [editingBudget, setEditingBudget] = useState(false)
  const [budgetInput, setBudgetInput] = useState(String(globalBudgetLimit || 0))
  const router = useRouter()
  const supabase = createClient()

  const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0)
  const remaining = globalBudgetLimit - totalSpent
  const pct = globalBudgetLimit > 0 ? Math.round((totalSpent / globalBudgetLimit) * 100) : 0

  const now = new Date()
  const overduePayments = timelines.filter((p: any) => p.status !== 'paid' && new Date(p.due_date) < now)
  const upcomingPayments = timelines.filter((p: any) => p.status !== 'paid' && new Date(p.due_date) >= now && new Date(p.due_date) <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000))

  const catSpent: Record<string, number> = {}
  expenses.forEach(e => { catSpent[e.category_id] = (catSpent[e.category_id] || 0) + (e.amount || 0) })

  const handleSaveBudget = async () => {
    const val = parseInt(budgetInput) || 0
    await supabase.from('tenants').update({ total_budget: val }).eq('id', id)
    setEditingBudget(false)
    router.refresh()
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    if (addType === 'expense') {
      await supabase.from('expenses').insert({
        tenant_id: id, description: form.get('description'), amount: parseInt(form.get('amount') as string) || 0,
        category_id: parseInt(form.get('category_id') as string) || null,
        expense_date: form.get('expense_date') as string
      })
    } else if (addType === 'category') {
      await supabase.from('budget_categories').insert({
        tenant_id: id, name: form.get('name'), budget_limit: parseInt(form.get('budget_limit') as string) || 0
      })
    } else {
      await supabase.from('payment_timelines').insert({
        tenant_id: id, description: form.get('description'),
        amount_due: parseInt(form.get('amount_due') as string) || 0,
        due_date: form.get('due_date') as string
      })
    }
    setShowAdd(false)
    router.refresh()
  }

  const TabBtn = ({ t, label }: { t: Tab; label: string }) => (
    <button onClick={() => setTab(t)} className={`py-2 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${tab === t ? 'bg-rose-gold-500 text-white shadow-sm' : 'text-navy-400/50 hover:text-navy-500'}`}>
      {label}
    </button>
  )

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Budget</h1><p className="text-xs text-navy-400/60 mt-0.5">Track your wedding expenses</p></div>
        <button onClick={() => { setShowAdd(true); setAddType('expense') }} className="h-9 px-4 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-600 active:scale-[0.97] transition-all shadow-sm">+ Add</button>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl border border-navy-100/20 shadow-sm grid grid-cols-4 gap-1">
        <TabBtn t="overview" label="Overview" />
        <TabBtn t="categories" label="Categories" />
        <TabBtn t="history" label="History" />
        <TabBtn t="schedule" label="Schedule" />
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {/* Alerts */}
          {overduePayments.length > 0 && overduePayments.map((p: any) => (
            <div key={p.id} className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">⚠</div>
                <div>
                  <p className="text-[10px] font-bold text-red-600 uppercase">Overdue Payment!</p>
                  <p className="text-sm font-semibold text-navy-700">{p.description}</p>
                  <p className="text-[10px] text-navy-400/40">Due: {new Date(p.due_date + 'T00:00:00Z').toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <button onClick={() => setTab('schedule')} className="text-[9px] font-bold bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all">View</button>
            </div>
          ))}
          {upcomingPayments.length > 0 && upcomingPayments.map((p: any) => (
            <div key={p.id} className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-center justify-between">
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">📅</div>
                <div>
                  <p className="text-[10px] font-bold text-amber-600 uppercase">Upcoming Payment</p>
                  <p className="text-sm font-semibold text-navy-700">{p.description}</p>
                  <p className="text-[10px] text-navy-400/40">Due: {new Date(p.due_date + 'T00:00:00Z').toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-rose-gold-500">Rp {(p.amount_due || 0).toLocaleString('id-ID')}</span>
            </div>
          ))}

          {/* Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-navy-100/20 p-4">
              <p className="text-[10px] font-medium text-navy-400/40 uppercase">Budget</p>
              <div className="flex items-center gap-1 mt-1">
                <p className="text-lg sm:text-xl font-semibold text-navy-800">Rp {globalBudgetLimit.toLocaleString('id-ID')}</p>
                <button onClick={() => setEditingBudget(!editingBudget)} className="text-navy-400/40 hover:text-rose-gold-500"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h3.22a2 2 0 012 2v3.22a2 2 0 01-.59 1.41l-8.59 8.59a2 2 0 01-1.41.59H3.62a1 1 0 01-1-1v-3.22a2 2 0 01.59-1.41l8.59-8.59a2 2 0 011.41-.59z"/></svg></button>
              </div>
              {editingBudget && (
                <div className="flex gap-1 mt-2">
                  <input type="number" value={budgetInput} onChange={e => setBudgetInput(e.target.value)} className="flex-1 h-8 px-2 rounded border border-navy-200/20 text-xs" />
                  <button onClick={handleSaveBudget} className="h-8 px-3 rounded bg-rose-gold-500 text-white text-[10px] font-semibold">Save</button>
                </div>
              )}
            </div>
            <div className="bg-white rounded-xl border border-navy-100/20 p-4">
              <p className="text-[10px] font-medium text-navy-400/40 uppercase">Spent</p>
              <p className="text-lg sm:text-xl font-semibold text-rose-gold-500 mt-1">Rp {totalSpent.toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100/20 p-4">
              <p className="text-[10px] font-medium text-navy-400/40 uppercase">Remaining</p>
              <p className={`text-lg sm:text-xl font-semibold mt-1 ${remaining >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>Rp {remaining.toLocaleString('id-ID')}</p>
            </div>
          </div>

          {/* Progress */}
          {globalBudgetLimit > 0 && (
            <div className="bg-white rounded-xl border border-navy-100/20 p-5">
              <div className="flex justify-between text-xs font-medium text-navy-400/60 mb-2"><span>Usage</span><span>{pct}%</span></div>
              <div className="h-2.5 bg-navy-50 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Categories */}
      {tab === 'categories' && (
        <div className="space-y-3">
          <button onClick={() => { setShowAdd(true); setAddType('category') }} className="h-9 px-4 rounded-xl bg-rose-gold-50 text-rose-gold-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-100 transition-all">+ Add Category</button>
          {categories.length > 0 ? categories.map(cat => {
            const spent = catSpent[cat.id] || 0
            const limit = cat.budget_limit || 0
            const cpct = limit > 0 ? Math.round((spent / limit) * 100) : 0
            return (
              <div key={cat.id} className="bg-white rounded-xl border border-navy-100/20 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-navy-700">{cat.name}</span>
                  <span className="text-xs font-medium text-navy-400/60">Rp {spent.toLocaleString('id-ID')} / Rp {limit.toLocaleString('id-ID')}</span>
                </div>
                {limit > 0 && (
                  <div className="h-1.5 bg-navy-50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${cpct > 100 ? 'bg-red-400' : 'bg-rose-gold-400'}`} style={{ width: `${Math.min(cpct, 100)}%` }} />
                  </div>
                )}
              </div>
            )
          }) : <div className="text-center py-12 text-sm text-navy-400/40">No categories yet.</div>}
        </div>
      )}

      {/* History */}
      {tab === 'history' && (
        <div>
          {expenses.length > 0 ? (
            <div className="bg-white rounded-xl border border-navy-100/20 divide-y divide-navy-100/10 overflow-hidden">
              {expenses.map(exp => (
                <div key={exp.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy-700">{exp.description || 'Expense'}</p>
                    <p className="text-[10px] text-navy-400/40">{exp.budget_categories?.name} &middot; {exp.expense_date ? new Date(exp.expense_date).toLocaleDateString('id-ID') : ''}</p>
                  </div>
                  <span className="text-sm font-semibold text-rose-gold-500">Rp {exp.amount.toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          ) : <div className="text-center py-12 text-sm text-navy-400/40">No expenses yet.</div>}
        </div>
      )}

      {/* Schedule */}
      {tab === 'schedule' && (
        <div className="space-y-3">
          <button onClick={() => { setShowAdd(true); setAddType('schedule') }} className="h-9 px-4 rounded-xl bg-rose-gold-50 text-rose-gold-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-100 transition-all">+ Add Schedule</button>
          {timelines.length > 0 ? timelines.map((t: any) => {
            const isPaid = t.status === 'paid'
            const due = new Date(t.due_date + 'T00:00:00Z')
            const isOverdue = !isPaid && due < now
            return (
              <div key={t.id} className={`bg-white rounded-xl border p-4 flex items-center justify-between ${isPaid ? 'border-emerald-100/40 bg-emerald-50/20' : isOverdue ? 'border-red-100/40 bg-red-50/20' : 'border-navy-100/20'}`}>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isPaid ? 'bg-emerald-100 text-emerald-700' : isOverdue ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                      {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                    </span>
                    <span className="text-[9px] text-navy-400/40">{new Date(t.due_date + 'T00:00:00Z').toLocaleDateString('id-ID')}</span>
                  </div>
                  <p className="text-sm font-medium text-navy-700">{t.description}</p>
                </div>
                <span className="text-sm font-semibold text-rose-gold-500">Rp {(t.amount_due || 0).toLocaleString('id-ID')}</span>
              </div>
            )
          }) : <div className="text-center py-12 text-sm text-navy-400/40">No payment schedule yet.</div>}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-sm font-semibold text-navy-800">
                  {addType === 'expense' ? 'Add Expense' : addType === 'category' ? 'Add Category' : 'Add Schedule'}
                </h2>
              </div>
              <button onClick={() => setShowAdd(false)} className="h-8 w-8 rounded-lg bg-navy-50/40 text-navy-400/60 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
            </div>

            {/* Add type selector */}
            <div className="flex gap-2 mb-5">
              {(['expense', 'category', 'schedule'] as const).map(t => (
                <button key={t} onClick={() => setAddType(t)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${addType === t ? 'bg-rose-gold-500 text-white' : 'bg-navy-50/40 text-navy-400/60'}`}>
                  {t === 'expense' ? 'Expense' : t === 'category' ? 'Category' : 'Schedule'}
                </button>
              ))}
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              {addType === 'expense' && (
                <>
                  <input type="text" name="description" required placeholder="Description" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                  <input type="number" name="amount" required placeholder="Amount (Rp)" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                  <select name="category_id" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm bg-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all">
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <input type="date" name="expense_date" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                </>
              )}
              {addType === 'category' && (
                <>
                  <input type="text" name="name" required placeholder="Category name" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                  <input type="number" name="budget_limit" required placeholder="Budget limit (Rp)" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                </>
              )}
              {addType === 'schedule' && (
                <>
                  <input type="text" name="description" required placeholder="Description" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                  <input type="number" name="amount_due" required placeholder="Amount (Rp)" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                  <input type="date" name="due_date" required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                </>
              )}
              <button type="submit" className="w-full h-10 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 transition-all">{addType === 'expense' ? 'Add Expense' : addType === 'category' ? 'Add Category' : 'Add Schedule'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
