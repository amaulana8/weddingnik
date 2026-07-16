import { createServerSupabase } from '@/lib/supabaseServer'
import GuestbookUploadForm from '@/components/GuestbookUploadForm'
import Link from 'next/link'

export default async function GuestbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: entries } = await supabase.from('guestbook_entries').select('*').eq('tenant_id', id).order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Guestbook</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">Messages from your guests</p>
      </div>

      {entries && entries.length > 0 && (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-xl border border-navy-100/20 p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-navy-700">{entry.name || 'Anonymous'}</p>
                  <p className="text-[10px] text-navy-400/40">{new Date(entry.created_at).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
              {entry.message && <p className="text-sm text-navy-500/70 leading-relaxed">{entry.message}</p>}
            </div>
          ))}
        </div>
      )}

      {(!entries || entries.length === 0) && (
        <div className="text-center py-16 text-sm text-navy-400/40">No guestbook entries yet.</div>
      )}
    </div>
  )
}
