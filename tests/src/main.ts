import { NestFactory } from '@nestjs/core'
import { ApplicationModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(ApplicationModule)
  await app.listen(3001)
}

bootstrap().catch(console.error)
