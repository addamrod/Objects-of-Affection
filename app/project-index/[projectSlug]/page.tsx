import type { Metadata } from 'next'
import { client } from '@/sanity/lib/client'
import { sanityFetch } from '@/sanity/lib/live'
import { urlFor } from '@/sanity/lib/image'

export const dynamic = 'force-dynamic'

const projectQuery = `*[_type == "project" && slug.current == $projectSlug][0] {
  title,
  clientName,
  projectName,
  seo { title, description, ogImage },
}`

const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  siteDescription,
  ogImage,
}`

export async function generateMetadata({
  params,
}: {
  params: Promise<{ projectSlug: string }>
}): Promise<Metadata> {
  const { projectSlug } = await params

  const [projectData, settings] = await Promise.all([
    client.fetch(projectQuery, { projectSlug }),
    client.fetch(siteSettingsQuery),
  ])

  const title       = projectData?.seo?.title       || projectData?.projectName || projectData?.title || settings?.siteTitle       || 'Objects of Affection'
  const description = projectData?.seo?.description || settings?.siteDescription
  const ogImageUrl  = projectData?.seo?.ogImage
    ? urlFor(projectData.seo.ogImage).width(1200).height(630).url()
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectSlug: string }>
}) {
  const { projectSlug } = await params
  const { data: projectData } = await sanityFetch({ query: projectQuery, params: { projectSlug } })

  return (
    <main className="pt-[59px] md:pt-[72px] flex items-center justify-center min-h-screen">
      <p className="text-[var(--color-tertiary-elements)] text-lg">
        {projectData?.projectName || projectData?.title || projectSlug}
      </p>
    </main>
  )
}
