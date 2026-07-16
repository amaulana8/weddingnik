'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { updateTimelineStatus, deleteTimeline } from '@/app/actions/weddingActions'

export default function ChecklistClient({ tasks: initialTasks, tenantId }: { tasks: any[]; tenantId: string }) {
  const [filter, setFilter] = useState<'all' | 'pending' | 'done'>('all')
  const router = useRouter()

  const stats = useMemo(() => {
    const total = initialTasks.length
    const completed = initialTasks.filter(t => t.status === 'paid').length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    return { total, completed, progress }
  }, [initialTasks])

  const filtered = initialTasks.filter(t => {
    if (filter === 'pending') return t.status !== 'paid'
    if (filter === 'done') return t.status === 'paid'
    return true
  })

  const toggleDone = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid'
    await updateTimelineStatus(taskId, tenantId, newStatus)
    router.refresh()
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Checklist</h1>
        <p className="text-xs text-navy-400/60 mt-0.5">Track your wedding preparation tasks</p>
      </div>

      {/* Progress Card */}
      <div className="rounded-2xl bg-navy-800 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-end justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-2">Preparations</p>
              <p className="text-3xl font-bold tracking-tight">{stats.progress}<span className="text-lg text-amber-400 ml-1">%</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-medium text-navy-400/70 uppercase">Done</p>
              <p className="text-lg font-bold text-white">{stats.completed} <span className="text-navy-400/60">/ {stats.total}</span></p>
            </div>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-gold-400 to-amber-400 rounded-full transition-all duration-1000" style={{ width: `${stats.progress}%` }} />
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white p-1 rounded-xl border border-navy-100/20 shadow-sm grid grid-cols-3 gap-1">
        {(['all', 'pending', 'done'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${filter === f ? 'bg-rose-gold-500 text-white shadow-sm' : 'text-navy-400/50 hover:text-navy-500'}`}>
            {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : 'Done'}
          </button>
        ))}
      </div>

      {/* Tasks */}
      {filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map(task => {
            const isDone = task.status === 'paid'
            return (
              <div key={task.id} className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${isDone ? 'bg-navy-50/40 border-navy-100/10 opacity-60' : 'bg-white border-navy-100/20 hover:border-rose-gold-200/50'}`}>
                <button onClick={() => toggleDone(task.id, task.status)} className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${isDone ? 'bg-rose-gold-500 border-rose-gold-500' : 'border-navy-300 hover:border-rose-gold-400'}`}>
                  {isDone && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isDone ? 'text-navy-400 line-through' : 'text-navy-700'}`}>{task.description}</p>
                  <div className="flex items-center gap-2 text-[10px] text-navy-400/40 mt-0.5">
                    {task.due_date && <span>📅 {new Date(task.due_date + 'T00:00:00Z').toLocaleDateString('id-ID')}</span>}
                    {task.budget_categories?.name && <span className="bg-navy-50/40 px-1.5 py-0.5 rounded text-navy-500">{task.budget_categories.name}</span>}
                  </div>
                </div>
                <form action={deleteTimeline.bind(null, tenantId, task.id)}>
                  <button className="h-7 w-7 rounded-lg text-navy-400/40 hover:text-red-400 hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </form>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-navy-100/20">
          <div className="h-12 w-12 rounded-xl bg-navy-50/40 flex items-center justify-center mx-auto mb-4 text-navy-200 text-xl">✅</div>
          <p className="text-sm text-navy-400/40">{filter === 'all' ? 'No tasks yet. Add your first task.' : 'No tasks in this category.'}</p>
        </div>
      )}
    </div>
  )
}
