import type { Metadata, Viewport } from 'next'
import { client } from '@/sanity/lib/client'
import { SanityLive } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'
import SiteShell from './components/site-shell'
import './globals.css'

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  siteDescription,
  ogImage,
  favicon { asset-> { url } },
}`

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await client.fetch(siteSettingsQuery)

  if (!s) {
    return {
      title: 'Objects of Affection',
      description: 'Objects of Affection',
    }
  }

  const ogImageUrl = s.ogImage
    ? urlFor(s.ogImage).width(1200).height(630).url()
    : undefined

  return {
    title: s.siteTitle ?? 'Objects of Affection',
    description: s.siteDescription,
    ...(s.favicon?.asset?.url && { icons: { icon: s.favicon.asset.url } }),
    openGraph: {
      title: s.siteTitle,
      description: s.siteDescription,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: s.siteTitle,
      description: s.siteDescription,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <SiteShell>{children}</SiteShell>
        <SanityLive />
      </body>
    </html>
  )
}
