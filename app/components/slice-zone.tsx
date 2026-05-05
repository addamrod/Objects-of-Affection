import type { CSSProperties } from 'react'
import { SectionHeroStatement } from './hero-statement'
import { SectionIndexGrid, type ContentItem } from './index-grid'

// Converts a spacing token (e.g. 'spacing-m') or '0' to a CSS value
const spacingVar = (token: string) =>
  token === '0' ? '0px' : `var(--${token})`

// Slice types — mirror sanity/schemaTypes/slices/*
type HeroStatementSlice = {
  _type: 'slice_heroStatement'
  _key: string
  heroText?: string
  button?: { type: string; text?: string; link?: string; gap?: string }
  desktop?: { textSize: string; textWidth: string; paddingTop: string; paddingBottom: string }
  mobile?:  { textSize: string; paddingTop: string; paddingBottom: string }
}

type IndexGridSlice = {
  _type: 'slice_indexGrid'
  _key: string
}

type DividerSlice = {
  _type: 'slice_divider'
  _key: string
  desktop?: { paddingTop: string; paddingBottom: string }
  mobile?:  { paddingTop: string; paddingBottom: string }
}

export type Slice = HeroStatementSlice | IndexGridSlice | DividerSlice

// Figma: divider (node 2525-725)
function Divider({ desktop, mobile }: {
  desktop?: { paddingTop: string; paddingBottom: string }
  mobile?:  { paddingTop: string; paddingBottom: string }
}) {
  const ptMobile  = spacingVar(mobile?.paddingTop    || '0')
  const ptDesktop = spacingVar(desktop?.paddingTop   || '0')
  const pbMobile  = spacingVar(mobile?.paddingBottom  || '0')
  const pbDesktop = spacingVar(desktop?.paddingBottom || '0')

  return (
    <div
      data-component="divider"
      style={{
        '--_pt-mobile':  ptMobile,
        '--_pb-mobile':  pbMobile,
        '--_pt-desktop': ptDesktop,
        '--_pb-desktop': pbDesktop,
      } as CSSProperties}
      className="flex items-center w-full pt-[var(--_pt-mobile)] pb-[var(--_pb-mobile)] px-[var(--spacing-s)] md:pt-[var(--_pt-desktop)] md:pb-[var(--_pb-desktop)] md:px-[var(--spacing-m)]"
    >
      {/* divider-line — 100% width of container */}
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
                button={slice.button}
                desktop={slice.desktop}
                mobile={slice.mobile}
              />
            )
          case 'slice_indexGrid':
            return <SectionIndexGrid key={slice._key} items={items} />
          case 'slice_divider':
            return (
              <Divider
                key={slice._key}
                desktop={slice.desktop}
                mobile={slice.mobile}
              />
            )
          default:
            return null
        }
      })}
    </>
  )
}
