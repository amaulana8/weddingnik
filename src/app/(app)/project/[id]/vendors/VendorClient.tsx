'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createVendor, deleteVendor } from '@/app/actions/weddingActions'

const VENDOR_CATEGORIES = ['Catering', 'Dekorasi', 'MUA & Hairdo', 'Fotografer', 'Videografer', 'Venue', 'Hiburan/Band', 'MC', 'Undangan', 'Souvenir', 'Lainnya']

export default function VendorClient({ vendors, categories, tenantId }: { vendors: any[]; categories: any[]; tenantId: string }) {
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const filtered = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    (v.service || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    await createVendor(tenantId, new FormData(e.currentTarget))
    setLoading(false); setShowAdd(false); router.refresh()
  }

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Vendors</h1><p className="text-xs text-navy-400/60 mt-0.5">Wedding service providers ({vendors.length})</p></div>
        <button onClick={() => setShowAdd(true)} className="h-9 px-4 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-600 active:scale-[0.97] transition-all shadow-sm">+ Add Vendor</button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute left-4 top-1/2 -translate-y-1/2 text-navy-400/30"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendor or category..." className="w-full h-10 pl-11 pr-4 rounded-xl border border-navy-200/20 bg-white text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
      </div>

      {/* List */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map(v => (
            <div key={v.id} className="bg-white rounded-xl border border-navy-100/20 p-4 flex items-center justify-between group hover:border-rose-gold-200/50 transition-all">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-navy-700">{v.name}</h3>
                <div className="flex items-center gap-2 text-[10px] text-navy-400/40 mt-0.5">
                  {v.service && <span className="bg-rose-gold-50 text-rose-gold-600 px-1.5 py-0.5 rounded font-bold uppercase">{v.service}</span>}
                  {v.phone && <span>{v.phone}</span>}
                </div>
                {v.notes && <p className="text-[10px] text-navy-400/40 mt-1 italic line-clamp-1">{v.notes}</p>}
              </div>
              <form action={deleteVendor.bind(null, tenantId, v.id)}>
                <button className="h-8 w-8 rounded-lg text-navy-400/40 hover:text-red-400 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </form>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-navy-100/20">
          <div className="h-12 w-12 rounded-xl bg-navy-50/40 flex items-center justify-center mx-auto mb-4 text-navy-200 text-xl">🤝</div>
          <p className="text-sm text-navy-400/40">{search ? 'No matching vendors.' : 'No vendors yet. Add your first vendor.'}</p>
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-start mb-5">
              <div><h2 className="text-sm font-semibold text-navy-800">Add Vendor</h2><p className="text-[10px] text-navy-400/50 mt-0.5">Register a wedding partner</p></div>
              <button onClick={() => setShowAdd(false)} className="h-8 w-8 rounded-lg bg-navy-50/40 text-navy-400/60 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Vendor Name</label>
                <input type="text" name="name" required placeholder="e.g. Sarah's Catering" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Category</label>
                <select name="service" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all">
                  <option value="">Select category...</option>
                  {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  {categories.filter(c => !VENDOR_CATEGORIES.includes(c.name)).map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Phone</label>
                  <input type="text" name="phone" placeholder="Contact number" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Notes</label>
                <textarea name="notes" rows={2} placeholder="Notes about this vendor..." className="w-full px-3 py-2.5 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
              </div>
              <button type="submit" disabled={loading} className="w-full h-10 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50 transition-all">{loading ? 'Saving...' : 'Save Vendor'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
