import { createServerSupabase } from '@/lib/supabaseServer'
import Link from 'next/link'
import NewProjectButton from '@/components/NewProjectButton'

export default async function ProjectListPage() {
  const supabase = await createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: projects } = await supabase
    .from('tenants')
    .select('*')
    .eq('admin_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-lg font-semibold text-navy-800 tracking-tight">Projects</h1>
          <p className="text-xs text-navy-400/60 mt-0.5">{projects?.length || 0} total projects</p>
        </div>
        <NewProjectButton />
      </div>

      <div className="space-y-2">
        {projects?.map((project) => (
          <Link
            key={project.id}
            href={`/project/${project.id}`}
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-navy-100/20 hover:border-rose-gold-200/50 hover:shadow-sm transition-all group"
          >
            <div>
              <h3 className="text-sm font-medium text-navy-700 group-hover:text-navy-900 transition-colors">{project.name}</h3>
              <p className="text-[11px] text-navy-400/40 mt-0.5">
                Created {new Date(project.created_at).toLocaleDateString('id-ID')}
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy-300 group-hover:text-rose-gold-400 transition-colors">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </Link>
        ))}

        {(!projects || projects.length === 0) && (
          <div className="text-center py-16">
            <div className="h-12 w-12 rounded-xl bg-navy-50/40 flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy-300"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13 12H3"/></svg>
            </div>
            <p className="text-sm font-medium text-navy-400/60">No projects yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
