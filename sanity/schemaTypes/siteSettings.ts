import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // ── SEO ──────────────────────────────────────────────────────────────
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Default <title> tag across all pages.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'titleTemplate',
      title: 'Title Template',
      type: 'string',
      description: 'Template for inner page titles. Use %s for the page name — e.g. "%s | Objects of Affection".',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      description: 'Default meta description (160 characters max).',
      validation: (Rule) => Rule.required().max(160),
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      description: 'Default social sharing image. Recommended size: 1200 × 630px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),

    // ── Pages ─────────────────────────────────────────────────────────────
    defineField({
      name: 'studioSeo',
      title: 'Studio Page',
      type: 'object',
      description: 'SEO overrides for the /studio page. Falls back to global defaults if left empty.',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, validation: (Rule) => Rule.max(160) }),
        defineField({ name: 'ogImage', title: 'OG Image', type: 'image', options: { hotspot: true } }),
      ],
    }),

    // ── AEO / Structured Data ─────────────────────────────────────────────
    defineField({
      name: 'organizationName',
      title: 'Organization Name',
      type: 'string',
      description: 'Used in schema.org Organization structured data.',
    }),
    defineField({
      name: 'siteUrl',
      title: 'Site URL',
      type: 'url',
      description: 'Canonical URL of the site — e.g. https://objectsofaffection.com.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Used in schema.org Organization structured data.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{ type: 'url' }],
      description: 'Social profile URLs (Instagram, LinkedIn, etc.) used in schema.org sameAs.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
