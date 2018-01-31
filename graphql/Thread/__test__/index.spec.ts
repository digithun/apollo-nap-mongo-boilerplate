import { Connection, Types } from 'mongoose'
import { initConnection } from '../../../lib/db.connection'
import config from '../../../config'
import { createThreadWrapResolver } from '../create.resolver'
import composeSchema from '../../compose.schema'

describe('Thread resolver test', () => {
  let connection: Connection;
  let models: GQApplicationModels;
  beforeAll(async () => {
    connection = await initConnection({
      config,
      logger: console
    })
    models = composeSchema({
      config,
      logger: console,
      __connection: connection
    }).models
  })
  afterAll(async () => {
    await connection.close()
  })

  it('should create new Thread if Thread not found', async () => {
    const threadId = Types.ObjectId()
    const rp = {
      source: undefined,
      args: {
        filter: {
          appId: 'mock-app',
          contentPrefix: 'prefix',
          contentId: threadId
        }
      },
      context: {
        logger: console,
        models
      }
    }
    await createThreadWrapResolver(() => {
      return undefined
    })(rp)

    const thread = await models.Thread.findOne({
      appId: 'mock-app',
      contentId: threadId
    })

    expect(thread).toEqual(expect.anything())
    await thread.remove()
  })

})
