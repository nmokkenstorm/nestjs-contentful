import { Injectable } from '@nestjs/common'
import { ContentType } from '../content-type.interface'
import { MigrationClient } from '../services/migration-client.service'
import { InstructionType } from '../services/differ.service'

import { MigratorInterface, OperationMap } from './migrator.interface'

@Injectable()
export class ContentfulMigrator implements MigratorInterface {
  constructor(private readonly client: MigrationClient) {}

  private readonly opsMap: OperationMap = {
    [InstructionType.CREATE]: (value) => this.client.createType(value),
    [InstructionType.DELETE]: (value) => this.client.deleteType(value),
  }

  async execute(
    target: ContentType,
    instruction: InstructionType,
  ): Promise<void> {
    await this.opsMap[instruction](target)
  }
}
