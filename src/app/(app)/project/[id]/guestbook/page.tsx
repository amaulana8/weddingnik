import { createServerSupabase } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import GuestbookClient from './GuestbookClient'

export default async function GuestbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: entries } = await supabase
    .from('guestbook_entries')
    .select('*')
    .eq('tenant_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Guestbook</h1>
          <p className="text-xs text-navy-400/60 mt-0.5">{entries?.length || 0} entries</p>
        </div>
      </div>
      <GuestbookClient tenantId={id} initialEntries={entries || []} />
    </div>
  )
}
