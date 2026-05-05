import { sanityFetch } from '@/sanity/lib/live'
import { SliceZone, type Slice } from '@/app/components/slice-zone'
import type { ContentItem } from '@/app/components/index-grid'

const pageQuery = `*[_type == "page" && slug.current == "index"][0] {
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

// Fallback layout used until a Page document is created in Sanity
const FALLBACK_SLICES: Slice[] = [
  { _type: 'slice_heroStatement', _key: 'hero-fallback' },
  { _type: 'slice_divider',       _key: 'divider-fallback' },
  { _type: 'slice_indexGrid',     _key: 'grid-fallback' },
]

// Figma: body_main
export default async function BodyMain() {
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
      {/* Figma: wrapper_index — top padding offsets fixed nav */}
      <div data-component="wrapper_index" className="pt-[59px] md:pt-[72px] w-full flex flex-col items-start">
        <SliceZone slices={slices} items={items} />
      </div>
    </main>
  )
}
