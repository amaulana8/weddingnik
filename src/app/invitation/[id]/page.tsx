import { supabaseAdmin } from '@/lib/supabaseAdmin'
import { notFound } from 'next/navigation'
import InvitationClient from './InvitationClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function InvitationPublicPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ to?: string }>
}) {
  const { id } = await params
  const { to } = await searchParams

  const { data: invitation } = await supabaseAdmin
    .from('invitation_details').select('*, tenants(name, is_guestbook_enabled)')
    .eq('tenant_id', id)
    .single()

  if (!invitation) notFound()

  let guestInfo = null
  if (to) {
    const { data: guest } = await supabaseAdmin
      .from('guests')
      .select('*')
      .eq('qr_code_token', to)
      .single()
    guestInfo = guest
  }

  return <InvitationClient invitation={invitation} guestInfo={guestInfo} tenantId={id} />
}
