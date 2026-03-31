import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Objects of Affection')
    .items([
      S.documentTypeListItem('project').title('Projects'),
    ])
