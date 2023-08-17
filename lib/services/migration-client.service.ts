import { Injectable } from '@nestjs/common'
import { ContentfulClient } from '../infrastructure/client.service'
import { ContentType, ContentTypeResponse, Wrapper } from '../content-type.interface'

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

  async deleteType({ id }: ContentType): Promise<void> {
    const { sys } = await this.client.get<ContentTypeResponse>(
      `content_types/${id}`,
    )

    if (sys.publishedCounter !== 0) {
      await this.client.delete(`content_types/${id}/published`)
    }

    await this.client.delete(`content_types/${id}`)
  }
}
