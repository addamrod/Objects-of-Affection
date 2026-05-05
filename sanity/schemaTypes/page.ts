import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isHomepage',
      title: 'Set as Homepage',
      type: 'boolean',
      description: 'Only one page should be set as the homepage at a time.',
      initialValue: false,
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      description: 'Overrides site-wide settings. Leave blank to inherit from Site Settings.',
      fields: [
        defineField({
          name: 'title',
          title: 'Page Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
        }),
      ],
    }),
    defineField({
      name: 'slices',
      title: 'Slices',
      type: 'array',
      of: [
        { type: 'slice_heroStatement' },
        { type: 'slice_indexGrid' },
        { type: 'slice_divider' },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current', isHomepage: 'isHomepage' },
    prepare({ title, subtitle, isHomepage }) {
      return {
        title: isHomepage ? `🏠 ${title}` : title,
        subtitle: `/${subtitle}`,
      }
    },
  },
})
