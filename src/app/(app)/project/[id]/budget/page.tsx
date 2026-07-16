import { createServerSupabase } from '@/lib/supabaseServer'
import BudgetContainer from './BudgetContainer'

export default async function BudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const [{ data: categories }, { data: expenses }, { data: timelines }, { data: project }] = await Promise.all([
    supabase.from('budget_categories').select('*').eq('tenant_id', id),
    supabase.from('expenses').select('*, budget_categories(name)').eq('tenant_id', id).order('expense_date', { ascending: false }),
    supabase.from('payment_timelines').select('*, budget_categories(name)').eq('tenant_id', id).order('due_date', { ascending: true }),
    supabase.from('tenants').select('total_budget, name').eq('id', id).single()
  ])

  return (
    <BudgetContainer
      id={id}
      globalBudgetLimit={project?.total_budget || 0}
      categories={categories || []}
      expenses={expenses || []}
      timelines={timelines || []}
    />
  )
}
