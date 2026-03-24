import { type SchemaTypeDefinition } from 'sanity'
import { content } from './content'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [content],
}