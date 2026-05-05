import { defineField, defineType } from 'sanity'

export const sliceDivider = defineType({
  name: 'slice_divider',
  title: 'Divider',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Divider',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare() {
      return { title: 'Divider' }
    },
  },
})
