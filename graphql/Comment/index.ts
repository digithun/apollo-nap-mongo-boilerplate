import { Model } from 'mongoose'
import { TypeComposer } from 'graphql-compose'
import composeWithMongoose from 'graphql-compose-mongoose'
import schema from './comment.schema'
import addReplyResolver from './reply.resolver'

export default {
  schema,
  createTypeComposer: (CommentModel): TypeComposer => {
    const typeComposer = composeWithMongoose(CommentModel) as TypeComposer
    addReplyResolver(typeComposer)
    return typeComposer
  }
} as GQTypeComposerStrategy<GQCommentDocument>
