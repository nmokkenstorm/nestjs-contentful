import { Injectable } from '@nestjs/common'
import { ContentfulClient } from '../infrastructure/client.service'
import { SchemaSource, Schema } from './source.interface'
import { Wrapper } from '../content-type.interface'

@Injectable()
export class ContentfulSchemaSource implements SchemaSource {
  constructor(private readonly client: ContentfulClient) {}

  read = async(): Promise<Schema> => {
    const result = await this.client.get<Wrapper>('content_types')

    const contentTypes = result?.items ?? []

    return { contentTypes }
  }

  write = async(schema: Schema): Promise<void> => {
    throw new Error('not implemented')
  }
}
