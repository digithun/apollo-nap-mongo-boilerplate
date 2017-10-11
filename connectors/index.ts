import createUserConnector, { GQUserConnector } from './user'

export type GQConnectors = {
  User: GQUserConnector
}

export default (config: {
  napEndpoint: string,
  models: GQApplicationModels,
  logger: ApplicationLogger
}): GQConnectors => ({
  User: createUserConnector({ endpoint: config.napEndpoint, userModel: config.models.User, logger: config.logger })
})
