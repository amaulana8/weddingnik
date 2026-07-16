'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { updateTimelineStatus, deleteTimeline } from '@/app/actions/weddingActions'
import AddTimelineForm from './AddTimelineForm'

const fmt = (d: string) => d ? new Date(d + 'T00:00:00Z').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export default function TimelineClient({ items, categories, tenantId }: { items: any[]; categories: any[]; tenantId: string }) {
  const router = useRouter()
  const pending = items.filter(i => i.status !== 'paid')
  const paid = items.filter(i => i.status === 'paid')

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-lg font-semibold text-navy-800 tracking-tight">Timeline</h1><p className="text-xs text-navy-400/60 mt-0.5">Payment schedule & milestones</p></div>
        <AddTimelineForm tenantId={tenantId} categories={categories} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-navy-100/20 p-4">
          <p className="text-[10px] font-medium text-navy-400/40 uppercase">Total</p>
          <p className="text-xl font-semibold text-navy-800 mt-1">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100/20 p-4">
          <p className="text-[10px] font-medium text-navy-400/40 uppercase">Pending</p>
          <p className="text-xl font-semibold text-amber-500 mt-1">{pending.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-navy-100/20 p-4">
          <p className="text-[10px] font-medium text-navy-400/40 uppercase">Paid</p>
          <p className="text-xl font-semibold text-emerald-500 mt-1">{paid.length}</p>
        </div>
      </div>

      {/* Timeline */}
      {items.length > 0 ? (
        <div className="relative pl-10 space-y-6 before:absolute before:left-[19px] before:top-[6px] before:bottom-[6px] before:w-[2px] before:bg-navy-100/30">
          {items.map((item, i) => {
            const isPaid = item.status === 'paid'
            const due = new Date(item.due_date + 'T00:00:00Z')
            const today = new Date(); today.setHours(0,0,0,0)
            const isOverdue = !isPaid && due < today

            return (
              <div key={item.id} className="relative group" style={{ animationDelay: `${i * 50}ms` }}>
                <div className={`absolute -left-[31px] top-1.5 h-[18px] w-[18px] rounded-full border-[3px] border-white shadow-sm z-10 ${
                  isPaid ? 'bg-emerald-500' : isOverdue ? 'bg-red-500' : 'bg-amber-400'
                }`} />
                <div className={`p-5 rounded-xl border transition-all hover:shadow-sm ${
                  isPaid ? 'bg-emerald-50/20 border-emerald-100/40' : isOverdue ? 'bg-red-50/20 border-red-100/40' : 'bg-white border-navy-100/20'
                }`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isPaid ? 'bg-emerald-100 text-emerald-700' : isOverdue ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {isPaid ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                        </span>
                        {item.budget_categories?.name && (
                          <span className="text-[9px] font-bold text-navy-400/50 bg-navy-50/40 px-2 py-0.5 rounded">{item.budget_categories.name}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-navy-700">{item.description}</h3>
                      <p className="text-[10px] text-navy-400/40 mt-0.5">{fmt(item.due_date)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-rose-gold-500">Rp {(item.amount_due || 0).toLocaleString('id-ID')}</p>
                      {!isPaid && (
                        <form action={async () => {
                          await updateTimelineStatus(item.id, tenantId, 'paid')
                          router.refresh()
                        }}>
                          <button className="text-[9px] font-bold text-emerald-600 hover:text-emerald-700 mt-1">Mark Paid</button>
                        </form>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-all">
                    <form action={deleteTimeline.bind(null, tenantId, item.id)}>
                      <button className="text-[9px] font-medium text-red-400 hover:text-red-500">Delete</button>
                    </form>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-navy-100/20">
          <div className="h-12 w-12 rounded-xl bg-navy-50/40 flex items-center justify-center mx-auto mb-4 text-navy-200 text-xl">📅</div>
          <p className="text-sm text-navy-400/40">No milestones yet. Add your first payment schedule.</p>
        </div>
      )}
    </div>
  )
}
