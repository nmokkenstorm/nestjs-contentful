import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import {
  CONTENTFUL_ENV,
  CONTENTFUL_SPACE,
  CONTENTFUL_TOKEN,
  CONTENTFUL_URL,
} from './tokens'

@Injectable()
export class ContentfulClient {
  constructor(
    @Inject(CONTENTFUL_ENV) private readonly environment: string,
    @Inject(CONTENTFUL_SPACE) private readonly space: string,
    @Inject(CONTENTFUL_TOKEN) private readonly token: string,
    @Inject(CONTENTFUL_URL) private readonly url: string,
    private readonly httpService: HttpService
  ) {}

  private getUrl(path: string): string {
    return `${this.url}/spaces/${this.space}/environments/${this.environment}/${path}`
  }

  async get<T>(path: string): Promise<T> {
    const response = await lastValueFrom(
      this.httpService.get(this.getUrl(path), {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
    )

    if (!response) {
      throw new Error("contentful didn't work")
    }

    return response.data
  }
}
