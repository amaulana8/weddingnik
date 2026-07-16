import { createServerSupabase } from '@/lib/supabaseServer'
import ChecklistClient from './ChecklistClient'

export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: tasks } = await supabase.from('payment_timelines').select('*, budget_categories(name)').eq('tenant_id', id).order('due_date', { ascending: true })
  return <ChecklistClient tasks={tasks || []} tenantId={id} />
}
