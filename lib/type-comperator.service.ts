import { ContentType } from './migration-client.service'

export const TypeComperator = Symbol('TypeComperator')

export interface TypeComperator {
  typeEquals: (first: ContentType, second: ContentType) => boolean
}
