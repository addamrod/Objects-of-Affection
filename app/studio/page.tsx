import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const studioSeoQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  siteDescription,
  ogImage,
  "studio": studioSeo {
    title,
    description,
    ogImage,
  }
}`

export async function generateMetadata(): Promise<Metadata> {
  const s = await client.fetch(studioSeoQuery)

  const title = s?.studio?.title || 'Studio'
  const description = s?.studio?.description || s?.siteDescription
  const ogImageUrl = s?.studio?.ogImage
    ? urlFor(s.studio.ogImage).width(1200).height(630).url()
    : s?.ogImage
      ? urlFor(s.ogImage).width(1200).height(630).url()
      : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImageUrl && { images: [{ url: ogImageUrl, width: 1200, height: 630 }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
  }
}

export default function StudioPage() {
  return (
    <main>
    </main>
  )
}
