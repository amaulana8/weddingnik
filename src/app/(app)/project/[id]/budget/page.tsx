import { createServerSupabase } from '@/lib/supabaseServer'

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: expenses } = await supabase.from('expenses').select('*, budget_categories(name)').eq('tenant_id', id).order('expense_date', { ascending: false })
  const total = expenses?.reduce((a, b) => a + (b.amount || 0), 0) || 0

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Budget</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">Total: Rp {total.toLocaleString('id-ID')}</p>
      </div>
      {expenses?.length === 0 && (
        <div className="text-center py-16 text-sm text-navy-400/40">No expenses yet.</div>
      )}
    </div>
  )
}