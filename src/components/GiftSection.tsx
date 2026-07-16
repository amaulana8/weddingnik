'use client'

import { useState } from 'react'

export default function GiftSection({ bankName, accountNumber, accountName }: {
  bankName: string; accountNumber: string; accountName: string
}) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!bankName || !accountNumber) return null

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/50 shadow-xl text-center">
      <div className="text-3xl mb-4">🎁</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Digital Gift</h3>
      <p className="text-slate-500 text-xs mb-8 italic">Your prayers are the greatest gift. If you wish to send a digital gift, you may send it to:</p>
      <div className="bg-white/60 border border-white/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">{bankName}</div>
        <p className="text-2xl font-black text-slate-900 mb-1 tracking-tighter">{accountNumber}</p>
        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">a.n {accountName}</p>
        <button onClick={handleCopy} className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
          {copied ? <><span>✅</span> Copied</> : <><span>📋</span> Copy Number</>}
        </button>
      </div>
    </div>
  )
}
