import { requiredEnv, optionalEnvWithDefault } from './lib/utils'
declare global {
  interface ApplicationConfig {
    dev: boolean
    MONGODB_URI: string
    NAP_URI: string
    PORT: string
    EVENT_SERVICE_URL: string
    EVENT_SERVICE_SECRET: string
    JWT_SECRET: string,
    API_KEY: string,
  }
}
console.log(process.env.NODE_ENV)

const config: ApplicationConfig = {
  API_KEY: requiredEnv('API_KEY'),
  EVENT_SERVICE_URL: requiredEnv('EVENT_SERVICE_URL'),
  EVENT_SERVICE_SECRET: requiredEnv('EVENT_SERVICE_SECRET'),
  JWT_SECRET: requiredEnv('JWT_SECRET'),
  dev: optionalEnvWithDefault('NODE_ENV', 'development') === 'development',
  MONGODB_URI: optionalEnvWithDefault('MONGODB_URI', undefined),
  NAP_URI: optionalEnvWithDefault('NAP_URI', 'CASUAL'),
  PORT: optionalEnvWithDefault('PORT', 80)
}

export default config
