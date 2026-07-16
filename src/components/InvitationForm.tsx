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
        <select name="theme" defaultValue="romantic" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all">
          <option value="romantic">Romantic</option>
          <option value="elegant">Elegant Rose</option>
          <option value="modern">Modern Dark</option>
          <option value="royal">Royal Gold</option>
          <option value="vintage">Vintage</option>
          <option value="sakura">Sakura</option>
          <option value="tropical">Tropical</option>
          <option value="lavender">Lavender</option>
          <option value="sunflower">Sunflower</option>
          <option value="lily">Lily</option>
        </select>
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
