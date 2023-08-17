export const ContentfulConfig = Symbol('CONTENTFUL-CONFIG')

export const defaultConfig: OptionalConfig = {
  url: 'https://api.contentful.com',
  environment: 'master',
}

export interface ContentfulConfig {
  url: string
  space: string
  environment: string
  token: string
}

export type OptionalConfig = Partial<ContentfulConfig>

export type RequiredConfig = Pick<ContentfulConfig, 'space' | 'token'> &
OptionalConfig

type ConfigKey = keyof ContentfulConfig

const keys: readonly ConfigKey[] = [
  'url',
  'space',
  'environment',
  'token',
] as const

export const isConfigKey = (value: string | ConfigKey): value is ConfigKey =>
  keys.find((e) => e === value) !== undefined
