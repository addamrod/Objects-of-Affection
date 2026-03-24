import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'

const query = `*[_type == "content"] | order(_createdAt asc) {
  _id,
  title,
  slug,
  image
}`

export default async function IndexPage() {
  const items = await client.fetch(query)

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-8">Index</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item: any) => (
          <Link key={item._id} href={`/${item.slug.current}`}>
            <div className="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
              {item.image && (
                <Image
                  src={urlFor(item.image).width(600).url()}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
