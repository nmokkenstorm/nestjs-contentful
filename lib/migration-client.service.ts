import { Injectable } from '@nestjs/common'
import { ContentfulClient } from './client.service'

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

interface ContentTypeResponse {
  sys: Sys
  name: string
  fields: ContentField[]
}

interface Wrapper {
  sys: Sys<'Array'>
  total: number
  skip: number
  limit: number
  items: ContentTypeResponse[]
}

@Injectable()
export class MigrationClient {
  constructor(private readonly client: ContentfulClient) {}

  async findTypes(): Promise<ContentType[]> {
    const { items } = await this.client.get<Wrapper>('content_types')

    return items.map(({ sys, ...rest }) => ({ ...rest, id: sys.id }))
  }

  async createType({ id, ...rest }: ContentType): Promise<ContentType> {
    const data = await this.client.put<ContentType>(`content_types/${id}`, rest)

    return data
  }

  async deleteType({ id, ...rest }: ContentType): Promise<void> {
    const { sys } = await this.client.get<ContentTypeResponse>(
      `content_types/${id}`,
    )

    if (sys.publishedCounter !== 0) {
      await this.client.delete<ContentType>(`content_types/${id}/published`)
    }

    await this.client.delete<ContentType>(`content_types/${id}`)
  }
}
