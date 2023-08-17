import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Logger,
  FactoryProvider,
  ValueProvider,
  Inject,
} from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

import { ContentfulSchemaSource } from './schema-sources/contentful.source'
import { FileSchemaSource } from './schema-sources/file.source'
import { NullSchemaSource } from './schema-sources/null.source'
import {
  BridgeInterface,
  BridgeConfig,
  BridgeVerbosity,
} from './services/bridge.interface'
import { MigratorInterface } from './migrators/migrator.interface'
import { LogMigrator } from './migrators/migrator-log.service'
import { Bridge } from './services/bridge.service'
import { ContentfulConfig, RequiredConfig } from './infrastructure/config'
import { ContentfulClient } from './infrastructure/client.service'
import { Differ } from './services/differ.service'
import { TypeComperator } from './services/type-comperator.service'
import { SimpleComperator } from './services/simple-comperator.service'

export enum SyncDirection {
  Download = 'Download',
  Upload = 'Upload',
}
export enum SyncMode {
  Warn = 'Warn',
  Error = 'Error',
  Append = 'Append',
  Overwrite = 'Overwrite',
  Ignore = 'Ignore',
  Recreate = 'Recreate',
}

const defaultDirection = SyncDirection.Download
const defaultMode = SyncMode.Ignore

const ModuleConfig = Symbol('CONTENTFUL-MODULE-CONFIG')
type ModuleConfig = RequiredConfig & {
  direction?: SyncDirection
  mode?: SyncMode
}

// TODO fix me? TypeORM does the same but eghhh
// @see https://github.com/nestjs/typeorm/blob/master/lib/interfaces/typeorm-options.interface.ts#L53
type InjectionToken = any[]
type ConfigFactory<T extends InjectionToken = InjectionToken> =
  | {
    imports?: ModuleMetadata['imports']
    inject?: T
    useFactory: (...args: T) => ModuleConfig
  }
  | RequiredConfig

@Module({
  imports: [HttpModule],
})
export class ContentfulModule {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    @Inject(ModuleConfig) private readonly config: ModuleConfig,
    @Inject(BridgeInterface) private readonly bridge: BridgeInterface,
    private readonly contentFulSource: ContentfulSchemaSource,
    private readonly nullSource: NullSchemaSource,
  ) {}

  static forRoot(config: ConfigFactory): DynamicModule {
    const providers = [
      ContentfulModule.createConfigProvider(config),
      ContentfulClient,
      ContentfulSchemaSource,
      NullSchemaSource,
      Differ,
      FileSchemaSource,
      {
        provide: TypeComperator,
        useClass: SimpleComperator,
      },
      {
        provide: MigratorInterface,
        useClass: LogMigrator,
      },
      {
        provide: ModuleConfig,
        useValue: {
          direction: defaultDirection,
          mode: defaultMode,
        },
      },
      {
        provide: BridgeConfig,
        useValue: {
          destructive: false,
          verbosity: BridgeVerbosity.Verbose,
        },
      },
      {
        provide: BridgeInterface,
        useClass: Bridge,
      },
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
    const mode = this.config.mode ?? defaultMode
    const direction = this.config.direction ?? defaultDirection
    const [source, destination] = [this.contentFulSource, this.nullSource]

    this.logger.log(
      `Starting Contentful Module in [${mode}, ${direction}] mode`,
    )

    const [from, to] =
      this.config.direction === SyncDirection.Upload
        ? [destination, source]
        : [source, destination]

    await this.bridge.sync(from, to)
  }
}
