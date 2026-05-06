import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { sanityFetch } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'
import { SliceZone, type Slice } from '@/app/components/slice-zone'
import type { ContentItem } from '@/app/components/index-grid'

const homepageQuery = `*[_type == "page" && isHomepage == true][0] {
  title,
  seo { title, description, ogImage },
  slices[] {
    _type,
    _key,
    heroText,
    button { type, text, link, gap },
    heroTextWidth,
    desktop { textSize, textWidth, paddingTop, paddingBottom },
    mobile { textSize, paddingTop, paddingBottom },
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
        "lqip": metadata.lqip
      }
    },
    caption,
    file { asset-> { url } }
  }
}`

// Fallback layout until a homepage is set in Sanity
const FALLBACK_SLICES: Slice[] = [
  { _type: 'slice_heroStatement', _key: 'hero-fallback' },
  { _type: 'slice_divider',       _key: 'divider-fallback' },
  { _type: 'slice_indexGrid',     _key: 'grid-fallback' },
]

export async function generateMetadata(): Promise<Metadata> {
  const [pageData, settings] = await Promise.all([
    client.fetch(homepageQuery),
    client.fetch(siteSettingsQuery),
  ])

  const title       = pageData?.seo?.title       || settings?.siteTitle       || 'Objects of Affection'
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

// Figma: body_main
export default async function BodyMain() {
  const [{ data: pageData }, { data: projects }] = await Promise.all([
    sanityFetch({ query: homepageQuery }),
    sanityFetch({ query: projectsQuery }),
  ])

  let globalIndex = 0
  const items: ContentItem[] = (projects ?? []).flatMap((project: any) =>
    (project.content || []).map((item: any, i: number) => ({
      ...item,
      clientName:  project.clientName || '',
      projectName: project.projectName || project.title,
      projectSlug: project.slug?.current,
      indexSlug:    String(++globalIndex).padStart(3, '0'),
      itemIndex:    i + 1,
      blurDataURL:  item.image?.asset?.lqip,
    }))
  )

  const slices: Slice[] = pageData?.slices ?? FALLBACK_SLICES

  return (
    <main data-component="body_main">
      <div data-component="wrapper_index" className="pt-[59px] md:pt-[72px] w-full flex flex-col items-start">
        <SliceZone slices={slices} items={items} />
      </div>
    </main>
  )
}
