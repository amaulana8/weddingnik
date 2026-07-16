import MobileNav from '@/components/MobileNav'
import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabaseServer'

export default async function ProjectDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: project } = await supabase.from('tenants').select('name').eq('id', id).single()

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden flex items-center gap-3 h-12 mb-4">
        <Link
          href="/project"
          className="h-8 w-8 rounded-lg bg-rose-gold-50 flex items-center justify-center text-rose-gold-500 hover:bg-rose-gold-100 transition-colors shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </Link>
        <div className="min-w-0">
          <p className="text-xs text-navy-400/60 font-medium truncate">{project?.name || 'Project'}</p>
        </div>
        <div className="ml-auto h-6 w-6 rounded-md bg-gradient-to-br from-rose-gold-400 to-rose-gold-500 flex items-center justify-center text-white font-bold text-[8px]">
          {user?.email?.charAt(0).toUpperCase()}
        </div>
      </div>

      {children}

      <MobileNav />
    </>
  )
}
