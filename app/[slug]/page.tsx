import Image from 'next/image'
import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const query = `*[_type == "content"] | order(_createdAt asc) {
  _id,
  title,
  slug,
  image
}`

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const items = await client.fetch(query)
  const currentIndex = items.findIndex((item: any) => item.slug.current === slug)
  const item = items[currentIndex]
  const prev = items[currentIndex - 1] ?? items[items.length - 1]
  const next = items[currentIndex + 1] ?? items[0]

  if (!item) return <div>Not found</div>

  return (
    <main className="fixed inset-0 bg-black flex items-center justify-center">
      <Link href="/" className="absolute top-6 left-6 text-white text-sm z-10">
        ← Index
      </Link>
      {item.image && (
        <Image
          src={urlFor(item.image).width(1800).url()}
          alt={item.title}
          fill
          className="object-contain"
        />
      )}
      <Link
        href={`/${prev.slug.current}`}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl z-10"
      >
        ‹
      </Link>
      <Link
        href={`/${next.slug.current}`}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl z-10"
      >
        ›
      </Link>
    </main>
  )
}
