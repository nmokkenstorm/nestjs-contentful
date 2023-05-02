# nestjs-contentful

## Usage:

- find out what your contentful space id is:
  - log in or sign in on contenful on [here](https://contentful.com/login)
  - find your space id in the url: `https://app.contentful.com/spaces/{this-is-your-space}/home`
- create a content management token:
  - settings
  - API Keys
  - Content management tokens
  - Generate personal token
- add the following to your `app.module.ts`:

```typescript
import { Module } from '@nestjs/common'
import { ContentfulModule } from 'nestjs-contentful'

@Module({
  imports: [
    // somewhere between your other imports..
    ContentfulModule.forRoot({
      token: 'CFPAT-your-contentful-token', // example, don't commit this!
      space: 'your-contentful-space', // find this value in your url
      environment: 'some-environment', // optional, defaults to `master`
    }),
  ],
  controllers: [
    // your controllers..
  ],
  providers: [
    // your providers..
  ],
})
export class AppModule {}
```

You should probably use [@nestjs/config](https://docs.nestjs.com/techniques/configuration) with a [custom provider](https://docs.nestjs.com/fundamentals/custom-providers#factory-providers-usefactory) or similar to securely handle your credentials
