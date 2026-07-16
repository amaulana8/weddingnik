import { createServerSupabase } from '@/lib/supabaseServer'

export default async function VendorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: vendors } = await supabase.from('wedding_vendors').select('*').eq('tenant_id', id).order('name', { ascending: true })

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Vendors</h1><p className="text-xs text-navy-400/60 mt-0.5">Wedding service providers</p></div>
      {vendors && vendors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {vendors.map((v) => (
            <div key={v.id} className="bg-white rounded-xl border border-navy-100/20 p-5 group hover:border-rose-gold-200/50 transition-all">
              <h3 className="text-sm font-semibold text-navy-700 mb-1">{v.name}</h3>
              {v.service && <p className="text-xs text-rose-gold-500 font-medium mb-1">{v.service}</p>}
              {v.phone && <p className="text-xs text-navy-400/40">{v.phone}</p>}
              {v.notes && <p className="text-xs text-navy-400/40 mt-1">{v.notes}</p>}
            </div>
          ))}
        </div>
      ) : <div className="text-center py-16 text-sm text-navy-400/40">No vendors added yet.</div>}
    </div>
  )
}