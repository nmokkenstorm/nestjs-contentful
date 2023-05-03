import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ApplicationModule } from '../src/app.module'
import { Server } from 'http'

describe('Contentful', () => {
  let server: Server
  let app: INestApplication

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ApplicationModule],
    }).compile()

    app = module.createNestApplication()
    server = app.getHttpServer()
    await app.init()
  })

  it(`it should not fail`, () => {
    expect(server).toBeDefined()
  })

  afterEach(async () => {
    await app.close()
  })
})
