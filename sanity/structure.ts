import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Objects of Affection')
    .items([
      // Singleton — only one site settings document ever exists
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
    ])
