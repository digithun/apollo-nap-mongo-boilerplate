
import * as mongoose from 'mongoose'

declare global {
  interface DBConnectionContext {
    logger: ApplicationLogger
    config: ApplicationConfig
  }
}

let _inmemoryURI;
let _mongoServerInstance
async function createInMemoryMongo(): Promise<any> {
  const MongoInMemory = require('mongo-in-memory');
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
    if (process.env.NODE_ENV === 'test' || (!context.config.MONGODB_URI && process.env.NODE_ENV === 'development')) {
      context.logger.log('DB: use test inmemory mongo')
      context.config.MONGODB_URI = await createInMemoryMongo()
    }
    (mongoose as any).Promise = global.Promise

    context.logger.log('DB: ' + `create connection.... `)
    const __connection: any = mongoose.createConnection(context.config.MONGODB_URI, {
      promiseLibrary: global.Promise
    })

    __connection.on('disconnected', () => {
      context.logger.log(`👊🏽  Disconnected`)

      // close inmemoery if exists
      if (_mongoServerInstance) {
        _mongoServerInstance.stop()
      }
    })

    __connection.on('reconnect', () => {
      context.logger.log(`😧  Reconnect......`)
    })

    __connection.on('connected', () => {
      context.logger.log(`🖥  Connected.... `)
      resolve(__connection)
    })

  })
}
