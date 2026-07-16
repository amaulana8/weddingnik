'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createGuest } from '@/app/actions/weddingActions'

export default function GuestForm({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    await createGuest(tenantId, form)
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="h-8 px-3 rounded-lg bg-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-600 active:scale-[0.97] transition-all shadow-sm">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Guest
      </button>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-navy-900/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed top-[12%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-sm px-4 animate-scale-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-navy-100/20 p-6">
              <h2 className="text-sm font-semibold text-navy-800 mb-1">Add Guest</h2>
              <p className="text-xs text-navy-400/60 mb-4">Add a new guest to your list</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Guest name" required className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                <input type="text" name="phone" placeholder="WhatsApp (e.g. 62812...)" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
                
                <p className="text-[10px] font-semibold text-navy-400/60 uppercase tracking-wider ml-1">Category</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'General', icon: '👥' },
                    { id: 'VIP', icon: '⭐' },
                    { id: 'Family', icon: '🏠' },
                    { id: 'Colleague', icon: '💼' },
                  ].map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 p-3 rounded-xl border-2 border-navy-100/20 cursor-pointer transition-all has-[:checked]:border-rose-gold-400 has-[:checked]:bg-rose-gold-50 hover:border-navy-300/30">
                      <input type="radio" name="category" value={cat.id} defaultChecked={cat.id === 'General'} className="absolute opacity-0" />
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-[10px] font-bold text-navy-600 uppercase tracking-wider">{cat.id}</span>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="h-9 px-4 rounded-xl text-xs font-semibold text-navy-400/60 hover:text-navy-600">Cancel</button>
                  <button type="submit" disabled={loading} className="h-9 px-5 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
