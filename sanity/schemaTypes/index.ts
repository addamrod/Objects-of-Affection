import { type SchemaTypeDefinition } from 'sanity'
import { project } from './project'
import { siteSettings } from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [siteSettings, project],
}