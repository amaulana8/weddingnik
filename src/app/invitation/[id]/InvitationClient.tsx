'use client'

import { useState } from 'react'
import RSVPForm from '@/components/RSVPForm'
import GiftSection from '@/components/GiftSection'
import InvitationFeaturesTab from './InvitationFeaturesTab'
import BackgroundMusic from '@/components/BackgroundMusic'
import { createClient } from '@/lib/supabaseClient'

interface Props {
  invitation: any
  guestInfo: any | null
  tenantId: string
}

export default function InvitationClient({ invitation, guestInfo, tenantId }: Props) {
  

  const formatDate = (d: string) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('id-ID', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const formatTime = (d: string) => {
    if (!d) return ''
    return new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const coupleName = `${invitation.bride_name || 'Bride'} & ${invitation.groom_name || 'Groom'}`
  const guestName = guestInfo?.name || ''
  const isAttended = guestInfo?.status === 'attended'

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-rose-50/30 flex flex-col items-center relative overflow-hidden">
        {/* Floating petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {['🌸','💮','🏵️'].map((p, i) => (
            <span key={i} className="petal text-2xl" style={{
              left: `${10 + i * 25}%`, animationDuration: `${8 + i * 2}s`,
              animationDelay: `${i * 3}s`
            }}>{p}</span>
          ))}
        </div>

        {/* Decorative bg */}
        <div className="absolute top-0 left-0 -ml-40 -mt-40 h-[600px] w-[600px] rounded-full bg-rose-100/60 blur-3xl opacity-80 z-0" />
        <div className="absolute bottom-0 right-0 -mr-40 -mb-40 h-[600px] w-[600px] rounded-full bg-amber-100/60 blur-3xl opacity-80 z-0" />

        <div className="relative z-10 w-full max-w-lg mx-auto px-4 pb-32">
          {/* Bismillah */}
          {invitation.bismillah_enabled && (
            <div className="mb-12 opacity-60 mt-12 text-center">
              <p className="text-2xl" style={{ fontFamily: "'Scheherazade New', serif" }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            </div>
          )}

          {/* Header */}
          <div className="text-center mt-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-rose-400 font-black mb-6">The Wedding of</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              {coupleName}
            </h1>
          </div>

          {/* Invitation message */}
          <div className="mt-10 text-center px-4">
            <p className="text-slate-500 text-sm leading-relaxed italic">
              {invitation.message || 'The love we share is a gift from above. We invite you to witness our union as we become one in heart and soul.'}
            </p>
          </div>

          {/* Event details */}
          {invitation.event_date && (
            <div className="mt-10 bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl text-center">
              <div className="text-3xl mb-3">📅</div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-rose-400 font-black mb-2">Date & Time</p>
              <p className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>{formatDate(invitation.event_date)}</p>
              <p className="text-slate-500 text-sm font-medium mt-1">{formatTime(invitation.event_date)}</p>
              {invitation.location && <p className="text-slate-500 text-xs mt-3">{invitation.location}</p>}
              {invitation.venue_address && <p className="text-slate-400 text-[10px] mt-1">{invitation.venue_address}</p>}
            </div>
          )}

          {/* Guest QR Code (if not attended) */}
          {guestInfo && !isAttended && (
            <div className="mt-8 bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-4">Exclusive Guest Access</p>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Dear {guestName},</h3>
              <p className="text-slate-500 text-xs mb-4">Please show this QR code at the reception desk</p>
              <div className="inline-block p-3 bg-white rounded-2xl shadow-inner">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${guestInfo.qr_code_token}`} alt="QR" className="w-36 h-36 mx-auto" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">{guestInfo.qr_code_token}</p>
            </div>
          )}

          {/* Attended success */}
          {guestInfo && isAttended && (
            <div className="mt-8 bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-emerald-500/30 shadow-xl text-center">
              <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">Check-in Successful</p>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Welcome, {guestName}!</h3>
              <p className="text-slate-500 text-xs">You have been checked in. Enjoy the celebration!</p>
            </div>
          )}

          {/* RSVP + Gift */}
          <div className="mt-8">
            <InvitationFeaturesTab
              tenantId={tenantId}
              rsvpEnabled={!!invitation.rsvp_enabled}
              giftEnabled={!!invitation.gift_enabled}
              giftBankName={invitation.gift_bank_name}
              giftAccountNumber={invitation.gift_account_number}
              giftAccountName={invitation.gift_account_name}
              theme={invitation.theme || 'romantic'}
            />
          </div>

          {/* Guestbook */}
          {isAttended && invitation.tenants?.is_guestbook_enabled && (
            <div className="mt-8" id="guestbook">
              <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/50 shadow-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Guestbook</h3>
                <GuestbookForm tenantId={tenantId} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300 font-black">
              Created with love by {invitation.tenants?.name || 'Wedding Organizer'}
            </p>
          </div>
        </div>
      </div>
      {invitation.music_url && <BackgroundMusic url={invitation.music_url} />}
      <style>{`
        @keyframes falling {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; }
        }
        .petal { position: absolute; top: -10%; user-select: none; pointer-events: none; z-index: 5; animation: falling linear infinite; }
      `}</style>
    </>
  )
}

function GuestbookForm({ tenantId }: { tenantId: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabaseClient = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    await (await import('@/app/actions/weddingActions')).createGuestbookEntry(tenantId, form)
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) return <p className="text-center text-sm text-slate-500 italic">Thank you for your message!</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" required placeholder="Your name" className="w-full bg-white/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all" />
      <textarea name="message" required placeholder="Write your wishes..." rows={3} className="w-full bg-white/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all" />
      <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-rose-400 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-500 disabled:opacity-50 transition-all">
        {loading ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
