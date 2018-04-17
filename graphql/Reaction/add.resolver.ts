import * as mongoose from 'mongoose'
import { TypeComposer, ResolverNextRpCb, Resolver, ResolverRpCb } from 'graphql-compose'
import { GraphQLMongoID } from 'graphql-compose-mongoose'
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLEnumType, GraphQLString } from 'graphql'
import { guardWrapResolver } from './utils'
import gql from 'graphql-tag'

type GQAddArgs = {
  commentId: string
  type: ReactionType
  userId: string
}

export const addResolve: ResolverRpCb<any, GQResolverContext> = async (rp) => {
  const args: GQAddArgs = rp.args as any
  const reaction = await rp.context.models.Reaction.findOne({ commentId: args.commentId, userId: args.userId })
  if (reaction) {
    throw Error("already-exists")
  }
  await rp.context.models.Reaction.create({
    commentId: args.commentId,
    userId: args.userId,
    type: args.type,
  })
  const reactionSummary = await rp.context.models.Reaction.aggregateByCommentId(mongoose.Types.ObjectId(args.commentId))
  await rp.context.models.Comment.findOneAndUpdate({ _id: args.commentId }, { $set: { reactionSummary } }, { new: true })
  return true
}

export default function enchanceCreate(typeComposer: TypeComposer) {
  const addResolver = new Resolver({
    name: "add",
    description: "add reaction to comment",
    type: 'Boolean',
    args: {
      'commentId': { type: new GraphQLNonNull(GraphQLMongoID) },
      'userId': { type: new GraphQLNonNull(GraphQLString), },
      'type': { type: new GraphQLNonNull(GraphQLString), },
    },
    resolve: addResolve,
  })
  typeComposer.setResolver('add', addResolver.wrapResolve(guardWrapResolver))
}
