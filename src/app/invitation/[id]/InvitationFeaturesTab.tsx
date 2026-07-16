'use client'

import { useState } from 'react'
import RSVPForm from '@/components/RSVPForm'
import GiftSection from '@/components/GiftSection'

export default function InvitationFeaturesTab({ tenantId, rsvpEnabled, giftEnabled, giftBankName, giftAccountNumber, giftAccountName, theme }: {
  tenantId: string; rsvpEnabled: boolean; giftEnabled: boolean; giftBankName?: string; giftAccountNumber?: string; giftAccountName?: string; theme: string
}) {
  const [activeTab, setActiveTab] = useState<'rsvp' | 'gift'>(rsvpEnabled ? 'rsvp' : 'gift')
  const hasBoth = rsvpEnabled && (giftEnabled && !!giftBankName && !!giftAccountNumber)

  if (!rsvpEnabled && (!giftEnabled || !giftBankName || !giftAccountNumber)) return null

  const getThemeColor = (t: string) => {
    const colors: Record<string, string> = {
      romantic: 'bg-rose-500', modern: 'bg-indigo-600', royal: 'bg-amber-700',
      vintage: 'bg-emerald-800', sakura: 'bg-pink-600', tropical: 'bg-emerald-600',
      elegant: 'bg-red-800', lavender: 'bg-purple-700', sunflower: 'bg-amber-500',
      lily: 'bg-slate-900'
    }
    return colors[t] || 'bg-rose-500'
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {hasBoth && (
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/50 shadow-sm grid grid-cols-2 gap-1.5 mb-8">
          <button onClick={() => setActiveTab('rsvp')}
            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'rsvp' ? `${getThemeColor(theme)} text-white shadow-sm` : 'text-slate-400 hover:text-slate-600'
            }`}>RSVP</button>
          <button onClick={() => setActiveTab('gift')}
            className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === 'gift' ? `${getThemeColor(theme)} text-white shadow-sm` : 'text-slate-400 hover:text-slate-600'
            }`}>Digital Gift</button>
        </div>
      )}
      <div className="w-full animate-in fade-in duration-300">
        {activeTab === 'rsvp' && rsvpEnabled && <RSVPForm tenantId={tenantId} />}
        {activeTab === 'gift' && giftEnabled && giftBankName && giftAccountNumber && (
          <GiftSection bankName={giftBankName} accountNumber={giftAccountNumber} accountName={giftAccountName || ''} />
        )}
      </div>
    </div>
  )
}
