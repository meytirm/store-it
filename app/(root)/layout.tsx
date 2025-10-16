import { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import MobileNavigation from '@/components/MobileNavigation'
import Header from '@/components/Header'

function Layout({ children }: Props) {
  return (
    <main className="flex h-screen">
      <Sidebar />
      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation />
        <Header />
        <div className="main-content">{children}</div>
      </section>
    </main>
  )
}

export default Layout

interface Props {
  children: ReactNode
}
