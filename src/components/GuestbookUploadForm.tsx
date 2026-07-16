'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function GuestbookUploadForm({ tenantId }: { tenantId: string }) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    await supabase.from('guestbook_entries').insert({
      tenant_id: tenantId,
      name: name.trim(),
      message: message.trim() || null,
    })

    setLoading(false)
    setDone(true)
    router.refresh()
  }

  if (done) {
    return (
      <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 text-center border border-white/50 shadow-xl">
        <div className="text-4xl mb-4">💌</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Thank You!</h3>
        <p className="text-slate-600 text-sm">Your message has been posted.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/50 shadow-xl">
      <h3 className="text-lg font-bold text-slate-900 mb-4 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Leave a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="w-full bg-white/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all" />
        <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your wishes..." rows={3} className="w-full bg-white/60 border border-white/20 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-rose-200 outline-none transition-all" />
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-rose-500 text-white text-xs font-black uppercase tracking-widest hover:bg-rose-600 disabled:opacity-50 transition-all">
          {loading ? 'Posting...' : 'Post Message'}
        </button>
      </form>
    </div>
  )
}
