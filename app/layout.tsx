import type { Metadata, Viewport } from 'next'
import SiteShell from './components/site-shell'
import './globals.css'

export const metadata: Metadata = {
  title: 'Objects of Affection',
  description: 'Objects of Affection',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
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
