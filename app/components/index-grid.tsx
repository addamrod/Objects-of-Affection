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
  imageWidth?: number
  imageHeight?: number
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
  desktop: [3, 4, 5] as const,
  mobile: [1, 2, 3] as const,
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
  const skipEffect = useRef(false)
  const isDragging = useRef(false)

  function snapPositions(): [number, number, number] {
    const w = trackRef.current?.getBoundingClientRect().width ?? 0
    const max = w - 10 // 10px = indicator size
    return [0, max / 2, max]
  }

  // Programmatic corrections (initial mount, isMobile change, resize) — always instant
  useLayoutEffect(() => {
    if (skipEffect.current) {
      skipEffect.current = false
      return
    }
    // Don't override position while user is actively dragging
    if (isDragging.current) return
    animate(x, snapPositions()[activeIndex], { duration: 0 })
  }, [activeIndex, isMobile]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-snap on window resize so indicator stays aligned as track width changes
  useEffect(() => {
    const handleResize = () => animate(x, snapPositions()[activeIndex], { duration: 0 })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleDragEnd() {
    isDragging.current = false
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
      className="flex gap-[var(--spacing-m,30px)] items-center justify-end shrink-0"
    >
      <span className="text-lg leading-none font-medium text-[var(--color-primary-elements)] whitespace-nowrap">
        Size
      </span>
      <div
        data-component="index-grid_size-slider"
        className="flex flex-col items-start shrink-0 w-[144px]"
      >
        <div
          ref={trackRef}
          data-component="index-grid_size-slider-track"
          className="flex h-[10px] items-center justify-center relative shrink-0 w-full"
        >
          <div
            data-component="index-grid_size-line"
            className="bg-[var(--color-primary-elements)] flex-1 h-[var(--stroke-m)] min-w-px"
          />
          <motion.div
            drag="x"
            dragConstraints={trackRef}
            dragElastic={0}
            dragMomentum={false}
            style={{ x }}
            onDragStart={() => { isDragging.current = true }}
            onDragEnd={handleDragEnd}
            data-component="index-grid_size-indicator"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-[var(--color-primary-elements)] size-[10px] rounded-full cursor-grab active:cursor-grabbing touch-none"
          >
            {/* Invisible hit area for easier touch grabbing */}
            <div className="absolute -inset-[20px]" />
          </motion.div>
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
      className="w-full overflow-hidden rounded-[var(--radius-s)] bg-[var(--color-secondary-bg)] relative cursor-pointer"
    >
      {item._type === 'photo' && item.image && (
        <Image
          src={urlFor(item.image).url()}
          alt={item.caption || item.projectName}
          width={item.imageWidth ?? 800}
          height={item.imageHeight ?? 1067}
          sizes="(max-width: 768px) 100vw, 25vw"
          quality={90}
          className="w-full h-auto block"
        />
      )}
      {item._type === 'video' && item.file?.asset?.url && (
        <video
          src={item.file.asset.url}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-auto block"
        />
      )}
      <div
        data-component="index-content_expand"
        className="absolute top-[5px] right-[5px] size-[32.5px] opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {ExpandIcon}
      </div>
    </div>
  )
}

// Figma: index-item_tag (node 2020-91)
function IndexItemTag({
  indexSlug,
}: {
  clientName: string
  projectName: string
  indexSlug: string
}) {
  return (
    <div
      data-component="index-item_tag"
      className="self-start flex items-center p-[var(--spacing-2xs)] rounded-[var(--radius-s)] bg-[var(--color-secondary-bg)] shrink-0"
    >
      <span className="font-mono text-accent-sm text-[var(--color-secondary-elements)] whitespace-nowrap">
        OOA–{indexSlug}
      </span>
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
      href={`/project-index/${item.projectSlug}#${item.indexSlug}`}
      className="group flex flex-col"
    >
      <IndexItemContentContainer item={item} />
      {showTag && <div className="flex-1 min-h-[var(--spacing-xs)]" />}
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
  const [desktopCols, setDesktopCols] = useState<DesktopCols>(3)
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
      className="px-[var(--spacing-s)] md:px-[var(--spacing-m)] py-[var(--spacing-m)] w-full flex flex-col gap-[var(--spacing-m)] overflow-hidden"
    >
      {/* Figma: container_index-grid_size-selector */}
      <div
        data-component="container_index-grid_size-selector"
        className="flex items-start justify-between self-stretch w-full"
      >
        {/* Figma: index-grid_accent-text */}
        <span className="text-lg leading-none font-medium text-[var(--color-primary-elements)] whitespace-nowrap">
          Project Index: {String(items.length).padStart(3, '0')}
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
        className={!hasInteracted ? 'grid grid-cols-1 md:grid-cols-3 gap-x-[15px] md:gap-x-[5px] gap-y-[30px]' : 'grid'}
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
