import { Injectable } from '@nestjs/common'
import { ContentType } from './migration-client.service'
import { TypeComperator } from './type-comperator.service'

@Injectable()
export class SimpleComperator implements TypeComperator {
  typeEquals(
    { id, name }: ContentType,
    { id: target, name: targetName }: ContentType,
  ): boolean {
    return id === target && name === targetName
  }
}
