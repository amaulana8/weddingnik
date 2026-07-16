import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import CmdK from '@/components/CmdK'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 px-5 py-6 lg:px-8 lg:py-8 max-w-5xl overflow-x-hidden pb-20 lg:pb-0">
        {children}
      </main>
      <MobileNav />
      <CmdK />
    </div>
  )
}
