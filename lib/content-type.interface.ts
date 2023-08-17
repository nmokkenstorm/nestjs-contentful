interface ContentField {
  id: string
  name: string
  required: boolean
  localized: boolean
  type: 'Text' | 'Symbol' | 'RichText'
}

export interface ContentType {
  id: string
  name: string
  description?: string
  fields: ContentField[]
}

type SysType = 'Array' | 'ContentType'
interface Sys<T extends SysType = SysType> {
  type: T
  id: string
  publishedCounter: number
}

export interface ContentTypeResponse {
  id: string
  sys: Sys
  name: string
  fields: ContentField[]
}

export interface Wrapper {
  sys: Sys<'Array'>
  total: number
  skip: number
  limit: number
  items: ContentTypeResponse[]
}
