'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

export default function ProjectSettings({ project, onClose }: { project: any; onClose: () => void }) {
  const [name, setName] = useState(project.name || '')
  const [gbEnabled, setGbEnabled] = useState(project.is_guestbook_enabled || false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    await supabase.from('tenants').update({ name: name.trim(), is_guestbook_enabled: gbEnabled }).eq('id', project.id)

    setLoading(false)
    router.refresh()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-navy-100/20 overflow-hidden animate-scale-in">
        <div className="bg-rose-gold-500 p-6 text-white">
          <h3 className="text-sm font-semibold">Project Settings</h3>
          <p className="text-rose-gold-100 text-xs mt-1">Update project name and features</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-semibold text-navy-400/60 uppercase tracking-wider ml-1">Project Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required
              className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm text-navy-700 font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all mt-1.5" />
          </div>

          <div className="flex items-center justify-between bg-navy-50/40 p-4 rounded-xl border border-navy-100/20">
            <div>
              <p className="text-[10px] font-bold text-navy-700 uppercase tracking-wider">Digital Guestbook</p>
              <p className="text-[8px] text-navy-400/40 italic mt-0.5">Addon Feature</p>
            </div>
            <button type="button" onClick={() => setGbEnabled(!gbEnabled)}
              className={`w-10 h-5 rounded-full transition-all duration-300 relative ${gbEnabled ? 'bg-rose-gold-400' : 'bg-navy-200'}`}>
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${gbEnabled ? 'left-[20px]' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="h-9 px-4 rounded-xl text-xs font-semibold text-navy-400/60 hover:text-navy-600">Cancel</button>
            <button type="submit" disabled={loading} className="h-9 px-5 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
