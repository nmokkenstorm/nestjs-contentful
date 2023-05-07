import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import {
  CONTENTFUL_ENV,
  CONTENTFUL_SPACE,
  CONTENTFUL_TOKEN,
  CONTENTFUL_URL,
} from './tokens'

type Data = unknown
type Method = 'get' | 'put' | 'delete'

@Injectable()
export class ContentfulClient {
  constructor(
    @Inject(CONTENTFUL_ENV) private readonly environment: string,
    @Inject(CONTENTFUL_SPACE) private readonly space: string,
    @Inject(CONTENTFUL_TOKEN) private readonly token: string,
    @Inject(CONTENTFUL_URL) private readonly url: string,
    private readonly httpService: HttpService
  ) {}

  async get<T>(path: string, data: Data = {}): Promise<T> {
    return this.request<T>('get', path, data)
  }

  async put<T>(path: string, data: Data = {}): Promise<T> {
    return this.request<T>('put', path, data)
  }

  async delete<T>(path: string, data: Data = {}): Promise<T> {
    return this.request<T>('delete', path, data)
  }

  private getUrl(path: string): string {
    return [
      this.url,
      'spaces',
      this.space,
      'environments',
      this.environment,
      path,
    ].join('/')
  }

  private async request<T>(
    method: Method,
    path: string,
    data: Data
  ): Promise<T> {
    const url = this.getUrl(path)

    const response = await lastValueFrom(
      this.httpService.request({
        method,
        url,
        params: method === 'get' ? data : undefined,
        data: method !== 'get' ? data : undefined,
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
    ).catch(({ response }) => {
      console.error({
        message: response?.data?.message,
        errors: response?.data?.details?.errors,
        type: response?.data?.sys?.id,
        url,
      })
    })

    if (!response) {
      throw new Error("contentful didn't work")
    }

    return response.data
  }
}
