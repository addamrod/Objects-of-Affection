import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'Default title tag across all pages.',
      validation: (Rule) => Rule.required(),
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
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Browser tab icon. Recommended size: 32 × 32px or 64 × 64px. PNG or ICO.',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
