'use server'

import { createServerSupabase } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'

export async function createExpense(tenantId: string, formData: FormData) {
  const supabase = await createServerSupabase()
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string) || 0
  const category_id = formData.get('category_id') as string || null
  const { error } = await supabase.from('expenses').insert({
    tenant_id: tenantId,
    description, amount,
    category_id: category_id ? parseInt(category_id) : null,
    expense_date: new Date().toISOString()
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/budget`)
}

export async function createGuest(tenantId: string, formData: FormData) {
  const supabase = await createServerSupabase()
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string || ''
  const category = formData.get('category') as string || 'General'
  const { error } = await supabase.from('guests').insert({
    tenant_id: tenantId,
    name,
    phone_number: phone,
    category,
    qr_code_token: Math.random().toString(36).substring(2, 10).toUpperCase()
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/guests`)
}

export async function deleteGuest(tenantId: string, guestId: string) {
  const supabase = await createServerSupabase()
  const { error } = await supabase.from('guests').delete().eq('id', guestId)
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/guests`)
}

export async function createRundown(tenantId: string, formData: FormData) {
  const supabase = await createServerSupabase()
  const start_time = formData.get('start_time') as string
  const end_time = formData.get('end_time') as string || null
  const activity = formData.get('activity') as string
  const location = formData.get('location') as string || ''
  const pic = formData.get('pic') as string || ''
  const { error } = await supabase.from('wedding_rundowns').insert({
    tenant_id: tenantId, start_time, end_time, activity, location, pic, notes: ''
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/rundown`)
}

export async function deleteRundown(tenantId: string, rundownId: string) {
  const supabase = await createServerSupabase()
  const { error } = await supabase.from('wedding_rundowns').delete().eq('id', rundownId)
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/rundown`)
}

export async function createTimeline(tenantId: string, formData: FormData) {
  const supabase = await createServerSupabase()
  const description = formData.get('description') as string
  const due_date = formData.get('due_date') as string
  const amount_due = parseFloat(formData.get('amount_due') as string) || 0
  const { error } = await supabase.from('payment_timelines').insert({
    tenant_id: tenantId, description, due_date, amount_due, status: 'pending'
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/timeline`)
}

export async function updateTimelineStatus(timelineId: string, tenantId: string, status: string) {
  const supabase = await createServerSupabase()
  const { error } = await supabase.from('payment_timelines').update({ status }).eq('id', timelineId)
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/timeline`)
  revalidatePath(`/project/${tenantId}/checklist`)
}

export async function deleteTimeline(tenantId: string, timelineId: string) {
  const supabase = await createServerSupabase()
  const { error } = await supabase.from('payment_timelines').delete().eq('id', timelineId)
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/timeline`)
  revalidatePath(`/project/${tenantId}/checklist`)
}

export async function createVendor(tenantId: string, formData: FormData) {
  const supabase = await createServerSupabase()
  const name = formData.get('name') as string
  const service = formData.get('service') as string || ''
  const phone = formData.get('phone') as string || ''
  const notes = formData.get('notes') as string || ''
  const { error } = await supabase.from('wedding_vendors').insert({
    tenant_id: tenantId, name, service, phone, notes
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/vendors`)
}

export async function deleteVendor(tenantId: string, vendorId: string) {
  const supabase = await createServerSupabase()
  const { error } = await supabase.from('wedding_vendors').delete().eq('id', vendorId)
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/vendors`)
}

export async function inviteTeamMember(tenantId: string, formData: FormData) {
  const supabase = await createServerSupabase()
  const email = formData.get('email') as string
  const role = formData.get('role') as string || 'member'

  const { data: profile } = await supabase.from('profiles').select('id').eq('email', email).single()
  if (!profile) throw new Error('User dengan email tersebut tidak ditemukan.')

  const { error } = await supabase.from('wedding_memberships').insert({
    tenant_id: tenantId,
    user_id: profile.id,
    role
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/team`)
}

export async function removeTeamMember(tenantId: string, membershipId: string) {
  const supabase = await createServerSupabase()
  const { error } = await supabase.from('wedding_memberships').delete().eq('id', membershipId)
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/team`)
}

export async function createGuestbookEntry(tenantId: string, formData: FormData) {
  const supabase = await createServerSupabase()
  const name = formData.get('name') as string
  const message = formData.get('message') as string || ''
  const { error } = await supabase.from('guestbook_entries').insert({
    tenant_id: tenantId, name, message, photo_url: null
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/guestbook`)
  revalidatePath(`/project/${tenantId}/photo-wall`)
}

export async function uploadPhoto(tenantId: string, formData: FormData) {
  const supabase = await createServerSupabase()
  const name = formData.get('name') as string || 'Guest'
  const photoUrl = formData.get('photo_url') as string
  const message = formData.get('message') as string || ''
  const { error } = await supabase.from('guestbook_entries').insert({
    tenant_id: tenantId, name, message, photo_url: photoUrl || null
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/project/${tenantId}/photo-wall`)
}

export async function markAttendance(tenantId: string, qrToken: string) {
  const supabase = await createServerSupabase()
  const { data: guest, error: findError } = await supabase
    .from('guests')
    .select('*')
    .eq('qr_code_token', qrToken)
    .single()

  if (findError || !guest) return { success: false, message: 'Guest not found' }
  if (guest.status === 'attended') return { success: false, message: 'Already checked in', guest }

  const { error: updateError } = await supabase
    .from('guests')
    .update({ status: 'attended', attended_at: new Date().toISOString() })
    .eq('id', guest.id)

  if (updateError) return { success: false, message: 'Failed to update' }
  revalidatePath(`/project/${tenantId}/scanner`)
  revalidatePath(`/project/${tenantId}/guests`)
  return { success: true, message: 'Attendance recorded!', guest }
}
