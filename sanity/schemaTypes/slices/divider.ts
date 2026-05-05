import { defineType } from 'sanity'

export const sliceDivider = defineType({
  name: 'slice_divider',
  title: 'Divider',
  type: 'object',
  fields: [],
  preview: {
    prepare() {
      return { title: 'Divider' }
    },
  },
})
