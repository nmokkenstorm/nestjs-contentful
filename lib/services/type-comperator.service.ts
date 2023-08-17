import { ContentType } from '../content-type.interface'

export const TypeComperator = Symbol('TypeComperator')

export interface TypeComperator {
  typeEquals: (first: ContentType, second: ContentType) => boolean
}
