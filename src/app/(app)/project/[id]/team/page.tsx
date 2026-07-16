import { createServerSupabase } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { redirect } from 'next/navigation'
import TeamClient from './TeamClient'

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: rawMembers } = await supabaseAdmin
    .from('wedding_memberships')
    .select('id, role, user_id')
    .eq('tenant_id', id)

  const userIds = rawMembers?.map(m => m.user_id) || []
  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, email, name')
    .in('id', userIds)

  const members = rawMembers?.map(member => ({
    ...member,
    profiles: profiles?.find(p => p.id === member.user_id) || null
  })) || []

  return <TeamClient members={members} currentUserEmail={user.email || ''} tenantId={id} />
}
