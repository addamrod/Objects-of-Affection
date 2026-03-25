import type { Metadata } from 'next'
import Nav from './components/nav'
import PageTransition from './components/page-transition'
import './globals.css'

export const metadata: Metadata = {
  title: 'Objects of Affection',
  description: 'Objects of Affection',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Nav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  )
}
