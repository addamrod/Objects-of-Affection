// Figma: section_hero-statement

const DEFAULT_HERO_TEXT =
  'Objects of Affection (OOA) is a creative studio focused on elevating the online product experience. We partner with brands and agencies to create visuals that resonate across every channel.'

// Figma: container_new-work (node 2509)
function ContainerNewWork() {
  return (
    <div
      data-component="container_new-work"
      className="flex gap-[var(--spacing-s)] items-center shrink-0"
    >
      {/* new-work_details */}
      <div
        data-component="new-work_details"
        className="flex items-center gap-[var(--spacing-xs)] shrink-0"
      >
        {/* new-work_icon — pulsing green availability dot */}
        <div
          data-component="new-work_icon"
          className="size-[10px] rounded-full bg-[#39FF14] shrink-0 [animation:pulse-opacity_500ms_ease-in-out_infinite]"
        />
        <span className="text-lg font-medium leading-none text-[var(--color-primary-elements)] whitespace-nowrap">
          Available For New Projects
        </span>
      </div>

      {/* new-work_button — underlined text link, hover dims to secondary */}
      <div data-component="new-work_button" className="flex items-start shrink-0">
        <span className="text-lg font-medium leading-none underline decoration-solid whitespace-nowrap text-[var(--color-primary-elements)] hover:text-[var(--color-secondary-elements)] transition-colors cursor-pointer">
          Learn More
        </span>
      </div>
    </div>
  )
}

// Figma: section_hero-statement (Desktop + Mobile via responsive classes)
export function SectionHeroStatement({
  heroText = DEFAULT_HERO_TEXT,
  showAvailability = true,
}: {
  heroText?: string
  showAvailability?: boolean
} = {}) {
  return (
    <section
      data-component="section_hero-statement"
      className="flex flex-col gap-[var(--spacing-m)] items-start px-[var(--spacing-s)] md:px-[var(--spacing-m)] py-[var(--spacing-3xl)] w-full max-w-[1440px]"
    >
      {/* Figma: container_hero-text */}
      <div
        data-component="container_hero-text"
        className="flex items-center justify-center w-full md:w-3/4"
      >
        {/*
          Desktop: Headings/H3 Medium — 32px, weight 500, line-height 1.1
          Mobile:  Headings/H5 Medium — 22px, weight 500, line-height 1.1
        */}
        <p className="flex-1 text-h5 md:text-h3 font-medium leading-[1.1] text-[var(--color-primary-elements)]">
          {heroText}
        </p>
      </div>

      {showAvailability && <ContainerNewWork />}
    </section>
  )
}
