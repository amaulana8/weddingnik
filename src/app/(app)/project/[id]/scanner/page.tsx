'use client'

import { useState, useEffect } from 'react'
import { markAttendance } from '@/app/actions/weddingActions'

export default function ScannerPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState('')
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; guest?: any } | null>(null)
  const [manualToken, setManualToken] = useState('')
  const [scannerReady, setScannerReady] = useState(false)

  useEffect(() => { paramsPromise.then(p => setId(p.id)) }, [paramsPromise])

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/html5-qrcode'
    script.async = true
    script.onload = () => setScannerReady(true)
    document.body.appendChild(script)
    return () => {
      const s = document.querySelector('script[src="https://unpkg.com/html5-qrcode"]')
      if (s) document.body.removeChild(s)
    }
  }, [])

  useEffect(() => {
    if (!scannerReady || !id) return
    let html5QrCode: any = null
    const startScanner = async () => {
      try {
        // @ts-ignore
        html5QrCode = new Html5Qrcode('reader')
        await html5QrCode.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText: string) => {
            await handleScan(decodedText)
            if (html5QrCode) html5QrCode.stop()
          })
      } catch (err) { console.error('Scanner failed', err) }
    }
    startScanner()
    return () => { if (html5QrCode) html5QrCode.stop() }
  }, [scannerReady, id])

  const handleScan = async (token: string) => {
    const res = await markAttendance(id, token)
    setScanResult(res)
  }

  const handleManual = async () => {
    if (!manualToken.trim()) return
    await handleScan(manualToken.trim())
    setManualToken('')
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Scanner</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">QR check-in for guest attendance</p>
      </div>

      {scanResult && (
        <div className={`rounded-xl border p-4 flex items-center gap-3 ${scanResult.success ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
          <div className={`h-10 w-10 rounded-full flex items-center justify-center text-lg ${scanResult.success ? 'bg-emerald-100' : 'bg-red-100'}`}>
            {scanResult.success ? '✅' : '❌'}
          </div>
          <div>
            <p className={`text-sm font-semibold ${scanResult.success ? 'text-emerald-700' : 'text-red-600'}`}>{scanResult.message}</p>
            {scanResult.guest && <p className="text-xs text-navy-400/60 mt-0.5">Guest: {scanResult.guest.name}</p>}
          </div>
          <button onClick={() => setScanResult(null)} className="ml-auto text-navy-400/40 hover:text-navy-600">&times;</button>
        </div>
      )}

      <div className="bg-white rounded-xl border border-navy-100/20 p-6 space-y-4">
        {scannerReady ? (
          <div id="reader" className="w-full aspect-square max-w-sm mx-auto rounded-xl overflow-hidden bg-navy-50/40" />
        ) : (
          <div className="w-full aspect-square max-w-sm mx-auto rounded-xl bg-navy-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-rose-gold-400 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-xs text-navy-400/40">Loading camera scanner...</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-navy-100/20" />
          <span className="text-[10px] font-medium text-navy-400/40 px-2">OR</span>
          <div className="h-px flex-1 bg-navy-100/20" />
        </div>

        <div className="flex gap-2">
          <input type="text" value={manualToken} onChange={e => setManualToken(e.target.value)} placeholder="Enter QR token manually..." className="flex-1 h-10 px-3 rounded-xl border border-navy-200/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" onKeyDown={e => e.key === 'Enter' && handleManual()} />
          <button onClick={handleManual} disabled={!manualToken.trim()} className="h-10 px-5 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50 transition-all">Check</button>
        </div>
      </div>
    </div>
  )
}
