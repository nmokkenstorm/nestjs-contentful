import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Logger,
  FactoryProvider,
  ValueProvider,
} from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { ContentfulSchemaSource } from './schema-sources/contentful.source'
import { ContentfulConfig, RequiredConfig } from './infrastructure/config'
import { ContentfulClient } from './infrastructure/client.service'

// TODO fix me? TypeORM does the same but eghhh
// @see https://github.com/nestjs/typeorm/blob/master/lib/interfaces/typeorm-options.interface.ts#L53
type InjectionToken = any[]
type ConfigFactory<T extends InjectionToken = InjectionToken> =
  | {
    imports?: ModuleMetadata['imports']
    inject?: T
    useFactory: (...args: T) => RequiredConfig
  }
  | RequiredConfig

@Module({
  imports: [HttpModule]
})
export class ContentfulModule {
  private readonly logger = new Logger('Contentful')

  static forRoot(config: ConfigFactory): DynamicModule {
    const providers = [
      ContentfulModule.createConfigProvider(config),
      ContentfulClient,
      ContentfulSchemaSource,
    ]

    return {
      module: ContentfulModule,
      providers,
      exports: [ContentfulClient],
    }
  }

  static createConfigProvider(
    config: ConfigFactory,
  ): FactoryProvider | ValueProvider {
    return {
      provide: ContentfulConfig,
      ...('useFactory' in config ? config : { useValue: config }),
    }
  }

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log(
      'Starting Contentful Module..',
      ContentfulModule.constructor.name,
    )
  }
}
