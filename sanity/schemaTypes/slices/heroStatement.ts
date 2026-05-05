import { defineField, defineType } from 'sanity'

export const sliceHeroStatement = defineType({
  name: 'slice_heroStatement',
  title: 'Hero Statement',
  type: 'object',
  fields: [
    defineField({
      name: 'heroText',
      title: 'Hero Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'showAvailability',
      title: 'Show Availability Badge',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { subtitle: 'heroText' },
    prepare({ subtitle }) {
      return { title: 'Hero Statement', subtitle }
    },
  },
})
