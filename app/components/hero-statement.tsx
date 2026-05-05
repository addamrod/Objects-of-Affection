// Figma: section_hero-statement
import type { CSSProperties } from 'react'
import Link from 'next/link'

const DEFAULT_HERO_TEXT =
  'Objects of Affection (OOA) is a creative studio focused on elevating the online product experience. We partner with brands and agencies to create visuals that resonate across every channel.'

// Lookup tables — defined statically so Tailwind never purges these classes
const TEXT_MOBILE: Record<string, string> = {
  h1: 'text-h1', h2: 'text-h2', h3: 'text-h3',
  h4: 'text-h4', h5: 'text-h5', h6: 'text-h6',
}
const TEXT_DESKTOP: Record<string, string> = {
  h1: 'md:text-h1', h2: 'md:text-h2', h3: 'md:text-h3',
  h4: 'md:text-h4', h5: 'md:text-h5', h6: 'md:text-h6',
}
const WIDTH_DESKTOP: Record<string, string> = {
  '25': 'md:w-1/4', '50': 'md:w-1/2', '75': 'md:w-3/4', '100': 'md:w-full',
}

// Converts a spacing token (e.g. 'spacing-m') or '0' to a CSS value
const spacingVar = (token: string) =>
  token === '0' ? '0px' : `var(--${token})`

// Figma: blinking-button (node 2509-1268)
function BlinkingButton({ text, link }: { text: string; link?: string }) {
  const className =
    'group flex items-center gap-[var(--spacing-xs)] px-[var(--spacing-s)] py-[var(--spacing-xs)] rounded-[var(--radius-m)] backdrop-blur-[var(--blur-medium)] bg-[var(--color-secondary-bg)]'

  const inner = (
    <>
      {/* blinking-button_icon — pulsing green dot */}
      <div
        data-component="blinking-button_icon"
        className="size-[10px] rounded-full bg-[#39FF14] shrink-0 [animation:pulse-opacity_500ms_ease-in-out_infinite]"
      />
      <span className="text-lg font-medium leading-none text-[var(--color-primary-elements)] whitespace-nowrap group-hover:underline transition-none">
        {text}
      </span>
    </>
  )

  return link ? (
    <Link href={link} data-component="blinking-button" className={className}>
      {inner}
    </Link>
  ) : (
    <div data-component="blinking-button" className={className}>
      {inner}
    </div>
  )
}

// Figma: section_hero-statement (Desktop + Mobile via responsive classes)
export function SectionHeroStatement({
  heroText         = DEFAULT_HERO_TEXT,
  button,
  desktop,
  mobile,
}: {
  heroText?: string
  button?: { type: string; text?: string; link?: string; gap?: string }
  desktop?: { textSize: string; textWidth: string; paddingTop: string; paddingBottom: string }
  mobile?:  { textSize: string; paddingTop: string; paddingBottom: string }
} = {}) {
  const ptMobile  = spacingVar(mobile?.paddingTop    || 'spacing-3xl')
  const ptDesktop = spacingVar(desktop?.paddingTop   || 'spacing-3xl')
  const pbMobile  = spacingVar(mobile?.paddingBottom  || 'spacing-3xl')
  const pbDesktop = spacingVar(desktop?.paddingBottom || 'spacing-3xl')
  const gap       = spacingVar(button?.gap           || 'spacing-m')

  const textMobile  = TEXT_MOBILE[mobile?.textSize   || 'h5'] ?? 'text-h5'
  const textDesktop = TEXT_DESKTOP[desktop?.textSize || 'h3'] ?? 'md:text-h3'
  const widthClass  = WIDTH_DESKTOP[desktop?.textWidth || '75'] ?? 'md:w-3/4'

  const showBlinkingButton = button?.type === 'blinkingButton'

  return (
    <section
      data-component="section_hero-statement"
      style={{
        '--_pt-mobile':  ptMobile,
        '--_pb-mobile':  pbMobile,
        '--_pt-desktop': ptDesktop,
        '--_pb-desktop': pbDesktop,
        '--_gap':        gap,
      } as CSSProperties}
      className="flex flex-col gap-[var(--_gap)] items-start px-[var(--spacing-s)] md:px-[var(--spacing-m)] pt-[var(--_pt-mobile)] pb-[var(--_pb-mobile)] md:pt-[var(--_pt-desktop)] md:pb-[var(--_pb-desktop)] w-full max-w-[1440px]"
    >
      {/* Figma: container_hero-text */}
      <div
        data-component="container_hero-text"
        className={`flex items-center justify-center w-full ${widthClass}`}
      >
        <p className={`flex-1 ${textMobile} ${textDesktop} font-medium leading-[1.1] text-[var(--color-primary-elements)]`}>
          {heroText}
        </p>
      </div>

      {showBlinkingButton && (
        <BlinkingButton
          text={button?.text || 'Available For New Projects'}
          link={button?.link}
        />
      )}
    </section>
  )
}
