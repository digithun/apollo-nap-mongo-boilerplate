import { Model } from 'mongoose'
import { TypeComposer } from 'graphql-compose'
import composeWithMongoose from 'graphql-compose-mongoose'
import schema from './comment.schema'
import addReplyResolver from './reply.resolver'
import addConnectionResolver from './connection.resolver'

export default {
  schema,
  createTypeComposer: (CommentModel): TypeComposer => {
    const typeComposer = composeWithMongoose(CommentModel) as TypeComposer
    addReplyResolver(typeComposer)
    addConnectionResolver(typeComposer)
    return typeComposer
  },
  createGraphQLRelation: (typeComposers) => {
    typeComposers.Comment.addRelation('thread', {
      resolver: typeComposers.Thread.getResolver('findById'),
      prepareArgs: {
        _id: (source) => source._id
      }
    })

    typeComposers.Comment.addRelation('comments', {
      resolver: typeComposers.Comment.getResolver('findMany'),
      prepareArgs: {
        filter: (source) => ({
          replyToId: source._id.toString()
        })
      }
    })

    typeComposers.Comment.addRelation('commentConnection', {
      resolver: typeComposers.Comment.getResolver('connection'),
      prepareArgs: {
        filter: (source) => ({
          replyToId: source._id.toString()
        })
      }
    })

    typeComposers.Comment.addRelation('user', {
      resolver: typeComposers.User.getResolver('getUserInfo'),
      prepareArgs: {
        _id: (source) => source.userId
      },
      projection: { userId: true }
    })
  }
} as GQTypeComposerStrategy<GQCommentDocument>
