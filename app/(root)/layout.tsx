import { ReactNode } from 'react'

function Layout({ children }: Props) {
  return (
    <main className="flex h-screen">
      Sidebar
      <section className="flex h-full flex-1 flex-col">
        MobileNavigation Header
        <div className="main-content">{children}</div>
      </section>
    </main>
  )
}

export default Layout

interface Props {
  children: ReactNode
}
