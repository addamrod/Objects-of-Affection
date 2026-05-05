import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { sanityFetch } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'
import { SliceZone, type Slice } from '@/app/components/slice-zone'
import type { ContentItem } from '@/app/components/index-grid'

const pageQuery = `*[_type == "page" && slug.current == $slug][0] {
  title,
  seo { title, description, ogImage },
  slices[] {
    _type,
    _key,
    heroText,
    showAvailability,
  }
}`

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  siteDescription,
  ogImage,
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
          dimensions { width, height }
        }
      }
    },
    caption,
    file { asset-> { url } }
  }
}`

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params

  const [pageData, settings] = await Promise.all([
    client.fetch(pageQuery, { slug }),
    client.fetch(siteSettingsQuery),
  ])

  const title       = pageData?.seo?.title       || pageData?.title || settings?.siteTitle       || 'Objects of Affection'
  const description = pageData?.seo?.description || settings?.siteDescription
  const ogImageUrl  = pageData?.seo?.ogImage
    ? urlFor(pageData.seo.ogImage).width(1200).height(630).url()
    : settings?.ogImage
      ? urlFor(settings.ogImage).width(1200).height(630).url()
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

export default async function SlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [{ data: pageData }, { data: projects }] = await Promise.all([
    sanityFetch({ query: pageQuery, params: { slug } }),
    sanityFetch({ query: projectsQuery }),
  ])

  if (!pageData) {
    return (
      <main className="pt-[59px] md:pt-[72px] flex items-center justify-center min-h-screen">
        <p className="text-[var(--color-tertiary-elements)] text-lg">Page not found.</p>
      </main>
    )
  }

  const items: ContentItem[] = (projects ?? []).flatMap((project: any) =>
    (project.content || []).map((item: any, i: number) => ({
      ...item,
      imageWidth:  item.image?.asset?.metadata?.dimensions?.width,
      imageHeight: item.image?.asset?.metadata?.dimensions?.height,
      clientName:  project.clientName || '',
      projectName: project.projectName || project.title,
      projectSlug: project.slug?.current,
      indexSlug:   String(i + 1).padStart(2, '0'),
    }))
  )

  const slices: Slice[] = pageData.slices ?? []

  return (
    <main data-component="body_main">
      <div data-component="wrapper_page" className="pt-[59px] md:pt-[72px] w-full flex flex-col items-start">
        <SliceZone slices={slices} items={items} />
      </div>
    </main>
  )
}
