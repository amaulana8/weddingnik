'use client'

import { useState, useEffect } from 'react'
import { markAttendance } from '@/app/actions/weddingActions'

export default function ScannerPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('')
  const [result, setResult] = useState<{ success: boolean; message: string; guest?: any } | null>(null)
  const [manualToken, setManualToken] = useState('')

  useEffect(() => { paramsPromise.then(p => setId(p.id)) }, [paramsPromise])

  const handleManualCheck = async () => {
    if (!manualToken.trim() || !id) return
    const res = await markAttendance(id, manualToken.trim())
    setResult(res)
    setManualToken('')
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Scanner</h1><p className="text-xs text-navy-400/60 mt-0.5">QR check-in at venue</p></div>

      {result && (
        <div className={`rounded-xl border p-5 ${result.success ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600'}`}>
          <p className="text-sm font-semibold">{result.success ? '✅ ' : '❌ '}{result.message}</p>
          {result.guest && <p className="text-xs mt-1 text-navy-400/60">Guest: {result.guest.name}</p>}
        </div>
      )}

      <div className="bg-white rounded-xl border border-navy-100/20 p-6 space-y-4">
        <div className="h-40 rounded-xl bg-navy-50 flex items-center justify-center">
          <div className="text-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-navy-300 mx-auto mb-2"><path d="M3 7V5a2 2 0 012-2h2"/><path d="M17 3h2a2 2 0 012 2v2"/><path d="M21 17v2a2 2 0 01-2 2h-2"/><path d="M7 21H5a2 2 0 01-2-2v-2"/><line x1="7" x2="17" y1="12" y2="12"/></svg>
            <p className="text-xs text-navy-400/40">Camera QR scanner ready</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="text" value={manualToken} onChange={e => setManualToken(e.target.value)} placeholder="Or enter QR token manually..." className="flex-1 h-10 px-3 rounded-xl border border-navy-200/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40" onKeyDown={e => e.key === 'Enter' && handleManualCheck()} />
          <button onClick={handleManualCheck} disabled={!manualToken.trim()} className="h-10 px-4 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50 transition-all">Check</button>
        </div>
      </div>
    </div>
  )
}
