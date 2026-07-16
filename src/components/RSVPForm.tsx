'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function RSVPForm({ tenantId }: { tenantId: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const isAttending = form.get('is_attending') === 'true'
    const guestCount = parseInt(form.get('guest_count') as string) || 1

    const supabase = createClient()
    await supabase.from('rsvps').insert({
      tenant_id: tenantId, name, is_attending: isAttending, guest_count: guestCount,
      message: form.get('message') as string || ''
    })

    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 text-center border border-white/50 shadow-xl">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
        <p className="text-slate-600 text-sm italic">Your RSVP has been received.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/50 shadow-xl text-left">
      <h3 className="text-xl font-bold text-slate-900 mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>RSVP Confirmation</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Your Name</label>
          <input name="name" required placeholder="Enter your name..." className="w-full bg-white/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Will you attend?</label>
          <div className="flex gap-3">
            <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/30 cursor-pointer hover:bg-emerald-50/60 transition-all has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50">
              <input type="radio" name="is_attending" value="true" defaultChecked className="accent-emerald-500" />
              <span className="text-xs font-bold text-emerald-700">Yes, I'll be there</span>
            </label>
            <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-red-200 bg-red-50/30 cursor-pointer hover:bg-red-50/60 transition-all has-[:checked]:border-red-400 has-[:checked]:bg-red-50">
              <input type="radio" name="is_attending" value="false" className="accent-red-400" />
              <span className="text-xs font-bold text-red-500">Regretfully decline</span>
            </label>
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Number of Guests</label>
          <input type="number" name="guest_count" defaultValue={1} min={1} className="w-full bg-white/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-slate-900 focus:ring-2 focus:ring-rose-200 outline-none transition-all" />
        </div>
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Message (optional)</label>
          <textarea name="message" rows={3} className="w-full bg-white/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all" placeholder="Send your wishes..." />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-slate-900 text-white text-xs font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 transition-all">
          {loading ? 'Sending...' : 'Confirm Attendance'}
        </button>
      </form>
    </div>
  )
}
