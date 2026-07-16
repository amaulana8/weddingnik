'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'
import { createGuest, deleteGuest } from '@/app/actions/weddingActions'
import ExportRSVPButton from '@/components/ExportRSVPButton'

export default function GuestClient({ tenantId, initialGuests, initialRsvps }: {
  tenantId: string; initialGuests: any[]; initialRsvps: any[]
}) {
  const [activeTab, setActiveTab] = useState<'guests' | 'rsvp'>('guests')
  const [showAdd, setShowAdd] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importData, setImportData] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const rsvps = initialRsvps || []
  const invitedCount = initialGuests.length
  const respondedCount = rsvps.length
  const confirmedCount = rsvps.filter(r => r.is_attending).length
  const declinedCount = rsvps.filter(r => !r.is_attending).length
  const totalPeopleComing = rsvps.reduce((acc: number, r: any) => r.is_attending ? acc + (r.guest_count || 0) : acc, 0)

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    await createGuest(tenantId, form)
    setShowAdd(false)
    router.refresh()
  }

  const handleDelete = async (guestId: string) => {
    if (!confirm('Delete this guest?')) return
    await deleteGuest(tenantId, guestId)
    router.refresh()
  }

  const handleImport = async () => {
    if (!importData.trim()) return
    setIsImporting(true)
    try {
      const lines = importData.split('\n').filter(l => l.trim())
      const guests = lines.map(line => {
        const parts = line.split(/[,;\t]/)
        return { name: parts[0]?.trim(), whatsapp_number: parts[1]?.trim() || '', category: parts[2]?.trim() || 'General' }
      }).filter(g => g.name)
      const supabase = createClient()
      for (const g of guests) {
        await supabase.from('guests').insert({
          tenant_id: tenantId, name: g.name,
          whatsapp_number: g.whatsapp_number,
          category: g.category,
          qr_code_token: Math.random().toString(36).substring(2, 10).toUpperCase()
        })
      }
      router.refresh()
      setImportData('')
      setShowImport(false)
    } catch { }
    setIsImporting(false)
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Guests</h1><p className="text-xs text-navy-400/60 mt-0.5">{invitedCount} invited, {confirmedCount} confirmed</p></div>
        <ExportRSVPButton guests={initialGuests} rsvps={rsvps} />
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl border border-navy-100/20 shadow-sm grid grid-cols-2 gap-1">
        {(['guests', 'rsvp'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
              activeTab === tab ? 'bg-rose-gold-500 text-white shadow-sm' : 'text-navy-400/50 hover:text-navy-500'
            }`}>
            {tab === 'guests' ? 'Guest List' : 'RSVP Confirmation'}
          </button>
        ))}
      </div>

      {activeTab === 'guests' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => { setShowAdd(!showAdd); setShowImport(false) }} className="h-9 px-4 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 transition-all">
              {showAdd ? 'Cancel' : '+ Add Guest'}
            </button>
            <button onClick={() => { setShowImport(!showImport); setShowAdd(false) }} className="h-9 px-4 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all">
              {showImport ? 'Cancel' : '⇅ Import Excel'}
            </button>
          </div>

          {showAdd && (
            <form onSubmit={handleAdd} className="bg-white rounded-xl border border-navy-100/20 p-5 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input type="text" name="name" placeholder="Guest name" required className="h-10 px-3 rounded-xl border border-navy-200/20 text-sm" />
                <input type="text" name="whatsapp_number" placeholder="WhatsApp (e.g. 62812...)" className="h-10 px-3 rounded-xl border border-navy-200/20 text-sm" />
                <div className="flex gap-2">
                  {[{id:'General',icon:'👥'},{id:'VIP',icon:'⭐'},{id:'Family',icon:'🏠'},{id:'Colleague',icon:'💼'}].map(cat => (
                    <label key={cat.id} className="flex-1 flex flex-col items-center p-2 rounded-xl border-2 border-navy-100/20 cursor-pointer transition-all has-[:checked]:border-rose-gold-400 has-[:checked]:bg-rose-gold-50">
                      <input type="radio" name="category" value={cat.id} defaultChecked={cat.id === 'General'} className="absolute opacity-0" />
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-[8px] font-bold text-navy-600 uppercase">{cat.id}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full h-10 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 transition-all">Save Guest</button>
            </form>
          )}

          {showImport && (
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-5 space-y-4 animate-fade-in">
              <div className="flex justify-between"><h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Quick Import</h3><span className="text-[9px] font-bold text-amber-600 bg-white px-2 py-1 rounded border border-amber-200">Format: Name, WhatsApp, Category</span></div>
              <textarea value={importData} onChange={e => setImportData(e.target.value)} placeholder="Budi Santoso, 62812345678, VIP&#10;Ani Wijaya, 62898765432, Family" rows={5} className="w-full rounded-xl border-0 p-4 text-sm font-mono focus:ring-2 focus:ring-amber-500 shadow-inner outline-none" />
              <button onClick={handleImport} disabled={isImporting || !importData.trim()} className="w-full h-10 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 disabled:opacity-50 transition-all">{isImporting ? 'Processing...' : 'Start Import'}</button>
            </div>
          )}

          {initialGuests.length > 0 ? (
            <div className="space-y-2">
              {initialGuests.map(guest => (
                <div key={guest.id} className="bg-white rounded-xl border border-navy-100/20 p-4 flex items-center justify-between group">
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-navy-700">{guest.name}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-navy-400/40 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase ${guest.category === 'VIP' ? 'bg-amber-100 text-amber-700' : 'bg-navy-50/40 text-navy-500'}`}>{guest.category || 'General'}</span>
                      {guest.qr_code_token && <span className="font-mono text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{guest.qr_code_token.substring(0, 6)}</span>}
                      <span className={`flex items-center gap-1 ${guest.status === 'attended' ? 'text-emerald-600' : 'text-navy-400/40'}`}>
                        <span className={`h-1 w-1 rounded-full ${guest.status === 'attended' ? 'bg-emerald-500' : 'bg-slate-300'}`} />{guest.status === 'attended' ? 'Present' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/invitation/${tenantId}?to=${guest.qr_code_token}`) }} className="h-8 w-8 rounded-lg text-amber-600 bg-amber-50 hover:bg-amber-100 flex items-center justify-center" title="Copy invite link">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    </button>
                    <button onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guest.qr_code_token}`, '_blank')} className="h-8 w-8 rounded-lg text-navy-500 bg-navy-50/40 hover:bg-navy-100/30 flex items-center justify-center" title="View QR">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    </button>
                    <button onClick={() => handleDelete(guest.id)} className="h-8 w-8 rounded-lg text-red-400 hover:bg-red-50 flex items-center justify-center" title="Delete">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-sm text-navy-400/40">No guests yet. Add your first guest to get started.</div>
          )}
        </div>
      )}

      {activeTab === 'rsvp' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-navy-100/20 p-4 text-center">
              <p className="text-2xl font-bold text-navy-800">{invitedCount}</p>
              <p className="text-[10px] font-medium text-navy-400/40 uppercase mt-1">Invited</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100/20 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-500">{confirmedCount}</p>
              <p className="text-[10px] font-medium text-navy-400/40 uppercase mt-1">Attending</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100/20 p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{declinedCount}</p>
              <p className="text-[10px] font-medium text-navy-400/40 uppercase mt-1">Declined</p>
            </div>
            <div className="bg-white rounded-xl border border-navy-100/20 p-4 text-center">
              <p className="text-2xl font-bold text-rose-gold-500">{totalPeopleComing}</p>
              <p className="text-[10px] font-medium text-navy-400/40 uppercase mt-1">People Coming</p>
            </div>
          </div>

          {/* RSVP List */}
          {rsvps.length > 0 ? (
            <div className="bg-white rounded-xl border border-navy-100/20 divide-y divide-navy-100/10 overflow-hidden">
              {rsvps.map((rsvp: any) => (
                <div key={rsvp.id} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-navy-700">{rsvp.name}</p>
                    <p className="text-[10px] text-navy-400/40">{new Date(rsvp.created_at).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {rsvp.guest_count > 1 && <span className="text-[10px] text-navy-400/60">{rsvp.guest_count} guests</span>}
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rsvp.is_attending ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
                      {rsvp.is_attending ? 'Attending' : 'Declined'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-sm text-navy-400/40">No RSVPs received yet.</div>
          )}
        </div>
      )}
    </div>
  )
}
