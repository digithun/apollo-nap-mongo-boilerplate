import * as mongoose from 'mongoose'
import { TypeComposer, ResolverNextRpCb, Resolver, ResolverRpCb } from 'graphql-compose'
import { GraphQLMongoID } from 'graphql-compose-mongoose'
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLEnumType, GraphQLString } from 'graphql'
import { guardWrapResolver, updateReactionSummary } from './utils'
import gql from 'graphql-tag'

type GQAddArgs = {
  contentType: string
  contentId: string
  type: ReactionType
  userId: string
}

export const addResolve: ResolverRpCb<any, GQResolverContext> = async (rp) => {
  const args: GQAddArgs = rp.args as any
  const reaction = await rp.context.models.Reaction.findOne({ contentType: args.contentType, contentId: args.contentId, userId: args.userId })
  if (reaction) {
    throw Error("already-exists")
  }
  await rp.context.models.Reaction.create({
    contentType: args.contentType,
    contentId: args.contentId,
    userId: args.userId,
    type: args.type,
  })
  await updateReactionSummary(rp.context.models, args.contentType, mongoose.Types.ObjectId(args.contentId))
  return true
}

export default function enchanceCreate(typeComposer: TypeComposer) {
  const addResolver = new Resolver({
    name: "add",
    description: "add reaction to comment",
    type: "Boolean",
    args: {
      "contentType": { type: new GraphQLNonNull(GraphQLString) },
      "contentId": { type: new GraphQLNonNull(GraphQLMongoID) },
      "userId": { type: new GraphQLNonNull(GraphQLString), },
      "type": { type: new GraphQLNonNull(GraphQLString), },
    },
    resolve: addResolve,
  })
  typeComposer.setResolver('add', addResolver.wrapResolve(guardWrapResolver))
}
