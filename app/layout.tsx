import type { Metadata, Viewport } from 'next'
import { client } from '@/sanity/lib/client'
import { SanityLive } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'
import SiteShell from './components/site-shell'
import './globals.css'

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  titleTemplate,
  siteDescription,
  ogImage,
  keywords,
  organizationName,
  siteUrl,
  logo,
  socialLinks,
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
    title: {
      default: s.siteTitle ?? 'Objects of Affection',
      template: s.titleTemplate ?? `%s | ${s.siteTitle ?? 'Objects of Affection'}`,
    },
    description: s.siteDescription,
    keywords: s.keywords,
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
  const s = await client.fetch(siteSettingsQuery)

  const jsonLd = s
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: s.organizationName ?? s.siteTitle,
        url: s.siteUrl,
        description: s.siteDescription,
        ...(s.logo && { logo: urlFor(s.logo).url() }),
        ...(s.socialLinks?.length && { sameAs: s.socialLinks }),
      }
    : null

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        <SiteShell>{children}</SiteShell>
        <SanityLive />
      </body>
    </html>
  )
}
