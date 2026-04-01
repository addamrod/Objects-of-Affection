// Figma: section_hero-statement

const HERO_TEXT =
  'Objects of Affection (OOA) is a creative studio focused on elevating the online product experience. We partner with brands and agencies to create visuals that resonate across every channel.'

// Figma: container_new-work
function ContainerNewWork() {
  return (
    <div
      data-component="container_new-work"
      className="flex items-center gap-[var(--spacing-m)] pl-[var(--spacing-s)] pr-[var(--spacing-2xs)] py-[var(--spacing-2xs)] rounded-[var(--radius-m)] bg-[var(--color-cloud-white)] backdrop-blur-[var(--blur-medium)] shrink-0 overflow-hidden"
    >
      {/* new-work_details */}
      <div className="flex items-center gap-[var(--spacing-xs)] shrink-0">
        {/* new-work_icon — pulsing green availability dot */}
        <div
          data-component="new-work_icon"
          className="size-[10px] rounded-full bg-[#39FF14] shrink-0 [animation:pulse-opacity_500ms_ease-in-out_infinite]"
        />
        <span className="text-md md:text-lg font-medium leading-none text-[var(--color-primary-elements)] whitespace-nowrap">
          Available For New Projects
        </span>
      </div>

      {/* new-work_button — desktop hover: medium-grey bg */}
      <div className="group flex items-center justify-center px-[var(--spacing-s)] py-[var(--spacing-xs)] rounded-[var(--radius-m)] bg-[var(--color-medium-grey)] md:bg-[var(--color-light-grey)] md:hover:bg-[var(--color-medium-grey)] transition-colors cursor-pointer">
        <span className="text-md md:text-lg font-medium md:font-normal md:group-hover:font-medium leading-none text-[var(--color-primary-elements)] whitespace-nowrap">
          Learn More
        </span>
      </div>
    </div>
  )
}

// Figma: section_hero-statement (Desktop + Mobile via responsive classes)
export function SectionHeroStatement() {
  return (
    <section
      data-component="section_hero-statement"
      className="flex flex-col gap-[var(--spacing-xl)] items-start px-[var(--spacing-s)] md:px-[var(--spacing-m)] py-[var(--spacing-3xl)] w-full max-w-[1440px] mx-auto"
    >
      {/* Figma: container_hero-text */}
      <div
        data-component="container_hero-text"
        className="flex items-center justify-center w-full"
      >
        {/*
          Desktop: Headings/H1 Medium — 48px, weight 500, line-height 1.1
          Mobile:  Headings/H5 Medium — 22px, weight 500, line-height 1.1
        */}
        <p className="flex-1 text-h5 md:text-h1 font-medium leading-[1.1] text-[var(--color-primary-elements)]">
          {HERO_TEXT}
        </p>
      </div>

      <ContainerNewWork />
    </section>
  )
}
