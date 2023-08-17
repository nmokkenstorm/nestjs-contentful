import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ApplicationModule } from './src/app.module'
import { NullSchemaSource } from '../lib/schema-sources/null.source'
import { ContentfulSchemaSource } from '../lib/schema-sources/contentful.source'
import { BridgeInterface } from '../lib/services/bridge.interface'

describe('Bridge', () => {
  let app: INestApplication
  let bridge: BridgeInterface

  beforeEach(async() => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile()

    app = module.createNestApplication()
    bridge = app.get<BridgeInterface>(BridgeInterface)
  })

  it('it should be able to read a remote schema and dump it somewhere', async() => {
    const source = app.get<ContentfulSchemaSource>(ContentfulSchemaSource)
    const destination = app.get<NullSchemaSource>(NullSchemaSource)

    await bridge.sync(source, destination)
  })
})
