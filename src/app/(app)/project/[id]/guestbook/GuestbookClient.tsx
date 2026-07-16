'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function GuestbookClient({ tenantId, initialEntries }: { tenantId: string; initialEntries: any[] }) {
  const [filter, setFilter] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const filtered = initialEntries.filter(e =>
    e.name.toLowerCase().includes(filter.toLowerCase()) ||
    (e.message && e.message.toLowerCase().includes(filter.toLowerCase()))
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    await supabase.from('guestbook_entries').insert({
      tenant_id: tenantId,
      name: name.trim(),
      message: message.trim() || null,
    })
    setLoading(false)
    setShowForm(false)
    setName('')
    setMessage('')
    router.refresh()
  }

  const handleDelete = async (entryId: string) => {
    if (!confirm('Delete this entry?')) return
    await supabase.from('guestbook_entries').delete().eq('id', entryId)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Stats + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400/30">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input type="text" value={filter} onChange={e => setFilter(e.target.value)}
            placeholder="Search entries..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-navy-200/20 bg-white text-sm text-navy-700 font-medium placeholder:text-navy-400/30 focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-white rounded-xl border border-navy-100/20 px-4 h-10 flex items-center gap-2">
            <span className="text-sm font-semibold text-navy-700">{initialEntries.length}</span>
            <span className="text-[10px] font-medium text-navy-400/40 uppercase">Entries</span>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="h-10 px-4 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-600 active:scale-[0.97] transition-all shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Entry
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-navy-100/20 p-5 space-y-4 animate-fade-in">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required
            className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="h-9 px-4 rounded-xl text-xs font-medium text-navy-400/60 hover:text-navy-600">Cancel</button>
            <button type="submit" disabled={loading} className="h-9 px-5 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50">{loading ? 'Saving...' : 'Post'}</button>
          </div>
        </form>
      )}

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((entry) => (
            <div key={entry.id} className="group bg-white rounded-xl border border-navy-100/20 overflow-hidden hover:shadow-sm transition-all relative">
              {entry.photo_url ? (
                <div className="aspect-square overflow-hidden bg-navy-50">
                  <img src={entry.photo_url} alt={entry.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center bg-gradient-to-br from-rose-gold-50 to-navy-50">
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                    <span className="text-lg font-bold text-rose-gold-400">{entry.name?.charAt(0).toUpperCase() || '?'}</span>
                  </div>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-semibold text-navy-700">{entry.name}</h4>
                  <button onClick={() => handleDelete(entry.id)} className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-lg text-navy-400/40 hover:text-red-400 hover:bg-red-50 transition-all flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
                <p className="text-[10px] text-navy-400/40 mt-0.5">{new Date(entry.created_at).toLocaleDateString('id-ID')}</p>
                {entry.message && <p className="text-xs text-navy-500/70 mt-2 line-clamp-3">{entry.message}</p>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm text-navy-400/40">{filter ? 'No matching entries.' : 'No guestbook entries yet. Add your first entry!'}</p>
        </div>
      )}
    </div>
  )
}
