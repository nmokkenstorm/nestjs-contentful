import { Injectable } from '@nestjs/common'
import { MigrationClient, ContentType } from './migration-client.service'
import { Differ, InstructionType, InstructionValue } from './differ.service'

type OperationMap = Record<
  InstructionType,
  (value: InstructionValue) => void | Promise<void>
>

@Injectable()
export class Migrator {
  constructor(
    private readonly client: MigrationClient,
    private readonly differ: Differ
  ) {}

  private opsMap: OperationMap = {
    [InstructionType.CREATE]: (value) => {
      this.client.createType(value)
    },
    [InstructionType.DELETE]: (value) => this.client.deleteType(value),
  }

  async ensureExists(target: ContentType[]): Promise<void> {
    const existing = await this.client.findTypes()

    const operations = this.differ.compare(target, existing)

    await Promise.all(
      operations.map(({ operation, value }) => this.opsMap[operation](value))
    )
  }
}
