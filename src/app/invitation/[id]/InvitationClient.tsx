'use client'

import { useState } from 'react'
import RSVPForm from '@/components/RSVPForm'
import GiftSection from '@/components/GiftSection'
import BackgroundMusic from '@/components/BackgroundMusic'
import InvitationFeaturesTab from './InvitationFeaturesTab'

interface Props {
  invitation: any
  guestInfo: any | null
  tenantId: string
}

const themeConfig: Record<string, any> = {
  romantic: { bg: 'from-rose-100 via-white to-rose-50', font: "'Playfair Display', serif", accent: 'rose', isDark: false, rounding: '3xl', cardPad: 'p-6', spacing: 'mt-10', headSize: 'text-3xl', btnShape: 'rounded-full' },
  modern: { bg: 'from-slate-900 via-slate-800 to-slate-900', font: "'Montserrat', sans-serif", accent: 'indigo', isDark: true, rounding: 'lg', cardPad: 'p-4', spacing: 'mt-6', headSize: 'text-2xl font-light tracking-wide', btnShape: 'rounded-lg' },
  royal: { bg: 'from-amber-50 via-white to-amber-50', font: "'Crimson Text', serif", accent: 'amber', isDark: false, rounding: '2xl', cardPad: 'p-8', spacing: 'mt-12', headSize: 'text-4xl uppercase tracking-widest', btnShape: 'rounded-2xl' },
  vintage: { bg: 'from-emerald-50 via-stone-50 to-emerald-50', font: "'Crimson Text', serif", accent: 'emerald', isDark: false, rounding: 'xl', cardPad: 'p-5', spacing: 'mt-8', headSize: 'text-2xl', btnShape: 'rounded-xl border-2' },
  luxe: { bg: 'from-stone-100 via-white to-stone-50', font: "'Playfair Display', serif", accent: 'rose-gold', isDark: false, rounding: 'full', cardPad: 'p-8', spacing: 'mt-14', headSize: 'text-3xl tracking-[0.1em]', btnShape: 'rounded-full border border-navy-100/20' },
  boho: { bg: 'from-orange-50 via-white to-amber-50', font: "'Crimson Text', serif", accent: 'orange', isDark: false, rounding: 'xl', cardPad: 'p-5', spacing: 'mt-8', headSize: 'text-2xl', btnShape: 'rounded-xl' },
  midnight: { bg: 'from-indigo-950 via-indigo-900 to-indigo-950', font: "'Crimson Text', serif", accent: 'indigo', isDark: true, rounding: '2xl', cardPad: 'p-6', spacing: 'mt-10', headSize: 'text-3xl tracking-wide', btnShape: 'rounded-2xl' },
  script: { bg: 'from-rose-gold-50 via-white to-rose-gold-50/30', font: "'Great Vibes', cursive", accent: 'rose-gold', isDark: false, rounding: '2xl', cardPad: 'p-6', spacing: 'mt-10', headSize: 'text-4xl', btnShape: 'rounded-2xl' },
  floral: { bg: 'from-rose-50 via-white to-pink-50', font: "'Playfair Display', serif", accent: 'pink', isDark: false, rounding: 'xl', cardPad: 'p-5', spacing: 'mt-8', headSize: 'text-2xl italic', btnShape: 'rounded-xl' },
  sakura: { bg: 'from-pink-50 via-white to-pink-50/30', font: "'Great Vibes', cursive", accent: 'pink', isDark: false, rounding: '2xl', cardPad: 'p-6', spacing: 'mt-8', headSize: 'text-3xl', btnShape: 'rounded-2xl' },
  tropical: { bg: 'from-emerald-50 via-white to-teal-50', font: "'Montserrat', sans-serif", accent: 'emerald', isDark: false, rounding: 'xl', cardPad: 'p-5', spacing: 'mt-8', headSize: 'text-2xl font-light', btnShape: 'rounded-xl' },
  elegant: { bg: 'from-red-50 via-white to-rose-50', font: "'Playfair Display', serif", accent: 'red', isDark: false, rounding: 'full', cardPad: 'p-8', spacing: 'mt-12', headSize: 'text-3xl', btnShape: 'rounded-full' },
  lavender: { bg: 'from-purple-50 via-white to-purple-50/30', font: "'Playfair Display', serif", accent: 'purple', isDark: false, rounding: '2xl', cardPad: 'p-6', spacing: 'mt-10', headSize: 'text-2xl', btnShape: 'rounded-2xl' },
  sunflower: { bg: 'from-amber-50 via-white to-yellow-50', font: "'Montserrat', sans-serif", accent: 'amber', isDark: false, rounding: 'xl', cardPad: 'p-5', spacing: 'mt-8', headSize: 'text-2xl font-bold', btnShape: 'rounded-xl' },
  lily: { bg: 'from-rose-gold-50 via-white to-rose-gold-50/30', font: "'Playfair Display', serif", accent: 'rose-gold', isDark: false, rounding: '3xl', cardPad: 'p-6', spacing: 'mt-10', headSize: 'text-3xl', btnShape: 'rounded-3xl' },
  wildflower: { bg: 'from-emerald-50 via-white to-amber-50', font: "'Montserrat', sans-serif", accent: 'emerald', isDark: false, rounding: 'xl', cardPad: 'p-5', spacing: 'mt-8', headSize: 'text-xl font-bold', btnShape: 'rounded-xl' },
  orchid: { bg: 'from-pink-50 via-white to-purple-50', font: "'Playfair Display', serif", accent: 'pink', isDark: false, rounding: '3xl', cardPad: 'p-7', spacing: 'mt-10', headSize: 'text-2xl italic', btnShape: 'rounded-3xl' },
  autumn: { bg: 'from-orange-50 via-amber-50 to-orange-50', font: "'Crimson Text', serif", accent: 'orange', isDark: false, rounding: 'xl', cardPad: 'p-5', spacing: 'mt-8', headSize: 'text-2xl', btnShape: 'rounded-xl' },
  hydrangea: { bg: 'from-blue-50 via-white to-indigo-50', font: "'Playfair Display', serif", accent: 'blue', isDark: false, rounding: '2xl', cardPad: 'p-6', spacing: 'mt-10', headSize: 'text-2xl', btnShape: 'rounded-2xl' },
  peony: { bg: 'from-rose-50 via-white to-pink-50', font: "'Playfair Display', serif", accent: 'rose', isDark: false, rounding: 'full', cardPad: 'p-7', spacing: 'mt-10', headSize: 'text-3xl', btnShape: 'rounded-full' },
}

// @tailwind-safelist: rounded-3xl rounded-lg rounded-2xl rounded-xl rounded-full p-4 p-5 p-6 p-7 p-8 mt-6 mt-8 mt-10 mt-12 mt-14 text-2xl text-3xl text-4xl font-light font-bold font-black tracking-wide tracking-wider tracking-[0.1em] uppercase italic leading-tight leading-relaxed border-2 rounded-full border border-navy-100/20 text-xl
const petalMap: Record<string, Array<{icon: string; left: string; duration: string; delay: string}>> = {
  romantic: [{icon:'💖',left:'10%',duration:'8s',delay:'0s'},{icon:'✨',left:'30%',duration:'12s',delay:'2s'},{icon:'💖',left:'50%',duration:'10s',delay:'1s'},{icon:'✨',left:'75%',duration:'14s',delay:'4s'},{icon:'💖',left:'90%',duration:'9s',delay:'0s'}],
  modern: [{icon:'✧',left:'15%',duration:'10s',delay:'0s'},{icon:'✦',left:'35%',duration:'13s',delay:'2s'},{icon:'✧',left:'55%',duration:'9s',delay:'1s'},{icon:'✦',left:'75%',duration:'14s',delay:'3s'},{icon:'✧',left:'90%',duration:'11s',delay:'0s'}],
  royal: [{icon:'☦',left:'10%',duration:'9s',delay:'0s'},{icon:'✨',left:'30%',duration:'12s',delay:'3s'},{icon:'☦',left:'50%',duration:'10s',delay:'1s'},{icon:'✨',left:'70%',duration:'14s',delay:'4s'},{icon:'☦',left:'85%',duration:'11s',delay:'0s'}],
  vintage: [{icon:'🍂',left:'15%',duration:'8s',delay:'0s'},{icon:'🍃',left:'40%',duration:'11s',delay:'2s'},{icon:'🍂',left:'60%',duration:'9s',delay:'1s'},{icon:'🍃',left:'85%',duration:'13s',delay:'3s'}],
  luxe: [{icon:'✨',left:'10%',duration:'10s',delay:'0s'},{icon:'💎',left:'30%',duration:'13s',delay:'2s'},{icon:'✨',left:'50%',duration:'9s',delay:'1s'},{icon:'✨',left:'75%',duration:'14s',delay:'4s'},{icon:'💎',left:'90%',duration:'11s',delay:'0s'}],
  boho: [{icon:'🌾',left:'10%',duration:'8s',delay:'0s'},{icon:'🍂',left:'35%',duration:'12s',delay:'2s'},{icon:'🌾',left:'55%',duration:'9s',delay:'1s'},{icon:'🍂',left:'75%',duration:'13s',delay:'3s'},{icon:'🌾',left:'90%',duration:'10s',delay:'0s'}],
  midnight: [{icon:'🌙',left:'10%',duration:'10s',delay:'0s'},{icon:'✨',left:'30%',duration:'13s',delay:'2s'},{icon:'⭐',left:'50%',duration:'9s',delay:'1s'},{icon:'✨',left:'70%',duration:'14s',delay:'3s'},{icon:'🌙',left:'85%',duration:'11s',delay:'0s'}],
  tropical: [{icon:'🍃',left:'10%',duration:'8s',delay:'0s'},{icon:'🌺',left:'30%',duration:'11s',delay:'2s'},{icon:'🍃',left:'50%',duration:'9s',delay:'1s'},{icon:'🌺',left:'75%',duration:'13s',delay:'3s'},{icon:'🍃',left:'90%',duration:'10s',delay:'0s'}],
  elegant: [{icon:'🌹',left:'10%',duration:'9s',delay:'0s'},{icon:'✨',left:'35%',duration:'12s',delay:'2s'},{icon:'🌹',left:'55%',duration:'10s',delay:'1s'},{icon:'✨',left:'75%',duration:'14s',delay:'3s'},{icon:'🌹',left:'90%',duration:'11s',delay:'0s'}],
  sakura: [{icon:'🌸',left:'10%',duration:'8s',delay:'0s'},{icon:'🌸',left:'30%',duration:'12s',delay:'2s'},{icon:'🌸',left:'50%',duration:'10s',delay:'1s'},{icon:'🌸',left:'75%',duration:'14s',delay:'4s'},{icon:'🌸',left:'90%',duration:'9s',delay:'0s'}],
  lavender: [{icon:'🪻',left:'10%',duration:'9s',delay:'0s'},{icon:'✨',left:'30%',duration:'12s',delay:'2s'},{icon:'🪻',left:'50%',duration:'10s',delay:'1s'},{icon:'✨',left:'70%',duration:'14s',delay:'3s'},{icon:'🪻',left:'85%',duration:'11s',delay:'0s'}],
  sunflower: [{icon:'🌻',left:'10%',duration:'8s',delay:'0s'},{icon:'✨',left:'30%',duration:'12s',delay:'2s'},{icon:'🌻',left:'50%',duration:'10s',delay:'1s'},{icon:'✨',left:'70%',duration:'14s',delay:'3s'},{icon:'🌻',left:'85%',duration:'9s',delay:'0s'}],
  lily: [{icon:'🫶',left:'15%',duration:'9s',delay:'0s'},{icon:'✨',left:'35%',duration:'12s',delay:'2s'},{icon:'🫶',left:'50%',duration:'10s',delay:'1s'},{icon:'✨',left:'75%',duration:'14s',delay:'3s'},{icon:'🫶',left:'85%',duration:'11s',delay:'0s'}],
  floral: [{icon:'✿',left:'10%',duration:'8s',delay:'0s'},{icon:'🌸',left:'30%',duration:'11s',delay:'2s'},{icon:'✿',left:'55%',duration:'9s',delay:'1s'},{icon:'🌸',left:'75%',duration:'13s',delay:'3s'},{icon:'✿',left:'90%',duration:'10s',delay:'0s'}],
  wildflower: [{icon:'💐',left:'10%',duration:'9s',delay:'0s'},{icon:'🌸',left:'35%',duration:'12s',delay:'2s'},{icon:'💐',left:'55%',duration:'10s',delay:'1s'},{icon:'🌸',left:'75%',duration:'13s',delay:'3s'},{icon:'💐',left:'90%',duration:'11s',delay:'0s'}],
  orchid: [{icon:'💮',left:'10%',duration:'8s',delay:'0s'},{icon:'🌸',left:'30%',duration:'11s',delay:'2s'},{icon:'💮',left:'50%',duration:'9s',delay:'1s'},{icon:'🌸',left:'75%',duration:'14s',delay:'3s'},{icon:'💮',left:'90%',duration:'10s',delay:'0s'}],
  autumn: [{icon:'🍂',left:'10%',duration:'8s',delay:'0s'},{icon:'🍁',left:'30%',duration:'12s',delay:'2s'},{icon:'🍂',left:'50%',duration:'9s',delay:'1s'},{icon:'🍁',left:'75%',duration:'14s',delay:'3s'},{icon:'🍂',left:'90%',duration:'10s',delay:'0s'}],
  hydrangea: [{icon:'💠',left:'10%',duration:'9s',delay:'0s'},{icon:'🌸',left:'35%',duration:'12s',delay:'2s'},{icon:'💠',left:'55%',duration:'10s',delay:'1s'},{icon:'🌸',left:'75%',duration:'14s',delay:'3s'},{icon:'💠',left:'90%',duration:'11s',delay:'0s'}],
  peony: [{icon:'❦',left:'10%',duration:'8s',delay:'0s'},{icon:'✨',left:'30%',duration:'12s',delay:'2s'},{icon:'❦',left:'50%',duration:'10s',delay:'1s'},{icon:'✨',left:'75%',duration:'14s',delay:'4s'},{icon:'❦',left:'90%',duration:'9s',delay:'0s'}],
  script: [{icon:'🫶',left:'15%',duration:'9s',delay:'0s'},{icon:'✨',left:'35%',duration:'12s',delay:'2s'},{icon:'🫶',left:'60%',duration:'10s',delay:'1s'},{icon:'✨',left:'80%',duration:'14s',delay:'3s'}],
}

export default function InvitationClient({ invitation, guestInfo, tenantId }: Props) {
  const themeId = invitation?.theme || 'romantic'
  const theme = themeConfig[themeId] || themeConfig.romantic
  const guestName = guestInfo?.name || ''
  const isAttended = guestInfo?.status === 'attended'
  const coupleName = `${invitation.bride_name || 'Bride'} & ${invitation.groom_name || 'Groom'}`

  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''
  const formatTime = (d: string) => d ? new Date(d).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : ''

  const accentColors: Record<string, string> = {
    rose: 'text-rose-500 bg-rose-100 border-rose-200',
    indigo: 'text-indigo-400 bg-indigo-900/30 border-indigo-700/50',
    amber: 'text-amber-600 bg-amber-100 border-amber-200',
    emerald: 'text-emerald-600 bg-emerald-100 border-emerald-200',
    red: 'text-red-600 bg-red-100 border-red-200',
    pink: 'text-pink-600 bg-pink-100 border-pink-200',
    purple: 'text-purple-600 bg-purple-100 border-purple-200',
    'rose-gold': 'text-rose-gold-600 bg-rose-gold-100 border-rose-gold-200',
    teal: 'text-teal-600 bg-teal-100 border-teal-200',
  }

  const accent = accentColors[theme.accent] || accentColors.rose

  return (
    <>
      <div className={`min-h-screen flex flex-col items-center relative overflow-hidden ${
          themeId === 'modern' ? 'bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900' :
          themeId === 'royal' ? 'bg-gradient-to-b from-amber-50 via-white to-amber-50' :
          themeId === 'vintage' ? 'bg-gradient-to-b from-emerald-50 via-stone-50 to-emerald-50' :
          themeId === 'elegant' ? 'bg-gradient-to-b from-red-50 via-white to-red-50' :
          themeId === 'sakura' ? 'bg-gradient-to-b from-pink-100 via-white to-pink-50' :
          themeId === 'lavender' ? 'bg-gradient-to-b from-purple-100 via-white to-purple-50' :
          themeId === 'sunflower' ? 'bg-gradient-to-b from-amber-100 via-white to-yellow-50' :
          themeId === 'tropical' ? 'bg-gradient-to-b from-emerald-100 via-white to-teal-50' :
          themeId === 'midnight' ? 'bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-950' :
          themeId === 'lily' ? 'bg-gradient-to-b from-rose-gold-50 via-white to-rose-gold-50/30' :
          'bg-gradient-to-b from-rose-100 via-white to-rose-50'
        }`}>
        {/* Floating petals - theme specific */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {petalMap[themeId]?.map((p: any, i: number) => (
            <span key={i} className="petal text-2xl" style={{ left: p.left, animationDuration: p.duration, animationDelay: p.delay }}>{p.icon}</span>
          ))}
        </div>

        {/* Decorative bg blobs */}
        <div className={`absolute top-0 left-0 -ml-40 -mt-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-50 z-0 ${
          themeId === 'modern' || themeId === 'midnight'  ? 'bg-indigo-800/40' : 'bg-rose-100/60'
        }`} />
        <div className={`absolute bottom-0 right-0 -mr-40 -mb-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-50 z-0 ${
          themeId === 'modern' || themeId === 'midnight'  ? 'bg-indigo-900/40' : 'bg-amber-100/60'
        }`} />

        <div className="relative z-10 w-full max-w-lg mx-auto px-4 pb-32">
          {/* Bismillah */}
          {invitation.bismillah_enabled && (
            <div className="mb-12 opacity-60 mt-12 text-center">
              <p className="text-2xl" style={{ fontFamily: "'Scheherazade New', serif" }}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</p>
            </div>
          )}

          {/* Header */}
          <div className="text-center mt-16">
            <p className={`text-[10px] uppercase tracking-[0.4em] font-black mb-6 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/50' : 'text-rose-400'}`}>The Wedding of</p>
            <h1 className={`${theme.headSize} font-bold mb-2 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: theme.font }}>
              {coupleName}
            </h1>
          </div>

          {/* Invitation message */}
          <div className="mt-10 text-center px-4">
            <p className={`text-sm leading-relaxed italic ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/60' : 'text-slate-500'}`}>
              {invitation.message || 'The love we share is a gift from above. We invite you to witness our union.'}
            </p>
          </div>

          {/* Event details */}
          {invitation.event_date && (
            <div className={`mt-10 ${themeId === 'modern' || themeId === 'midnight' ? 'bg-white/10 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md' } rounded-3xl p-6 border ${themeId === 'modern' || themeId === 'midnight'  ? 'border-white/10' : 'border-white/50'} shadow-xl text-center`}>
              <div className="text-3xl mb-3">📅</div>
              <p className={`text-[10px] uppercase tracking-[0.3em] font-black mb-2 ${accent.split(' ')[0]}`}>Date & Time</p>
              <p className={`${themeId === 'modern' || themeId === 'midnight'  ? 'text-white' : 'text-slate-900'} ${theme.font === "'Montserrat', sans-serif" ? 'text-base font-light' : 'text-lg font-bold'}`} style={{ fontFamily: theme.font }}>{formatDate(invitation.event_date)}</p>
              <p className={`text-sm font-medium mt-1 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/60' : 'text-slate-500'}`}>{formatTime(invitation.event_date)}</p>
              {invitation.location && <p className={`text-xs mt-3 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/50' : 'text-slate-500'}`}>{invitation.location}</p>}
              {invitation.venue_address && <p className={`text-[10px] mt-1 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/40' : 'text-slate-400'}`}>{invitation.venue_address}</p>}
            </div>
          )}

          {/* Guest QR Code (if not attended) */}
          {guestInfo && !isAttended && (
            <div className={`mt-8 ${themeId === 'modern' || themeId === 'midnight' ? 'bg-white/10 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md' } rounded-3xl p-6 border ${themeId === 'modern' || themeId === 'midnight'  ? 'border-white/10' : 'border-white/50'} shadow-xl text-center`}>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${accent.split(' ')[0]}`}>Exclusive Guest Access</p>
              <h3 className={`text-xl font-bold mb-2 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white' : 'text-slate-900'}`}>Dear {guestName},</h3>
              <p className={`text-xs mb-4 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/60' : 'text-slate-500'}`}>Please show this QR code at the reception desk</p>
              <div className="inline-block p-3 bg-white rounded-2xl shadow-inner">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${guestInfo.qr_code_token}`} alt="QR" className="w-36 h-36 mx-auto" />
              </div>
              <p className={`text-[10px] font-black uppercase tracking-widest mt-3 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/40' : 'text-slate-400'}`}>{guestInfo.qr_code_token}</p>
            </div>
          )}

          {/* Attended success */}
          {guestInfo && isAttended && (
            <div className={`mt-8 ${themeId === 'modern' || themeId === 'midnight' ? 'bg-white/10 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md' } rounded-3xl p-6 border border-emerald-500/30 shadow-xl text-center`}>
              <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">Check-in Successful</p>
              <h3 className={`text-xl font-bold mb-2 ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white' : 'text-slate-900'}`}>Welcome, {guestName}!</h3>
              <p className={`text-xs ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/60' : 'text-slate-500'}`}>You have been checked in. Enjoy the celebration!</p>
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
              theme={themeId}
            />
          </div>

          {/* Guestbook */}
          {isAttended && invitation.tenants?.is_guestbook_enabled && (
            <div className="mt-8" id="guestbook">
              <div className={`${themeId === 'modern' || themeId === 'midnight' ? 'bg-white/10 backdrop-blur-md' : 'bg-white/70 backdrop-blur-md' } rounded-3xl p-6 border ${themeId === 'modern' || themeId === 'midnight'  ? 'border-white/10' : 'border-white/50'} shadow-xl`}>
                <h3 className={`text-lg font-bold mb-4 text-center ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: theme.font }}>Guestbook</h3>
                <GuestbookForm tenantId={tenantId} />
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className={`text-[10px] uppercase tracking-[0.3em] font-black ${themeId === 'modern' || themeId === 'midnight'  ? 'text-white/30' : 'text-slate-300'}`}>
              Created with love by {invitation.tenants?.name || 'Wedding Organizer'}
            </p>
          </div>
        </div>

        {/* Music */}
        {invitation.music_url && <BackgroundMusic url={invitation.music_url} />}
      </div>

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
