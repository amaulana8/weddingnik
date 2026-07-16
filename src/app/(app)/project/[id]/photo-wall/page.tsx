import { createServerSupabase } from '@/lib/supabaseServer'

export default async function PhotoWallPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: photos } = await supabase.from('guestbook_entries').select('photo_url, name, message, created_at').eq('tenant_id', id).not('photo_url', 'is', null).order('created_at', { ascending: false })
  const photosWithUrl = photos?.filter(p => p.photo_url) || []

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Photo Wall</h1><p className="text-xs text-navy-400/60 mt-0.5">{photosWithUrl.length} photos</p></div>
      {photosWithUrl.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photosWithUrl.map((p, i) => (
            <div key={i} className="aspect-square rounded-xl bg-navy-50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
              <div className="absolute bottom-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-medium text-white">{p.name || 'Guest'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-center py-16 text-sm text-navy-400/40">No photos yet. Photos from guestbook entries will appear here.</div>}
    </div>
  )
}