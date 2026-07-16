import { createServerSupabase } from '@/lib/supabaseServer'
import { redirect } from 'next/navigation'
import GuestbookClient from './GuestbookClient'

export default async function GuestbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenant } = await supabase.from('tenants').select('is_guestbook_enabled').eq('id', id).single()

  if (!tenant?.is_guestbook_enabled) {
    return (
      <div className="animate-fade-in flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-navy-100/20 p-8 text-center max-w-sm">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h2 className="text-base font-semibold text-navy-800 mb-2">Feature Not Active</h2>
          <p className="text-xs text-navy-400/60 mb-6">Digital Guestbook is not enabled for this project. Enable it in Project Settings.</p>
          <a href="/project" className="inline-block h-9 px-5 rounded-xl bg-navy-800 text-white text-xs font-semibold flex items-center justify-center hover:bg-navy-900 transition-all">Back to Projects</a>
        </div>
      </div>
    )
  }

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
