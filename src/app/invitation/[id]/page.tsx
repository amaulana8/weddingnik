import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import InvitationClient from './InvitationClient'

export default async function InvitationPublicPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ to?: string }>
}) {
  const { id } = await params
  const { to } = await searchParams
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return cookieStore.getAll() } } }
  )

  const { data: invitation } = await supabase
    .from('invitation_details')
    .select('*, tenants(name, is_guestbook_enabled)')
    .eq('tenant_id', id)
    .single()

  if (!invitation) notFound()

  let guestInfo = null
  if (to) {
    const { data: guest } = await supabase
      .from('guests')
      .select('*')
      .eq('qr_code_token', to)
      .single()
    guestInfo = guest
  }

  return <InvitationClient invitation={invitation} guestInfo={guestInfo} tenantId={id} />
}
