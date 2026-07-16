'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createGuestbookEntry } from '@/app/actions/weddingActions'

export default function GuestbookAddForm({ tenantId }: { tenantId: string }) {
  const [name, setName] = useState(''); const [message, setMessage] = useState(''); const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const form = new FormData(); form.set('name', name); form.set('message', message)
    await createGuestbookEntry(tenantId, form)
    setLoading(false); setName(''); setMessage(''); router.refresh()
  }
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required className="flex-1 h-9 px-3 rounded-xl border border-navy-200/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40" />
      <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" className="flex-[2] h-9 px-3 rounded-xl border border-navy-200/20 text-sm focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40" />
      <button type="submit" disabled={loading} className="h-9 px-4 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50">{loading ? '...' : 'Post'}</button>
    </form>
  )
}
