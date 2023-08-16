import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ContentfulModule } from '../../lib'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ContentfulModule.forRoot({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        space: config.getOrThrow<string>('CONTENTFUL_SPACE'),
        token: config.getOrThrow<string>('CONTENTFUL_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class ApplicationModule {}
