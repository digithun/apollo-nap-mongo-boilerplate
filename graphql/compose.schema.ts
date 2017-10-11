
import { GQC, TypeComposer } from 'graphql-compose'
import * as mongoose from 'mongoose'
import thread from './Thread'
import comment from './Comment'
import user from './User'

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

  interface GQCreateOneResult<Document> {
    record: Document
    recordId: mongoose.Types.ObjectId
  }
}

export default function createSchema(connection: mongoose.Connection) {
  const models = {
    Thread: connection.model<GQThreadDocument>('Thread', thread.schema),
    Comment: connection.model<GQCommentDocument>('Comment', comment.schema),
    User: connection.model<GQUserDocument>('User', user.schema),
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
    reply: typeComposers.Comment.getResolver('reply')
  })
  return {
    schema: GQC.buildSchema() ,
    models
  }
}
