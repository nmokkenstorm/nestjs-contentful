import { Injectable, Logger } from '@nestjs/common'
import { ContentfulClient } from './client.service'

// todo
type DateString = string

type Field = {
  id: string
  name: string
  type: 'Symbol' | 'Array' | 'RichText'
  localized: boolean
  required: boolean
  omitted: boolean
  disabled: boolean
}

type ContentType = {
  name: string
  description: string
  fields: Field[]
  sys: {
    id: string
    type: 'ContentType'
  }
  publishedVersion: number
  publishedAt: DateString
  version: number
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
