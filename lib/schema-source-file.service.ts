import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { readFile, writeFile } from 'fs/promises'

import { SchemaSource, Schema, SchemaOptions } from './schema-source.interface'

const defaultOptions: FileSchemaSourceOptions = {
  space: 'default',
  environment: 'master',
  baseDir: join(__dirname, '../', 'schemas'),
}

type FileSchemaSourceOptions = SchemaOptions & {
  baseDir: string
  file?: string
}

export class FileSchemaSource implements SchemaSource {
  private readonly options: FileSchemaSourceOptions

  constructor(options: Partial<FileSchemaSourceOptions> = {}) {
    this.options = { ...defaultOptions, ...options }
  }

  read = async(
    options: Partial<FileSchemaSourceOptions> = {},
  ): Promise<Schema> => {
    const parsedOptions = this.parseOptions(options)

    const path = await this.getFilePath(parsedOptions)

    return JSON.parse((await readFile(path)).toString())
  }

  write = async(
    schema: Schema,
    options: Partial<FileSchemaSourceOptions> = {},
  ): Promise<void> => {
    const parsedOptions = this.parseOptions(options)

    const path = await this.getFilePath(parsedOptions)

    await writeFile(path, JSON.stringify(schema))
  }

  private readonly parseOptions = (
    options: Partial<FileSchemaSourceOptions> = {},
  ): FileSchemaSourceOptions => ({ ...this.options, ...options })

  private readonly getDir = async({
    baseDir,
    space,
  }: FileSchemaSourceOptions): Promise<string> => {
    const path = join(baseDir, space)

    this.ensureExists(path)

    return path
  }

  private ensureExists(path: string): void {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })
    }
  }

  private readonly getFilePath = async(
    options: FileSchemaSourceOptions,
  ): Promise<string> => {
    const { file, environment } = options
    const path = join(await this.getDir(options), file ?? environment)

    return path.endsWith('.json') ? path : `${path}.json`
  }
}
