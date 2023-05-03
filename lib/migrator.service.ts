import { Injectable, Logger } from '@nestjs/common'
import { ContentfulClient } from './client.service'

interface Field {
  id: string
  name: string
  required: boolean
  localized: boolean
  type: 'Text' | 'Symbol' | 'RichText'
}

interface ContentType {
  id: string
  name: string
  fields: Field[]
}

@Injectable()
export class ContentfulMigrator {
  constructor(private readonly client: ContentfulClient) {}

  async findTypes(): Promise<ContentType[]> {
    const data = await this.client.get<ContentType[]>('content_types')

    Logger.log(data)

    return data
  }
}
