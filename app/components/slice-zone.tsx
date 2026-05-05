import { SectionHeroStatement } from './hero-statement'
import { SectionIndexGrid, type ContentItem } from './index-grid'

// Slice types — mirror sanity/schemaTypes/slices/*
type HeroStatementSlice = {
  _type: 'slice_heroStatement'
  _key: string
  heroText?: string
  showAvailability?: boolean
}

type IndexGridSlice = {
  _type: 'slice_indexGrid'
  _key: string
}

type DividerSlice = {
  _type: 'slice_divider'
  _key: string
}

export type Slice = HeroStatementSlice | IndexGridSlice | DividerSlice

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

export function SliceZone({
  slices,
  items,
}: {
  slices: Slice[]
  items: ContentItem[]
}) {
  return (
    <>
      {slices.map((slice) => {
        switch (slice._type) {
          case 'slice_heroStatement':
            return (
              <SectionHeroStatement
                key={slice._key}
                heroText={slice.heroText}
                showAvailability={slice.showAvailability}
              />
            )
          case 'slice_indexGrid':
            return <SectionIndexGrid key={slice._key} items={items} />
          case 'slice_divider':
            return <Divider key={slice._key} />
          default:
            return null
        }
      })}
    </>
  )
}
