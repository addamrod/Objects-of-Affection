import { client } from '@/sanity/lib/client'
import { SectionIndexGrid, type ContentItem } from '@/app/components/index-grid'
import { SectionHeroStatement } from '@/app/components/hero-statement'

// Figma: divider
function Divider() {
  return (
    <div
      data-component="divider"
      className="flex items-center justify-center px-[var(--spacing-s)] md:px-[var(--spacing-m)] w-full"
    >
      <div className="flex-1 h-[var(--stroke-m)] bg-[var(--color-light-grey)]" />
    </div>
  )
}

const query = `*[_type == "project"] | order(_createdAt asc) {
  _id,
  title,
  slug,
  clientName,
  projectName,
  content[] {
    _key,
    _type,
    image,
    caption,
    file {
      asset-> {
        url
      }
    }
  }
}`

// Figma: body_main
export default async function BodyMain() {
  const projects = await client.fetch(query)

  const items: ContentItem[] = projects.flatMap((project: any) =>
    (project.content || []).map((item: any, i: number) => ({
      ...item,
      clientName: project.clientName || '',
      projectName: project.projectName || project.title,
      projectSlug: project.slug?.current,
      indexSlug: String(i + 1).padStart(2, '0'),
    }))
  )

  return (
    <main data-component="body_main">
      {/* Figma: wrapper_index — top padding offsets fixed nav */}
      <div data-component="wrapper_index" className="pt-[59px] md:pt-[72px] w-full">
        <SectionHeroStatement />
        <Divider />
        <SectionIndexGrid items={items} />
      </div>
    </main>
  )
}
