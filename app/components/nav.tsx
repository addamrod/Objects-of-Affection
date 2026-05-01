'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type CSSProperties, forwardRef, useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { href: '/studio', label: 'Studio' },
  { href: '/', label: 'Index' },
]

// Figma: menu-link
const MenuLink = forwardRef<
  HTMLAnchorElement,
  { href: string; label: string; active: boolean }
>(({ href, label, active }, ref) => (
  <Link
    ref={ref}
    href={href}
    data-component="menu-link"
    data-state={active ? 'active' : 'inactive'}
    className={[
      'relative z-10 flex items-center justify-center px-[var(--spacing-s)] py-[var(--spacing-xs)] rounded-[var(--radius-m)] text-lg leading-none whitespace-nowrap transition-colors font-medium',
      active
        ? 'text-[var(--color-primary-elements)]'
        : 'text-[var(--color-secondary-elements)] hover:text-[var(--color-primary-elements)]',
    ].join(' ')}
  >
    {label}
  </Link>
))
MenuLink.displayName = 'MenuLink'

// Figma: container_site-menu
function ContainerSiteMenu({ pathname }: { pathname: string }) {
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [indicator, setIndicator] = useState({ x: 0, width: 0, ready: false, visible: false })
  // Snap instantly on first load so the indicator is already in place when the nav fades in
  const isInitialLoad = useRef(true)

  const updateIndicator = (animate: boolean) => {
    const activeIndex = NAV_LINKS.findIndex(({ href }) =>
      href === '/' ? pathname === '/' : pathname.startsWith(href)
    )
    const activeEl = linkRefs.current[activeIndex]
    if (activeEl) {
      setIndicator({ x: activeEl.offsetLeft, width: activeEl.offsetWidth, ready: animate, visible: true })
    } else {
      setIndicator(prev => ({ ...prev, visible: false }))
    }
  }

  // First load: snap instantly. Route changes: animate.
  useEffect(() => {
    const shouldAnimate = !isInitialLoad.current
    isInitialLoad.current = false
    updateIndicator(shouldAnimate)
  }, [pathname])

  // Re-measure silently on resize (no animation)
  useEffect(() => {
    const handleResize = () => updateIndicator(false)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [pathname])

  return (
    <div
      data-component="container_site-menu"
      className="relative flex gap-[var(--spacing-2xs)] items-center rounded-[var(--radius-m)]"
    >
      {/* Figma: nav-indicator */}
      <div
        data-component="nav-indicator"
        className="absolute top-0 bottom-0 rounded-[var(--radius-m)] bg-[var(--color-primary-bg)]"
        style={{
          width: indicator.width,
          transform: `translateX(${indicator.x}px)`,
          opacity: indicator.visible ? 1 : 0,
          transition: indicator.ready
            ? 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease'
            : 'opacity 0.2s ease',
        }}
      />

      {NAV_LINKS.map(({ href, label }, i) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <MenuLink
            key={href}
            ref={el => { linkRefs.current[i] = el }}
            href={href}
            label={label}
            active={active}
          />
        )
      })}
    </div>
  )
}

// Figma: container_site-title
function ContainerSiteTitle() {
  return (
    <Link
      href="/"
      data-component="container_site-title"
      className="flex items-center justify-center px-[var(--spacing-s)] py-[var(--spacing-xs)] rounded-[var(--radius-m)]"
    >
      <span className="text-lg font-bold leading-none text-[var(--color-primary-elements)] whitespace-nowrap">
        OBJECTS OF AFFECTION
      </span>
    </Link>
  )
}

// True on every hard refresh (module re-evaluates). Stays false across route changes.
let isFirstNavLoad = true

// Figma: wrapper_top-navigation
export default function Nav() {
  const pathname = usePathname()
  const [navStyle, setNavStyle] = useState<CSSProperties>({ opacity: 0 })

  // On hard refresh: fade in after the same delay as page-transition (100ms)
  // On route changes: Nav never unmounts so this effect never re-runs — stays visible
  useEffect(() => {
    if (!isFirstNavLoad) return
    isFirstNavLoad = false
    const timer = setTimeout(() => {
      setNavStyle({ opacity: 1, transition: 'opacity 0.3s ease-in-out' })
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <header
      data-component="wrapper_top-navigation"
      style={navStyle}
      className="fixed top-0 left-0 right-0 z-50 flex pointer-events-none px-[var(--spacing-s)] md:px-[var(--spacing-m)] pt-[var(--spacing-m)]"
    >
      {/*
        Mobile:  flex-1 (full-width), justify-between (title left, menu right)
        Desktop: flex-none (content-sized, centered), gap-l (title + menu side by side)
      */}
      <div
        data-component="section_navigation"
        className="flex-1 md:flex-none flex items-center justify-between md:justify-start md:gap-[var(--spacing-l)] p-[var(--spacing-2xs)] rounded-[var(--radius-m)] backdrop-blur-[var(--blur-medium)] bg-[var(--color-transparent-bg)] pointer-events-auto overflow-hidden"
      >
        <ContainerSiteTitle />
        <ContainerSiteMenu pathname={pathname} />
      </div>
    </header>
  )
}
