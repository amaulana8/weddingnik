'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inviteTeamMember } from '@/app/actions/weddingActions'

export default function InviteMemberForm({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false); const [loading, setLoading] = useState(false); const [err, setError] = useState('')
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError('')
    const form = new FormData(e.currentTarget)
    try {
      await inviteTeamMember(tenantId, form)
      setOpen(false); router.refresh()
    } catch(e: any) { setError(e.message) }
    setLoading(false)
  }
  return (<>
    <button onClick={() => setOpen(true)} className="h-8 px-3 rounded-lg bg-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-600">+ Invite Member</button>
    {open && <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-navy-900/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-sm px-4 animate-scale-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-navy-100/20 p-6">
          <h2 className="text-sm font-semibold text-navy-800 mb-3">Invite Member</h2>
          {err && <p className="text-xs text-red-500 mb-3">{err}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" name="email" required placeholder="User email" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm" />
            <select name="role" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm bg-white">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="h-9 px-4 rounded-xl text-xs text-navy-400/60 hover:text-navy-600">Cancel</button>
              <button type="submit" disabled={loading} className="h-9 px-5 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50">{loading ? 'Sending...' : 'Invite'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>}
  </>)
}
