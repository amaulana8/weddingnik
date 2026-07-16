import { createServerSupabase } from '@/lib/supabaseServer'

export default async function PhotoWallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: photos } = await supabase.from('guestbook_entries').select('name, message, created_at').eq('tenant_id', id).order('created_at', { ascending: false })
  const photoCount = photos?.length || 0

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Photo Wall</h1><p className="text-xs text-navy-400/60 mt-0.5">{photoCount} entries</p></div>
      {photoCount > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos?.map((p, i) => (
            <div key={i} className="aspect-square rounded-xl bg-gradient-to-br from-rose-gold-50 to-navy-50 border border-navy-100/20 p-4 flex flex-col justify-end">
              <p className="text-xs font-semibold text-navy-700">{p.name}</p>
              {p.message && <p className="text-[10px] text-navy-400/40 line-clamp-2">{p.message}</p>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-sm text-navy-400/40">No entries yet. Guestbook messages will appear here.</div>
      )}
    </div>
  )
}
