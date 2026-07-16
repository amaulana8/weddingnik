'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRundown, deleteRundown } from '@/app/actions/weddingActions'

const formatTime = (t: string) => t ? t.substring(0, 5) : ''

export default function RundownClient({ rundowns, projectName, tenantId }: {
  rundowns: any[]; projectName: string; tenantId: string
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sorted = [...rundowns].sort((a, b) => a.start_time.localeCompare(b.start_time))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    await createRundown(tenantId, new FormData(e.currentTarget))
    setLoading(false); setShowAdd(false); router.refresh()
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Rundown</h1>
          <p className="text-xs text-navy-400/60 mt-0.5">Event schedule</p>
        </div>
        <ExportPDFButton sorted={sorted} projectName={projectName} />
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[17px] top-0 bottom-0 w-0.5 bg-navy-100/30 hidden sm:block" />

        {sorted.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-navy-100/20">
            <div className="h-14 w-14 rounded-2xl bg-navy-50/40 flex items-center justify-center mx-auto mb-4 text-navy-200 text-2xl">🕒</div>
            <p className="text-xs font-medium text-navy-400/40">No schedule yet. Add your first activity.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sorted.map((item, i) => (
              <div key={item.id} className="relative pl-0 sm:pl-14 group" style={{ animationDelay: `${i * 50}ms` }}>
                <div className="absolute left-[11px] sm:left-[0.55rem] top-1.5 h-4 w-4 rounded-full bg-white border-4 border-rose-gold-400 z-10 hidden sm:block" />
                <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
                  <div className="shrink-0">
                    <div className="inline-flex px-3 py-1.5 bg-navy-800 text-white rounded-xl text-[10px] font-bold tracking-wide">
                      {formatTime(item.start_time)}{item.end_time ? <span className="mx-1 opacity-40">-</span> : ''}{item.end_time ? formatTime(item.end_time) : ''}
                    </div>
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-xl border border-navy-100/20 group-hover:border-rose-gold-200/50 group-hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-navy-700 group-hover:text-rose-gold-500 transition-colors">{item.activity}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {item.location && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-navy-400/50 uppercase tracking-wider bg-navy-50/40 px-2 py-0.5 rounded">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                              {item.location}
                            </span>
                          )}
                          {item.pic && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-rose-gold-600 uppercase tracking-wider bg-rose-gold-50/50 px-2 py-0.5 rounded border border-rose-gold-100/30">
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              PIC: {item.pic}
                            </span>
                          )}
                        </div>
                      </div>
                      <form action={deleteRundown.bind(null, tenantId, item.id)}>
                        <button className="h-8 w-8 rounded-lg text-navy-400/40 hover:text-red-400 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </form>
                    </div>
                    {item.notes && <p className="text-xs text-navy-400/50 mt-3 italic border-t border-navy-100/10 pt-3">{item.notes}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setShowAdd(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-navy-800 text-white shadow-xl hover:bg-navy-900 active:scale-95 transition-all border-4 border-white flex items-center justify-center">
        <svg className="group-hover:rotate-90 transition-transform" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-5">
              <div>
                <h2 className="text-sm font-semibold text-navy-800">Add Activity</h2>
                <p className="text-[10px] text-navy-400/50 font-medium mt-0.5">Schedule the event timeline</p>
              </div>
              <button onClick={() => setShowAdd(false)} className="h-8 w-8 rounded-lg bg-navy-50/40 text-navy-400/60 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Activity Name</label>
                <input type="text" name="activity" required placeholder="e.g. Akad Nikah, Resepsi..." className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Start Time</label>
                  <input type="time" name="start_time" required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">End Time</label>
                  <input type="time" name="end_time" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Location</label>
                  <input type="text" name="location" placeholder="e.g. Ballroom Lt. 2" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">PIC</label>
                  <input type="text" name="pic" placeholder="Coordinator name" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Notes</label>
                <textarea name="notes" rows={3} placeholder="Details about this activity..." className="w-full px-3 py-2.5 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
              </div>
              <button type="submit" disabled={loading} className="w-full h-10 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50 transition-all">{loading ? 'Saving...' : 'Save Activity'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function ExportPDFButton({ sorted, projectName }: { sorted: any[]; projectName: string }) {
  if (sorted.length === 0) return null
  const handleExport = () => {
    const header = 'No,Time,Activity,Location,PIC,Notes'
    const rows = sorted.map((item, i) => [
      i + 1, `${formatTime(item.start_time)}-${formatTime(item.end_time)}`, item.activity,
      item.location || '-', item.pic || '-', (item.notes || '-').replace(/,/g, ';')
    ].join(','))
    const csv = `Rundown: ${projectName}\n\n${header}\n${rows.join('\n')}`
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `Rundown-${projectName.replace(/\s+/g, '_')}.csv`
    a.click(); URL.revokeObjectURL(url)
  }
  return (
    <button onClick={handleExport} className="h-8 px-3 rounded-lg bg-white border border-navy-100/20 text-[10px] font-bold text-rose-gold-500 flex items-center gap-1.5 hover:bg-rose-gold-50 transition-all shadow-sm">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Export
    </button>
  )
}
