
import * as mongoose from 'mongoose'
const MongoInMemory = require('mongo-in-memory');

declare global {
  interface DBConnectionContext {
    logger: ApplicationLogger
    config: ApplicationConfig
  }
}

let _inmemoryURI;
let _mongoServerInstance
async function createInMemoryMongo(): Promise<any> {
  console.log('create inmemory mongo')
  if (_inmemoryURI) {
    console.log('uri exists')
    return _inmemoryURI
  }
  return new Promise((resolve, reject) => {
    _mongoServerInstance = new MongoInMemory(3391);
    console.log('start inmemory instance')
    _mongoServerInstance.start((error, mongoConfig) => {
      if (error) {
        console.error(error);
      } else {
        // callback when server has started successfully
        console.log('start db')
        console.log('HOST ' + mongoConfig.host);
        console.log('PORT ' + mongoConfig.port);
        _inmemoryURI = _mongoServerInstance.getMongouri('comment-service-in-memory')
        resolve(_inmemoryURI)
      }
    });
  })
}

export async function initConnection(context: DBConnectionContext): Promise<mongoose.Connection> {
  return new Promise<mongoose.Connection>(async (resolve, reject) => {
    if (process.env.NODE_ENV === 'test') {
      context.logger.log('DB: use test inmemory mongo')
      context.config.MONGODB_URI = await createInMemoryMongo()
    }

    context.logger.log('DB: ' + `create connection to ${context.config.MONGODB_URI}`)
    const __connection: any = mongoose.createConnection(context.config.MONGODB_URI, {
      promiseLibrary: global.Promise
    })

    __connection.on('disconnected', () => {
      context.logger.log(`👊🏽  Disconnected => ${context.config.MONGODB_URI}`)

      // close inmemoery if exists
      if (_mongoServerInstance) {
      _mongoServerInstance.stop()
      }
    })

    __connection.on('reconnect', () => {
      context.logger.log(`😧  Reconnect to => ${context.config.MONGODB_URI}`)
    })

    __connection.on('connected', () => {
      context.logger.log(`🖥  Connected => ${context.config.MONGODB_URI} `)
      resolve(__connection)
    })

  })
}
