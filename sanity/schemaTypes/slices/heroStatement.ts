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

const TEXT_SIZE_OPTIONS_DESKTOP = [
  { title: 'H1 — 48px', value: 'h1' },
  { title: 'H2 — 40px', value: 'h2' },
  { title: 'H3 — 32px', value: 'h3' },
  { title: 'H4 — 26px', value: 'h4' },
  { title: 'H5 — 22px', value: 'h5' },
  { title: 'H6 — 18px', value: 'h6' },
]

const TEXT_SIZE_OPTIONS_MOBILE = [
  { title: 'H1 — 48px', value: 'h1' },
  { title: 'H2 — 40px', value: 'h2' },
  { title: 'H3 — 32px', value: 'h3' },
  { title: 'H4 — 26px', value: 'h4' },
  { title: 'H5 — 22px', value: 'h5' },
  { title: 'H6 — 18px', value: 'h6' },
]

const WIDTH_OPTIONS = [
  { title: '25%',  value: '25'  },
  { title: '50%',  value: '50'  },
  { title: '75%',  value: '75'  },
  { title: '100%', value: '100' },
]

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
      name: 'button',
      title: 'Button',
      type: 'object',
      fields: [
        defineField({
          name: 'type',
          title: 'Type',
          type: 'string',
          options: {
            list: [
              { title: 'None',            value: 'none'           },
              { title: 'Blinking Button', value: 'blinkingButton' },
            ],
          },
          initialValue: 'none',
        }),
        defineField({
          name: 'gap',
          title: 'Space Between Text and Button',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: 'spacing-m',
          hidden: ({ parent }) => parent?.type !== 'blinkingButton',
        }),
        defineField({
          name: 'text',
          title: 'Button Text',
          type: 'string',
          hidden: ({ parent }) => parent?.type !== 'blinkingButton',
        }),
        defineField({
          name: 'link',
          title: 'Button Link',
          type: 'url',
          hidden: ({ parent }) => parent?.type !== 'blinkingButton',
        }),
      ],
    }),
    defineField({
      name: 'desktop',
      title: 'Desktop',
      type: 'object',
      fields: [
        defineField({
          name: 'textSize',
          title: 'Text Size',
          type: 'string',
          options: { list: TEXT_SIZE_OPTIONS_DESKTOP },
          initialValue: 'h3',
        }),
        defineField({
          name: 'textWidth',
          title: 'Text Width',
          type: 'string',
          options: { list: WIDTH_OPTIONS },
          initialValue: '75',
        }),
        defineField({
          name: 'paddingTop',
          title: 'Top Padding',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: 'spacing-3xl',
        }),
        defineField({
          name: 'paddingBottom',
          title: 'Bottom Padding',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: 'spacing-3xl',
        }),
      ],
    }),
    defineField({
      name: 'mobile',
      title: 'Mobile',
      type: 'object',
      fields: [
        defineField({
          name: 'textSize',
          title: 'Text Size',
          type: 'string',
          options: { list: TEXT_SIZE_OPTIONS_MOBILE },
          initialValue: 'h5',
        }),
        defineField({
          name: 'paddingTop',
          title: 'Top Padding',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: 'spacing-3xl',
        }),
        defineField({
          name: 'paddingBottom',
          title: 'Bottom Padding',
          type: 'string',
          options: { list: SPACING_OPTIONS },
          initialValue: 'spacing-3xl',
        }),
      ],
    }),
  ],
  preview: {
    select: { subtitle: 'heroText' },
    prepare({ subtitle }) {
      return { title: 'Hero Statement', subtitle }
    },
  },
})
