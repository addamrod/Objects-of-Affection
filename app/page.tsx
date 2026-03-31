import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const query = `*[_type == "project"] | order(_createdAt asc) {
  _id,
  title,
  slug,
  clientName,
  projectName,
  "itemCount": count(content),
  content[] {
    _key,
    _type,
    image,
    caption
  }
}`

type ContentItem = {
  _key: string
  _type: 'photo' | 'video'
  image?: any
  caption?: string
  clientName: string
  projectName: string
  projectSlug: string
  indexSlug: string
}

// Figma: index-tag_details
function IndexTagDetails({ clientName, projectName }: { clientName: string; projectName: string }) {
  return (
    <div data-component="index-tag_details" className="flex items-center gap-[2.5px] shrink-0">
      <span>{clientName}</span>
      <span>–</span>
      <span>{projectName}</span>
    </div>
  )
}

// Figma: index-item_tag
function IndexItemTag({ clientName, projectName, indexSlug }: { clientName: string; projectName: string; indexSlug: string }) {
  return (
    <div
      data-component="index-item_tag"
      className="flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-2xs)] py-[5px] rounded-[var(--radius-s)] bg-[var(--color-secondary-bg)] text-sm leading-none text-[var(--color-secondary-elements)] whitespace-nowrap shrink-0"
    >
      <IndexTagDetails clientName={clientName} projectName={projectName} />
      <span>{indexSlug}</span>
    </div>
  )
}

// Figma: index-item_content-container
function IndexItemContentContainer({ item }: { item: ContentItem }) {
  return (
    <div
      data-component="index-item_content-container"
      className="aspect-[3/4] w-full overflow-hidden rounded-[var(--radius-s)] bg-[var(--color-secondary-bg)] relative cursor-pointer"
    >
      <div data-component="index-item_content" className="absolute inset-0">
        {item._type === 'photo' && item.image && (
          <Image
            src={urlFor(item.image).url()}
            alt={item.caption || item.projectName}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            quality={90}
            className="object-cover"
          />
        )}
      </div>
      <div
        data-component="index-content_expand"
        className="absolute top-[5px] right-[5px] size-[32.5px] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg viewBox="0 0 32.5 32.5" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
          <rect width="32.5" height="32.5" rx="5" fill="black" fillOpacity="0.25"/>
          <path d="M10 13V10H13M20 10H23V13M23 20V23H20M13 23H10V20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

// Figma: index-item
function IndexItem({ item }: { item: ContentItem }) {
  return (
    <Link
      data-component="index-item"
      href={`/projects/${item.projectSlug}#${item.indexSlug}`}
      className="group flex flex-col gap-[var(--spacing-xs)] items-start"
    >
      <IndexItemContentContainer item={item} />
      <IndexItemTag clientName={item.clientName} projectName={item.projectName} indexSlug={item.indexSlug} />
    </Link>
  )
}

// Figma: container_index-grid
function ContainerIndexGrid({ items }: { items: ContentItem[] }) {
  return (
    <div
      data-component="container_index-grid"
      className="grid grid-cols-1 md:grid-cols-4 gap-x-[10px] gap-y-[var(--spacing-m)] w-full"
    >
      {items.map((item) => (
        <IndexItem key={item._key} item={item} />
      ))}
    </div>
  )
}

// Figma: section_index-grid
function SectionIndexGrid({ items }: { items: ContentItem[] }) {
  return (
    <div
      data-component="section_index-grid"
      className="px-[var(--spacing-s)] md:px-[var(--spacing-m)] py-[var(--spacing-m)] w-full"
    >
      <ContainerIndexGrid items={items} />
    </div>
  )
}

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
