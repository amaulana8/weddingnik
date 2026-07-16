'use client'

import { ReactNode } from 'react'

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-navy-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-sm px-4 animate-scale-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-navy-100/20 p-6">
          {title && <h2 className="text-sm font-semibold text-navy-800 mb-1">{title}</h2>}
          {children}
        </div>
      </div>
    </div>
  )
}
