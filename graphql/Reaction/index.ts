import { Model } from 'mongoose'
import { TypeComposer } from 'graphql-compose'
import composeWithMongoose from 'graphql-compose-mongoose'
import schema from './reaction.schema'
import addAddResolver from './add.resolver'
import addRemoveResolver from './remove.resolver'

export default {
  schema,
  createTypeComposer: (CommentModel): TypeComposer => {
    const typeComposer = composeWithMongoose(CommentModel) as TypeComposer
    addAddResolver(typeComposer)
    addRemoveResolver(typeComposer)
    return typeComposer
  },
  createGraphQLRelation: (typeComposers) => {
  }
} as GQTypeComposerStrategy<GQReactionDocument>
