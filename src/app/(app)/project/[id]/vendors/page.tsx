import { createServerSupabase } from '@/lib/supabaseServer'
import VendorClient from './VendorClient'

export default async function VendorsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabase()

  const [{ data: vendors }, { data: categories }] = await Promise.all([
    supabase.from('wedding_vendors').select('*').eq('tenant_id', id).order('created_at', { ascending: false }),
    supabase.from('budget_categories').select('*').eq('tenant_id', id).order('name')
  ])

  return <VendorClient vendors={vendors || []} categories={categories || []} tenantId={id} />
}
