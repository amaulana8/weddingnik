'use client'

export default function ExportRSVPButton({ guests, rsvps, brideName, groomName }: {
  guests: any[]; rsvps: any[]; brideName?: string; groomName?: string
}) {
  if (!rsvps || rsvps.length === 0) return null

  const handleExport = () => {
    const individualCount = rsvps.filter((r: any) => r.is_attending && r.guest_count === 1).length
    const familyCount = rsvps.filter((r: any) => r.is_attending && r.guest_count > 1).length
    const totalGuests = rsvps.reduce((acc: number, r: any) => r.is_attending ? acc + (r.guest_count || 0) : acc, 0)
    const attending = rsvps.filter((r: any) => r.is_attending).length
    const declined = rsvps.filter((r: any) => !r.is_attending).length

    // Build CSV
    const header = `No,Nama,Status,Jumlah,Pesan,Tanggal`
    const rows = rsvps.map((r: any, i: number) => [
      i + 1, r.name, r.is_attending ? 'Hadir' : 'Absen',
      r.is_attending ? r.guest_count : '-', r.message || '-',
      new Date(r.created_at).toLocaleDateString('id-ID')
    ].join(','))

    const summary = `\n\nRingkasan:\nTotal: ${rsvps.length}, Hadir: ${attending}, Absen: ${declined}, Tamu: ${totalGuests} orang`
    const csv = header + '\n' + rows.join('\n') + summary
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `RSVP_${groomName || 'Guests'}_${brideName || 'List'}.csv`
    a.click(); URL.revokeObjectURL(url)
  }

  return (
    <button onClick={handleExport} className="h-8 px-3 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-bold flex items-center gap-1.5 hover:bg-amber-200 transition-all shadow-sm" title="Export RSVP to CSV">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Export CSV
    </button>
  )
}
