import { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import MobileNavigation from '@/components/MobileNavigation'
import Header from '@/components/Header'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { Toaster } from '@/components/ui/sonner'

async function Layout({ children }: Props) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return redirect('/sign-in')
  }
  return (
    <main className="flex h-screen">
      <Sidebar {...currentUser} />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation {...currentUser} />
        <Header />
        <div className="main-content">{children}</div>
      </section>

      <Toaster />
    </main>
  )
}

export default Layout

interface Props {
  children: ReactNode
}
