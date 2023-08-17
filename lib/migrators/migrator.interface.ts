import { ContentType } from '../content-type.interface'
import { InstructionType, InstructionValue } from '../services/differ.service'

export type OperationMap = Record<
InstructionType,
(value: InstructionValue) => Promise<unknown>
>

export const MigratorInterface = Symbol('MIGRATOR-INTERFACE')

export interface MigratorInterface {
  execute: (target: ContentType, instruction: InstructionType) => Promise<void>
}
