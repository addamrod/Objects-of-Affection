import type { Metadata } from 'next'
import SiteShell from './components/site-shell'
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
