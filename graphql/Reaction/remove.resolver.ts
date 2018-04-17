import * as mongoose from 'mongoose'
import { TypeComposer, ResolverNextRpCb, Resolver, ResolverRpCb } from 'graphql-compose'
import { GraphQLMongoID } from 'graphql-compose-mongoose'
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLEnumType, GraphQLString } from 'graphql'
import { guardWrapResolver } from './utils'
import gql from 'graphql-tag'

type GQRemoveArgs = {
  commentId: string
  userId: string
}

export const removeResolve: ResolverRpCb<any, GQResolverContext> = async (rp) => {
  const args: GQRemoveArgs = rp.args as any
  await rp.context.models.Reaction.delete({ userId: args.userId, commentId: args.commentId })
  const reactionSummary = await rp.context.models.Reaction.aggregateByCommentId(mongoose.Types.ObjectId(args.commentId))
  await rp.context.models.Comment.findOneAndUpdate({ _id: args.commentId }, { $set: { reactionSummary } }, { new: true })
  return true
}

export default function enchanceCreate(typeComposer: TypeComposer) {
  const resolver = new Resolver({
    name: "remove",
    description: "remove reaction from comment",
    type: "Boolean",
    args: {
      "commentId": { type: new GraphQLNonNull(GraphQLMongoID) },
      "userId": { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: removeResolve,
  })
  typeComposer.setResolver("remove", resolver.wrapResolve(guardWrapResolver))
}
