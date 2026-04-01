'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { urlFor } from '@/sanity/lib/image'

// motion-enhanced Link for layout animations
const MotionLink = motion(Link)

export type ContentItem = {
  _key: string
  _type: 'photo' | 'video'
  image?: any
  file?: { asset?: { url?: string } }
  caption?: string
  clientName: string
  projectName: string
  projectSlug: string
  indexSlug: string
}

type DesktopCols = 3 | 4 | 5
type MobileCols = 1 | 2 | 3

const COLUMN_OPTIONS = {
  desktop: [5, 4, 3] as const,
  mobile: [3, 2, 1] as const,
}

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]

const ExpandIcon = (
  <svg viewBox="0 0 32.5 32.5" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
    <rect width="32.5" height="32.5" rx="5" fill="black" fillOpacity="0.25" />
    <path
      d="M10 13V10H13M20 10H23V13M23 20V23H20M13 23H10V20"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Figma: index-grid_size-selector
function IndexGridSizeSelector({
  isMobile,
  desktopCols,
  mobileCols,
  onChange,
}: {
  isMobile: boolean
  desktopCols: DesktopCols
  mobileCols: MobileCols
  onChange: (cols: DesktopCols | MobileCols) => void
}) {
  const colValues = isMobile ? COLUMN_OPTIONS.mobile : COLUMN_OPTIONS.desktop
  const activeCols = isMobile ? mobileCols : desktopCols
  const activeIndex = colValues.indexOf(activeCols as never)

  const trackRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  // Prevents useLayoutEffect from double-animating after a user-initiated interaction
  const skipEffect = useRef(false)

  function snapPositions(): [number, number, number] {
    // getBoundingClientRect gives sub-pixel precision; offsetWidth rounds to integer
    const w = trackRef.current?.getBoundingClientRect().width ?? 0
    const max = w - 15 // 15px = indicator size
    return [0, max / 2, max]
  }

  // Programmatic corrections (initial mount, isMobile change, resize) — always instant
  useLayoutEffect(() => {
    if (skipEffect.current) {
      skipEffect.current = false
      return
    }
    animate(x, snapPositions()[activeIndex], { duration: 0 })
  }, [activeIndex, isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-snap on window resize so indicator stays aligned as track width changes
  useEffect(() => {
    const handleResize = () => animate(x, snapPositions()[activeIndex], { duration: 0 })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleDragEnd() {
    const positions = snapPositions()
    const current = x.get()
    const nearestIndex = positions.reduce((best, pos, i) =>
      Math.abs(current - pos) < Math.abs(current - positions[best]) ? i : best
    , 0)
    animate(x, positions[nearestIndex], { duration: 0.2, ease: EASE })
    skipEffect.current = true
    onChange(colValues[nearestIndex])
  }

  return (
    <div
      data-component="index-grid_size-selector"
      className="flex gap-[var(--spacing-m,30px)] items-start justify-end shrink-0"
    >
      <span className="text-md md:text-lg leading-none font-medium text-[var(--color-primary-elements)] whitespace-nowrap">
        Size
      </span>
      <div
        data-component="index-grid_size-slider"
        className="flex flex-col gap-[var(--spacing-xs)] items-start shrink-0"
      >
        <div
          data-component="index-grid_size-labels"
          className="flex gap-[var(--spacing-l,45px)] items-center justify-center text-md md:text-lg text-center whitespace-nowrap leading-none font-medium"
        >
          {colValues.map((cols, i) => (
            <button
              key={cols}
              onClick={() => {
                // Animate the indicator smoothly on user button clicks
                animate(x, snapPositions()[i], { duration: 0.25, ease: EASE })
                skipEffect.current = true
                onChange(cols)
              }}
              className={`shrink-0 leading-none transition-colors md:cursor-pointer ${
                i === activeIndex
                  ? 'text-[var(--color-primary-elements)]'
                  : 'text-[var(--color-tertiary-elements)] md:hover:text-[var(--color-secondary-elements)]'
              }`}
            >
              {String(cols).padStart(2, '0')}
            </button>
          ))}
        </div>
        <div
          ref={trackRef}
          data-component="index-grid_size-slider-track"
          className="flex h-[15px] items-center justify-center relative shrink-0 w-full"
        >
          <div
            data-component="index-grid_size-line"
            className="bg-[var(--color-tertiary-elements)] flex-1 h-[1.5px] min-h-px min-w-px rounded-[var(--radius-xs,2.5px)]"
          />
          <motion.div
            drag="x"
            dragConstraints={trackRef}
            dragElastic={0}
            dragMomentum={false}
            style={{ x }}
            onDragEnd={handleDragEnd}
            data-component="index-grid_size-indicator"
            className="absolute left-0 top-0 bg-[var(--color-tertiary-elements)] size-[15px] rounded-[var(--radius-s)] cursor-grab active:cursor-grabbing"
          />
        </div>
      </div>
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
        {item._type === 'video' && item.file?.asset?.url && (
          <video
            src={item.file.asset.url}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>
      <div
        data-component="index-content_expand"
        className="absolute top-[5px] right-[5px] size-[32.5px] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {ExpandIcon}
      </div>
    </div>
  )
}

// Figma: index-item_tag
// Tag visibility rules:
//   Desktop (any cols) or mobile 1-col → full "Client – Project  #" at 12px
//   Mobile 2–3 cols → hidden
function IndexItemTag({
  clientName,
  projectName,
  indexSlug,
}: {
  clientName: string
  projectName: string
  indexSlug: string
}) {
  return (
    <div
      data-component="index-item_tag"
      className="flex items-center gap-[var(--spacing-s,15px)] p-[var(--spacing-2xs)] rounded-[var(--radius-s)] bg-[var(--color-secondary-bg)] whitespace-nowrap shrink-0 leading-none text-[12px]"
    >
      <div
        data-component="index-tag_details"
        className="flex items-center gap-[var(--spacing-2xs,5px)] shrink-0"
      >
        <span className="font-medium text-[var(--color-secondary-elements)]">{clientName}</span>
        <span className="text-[var(--color-tertiary-elements)]">{projectName}</span>
      </div>
      <span className="text-[var(--color-tertiary-elements)]">{indexSlug}</span>
    </div>
  )
}

// Figma: index-item
function IndexItem({ item, showTag }: { item: ContentItem; showTag: boolean }) {
  return (
    <MotionLink
      layout
      transition={{ layout: { duration: 0.4, ease: EASE } }}
      data-component="index-item"
      href={`/projects/${item.projectSlug}#${item.indexSlug}`}
      className="group flex flex-col gap-[var(--spacing-xs)] items-start"
    >
      <IndexItemContentContainer item={item} />
      {showTag && (
        <IndexItemTag
          clientName={item.clientName}
          projectName={item.projectName}
          indexSlug={item.indexSlug}
        />
      )}
    </MotionLink>
  )
}

// Figma: section_index-grid
export function SectionIndexGrid({ items }: { items: ContentItem[] }) {
  const [isMobile, setIsMobile] = useState(false)
  const [desktopCols, setDesktopCols] = useState<DesktopCols>(5)
  const [mobileCols, setMobileCols] = useState<MobileCols>(1)
  // Until the user interacts, the grid is CSS-driven (always correct from first paint).
  // After interaction, JS takes over with inline styles.
  const [hasInteracted, setHasInteracted] = useState(false)

  // useLayoutEffect fires synchronously after hydration, before paint — no mismatch, no flash
  useLayoutEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const activeCols = isMobile ? mobileCols : desktopCols
  const showTag = !isMobile || mobileCols === 1

  const gapX = isMobile && mobileCols === 1 ? '15px' : '5px'
  const gapY = isMobile && mobileCols > 1 ? '5px' : '30px'

  function handleChange(cols: DesktopCols | MobileCols) {
    setHasInteracted(true)
    if (isMobile) setMobileCols(cols as MobileCols)
    else setDesktopCols(cols as DesktopCols)
  }

  return (
    <div
      data-component="section_index-grid"
      className="px-[var(--spacing-s)] md:px-[var(--spacing-m)] py-[var(--spacing-m)] w-full flex flex-col gap-[var(--spacing-s)] md:gap-[var(--spacing-m)]"
    >
      {/* Figma: container_index-grid_size-selector */}
      <div
        data-component="container_index-grid_size-selector"
        className="flex items-start justify-between self-stretch w-full"
      >
        {/* Figma: index-grid_accent-text */}
        <span className="text-md md:text-lg leading-none font-medium text-[var(--color-primary-elements)] whitespace-nowrap">
          Project Index
        </span>
        <IndexGridSizeSelector
          isMobile={isMobile}
          desktopCols={desktopCols}
          mobileCols={mobileCols}
          onChange={handleChange}
        />
      </div>

      {/* Figma: container_index-grid */}
      {/*
        Before interaction: CSS handles columns + gaps — always correct from first paint,
        no dependency on isMobile JS state (default: 1-col mobile, 5-col desktop).
        After interaction: inline style takes over with the user's chosen columns.
      */}
      <div
        data-component="container_index-grid"
        className={!hasInteracted ? 'grid grid-cols-1 md:grid-cols-5 gap-x-[15px] md:gap-x-[5px] gap-y-[30px]' : 'grid'}
        style={hasInteracted ? {
          gridTemplateColumns: `repeat(${activeCols}, minmax(0, 1fr))`,
          columnGap: gapX,
          rowGap: gapY,
        } : undefined}
      >
        {items.map((item) => (
          <IndexItem key={item._key} item={item} showTag={showTag} />
        ))}
      </div>
    </div>
  )
}
