'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { inviteTeamMember, removeTeamMember } from '@/app/actions/weddingActions'

const ROLES = [
  { id: 'member', name: 'Team Member', desc: 'Limited access (Scanner & Rundown)', icon: '👤', color: 'bg-indigo-600' },
  { id: 'admin', name: 'Project Admin', desc: 'Full access to all features', icon: '👑', color: 'bg-rose-gold-500' }
]

export default function TeamClient({ members, currentUserEmail, tenantId }: { members: any[]; currentUserEmail: string; tenantId: string }) {
  const [showInvite, setShowInvite] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('member')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true); setError('')
    const form = new FormData()
    form.set('email', email)
    form.set('role', role)
    try {
      await inviteTeamMember(tenantId, form)
      setShowInvite(false); setEmail('')
      router.refresh()
    } catch (err: any) { setError(err.message) }
    setLoading(false)
  }

  const handleRemove = async (membershipId: string) => {
    if (!confirm('Remove this member from the team?')) return
    await removeTeamMember(tenantId, membershipId)
    router.refresh()
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Team</h1>
          <p className="text-xs text-navy-400/60 mt-0.5">{members.length} member{members.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowInvite(true)} className="h-9 px-4 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-600 active:scale-[0.97] transition-all shadow-sm">+ Invite</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-navy-100/20 p-4"><p className="text-[10px] font-medium text-navy-400/40 uppercase">Total</p><p className="text-xl font-semibold text-navy-800 mt-1">{members.length}</p></div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4"><p className="text-[10px] font-medium text-amber-600 uppercase">Project Status</p><p className="text-xs font-semibold text-amber-800 mt-1 uppercase tracking-wide">Collaborative</p></div>
      </div>

      {members.length > 0 ? (
        <div className="space-y-2">
          {members.map((m, i) => {
            const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles
            const isMe = profile?.email === currentUserEmail
            const roleInfo = ROLES.find(r => r.id === m.role) || ROLES[0]
            return (
              <div key={m.id} className="bg-white rounded-xl border border-navy-100/20 p-4 flex items-center justify-between group hover:border-rose-gold-200/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg shadow-sm ${isMe ? roleInfo.color + ' text-white' : 'bg-navy-50/40 text-navy-400'}`}>
                    {roleInfo.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-700">{profile?.name || profile?.email?.split('@')[0] || 'Unknown'}</p>
                    <div className="flex items-center gap-2 text-[10px] text-navy-400/40">
                      <span>{profile?.email || ''}</span>
                      {isMe && <span className="text-rose-gold-500 font-bold uppercase">(You)</span>}
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${m.role === 'admin' ? 'bg-rose-gold-50 text-rose-gold-600' : 'bg-indigo-50 text-indigo-600'}`}>{m.role}</span>
                    </div>
                  </div>
                </div>
                {!isMe && (
                  <button onClick={() => handleRemove(m.id)} className="h-8 w-8 rounded-lg text-navy-400/40 hover:text-red-400 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-navy-100/20">
          <div className="h-12 w-12 rounded-xl bg-navy-50/40 flex items-center justify-center mx-auto mb-4 text-navy-200 text-xl">👥</div>
          <p className="text-sm text-navy-400/40">No team members yet. Invite your team to collaborate.</p>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm" onClick={() => setShowInvite(false)} />
          <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-start mb-5">
              <div><h2 className="text-sm font-semibold text-navy-800">Invite Member</h2><p className="text-[10px] text-navy-400/50 mt-0.5">Add a collaborator to this project</p></div>
              <button onClick={() => setShowInvite(false)} className="h-8 w-8 rounded-lg bg-navy-50/40 text-navy-400/60 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl mb-4">{error}</p>}
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="user@example.com" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-gold-400/40 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-navy-400/50 uppercase tracking-wider ml-1 mb-1.5 block">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map(r => (
                    <label key={r.id} className={`flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all has-[:checked]:border-rose-gold-400 has-[:checked]:bg-rose-gold-50 ${role === r.id ? 'border-rose-gold-400 bg-rose-gold-50' : 'border-navy-100/20'}`}>
                      <input type="radio" name="role" value={r.id} checked={role === r.id} onChange={() => setRole(r.id)} className="absolute opacity-0" />
                      <span className="text-lg mb-1">{r.icon}</span>
                      <span className="text-[9px] font-bold text-navy-600 uppercase">{r.name}</span>
                      <span className="text-[7px] text-navy-400/40 mt-0.5 text-center">{r.desc}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full h-10 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50 transition-all">{loading ? 'Sending...' : 'Send Invitation'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
