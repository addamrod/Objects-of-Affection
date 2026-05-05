import { defineField, defineType } from 'sanity'

const SPACING_OPTIONS = [
  { title: 'None',        value: '0'           },
  { title: '2XS — 5px',  value: 'spacing-2xs' },
  { title: 'XS — 10px',  value: 'spacing-xs'  },
  { title: 'S — 15px',   value: 'spacing-s'   },
  { title: 'M — 30px',   value: 'spacing-m'   },
  { title: 'L — 45px',   value: 'spacing-l'   },
  { title: 'XL — 60px',  value: 'spacing-xl'  },
  { title: '2XL — 90px', value: 'spacing-2xl' },
  { title: '3XL — 120px',value: 'spacing-3xl' },
]

export const sliceDivider = defineType({
  name: 'slice_divider',
  title: 'Divider',
  type: 'object',
  fields: [
    defineField({
      name: 'desktop',
      title: 'Desktop',
      type: 'object',
      fields: [
        defineField({
          name: 'paddingTop',
          title: 'Top Padding',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: '0',
        }),
        defineField({
          name: 'paddingBottom',
          title: 'Bottom Padding',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: '0',
        }),
      ],
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile',
      type: 'object',
      fields: [
        defineField({
          name: 'paddingTop',
          title: 'Top Padding',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: '0',
        }),
        defineField({
          name: 'paddingBottom',
          title: 'Bottom Padding',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: '0',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Divider' }
    },
  },
})
