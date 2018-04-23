import { GraphQLObjectType, GraphQLString } from 'graphql'
import { GQC, TypeComposer } from 'graphql-compose'
import * as mongoose from 'mongoose'
import thread from './Thread'
import { wrapResolvers } from 'graphql-compose-schema-wrapper'
import comment from './Comment'
import user from './User'
import reaction from './Reaction'
import 'isomorphic-fetch'

declare global {
  type GQTypeComposers = {
    Thread: TypeComposer
    Comment: TypeComposer
    User: TypeComposer
    Reaction: TypeComposer
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
    Reaction: mongoose.Model<GQReactionDocument> & { getSummary: (type: any, id: any) => any, delete: any }
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

  const models: GQApplicationModels = {
    Thread: __connection.model<GQThreadDocument>('Thread', thread.schema),
    Comment: __connection.model<GQCommentDocument>('Comment', comment.schema),
    User: __connection.model<GQUserDocument>('User', user.schema),
    Reaction: __connection.model<GQReactionDocument>('Reaction', reaction.schema) as any
  }
  const typeComposers: GQTypeComposers = {
    Thread: thread.createTypeComposer(models.Thread),
    Comment: comment.createTypeComposer(models.Comment),
    User: user.createTypeComposer(models.User),
    Reaction: reaction.createTypeComposer(models.Reaction),
  }

  thread.createGraphQLRelation(typeComposers)
  comment.createGraphQLRelation(typeComposers)
  const Viewer = TypeComposer.create("Viewer")
  Viewer.addFields({
    threads: typeComposers.Thread.getResolver('findMany'),
    thread: typeComposers.Thread.getResolver('findAndUpdate'),
    comment: typeComposers.Comment.getResolver('findById')
  })

  GQC.rootQuery().addFields({
    viewer: {
      type: Viewer,
      args: {
        userId: { type: GraphQLString },
      },
      resolve: (source, args, context) => {
        if (args.userId) {
          context.userId = args.userId
        }
        return {}
      }
    },
    threads: typeComposers.Thread.getResolver('findMany'),
    thread: typeComposers.Thread.getResolver('findAndUpdate'),
    comment: typeComposers.Comment.getResolver('findById')
  })
  GQC.rootMutation().addFields({
    addReaction:typeComposers.Reaction.getResolver('add'),
    removeReaction:typeComposers.Reaction.getResolver('remove'),
    createThread: typeComposers.Thread.getResolver('createOne'),
    ...wrapResolvers<any, { user: any }>({
      updateCommentById: typeComposers.Comment.getResolver('updateById'),
      remove: typeComposers.Comment.getResolver('remove'),
    }, (next) => async (rp) => {
      if (rp.context.user) {
        return next(rp)
      } else {
        throw new Error('unauthorized')
      }
    }),
    ...wrapResolvers<any, { user: any }>({
      reply: typeComposers.Comment.getResolver('reply')
    }, (next) => async (rp) => {
      const result = await next(rp)
      try {

        if (!rp.projection.record) {
          rp.projection.record = {}
        }
        if (!rp.projection.record.thread) {
          rp.projection.record.thread = {}
        }

        rp.projection.record.thread.contentId = {}

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
        console.error('[post-reply] cannot dispatch event message to event service...')
        return result
      }

    })
  })
  return {
    schema: GQC.buildSchema(),
    models
  }
}
