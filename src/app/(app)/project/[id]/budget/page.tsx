import { createServerSupabase } from '@/lib/supabaseServer'
import { createClient } from '@/lib/supabaseClient'
import BudgetForm from '@/components/BudgetForm'

export default async function BudgetPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams?: Promise<any> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: project } = await supabase.from('tenants').select('total_budget').eq('id', id).single()
  const { data: expenses } = await supabase.from('expenses').select('*, budget_categories(name)').eq('tenant_id', id).order('expense_date', { ascending: false })
  const { data: categories } = await supabase.from('budget_categories').select('*').eq('tenant_id', id)

  const totalSpent = expenses?.reduce((a, b) => a + (b.amount || 0), 0) || 0
  const budgetLimit = project?.total_budget || 0
  const percentage = budgetLimit > 0 ? Math.round((totalSpent / budgetLimit) * 100) : 0

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Budget</h1>
          <p className="text-xs text-navy-400/60 mt-0.5">Track your wedding expenses</p>
        </div>
        <BudgetForm tenantId={id} categories={categories || []} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-navy-100/20 p-5">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Total Budget</p>
          <p className="text-xl font-semibold text-navy-800">Rp {budgetLimit.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100/20 p-5">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Total Spent</p>
          <p className="text-xl font-semibold text-rose-gold-500">Rp {totalSpent.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100/20 p-5">
          <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider mb-1">Remaining</p>
          <p className="text-xl font-semibold text-emerald-500">Rp {(budgetLimit - totalSpent).toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Progress */}
      {budgetLimit > 0 && (
        <div className="bg-white rounded-xl border border-navy-100/20 p-5">
          <div className="flex justify-between text-xs font-medium text-navy-400/60 mb-2">
            <span>Budget Usage</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-2 bg-navy-50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 rounded-full transition-all" style={{ width: `${Math.min(percentage, 100)}%` }} />
          </div>
        </div>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="bg-white rounded-xl border border-navy-100/20 divide-y divide-navy-100/10">
          <div className="px-5 py-3">
            <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider">Categories</p>
          </div>
          {categories.map((cat) => {
            const catTotal = expenses?.filter(e => e.category_id === cat.id).reduce((a, b) => a + (b.amount || 0), 0) || 0
            return (
              <div key={cat.id} className="px-5 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-navy-700">{cat.name}</span>
                <span className="text-sm font-semibold text-navy-600">Rp {catTotal.toLocaleString('id-ID')}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Recent Expenses */}
      {expenses && expenses.length > 0 && (
        <div className="bg-white rounded-xl border border-navy-100/20 overflow-hidden">
          <div className="px-5 py-3 border-b border-navy-100/10">
            <p className="text-[11px] font-semibold text-navy-400/60 uppercase tracking-wider">Recent Expenses</p>
          </div>
          <div className="divide-y divide-navy-100/10">
            {expenses.slice(0, 10).map((exp) => (
              <div key={exp.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-navy-700">{exp.description || 'Expense'}</p>
                  <p className="text-[10px] text-navy-400/40">{exp.budget_categories?.name} &middot; {exp.expense_date ? new Date(exp.expense_date).toLocaleDateString('id-ID') : ''}</p>
                </div>
                <span className="text-sm font-semibold text-rose-gold-500">Rp {exp.amount.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!expenses || expenses.length === 0) && (
        <div className="text-center py-16 text-sm text-navy-400/40">No expenses yet. Add your first expense to get started.</div>
      )}
    </div>
  )
}
