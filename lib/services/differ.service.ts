import { Injectable, Inject } from '@nestjs/common'
import { ContentType } from '../content-type.interface'
import { TypeComperator } from './type-comperator.service'

export enum InstructionType {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
}

export type InstructionValue = ContentType

export interface MigrationInstruction {
  operation: InstructionType
  value: ContentType
}

// TODO: this could both be a lazy data structure with observables/generators
type ContentTypeStream = ContentType[]
type CompareResult = MigrationInstruction[]

@Injectable()
export class Differ {
  constructor(
    @Inject(TypeComperator) private readonly comperator: TypeComperator,
  ) {}

  compare(source: ContentTypeStream, target: ContentTypeStream): CompareResult {
    const toCreate = this.findMissing(source, target).map((value) => ({
      value,
      operation: InstructionType.CREATE,
    }))
    const toDelete = this.findMissing(target, source).map((value) => ({
      value,
      operation: InstructionType.DELETE,
    }))

    return [...toCreate, ...toDelete]
  }

  private findMissing(
    source: ContentTypeStream,
    target: ContentTypeStream,
  ): ContentTypeStream {
    return source.filter(
      (sourceItem) =>
        !target.some((targetItem) =>
          this.comperator.typeEquals(sourceItem, targetItem),
        ),
    )
  }
}
