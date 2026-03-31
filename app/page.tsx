import { client } from '@/sanity/lib/client'
import { SectionIndexGrid, type ContentItem } from '@/app/components/index-grid'

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

// Figma: wrapper_index
function WrapperIndex({ items }: { items: ContentItem[] }) {
  return (
    <div data-component="wrapper_index" className="pt-[74px] w-full">
      <SectionIndexGrid items={items} />
    </div>
  )
}

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
      <WrapperIndex items={items} />
    </main>
  )
}
