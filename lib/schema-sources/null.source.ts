import { Injectable } from '@nestjs/common'
import { SchemaSource, Schema } from './source.interface'

@Injectable()
export class NullSchemaSource implements SchemaSource {
  read = (): Promise<Schema> => {
    return Promise.resolve({ contentTypes: [] })
  }

  write = async(): Promise<void> => {
    await Promise.resolve()
  }
}
