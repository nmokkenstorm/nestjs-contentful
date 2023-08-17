import { Injectable, Inject, Logger } from '@nestjs/common'
import { BridgeInterface, BridgeConfig, BridgeVerbosity } from './bridge.interface'
import { SchemaSource } from '../schema-sources/source.interface'
import { Differ } from './differ.service'
import { MigratorInterface } from '../migrators/migrator.interface'

const defaultConfig: BridgeConfig = {
  destructive: false,
  verbosity: BridgeVerbosity.Normal
}

@Injectable()
export class Bridge implements BridgeInterface {
  private readonly config: BridgeConfig

  constructor(
    @Inject(BridgeConfig) config: Partial<BridgeConfig> = {},
    private readonly differ: Differ,
    @Inject(MigratorInterface) private readonly migrator: MigratorInterface
  ) {
    this.config = this.parseConfig(config)
  }

  async sync(from: SchemaSource, to: SchemaSource): Promise<void> {
    this.log('Starting sync')

    const [source, destination] = await Promise.all([from.read(), to.read()])

    await Promise.all(this.differ.compare(source.contentTypes, destination.contentTypes).map(({ operation, value }) =>
      this.migrator.execute(value, operation)
    ))

    this.log('Completed sync')
  }

  private log(message: string, isVerbose: boolean = false): void {
    if (this.config.verbosity === BridgeVerbosity.Quiet) {
      return
    }

    if (isVerbose && this.config.verbosity !== BridgeVerbosity.Verbose) {
      return
    }

    Logger.log(message, 'Contentful Migration Bridge')
  }

  private parseConfig(config: Partial<BridgeConfig>): BridgeConfig {
    const parsed = { ...defaultConfig, ...config }

    if (parsed.destructive) {
      throw new Error('Destructive migrations are not allowed yet')
    }

    return parsed
  }
}
