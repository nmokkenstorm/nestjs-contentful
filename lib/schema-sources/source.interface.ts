import { ContentType } from '../content-type.interface'

export interface SchemaOptions {
  environment: string
  space: string
}

export interface Schema {
  contentTypes: ContentType[]
}

export interface SchemaSource {
  read: (options?: Partial<SchemaOptions>) => Promise<Schema>
  write: (schema: Schema, options?: Partial<SchemaOptions>) => Promise<void>
}
