import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { sanityFetch } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'
import { SliceZone, type Slice } from '@/app/components/slice-zone'
import type { ContentItem } from '@/app/components/index-grid'

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

const pageQuery = `*[_type == "page" && slug.current == "studio"][0] {
  slices[] {
    _type,
    _key,
    heroText,
    showAvailability,
  }
}`

const projectsQuery = `*[_type == "project"] | order(_createdAt asc) {
  _id,
  title,
  slug,
  clientName,
  projectName,
  content[] {
    _key,
    _type,
    image {
      ...,
      asset-> {
        _id,
        metadata {
          dimensions {
            width,
            height
          }
        }
      }
    },
    caption,
    file {
      asset-> {
        url
      }
    }
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

// Fallback layout used until a Studio page document is created in Sanity
const FALLBACK_SLICES: Slice[] = []

export default async function StudioPage() {
  const [{ data: pageData }, { data: projects }] = await Promise.all([
    sanityFetch({ query: pageQuery }),
    sanityFetch({ query: projectsQuery }),
  ])

  const items: ContentItem[] = (projects ?? []).flatMap((project: any) =>
    (project.content || []).map((item: any, i: number) => ({
      ...item,
      imageWidth: item.image?.asset?.metadata?.dimensions?.width,
      imageHeight: item.image?.asset?.metadata?.dimensions?.height,
      clientName: project.clientName || '',
      projectName: project.projectName || project.title,
      projectSlug: project.slug?.current,
      indexSlug: String(i + 1).padStart(2, '0'),
    }))
  )

  const slices: Slice[] = pageData?.slices ?? FALLBACK_SLICES

  return (
    <main data-component="body_main">
      <div data-component="wrapper_studio" className="pt-[59px] md:pt-[72px] w-full flex flex-col items-start">
        <SliceZone slices={slices} items={items} />
      </div>
    </main>
  )
}
