'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabaseClient'

export default function NewProjectButton() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('tenants')
      .insert({ name: name.trim(), admin_id: user.id })
      .select()
      .single()

    setLoading(false)

    if (error) {
      alert('Gagal membuat project: ' + error.message)
      return
    }

    setOpen(false)
    setName('')
    router.push(`/project/${data.id}`)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="h-9 px-4 rounded-xl bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:from-rose-gold-500 hover:to-rose-gold-600 active:scale-[0.97] transition-all shadow-sm"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
        New Project
      </button>

      {open && (window as any).__showNewProject && null}
      {open && (
        <>
          <div className="fixed inset-0 z-[100] bg-navy-900/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-sm px-4 animate-scale-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-navy-100/20 p-6">
              <h2 className="text-sm font-semibold text-navy-800 mb-1">New Project</h2>
              <p className="text-xs text-navy-400/60 mb-5">Create a new wedding project</p>
              <form onSubmit={createProject}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Project name..."
                  required
                  className="w-full h-10 px-3 rounded-xl border border-navy-200/20 bg-white text-sm text-navy-700 font-medium placeholder:text-navy-400/30 focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 focus:border-rose-gold-400 transition-all mb-4"
                />
                <div className="flex items-center gap-2 justify-end">
                  <button type="button" onClick={() => setOpen(false)} className="h-9 px-4 rounded-xl text-xs font-semibold text-navy-400/60 hover:text-navy-600 transition-all">Cancel</button>
                  <button type="submit" disabled={loading} className="h-9 px-5 rounded-xl bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white text-xs font-semibold hover:from-rose-gold-500 hover:to-rose-gold-600 disabled:opacity-50 transition-all">
                    {loading ? 'Creating...' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
