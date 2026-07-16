'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const mainNav = [
  { label: 'Dashboard', href: '/dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
  { label: 'Projects', href: '/project', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3"/></svg> },
]

const projectItems = [
  { label: 'Overview', href: '', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { label: 'Budget', href: 'budget', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg> },
  { label: 'Guests', href: 'guests', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: 'Guestbook', href: 'guestbook', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg> },
  { label: 'Rundown', href: 'rundown', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="3" x2="21" y1="10" y2="10"/><line x1="10" x2="10" y1="4" y2="21"/></svg> },
  { label: 'Timeline', href: 'timeline', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/></svg> },
  { label: 'Invitation', href: 'invitation', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg> },
  { label: 'Vendors', href: 'vendors', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/></svg> },
  { label: 'Team', href: 'team', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> },
  { label: 'Checklist', href: 'checklist', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { label: 'Photo Wall', href: 'photo-wall', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg> },
  { label: 'Scanner', href: 'scanner', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" x2="17" y1="12" y2="12"/></svg> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  // Detect if inside a project
  const match = pathname.match(/^\/project\/([^\/]+)/)
  const projectId = match?.[1]

  // Get current feature path
  const featurePath = projectId ? pathname.replace(`/project/${projectId}/`, '') : ''

  return (
    <aside className={`hidden lg:flex flex-col bg-white border-r border-navy-100/20 transition-all duration-300 ${collapsed ? 'w-14' : 'w-52'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-14 border-b border-navy-100/20 px-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-rose-gold-400 to-rose-gold-500 flex items-center justify-center shadow-sm shrink-0">
          <span className="text-white font-bold text-[10px]">N</span>
        </div>
        {!collapsed && <span className="text-sm font-semibold text-navy-800">WeddingNik</span>}
      </div>

      <nav className="flex-1 px-2 py-3 overflow-y-auto no-scrollbar space-y-4">
        {/* Main Navigation */}
        <div>
          {!collapsed && <p className="text-[9px] font-semibold text-navy-400/40 uppercase tracking-[0.12em] mb-1.5 ml-2.5">Navigation</p>}
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const isActive = !projectId && pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-2.5 rounded-lg text-xs font-medium transition-all ${
                    collapsed ? 'justify-center p-2' : 'px-2.5 py-1.5'
                  } ${
                    isActive
                      ? 'bg-rose-gold-50 text-rose-gold-700 border-l-2 border-rose-gold-400'
                      : 'text-navy-400/60 hover:text-navy-600 hover:bg-navy-50/40'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Project Navigation */}
        {projectId && (
          <div>
            {!collapsed && <p className="text-[9px] font-semibold text-navy-400/40 uppercase tracking-[0.12em] mb-1.5 ml-2.5">Project</p>}
            <div className="space-y-0.5">
              {projectItems.map((item) => {
                const targetHref = item.href ? `/project/${projectId}/${item.href}` : `/project/${projectId}`
                const isActive = item.href === '' ? featurePath === '' : featurePath.startsWith(item.href)
                return (
                  <Link key={item.href} href={targetHref}
                    className={`flex items-center gap-2.5 rounded-lg text-xs font-medium transition-all ${
                      collapsed ? 'justify-center p-2' : 'px-2.5 py-1.5'
                    } ${
                      isActive
                        ? 'bg-rose-gold-50 text-rose-gold-700 border-l-2 border-rose-gold-400'
                        : 'text-navy-400/60 hover:text-navy-600 hover:bg-navy-50/40'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Collapse */}
      <div className="px-2 pb-3 border-t border-navy-100/10 pt-2">
        <button onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center h-7 rounded-lg text-navy-400/40 hover:text-navy-600 hover:bg-navy-50/40 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
