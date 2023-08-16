import { Injectable } from '@nestjs/common'
import { ContentfulClient } from './client.service'
import { SchemaSource, Schema } from './schema-source.interface'

@Injectable()
export class ContentfulSchemaSource implements SchemaSource {
  constructor(private readonly client: ContentfulClient) {}

  read = (): Promise<Schema> => {
    return this.client.get('content_types')
  }

  write = async(schema: Schema): Promise<void> => {
    throw new Error('not implemented')
  }
}
