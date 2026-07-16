'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
  { label: 'Projects', href: '/project', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3"/></svg> },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`hidden lg:flex flex-col bg-white border-r border-navy-100/20 transition-all duration-300 ${collapsed ? 'w-14' : 'w-52'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-14 border-b border-navy-100/20 px-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-rose-gold-400 to-rose-gold-500 flex items-center justify-center shadow-sm shrink-0">
          <span className="text-white font-bold text-[10px]">N</span>
        </div>
        {!collapsed && <span className="text-sm font-semibold text-navy-800">WeddingNik</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg text-xs font-medium transition-all ${
                collapsed ? 'justify-center p-2' : 'px-2.5 py-2'
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
      </nav>

      {/* Collapse */}
      <div className="px-2 pb-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center h-8 rounded-lg text-navy-400/40 hover:text-navy-600 hover:bg-navy-50/40 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${collapsed ? 'rotate-180' : ''}`}>
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
