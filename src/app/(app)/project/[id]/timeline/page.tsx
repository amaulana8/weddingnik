import { createServerSupabase } from '@/lib/supabaseServer'
import AddTimelineForm from './AddTimelineForm'
import TimelineClient from './TimelineClient'

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const [timelines, categories] = await Promise.all([
    supabase.from('payment_timelines').select('*, budget_categories(name)').eq('tenant_id', id).order('due_date', { ascending: true }),
    supabase.from('budget_categories').select('id, name').eq('tenant_id', id)
  ])

  return <TimelineClient items={timelines?.data || []} categories={categories?.data || []} tenantId={id} />
}
