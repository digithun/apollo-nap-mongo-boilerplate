import * as express from 'express'
import * as bodyParser from 'body-parser'
import * as chalk from 'chalk'
import { Connection, Model } from 'mongoose'
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express'
import * as next from 'next'
import clientRoutes from './routes'
import { createGraphQLSchema } from './graphql'
import createConnectors, { GQConnectors } from './connectors'

declare global {
  interface ApplicationLogger {
    log: (message: string) => void
  }
  interface SVContext {
    config: ApplicationConfig
    logger: ApplicationLogger
    __connection: Connection
  }

  interface GQResolverContext extends SVContext, express.Request {
    models: GQApplicationModels,
    connectors: GQConnectors,
    token: string
  }
}

export default async function init(context: SVContext) {
  const server = express()
  const clientApp = next({ dev: context.config.dev })
  const clientRoutesHandler = clientRoutes.getRequestHandler(clientApp)
  server.use(bodyParser.json())
  server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

  const { schema, models }  = createGraphQLSchema(context)
  server.use('/graphql', graphqlExpress( (req) => ({
    schema,
    context: {
      ...req,
      ...context,
      token: 'mock',
      models,
      connectors: createConnectors({ napEndpoint: context.config.NAP_URI })
    }
  })))

  server.use(clientRoutesHandler)
  return {
    start: async () => {
      await clientApp.prepare()
      server.listen(context.config.PORT, () => {
        context.logger.log(chalk.bgGreen(`Start application !!`))
        context.logger.log(chalk.green(`Application start on port =>> ${context.config.PORT}`))
      })
    }
  }
}
