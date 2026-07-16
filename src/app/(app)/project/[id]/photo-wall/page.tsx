import { createServerSupabase } from '@/lib/supabaseServer'
import PhotoWallClient from './PhotoWallClient'

export default async function PhotoWall({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const [{ data: entries }, { data: invitation }] = await Promise.all([
    supabase.from('guestbook_entries').select('*').eq('tenant_id', id).order('created_at', { ascending: false }),
    supabase.from('invitation_details').select('groom_name, bride_name').eq('tenant_id', id).single()
  ])
  return <PhotoWallClient id={id} entries={entries || []} invitation={invitation} />
}
