import { FileSchemaSource } from '../../lib/schema-source-file.service'
import { Schema } from '../../lib/schema-source.interface'
import { rmdir, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

describe('File Schema Source', () => {
  const baseDir = join(__dirname, '../', 'fixtures', 'schemas')

  let source: FileSchemaSource
  const schema: Schema = {
    contentTypes: [],
  }

  const createFile = async(directory: string, file: string): Promise<void> => {
    const path = join(baseDir, directory, file)

    await mkdir(join(baseDir, directory), { recursive: true })

    await writeFile(path, JSON.stringify(schema))
  }

  beforeAll(async() => {
    try {
      await rmdir(baseDir, { recursive: true })
      await mkdir(baseDir, { recursive: true })
    } catch (e) {
      // already empty
    }
  })

  beforeEach(() => {
    source = new FileSchemaSource({
      baseDir,
    })
  })

  it('should be able to get a schema from file', async() => {
    await createFile('default', 'master.json')

    const result = await source.read()
    expect(result).toBeDefined()
  })

  it('should be able to get a schema from a custom file with an extension', async() => {
    await createFile('default', 'master-custom.json')
    const result = await source.read({ file: 'master-custom' })
    expect(result).toBeDefined()
  })

  it('should be able to get a schema from a custom file without an extension', async() => {
    await createFile('default', 'master-custom-2.json')

    const result = await source.read({ file: 'master-custom-2.json' })
    expect(result).toBeDefined()
  })

  it('should be able to write a schema to a directory', async() => {
    await source.write(schema)
    expect(schema).toBeDefined()
  })

  it('should be able to write a schema to a custom directory', async() => {
    await source.write(schema, { baseDir: join(__dirname, '../', 'schemas') })
    expect(schema).toBeDefined()
  })

  it('should be able to write a schema to a custom file', async() => {
    const file = 'master-test.json'

    await source.write(schema, { file })
    expect(schema).toBeDefined()
  })
})
