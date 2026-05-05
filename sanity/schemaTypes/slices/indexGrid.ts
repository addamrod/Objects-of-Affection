import { defineType } from 'sanity'

export const sliceIndexGrid = defineType({
  name: 'slice_indexGrid',
  title: 'Project Index Grid',
  type: 'object',
  fields: [],
  preview: {
    prepare() {
      return { title: 'Project Index Grid' }
    },
  },
})
