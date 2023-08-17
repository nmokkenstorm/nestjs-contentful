import { Test } from '@nestjs/testing'
import { ApplicationModule } from './src/app.module'
import { ContentfulSchemaSource } from '../lib/schema-sources/contentful.source'

describe('Contentful Schema Source', () => {
  const create = async(): Promise<ContentfulSchemaSource> => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile()

    const app = module.createNestApplication()
    return app.get<ContentfulSchemaSource>(ContentfulSchemaSource)
  }

  it('it should be able to read the default env', async() => {
    const source = await create()

    const result = await source.read()

    expect(result).toBeDefined()
  })
})
