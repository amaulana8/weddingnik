import { createServerSupabase } from '@/lib/supabaseServer'
import RundownClient from './RundownClient'

export default async function RundownPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const [rundowns, project] = await Promise.all([
    supabase.from('wedding_rundowns').select('*').eq('tenant_id', id).order('start_time', { ascending: true }),
    supabase.from('tenants').select('name').eq('id', id).single()
  ])

  return <RundownClient rundowns={rundowns?.data || []} projectName={project?.data?.name || 'Wedding Project'} tenantId={id} />
}
