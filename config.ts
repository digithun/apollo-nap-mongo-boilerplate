import { requiredEnv, optionalEnvWithDefault } from './lib/utils'
declare global {
  interface ApplicationConfig {
    dev: boolean
    MONGODB_URI: string
    NAP_URI: string
    PORT: string
  }
}
console.log(process.env.NODE_ENV)

const config: ApplicationConfig = {
  dev: optionalEnvWithDefault('NODE_ENV', 'development') === 'development',
  MONGODB_URI: optionalEnvWithDefault('MONGODB_URI', undefined),
  NAP_URI: optionalEnvWithDefault('NAP_URI', 'CASUAL'),
  PORT: optionalEnvWithDefault('PORT', 80)
}

export default config
