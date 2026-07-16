'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { uploadPhoto } from '@/app/actions/weddingActions'

export default function PhotoUploadForm({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false); const [loading, setLoading] = useState(false)
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true)
    const form = new FormData(e.currentTarget)
    await uploadPhoto(tenantId, form)
    setLoading(false); setOpen(false); router.refresh()
  }
  return (<>
    <button onClick={() => setOpen(true)} className="h-8 px-3 rounded-lg bg-rose-gold-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-rose-gold-600">+ Upload Photo</button>
    {open && <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-navy-900/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-sm px-4 animate-scale-in">
        <div className="bg-white rounded-2xl shadow-2xl border border-navy-100/20 p-6">
          <h2 className="text-sm font-semibold text-navy-800 mb-3">Upload Photo</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Photo by (name)" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm" />
            <input type="url" name="photo_url" placeholder="Photo URL" className="w-full h-10 px-3 rounded-xl border border-navy-200/20 text-sm" />
            <textarea name="message" placeholder="Caption" rows={2} className="w-full px-3 py-2.5 rounded-xl border border-navy-200/20 text-sm" />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} className="h-9 px-4 rounded-xl text-xs text-navy-400/60 hover:text-navy-600">Cancel</button>
              <button type="submit" disabled={loading} className="h-9 px-5 rounded-xl bg-rose-gold-500 text-white text-xs font-semibold hover:bg-rose-gold-600 disabled:opacity-50">{loading ? 'Uploading...' : 'Upload'}</button>
            </div>
          </form>
        </div>
      </div>
    </div>}
  </>)
}
