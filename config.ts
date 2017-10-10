import { requiredEnv, optionalEnvWithDefault } from './lib/utils'
declare global {
  interface ApplicationConfig {
    dev: boolean
    MONGODB_URI: string
    NAP_URI: string
    PORT: string
  }
}

const config: ApplicationConfig = {
  dev: optionalEnvWithDefault('NODE_ENV', 'development'),
  MONGODB_URI: requiredEnv('MONGODB_URI'),
  NAP_URI: requiredEnv('NAP_URI'),
  PORT: optionalEnvWithDefault('PORT', 3000)
}

export default config
