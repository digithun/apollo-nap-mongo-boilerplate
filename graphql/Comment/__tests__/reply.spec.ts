import { Connection, Types } from 'mongoose'
import { initConnection } from '../../../lib/db.connection'
import config from '../../../config'
import { guardWrapResolver, assignUserResolver } from '../reply.resolver'
import composeSchema from '../../compose.schema'

describe('reply.resolver', () => {
  let connection: Connection
  let models: GQApplicationModels
  let thread: GQThreadDocument
  let context
  const shouldNotCall = () => {
    throw new Error('should not call')
  }
  beforeAll(async () => {
    connection = await initConnection({
      config,
      logger: console
    })
    models = composeSchema(connection).models
    thread = await models.Thread.create({
      appId: 'test',
      contentPrefix: 'prefix',
      contentId: 'reply.resolver'
    })
    context = {
      logger: console,
      models
    }
  })
  afterAll(async () => {
    await thread.remove()
    await connection.close()
  })

  describe('guardWrapResolver', () => {
    it('should throw if userId not exists', () => {
      return guardWrapResolver(shouldNotCall)({
        source: undefined,
        args: {
          record: {
            threadId: thread._id,
            message: 'test'
          }
        },
        context: Object.assign(context, {
          user: null
        })
      }).catch((e) => expect(e.message).toMatch('unauthorized'))
    })
    it('should throw if thread not exists', () => {
      return guardWrapResolver(shouldNotCall)({
        source: undefined,
        args: {
          record: {
            threadId: Types.ObjectId(),
            message: 'test'
          }
        },
        context: Object.assign(context, {
          user: {}
        })
      }).catch((e) => expect(e.message).toMatch('thread not exists'))
    })
    it('should throw if replyTo comment doest not exists', () => {
      return guardWrapResolver(shouldNotCall)({
        source: undefined,
        args: {
          record: {
            threadId: thread._id,
            message: 'test',
            replyToId: Types.ObjectId()
          }
        },
        context: Object.assign(context, {
          user: {}
        })
      }).catch((e) => expect(e.message).toMatch('comment not exists'))
    })
    it('should throw if replyTo comment doest not same threadId', async () => {
      const thread2 = await models.Thread.create({
        appId: 'test',
        contentPrefix: 'prefix',
        contentId: 'reply.resolver-2'
      })
      const comment = await models.Comment.create({
        threadId: thread2._id,
        message: 'test'
      })
      await guardWrapResolver(shouldNotCall)({
        source: undefined,
        args: {
          record: {
            threadId: thread._id,
            message: 'test',
            replyToId: comment._id
          }
        },
        context: Object.assign(context, {
          user: {}
        })
      }).catch((e) => expect(e.message).toMatch('comment wrong thread id'))
      await comment.remove()
      await thread2.remove()
    })
    it('should pass if everything is ok', async () => {
      const spy = jest.fn()
      await guardWrapResolver(spy)({
        source: undefined,
        args: {
          record: {
            threadId: thread._id,
            message: 'test',
            replyToId: null
          }
        },
        context: Object.assign(context, {
          user: {}
        })
      }).catch((e) => expect(e.message).toMatch('comment wrong thread id'))
      expect(spy).toBeCalled()
    })
  })

  describe('assignUserResolver', () => {
    it('should assign userId to record', async () => {
      const spy = jest.fn()
      await assignUserResolver(spy)({
        args: {
          record: {}
        },
        context: Object.assign(context, {
          user: { _id: 'test-user-id' }
        })
      })
      expect(spy.mock.calls[0][0].args.record).toEqual({
        userId: 'test-user-id'
      })
    })
  })
})
