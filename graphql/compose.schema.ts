
import { GQC, TypeComposer } from 'graphql-compose'
import * as mongoose from 'mongoose'
import thread from './Thread'
import { wrapResolvers } from 'graphql-compose-schema-wrapper'
import comment from './Comment'
import user from './User'
import 'isomorphic-fetch'

declare global {
  type GQTypeComposers = {
    Thread: TypeComposer
    Comment: TypeComposer
    User: TypeComposer
  }
  /**
   * Every Graphql-compose Model strategy should implement this type
   */
  interface GQTypeComposerStrategy<T extends mongoose.Document> {
    schema: mongoose.Schema
    createTypeComposer: (Model: mongoose.Model<T>) => TypeComposer
    createGraphQLRelation?: (typeComposers: GQTypeComposers) => void
  }
  /**
   * dont forget to add models to Interface
   * after you create new model
   */
  interface GQApplicationModels {
    Thread: mongoose.Model<GQThreadDocument>
    Comment: mongoose.Model<GQCommentDocument>
    User: mongoose.Model<GQUserDocument>
  }

  interface GQCreateOneArgs<Schema> {
    record: Schema
  }
  interface GQConnectionResult<TResult> {
    count: number
    edges: [{
      node: TResult
      cursor: string
    }]
    pageInfo?: {
      hasNextPage: boolean
      hasPreviousPage: boolean
      endCursor?: any
    }

  }
  interface GQCreateOneResult<Document> {
    record: Document
    recordId: mongoose.Types.ObjectId
  }
}

export default function createSchema({ __connection, config }: SVContext) {

  const models = {
    Thread: __connection.model<GQThreadDocument>('Thread', thread.schema),
    Comment: __connection.model<GQCommentDocument>('Comment', comment.schema),
    User: __connection.model<GQUserDocument>('User', user.schema),
  }
  const typeComposers: GQTypeComposers = {
    Thread: thread.createTypeComposer(models.Thread),
    Comment: comment.createTypeComposer(models.Comment),
    User: user.createTypeComposer(models.User)
  }

  thread.createGraphQLRelation(typeComposers)
  comment.createGraphQLRelation(typeComposers)

  GQC.rootQuery().addFields({
    threads: typeComposers.Thread.getResolver('findMany'),
    thread: typeComposers.Thread.getResolver('findAndUpdate')
  })
  GQC.rootMutation().addFields({
    createThread: typeComposers.Thread.getResolver('createOne'),
    updateCommentById: typeComposers.Comment.getResolver('updateById'),
    remove: typeComposers.Comment.getResolver('remove'),
    ...wrapResolvers<any, { user: any }>({
      reply: typeComposers.Comment.getResolver('reply')
    }, (next) => async (rp) => {
      try {

        if (!rp.projection.record) {
          rp.projection.record = {}
        }
        if (!rp.projection.record.thread) {
          rp.projection.record.thread = {}
        }

        rp.projection.record.thread.contentId = {}
        const result = await next(rp)

        const eventResponse = await fetch(config.EVENT_SERVICE_URL, {
          headers: {
            'x-api-key': config.EVENT_SERVICE_SECRET
          },
          method: 'POST',
          body: JSON.stringify({
            sender: 'comment',
            timestamp: Date.now(),
            userId: rp.context.user.userId,
            type: 'comment/comment-content',
            payload: {
              contentId: rp.args.record.contentId
            }
          })
        })
        const json = await eventResponse.json()
        return result
      } catch (e) {
        throw e
      }

    })
  })
  return {
    schema: GQC.buildSchema(),
    models
  }
}
