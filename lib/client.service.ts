import { Inject, Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import {
  OptionalConfig,
  ContentfulConfig,
  defaultConfig,
  isConfigKey,
} from './config'

type Data = unknown
type Method = 'get' | 'put' | 'delete' | 'post'

const validationMessage = 'missing required contentful info'

@Injectable()
export class ContentfulClient {
  private readonly config: OptionalConfig

  constructor(
    @Inject(ContentfulConfig) config: OptionalConfig = {},
    private readonly httpService: HttpService,
  ) {
    this.config = { ...defaultConfig, ...config }
  }

  get<T>(path: string, data: Data = {}, config: OptionalConfig = {}): Promise<T> {
    return this.request<T>('get', path, data, config)
  }

  put<T>(path: string, data: Data = {}, config: OptionalConfig = {}): Promise<T> {
    return this.request<T>('put', path, data, config)
  }

  async delete(path: string, data: Data = {}, config: OptionalConfig = {}): Promise<void> {
    await this.request('delete', path, data, config)
  }

  async post(path: string, data: Data = {}, config: OptionalConfig = {}): Promise<void> {
    await this.request('post', path, data, config)
  }

  private getUrl(path: string, config: OptionalConfig): string {
    const { url, space, environment } = this.getConfig(config)

    return [url, 'spaces', space, 'environments', environment, path].join('/')
  }

  private readonly validateConfig = (
    config: OptionalConfig,
  ): config is ContentfulConfig =>
    Object.entries(config).every(([key, value]) => value !== undefined && value !== '' && isConfigKey(key))

  private readonly getConfig = (config: OptionalConfig = {}): ContentfulConfig => {
    const result = { ...defaultConfig, ...this.config, ...config }

    if (!this.validateConfig(result)) {
      throw new Error(validationMessage)
    }

    return result
  }

  private async request<T>(
    method: Method,
    path: string,
    data: Data,
    config: OptionalConfig
  ): Promise<T> {
    const parsedConfig = this.getConfig(config)
    const { token } = parsedConfig
    const url = this.getUrl(path, parsedConfig)

    const response = await lastValueFrom(
      this.httpService.request({
        method,
        url,
        [this.hasBody(method) ? 'data' : 'params']: data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ).catch((error) => {
      console.error({
        config,
        error,
        parsedConfig: this.getConfig(config),
        message: error?.response?.data?.message,
        errors: error?.response?.data?.details?.errors,
        type: error?.response?.data?.sys?.id,
        url,
      })
    })

    if (response == null) {
      throw new Error("contentful didn't work")
    }

    return response.data
  }

  private hasBody(method: Method): boolean {
    return ['get', 'delete'].includes(method)
  }
}
