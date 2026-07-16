'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function InvitationForm({ tenantId, invitation }: { tenantId: string; invitation: any }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const payload: any = {
      tenant_id: tenantId,
      groom_name: form.get('groom_name'),
      bride_name: form.get('bride_name'),
      event_date: form.get('event_date'),
      location: form.get('location'),
      venue_address: form.get('venue_address'),
      message: form.get('message'),
      theme: form.get('theme') || 'romantic',
      maps_url: form.get('maps_url'),
      music_url: form.get('music_url'),
      rsvp_enabled: form.get('rsvp_enabled') === 'true',
      bismillah_enabled: form.get('bismillah_enabled') === 'true',
      gift_enabled: form.get('gift_enabled') === 'true',
      gift_bank_name: form.get('gift_bank_name'),
      gift_account_number: form.get('gift_account_number'),
      gift_account_name: form.get('gift_account_name'),
    }

    if (invitation?.id) {
      await supabase.from('invitation_details').update(payload).eq('id', invitation.id)
    } else {
      await supabase.from('invitation_details').insert(payload)
    }

    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-navy-100/20 p-6 space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Groom Name</label>
          <input type="text" name="groom_name" defaultValue={invitation?.groom_name} required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="Budi" />
        </div>
        <div>
          <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Bride Name</label>
          <input type="text" name="bride_name" defaultValue={invitation?.bride_name} required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="Ani" />
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Event Date & Time</label>
        <input type="datetime-local" name="event_date" defaultValue={invitation?.event_date ? new Date(invitation.event_date).toISOString().slice(0, 16) : ''} required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Location</label>
        <input type="text" name="location" defaultValue={invitation?.location} required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="Grand Ballroom" />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Venue Address</label>
        <textarea name="venue_address" defaultValue={invitation?.venue_address} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="Jl. Sudirman No. 1" />
      </div>

      <div>
        <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Theme</label>
        <div className="grid grid-cols-5 gap-2">
          {[
            { id: 'romantic', name: 'Romantic', bg: 'bg-rose-100 border border-rose-200' },
            { id: 'modern', name: 'Dark', bg: 'bg-slate-800 border border-slate-700' },
            { id: 'royal', name: 'Royal', bg: 'bg-rose-gold-100/50 border border-rose-gold-200' },
            { id: 'vintage', name: 'Vintage', bg: 'bg-emerald-50 border border-emerald-200' },
            { id: 'sakura', name: 'Sakura', bg: 'bg-pink-50 border border-pink-200', icon: '🌸' },
            { id: 'tropical', name: 'Tropical', bg: 'bg-emerald-50 border border-emerald-200', icon: '🌺' },
            { id: 'elegant', name: 'Elegant', bg: 'bg-red-50 border border-red-200', icon: '🌹' },
            { id: 'lavender', name: 'Lavender', bg: 'bg-purple-50 border border-purple-200', icon: '🪻' },
            { id: 'sunflower', name: 'Sunflower', bg: 'bg-rose-gold-300 border border-rose-gold-400', icon: '🌻' },
            { id: 'lily', name: 'Lily', bg: 'bg-rose-gold-50/30 border border-rose-gold-100/50', icon: '🫶' },
          ].map(t => (
            <label key={t.id} className="flex flex-col items-center p-1.5 border-2 rounded-xl cursor-pointer transition-all has-[:checked]:border-rose-gold-400 has-[:checked]:bg-rose-gold-50 border-rose-gold-100/30 hover:border-rose-gold-200 bg-white shadow-sm">
              <input type="radio" name="theme" value={t.id} defaultChecked={invitation?.theme === t.id || (!invitation?.theme && t.id === 'romantic')} className="absolute opacity-0" />
              <div className={`h-6 w-full rounded-lg mb-0.5 flex items-center justify-center ${t.bg}`}>
                {t.icon && <span className="text-[10px]">{t.icon}</span>}
              </div>
              <span className="text-[7px] font-bold uppercase tracking-wide text-navy-600 truncate w-full text-center">{t.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Message</label>
        <textarea name="message" defaultValue={invitation?.message} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="Merupakan suatu kehormatan..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 p-3 rounded-xl border border-navy-100/20 cursor-pointer hover:border-rose-gold-200/50 transition-all">
          <input type="checkbox" name="rsvp_enabled" value="true" defaultChecked={invitation?.rsvp_enabled} className="rounded text-rose-gold-500 focus:ring-rose-gold-400" />
          <span className="text-xs font-medium text-navy-600">RSVP Form</span>
        </label>
        <label className="flex items-center gap-2 p-3 rounded-xl border border-navy-100/20 cursor-pointer hover:border-rose-gold-200/50 transition-all">
          <input type="checkbox" name="bismillah_enabled" value="true" defaultChecked={invitation?.bismillah_enabled} className="rounded text-rose-gold-500 focus:ring-rose-gold-400" />
          <span className="text-xs font-medium text-navy-600">Bismillah Text</span>
        </label>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Google Maps URL</label>
        <input type="text" name="maps_url" defaultValue={invitation?.maps_url} className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="https://maps.google.com/..." />
      </div>

      <div className="border-t border-navy-100/20 pt-5 space-y-4">
        <h3 className="text-xs font-semibold text-navy-400/60 uppercase tracking-wider">Digital Angpao</h3>
        <label className="flex items-center gap-2 p-3 rounded-xl border border-navy-100/20 cursor-pointer hover:border-rose-gold-200/50 transition-all">
          <input type="checkbox" name="gift_enabled" value="true" defaultChecked={invitation?.gift_enabled} className="rounded text-rose-gold-500 focus:ring-rose-gold-400" />
          <span className="text-xs font-medium text-navy-600">Enable Digital Gift</span>
        </label>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Bank Name</label>
            <input type="text" name="gift_bank_name" defaultValue={invitation?.gift_bank_name} className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="BCA / Mandiri..." />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Account Number</label>
            <input type="text" name="gift_account_number" defaultValue={invitation?.gift_account_number} className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="1234567890" />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Account Name</label>
            <input type="text" name="gift_account_name" defaultValue={invitation?.gift_account_name} className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="John Doe" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-medium text-navy-400/60 mb-1.5">Background Music (MP3 URL)</label>
        <input type="text" name="music_url" defaultValue={invitation?.music_url} className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" placeholder="https://example.com/song.mp3" />
      </div>

      <div className="flex justify-end pt-2">
        <button type="submit" disabled={loading} className="h-10 px-6 rounded-xl bg-rose-gold-500 text-white text-sm font-semibold hover:bg-rose-gold-600 disabled:opacity-50 active:scale-[0.97] transition-all shadow-sm">
          {loading ? 'Saving...' : invitation?.id ? 'Update Invitation' : 'Create Invitation'}
        </button>
      </div>
    </form>
  )
}
