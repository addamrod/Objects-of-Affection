'use client'

import { usePathname } from 'next/navigation'
import Nav from './nav'
import PageTransition from './page-transition'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Nav />}
      <PageTransition>{children}</PageTransition>
    </>
  )
}
