'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function PhotoWallClient({ id, entries, invitation }: { id: string; entries: any[]; invitation: any }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wallEntries, setWallEntries] = useState(entries)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase.channel('guestbook-wall')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook_entries', filter: `tenant_id=eq.${id}` },
        (payload) => setWallEntries(prev => [payload.new, ...prev]))
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'guestbook_entries', filter: `tenant_id=eq.${id}` },
        (payload) => setWallEntries(prev => prev.filter(e => e.id !== payload.old.id)))
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [id])

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else { document.exitFullscreen() }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  return (
    <div className={`${isFullscreen ? 'fixed inset-0 z-[9999] bg-black p-6 overflow-y-auto' : 'animate-fade-in space-y-6'}`}>
      {!isFullscreen && (
        <div className="flex items-center justify-between">
          <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Photo Wall</h1><p className="text-xs text-navy-400/60 mt-0.5">{wallEntries.length} entries</p></div>
          <button onClick={toggleFullScreen} className="h-8 px-3 rounded-lg bg-white border border-navy-100/20 text-navy-500 text-[10px] font-bold flex items-center gap-1.5 hover:bg-navy-50/40 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
            Fullscreen
          </button>
        </div>
      )}
      {isFullscreen && (
        <div className="fixed top-4 right-4 z-[10000]">
          <button onClick={toggleFullScreen} className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/30">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}
      {isFullscreen && (
        <div className="fixed top-6 left-6 z-[10000] text-white">
          <p className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            {invitation?.bride_name || 'Bride'} & {invitation?.groom_name || 'Groom'}
          </p>
        </div>
      )}

      <div className={`${isFullscreen ? 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-20' : 'grid grid-cols-2 sm:grid-cols-3 gap-3'}`}>
        {wallEntries.length > 0 ? wallEntries.map((entry, i) => (
          <div key={entry.id} className={`aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${isFullscreen ? 'from-rose-gold-50/10 to-navy-50/10' : 'from-rose-gold-50 to-navy-50'} border ${isFullscreen ? 'border-white/10' : 'border-navy-100/20'} relative`}>
            {entry.photo_url ? (
              <img src={entry.photo_url} alt={entry.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3">
                <div className={`rounded-full ${isFullscreen ? 'bg-white/20 w-14 h-14 text-xl' : 'bg-white w-12 h-12 text-base'} flex items-center justify-center shadow-sm mb-1`}>
                  <span className="font-bold text-rose-gold-400">{entry.name?.charAt(0).toUpperCase() || '?'}</span>
                </div>
                <p className={`text-xs font-semibold text-center ${isFullscreen ? 'text-white/70' : 'text-navy-700'} truncate w-full`}>{entry.name}</p>
                {entry.message && <p className={`text-[9px] text-center mt-1 line-clamp-2 ${isFullscreen ? 'text-white/40' : 'text-navy-400/40'}`}>{entry.message}</p>}
              </div>
            )}
          </div>
        )) : (
          <div className="col-span-full text-center py-16 text-sm text-navy-400/40">No entries yet. Guestbook messages appear here.</div>
        )}
      </div>
    </div>
  )
}
