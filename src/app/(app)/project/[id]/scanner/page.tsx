import { createServerSupabase } from '@/lib/supabaseServer'

export default async function ScannerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: guests } = await supabase.from('guests').select('name, phone').eq('tenant_id', id).order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Scanner</h1><p className="text-xs text-navy-400/60 mt-0.5">QR check-in at venue</p></div>
      <div className="bg-white rounded-xl border border-navy-100/20 p-8 text-center">
        <div className="h-16 w-16 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy-300"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" x2="17" y1="12" y2="12"/></svg>
        </div>
        <p className="text-sm text-navy-400/60">QR code scanner will be available at the event venue.</p>
        <p className="text-xs text-navy-400/40 mt-2">Total guests: {guests?.length || 0}</p>
      </div>
    </div>
  )
}