import { createServerSupabase } from '@/lib/supabaseServer'

export default async function ScannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: items } = await supabase.from('guests').select('*').eq('tenant_id', id).order('created_at', { ascending: false })
  const itemCount = items?.length || 0

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Scanner</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">{itemCount} items</p>
      </div>
      {itemCount === 0 && (
        <div className="text-center py-16 text-sm text-navy-400/40">No data yet.</div>
      )}
    </div>
  )
}
