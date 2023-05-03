import { Module } from '@nestjs/common'
import { ContentfulModule } from '../../lib'

@Module({
  imports: [
    ContentfulModule.forRoot({
      token: process.env.CONTENTFUL_TOKEN ?? '',
      space: process.env.CONTENTFUL_SPACE ?? '',
    }),
  ],
})
export class ApplicationModule {}
