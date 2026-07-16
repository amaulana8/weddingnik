'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const shortcuts = [
  { key: 'g', label: 'Go to...' },
  { key: 'd', label: 'Dashboard', href: '/dashboard' },
  { key: 'p', label: 'Projects', href: '/project' },
]

export default function CmdK() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const pathname = usePathname()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((p) => !p)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const projectId = pathname.startsWith('/project/') ? pathname.split('/')[2] : null

  const items = [
    ...(projectId ? [
      { label: 'Dashboard', href: `/project/${projectId}`, icon: '◉' },
      { label: 'Budget', href: `/project/${projectId}/budget`, icon: '💰' },
      { label: 'Guests', href: `/project/${projectId}/guests`, icon: '👥' },
      { label: 'Guestbook', href: `/project/${projectId}/guestbook`, icon: '📋' },
      { label: 'Rundown', href: `/project/${projectId}/rundown`, icon: '📅' },
      { label: 'Timeline', href: `/project/${projectId}/timeline`, icon: '⏱' },
      { label: 'Invitation', href: `/project/${projectId}/invitation`, icon: '💌' },
      { label: 'Vendors', href: `/project/${projectId}/vendors`, icon: '🏪' },
      { label: 'Team', href: `/project/${projectId}/team`, icon: '👤' },
      { label: 'Checklist', href: `/project/${projectId}/checklist`, icon: '✓' },
    ] : []),
    { label: 'Dashboard', href: '/dashboard', icon: '◉' },
    { label: 'Projects', href: '/project', icon: '📁' },
  ]

  const filtered = items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
  const navigate = (href: string) => { setOpen(false); window.location.href = href }

  return (
    <>
      {/* Desktop trigger */}
      <button onClick={() => setOpen(true)} className="hidden lg:flex fixed bottom-5 right-5 z-40 h-9 px-3 rounded-xl bg-white border border-navy-100/20 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-[11px] font-medium text-navy-400/60 items-center gap-2">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        Quick nav
        <kbd className="px-1 py-0.5 rounded bg-rose-gold-50 text-[8px] font-bold text-rose-gold-500">⌘K</kbd>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[100] bg-navy-900/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-md px-4 animate-scale-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-navy-100/20 overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-navy-100/10">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy-300 shrink-0"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input
                  autoFocus
                  type="text"
                  placeholder="Search pages..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(0) }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected((s) => Math.min(s + 1, filtered.length - 1)) }
                    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)) }
                    if (e.key === 'Enter' && filtered[selected]) navigate(filtered[selected].href)
                  }}
                  className="flex-1 text-sm font-medium text-navy-700 outline-none placeholder:text-navy-400/30 bg-transparent"
                />
              </div>
              <div className="max-h-64 overflow-y-auto p-2 space-y-0.5">
                {filtered.map((item, i) => (
                  <button key={item.href} onClick={() => navigate(item.href)} onMouseEnter={() => setSelected(i)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                      i === selected ? 'bg-rose-gold-50 text-rose-gold-700' : 'text-navy-500 hover:bg-rose-gold-50/50'
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
