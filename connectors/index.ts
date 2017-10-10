import createNapConnector, { GQNapConnector } from './nap'

export type GQConnectors = {
  nap: GQNapConnector
}

export default (config: {
  napEndpoint: string
}): GQConnectors => ({
  nap: createNapConnector({ endpoint: config.napEndpoint })
})