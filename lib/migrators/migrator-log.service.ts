import { Injectable, Logger } from '@nestjs/common'
import { ContentType } from '../content-type.interface'
import { InstructionType } from '../services/differ.service'

import { MigratorInterface } from './migrator.interface'

@Injectable()
export class LogMigrator implements MigratorInterface {
  execute(target: ContentType, instruction: InstructionType): Promise<void> {
    Logger.log(`You should migrate resource "${target.name}" with instruction ${instruction}`, `[ContentfulModule] ${this.constructor.name}`)

    return Promise.resolve()
  }
}
