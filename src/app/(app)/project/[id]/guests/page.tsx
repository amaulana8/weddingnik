import { createServerSupabase } from '@/lib/supabaseServer'
import GuestClient from './GuestClient'

export default async function GuestsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: tenantId } = await params
  const supabase = await createServerSupabase()
  const { data: guests } = await supabase.from('guests').select('*').eq('tenant_id', tenantId).order('name')
  const { data: rsvps } = await supabase.from('rsvps').select('*').eq('tenant_id', tenantId)

  return <GuestClient tenantId={tenantId} initialGuests={guests || []} initialRsvps={rsvps || []} />
}
