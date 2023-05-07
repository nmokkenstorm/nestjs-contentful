import { DynamicModule, Module, Logger } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ContentfulClient } from './client.service'
import { MigrationClient } from './migration-client.service'
import { TypeComperator } from './type-comperator.service'
import { SimpleComperator } from './simple-comperator.service'
import { Migrator } from './migrator.service'
import { Differ } from './differ.service'

import {
  CONTENTFUL_ENV,
  CONTENTFUL_SPACE,
  CONTENTFUL_TOKEN,
  CONTENTFUL_URL,
} from './tokens'

const defaultUrl = 'https://api.contentful.com'
const defaultEnv = 'master'

interface Options {
  token: string
  space: string
  environment?: string
  url?: string
}

@Module({
  imports: [HttpModule],
  exports: [ContentfulModule],
  providers: [
    ContentfulClient,
    MigrationClient,
    Migrator,
    Differ,
    {
      provide: TypeComperator,
      useClass: SimpleComperator,
    },
  ],
})
export class ContentfulModule {
  private readonly logger = new Logger('Contentful')

  constructor(private readonly migrator: Migrator) {}

  static forRoot({
    token,
    space,
    environment = defaultEnv,
    url = defaultUrl,
  }: Options): DynamicModule {
    return {
      module: ContentfulModule,
      providers: [
        ContentfulClient,
        {
          provide: CONTENTFUL_ENV,
          useValue: environment,
        },
        {
          provide: CONTENTFUL_TOKEN,
          useValue: token,
        },
        {
          provide: CONTENTFUL_SPACE,
          useValue: space,
        },
        {
          provide: CONTENTFUL_URL,
          useValue: url,
        },
        {
          provide: CONTENTFUL_URL,
          useValue: url,
        },
        {
          provide: TypeComperator,
          useClass: SimpleComperator,
        },
      ],
      exports: [ContentfulClient]
    }
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('checking for updates..')
    await this.migrator.ensureExists([{ id: 'foo', name: 'bar', fields: [] }])
    this.logger.log('done updating')
  }
}
