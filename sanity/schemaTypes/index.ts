import { type SchemaTypeDefinition } from 'sanity'
import { siteSettings } from './siteSettings'
import { page } from './page'
import { project } from './project'
import { sliceHeroStatement } from './slices/heroStatement'
import { sliceIndexGrid } from './slices/indexGrid'
import { sliceDivider } from './slices/divider'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Settings
    siteSettings,
    // Pages
    page,
    // Slices
    sliceHeroStatement,
    sliceIndexGrid,
    sliceDivider,
    // Content
    project,
  ],
}
