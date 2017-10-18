import { Connection, Types } from 'mongoose'
import { initConnection } from '../../../lib/db.connection'
import config from '../../../config'
import { guardWrapResolver, assignUserResolver } from '../reply.resolver'
import composeSchema from '../../compose.schema'

describe('reply.resolver', () => {
  let connection: Connection
  let models: GQApplicationModels
  let thread: GQThreadDocument
  let thread2: GQThreadDocument
  let comment: GQCommentDocument
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
    thread2 = await models.Thread.create({
      appId: 'test',
      contentPrefix: 'prefix',
      contentId: 'reply.resolver-2'
    })
    comment = await models.Comment.create({
      threadId: thread2._id,
      message: 'test'
    })
    context = {
      logger: console,
      models,
      connectors: {
        User: {
          verifyAvailableUserId: (token, id) => Promise.resolve(true)
        }
      }
    }
  })
  afterAll(async () => {
    await thread.remove()
    await thread2.remove()
    await comment.remove()
    await connection.close()
  })

  describe('guardWrapResolver', () => {
    it('should throw if token not exists', () => {
      return guardWrapResolver(shouldNotCall)({
        source: undefined,
        args: {
          record: {
            threadId: thread._id,
            message: 'test',
            userId: 'A'
          }
        },
        context: Object.assign({}, context, {
          token: undefined
        })
      }).catch((e) => expect(e.message).toMatch('unauthorized'))
    })
    it('should throw if have no permission', async () => {
      const spy = jest.fn(() => Promise.resolve(false))
      await guardWrapResolver(shouldNotCall)({
        source: undefined,
        args: {
          record: {
            threadId: thread._id,
            message: 'test',
            userId: 'A'
          }
        },
        context: Object.assign({}, context, {
          token: 'AAA',
          connectors: {
            User: {
              verifyAvailableUserId: spy
            }
          }
        })
      }).catch((e) => expect(e.message).toMatch('permission'))
      expect(spy).toBeCalled()
    })
    it('should throw if thread not exists', () => {
      return guardWrapResolver(shouldNotCall)({
        source: undefined,
        args: {
          record: {
            threadId: Types.ObjectId(),
            message: 'test',
            userId: 'A'
          }
        },
        context: Object.assign({}, context, {
          token: 'A'
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
            replyToId: Types.ObjectId(),
            userId: 'A'
          }
        },
        context: Object.assign({}, context, {
          token: 'A'
        })
      }).catch((e) => expect(e.message).toMatch('comment not exists'))
    })
    it('should throw if replyTo comment doest not same threadId', async () => {
      await guardWrapResolver(shouldNotCall)({
        source: undefined,
        args: {
          record: {
            threadId: thread._id,
            message: 'test',
            replyToId: comment._id,
            userId: 'A'
          }
        },
        context: Object.assign({}, context, {
          token: 'A'
        })
      }).catch((e) => expect(e.message).toMatch('comment wrong thread id'))
    })
    it('should pass if everything is ok', async () => {
      const spy = jest.fn()
      await guardWrapResolver(spy)({
        source: undefined,
        args: {
          record: {
            threadId: thread._id,
            message: 'test',
            replyToId: null,
            userId: 'A'
          }
        },
        context: Object.assign({}, context, {
          token: 'A'
        })
      }).catch((e) => expect(e.message).toMatch('comment wrong thread id'))
      expect(spy).toBeCalled()
    })
  })

  describe.skip('assignUserResolver', () => {
    it('should assign userId to record', async () => {
      const spy = jest.fn()
      await assignUserResolver(spy)({
        args: {
          record: {}
        },
        context: Object.assign({}, context, {
          user: { _id: 'test-user-id' }
        })
      })
      expect(spy.mock.calls[0][0].args.record).toEqual({
        userId: 'test-user-id'
      })
    })
  })
})
