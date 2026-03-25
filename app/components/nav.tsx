'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef, useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { href: '/projects', label: 'Projects' },
  { href: '/studio', label: 'Studio' },
  { href: '/', label: 'Index' },
]

const MAIN_PATHS = ['/', '/studio', '/projects']

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
      'relative z-10 flex items-center justify-center px-[var(--spacing-s)] py-[var(--spacing-xs)] rounded-[var(--radius-m)] text-lg font-normal leading-none whitespace-nowrap transition-colors',
      active
        ? 'text-[var(--color-primary-elements)]'
        : 'text-[var(--color-tertiary-elements)] hover:text-[var(--color-secondary-elements)]',
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

  // Animate on pathname change
  useEffect(() => {
    updateIndicator(true)
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
        className="absolute top-0 bottom-0 rounded-[var(--radius-m)] bg-[var(--color-transparent-hover-bg)]"
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
      className="flex items-center justify-center px-[var(--spacing-s)] py-[var(--spacing-xs)] rounded-[var(--radius-m)] transition-colors hover:bg-[var(--color-transparent-hover-bg)]"
    >
      <span className="text-lg font-bold leading-none text-[var(--color-primary-elements)] whitespace-nowrap">
        OBJECTS OF AFFECTION
      </span>
    </Link>
  )
}

// Figma: wrapper_top-navigation
function WrapperTopNavigation({ viewport }: { viewport: 'desktop' | 'mobile' }) {
  const pathname = usePathname()

  return (
    <header
      data-component="wrapper_top-navigation"
      data-viewport={viewport}
      className={[
        'fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none',
        viewport === 'desktop'
          ? 'hidden md:flex px-[var(--spacing-m)] pt-[var(--spacing-m)]'
          : 'flex md:hidden px-[var(--spacing-s)] pt-[var(--spacing-m)]',
      ].join(' ')}
    >
      <div
        data-component="section_navigation"
        className="flex items-center p-[var(--spacing-2xs)] rounded-[var(--radius-m)] backdrop-blur-[var(--blur-medium)] bg-[var(--color-transparent-bg)] pointer-events-auto"
      >
        <div className={[
          'flex items-center overflow-hidden rounded-[inherit]',
          viewport === 'desktop' ? 'gap-[var(--spacing-l)]' : '',
        ].join(' ')}>
          <ContainerSiteTitle />
          {viewport === 'desktop' && <ContainerSiteMenu pathname={pathname} />}
        </div>
      </div>
    </header>
  )
}

// Figma: wrapper_bottom-navigation
function WrapperBottomNavigation() {
  const pathname = usePathname()
  const isMainPage = MAIN_PATHS.includes(pathname)

  return (
    <nav
      data-component="wrapper_bottom-navigation"
      data-viewport="mobile"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex justify-center px-[var(--spacing-s)] pb-[var(--spacing-m)] pointer-events-none"
    >
      <div
        data-component="section_navigation"
        className="flex items-center p-[var(--spacing-2xs)] rounded-[var(--radius-m)] backdrop-blur-[var(--blur-medium)] bg-[var(--color-transparent-bg)] pointer-events-auto"
      >
        {isMainPage ? (
          <ContainerSiteMenu pathname={pathname} />
        ) : (
          <Link
            data-component="container_site-menu-trigger"
            data-action="back"
            href="/"
            className="flex items-center justify-center px-[var(--spacing-s)] py-[var(--spacing-xs)] rounded-[var(--radius-m)] text-lg font-normal leading-none text-[var(--color-primary-elements)] whitespace-nowrap"
          >
            ← Back
          </Link>
        )}
      </div>
    </nav>
  )
}

export default function Nav() {
  return (
    <>
      <WrapperTopNavigation viewport="desktop" />
      <WrapperTopNavigation viewport="mobile" />
      <WrapperBottomNavigation />
    </>
  )
}
