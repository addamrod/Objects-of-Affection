import { defineField, defineType } from 'sanity'

export const sliceIndexGrid = defineType({
  name: 'slice_indexGrid',
  title: 'Project Index Grid',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Project Index Grid',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare() {
      return { title: 'Project Index Grid' }
    },
  },
})
