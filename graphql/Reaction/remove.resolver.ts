import * as mongoose from 'mongoose'
import { TypeComposer, ResolverNextRpCb, Resolver, ResolverRpCb } from 'graphql-compose'
import { GraphQLMongoID } from 'graphql-compose-mongoose'
import { GraphQLInputObjectType, GraphQLNonNull, GraphQLEnumType, GraphQLString } from 'graphql'
import { guardWrapResolver, updateReactionSummary } from './utils'
import gql from 'graphql-tag'

type GQRemoveArgs = {
  contentType: string
  contentId: string
  userId: string
}

export const removeResolve: ResolverRpCb<any, GQResolverContext> = async (rp) => {
  const args: GQRemoveArgs = rp.args as any
  const count = await rp.context.models.Reaction.delete({ userId: args.userId, contentType: args.contentType, contentId: args.contentId, deleted: false }).then(r => r.n)
  if (count === 0) {
    return false
  }
  await updateReactionSummary(rp.context.models, args.contentType, mongoose.Types.ObjectId(args.contentId))
  return true
}

export default function enchanceCreate(typeComposer: TypeComposer) {
  const resolver = new Resolver({
    name: "remove",
    description: "remove reaction from comment",
    type: "Boolean",
    args: {
      "contentType": { type: new GraphQLNonNull(GraphQLString) },
      "contentId": { type: new GraphQLNonNull(GraphQLMongoID) },
      "userId": { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: removeResolve,
  })
  typeComposer.setResolver("remove", resolver.wrapResolve(guardWrapResolver))
}
