import * as mongoose from 'mongoose'
import { TypeComposer, Resolver, ResolverRpCb } from 'graphql-compose'
import { GraphQLNonNull } from 'graphql'
import { GraphQLMongoID } from 'graphql-compose-mongoose'

export const getUserInfoResolve: ResolverRpCb<GQUserDocument, GQResolverContext> = async (rp) => {
  const result = await rp.context.connectors.User.resolveUserInfo(rp.args._id)
    .catch((error) => {
      rp.context.logger.log(`cant resolve user info id ${rp.args._id}`)
      return null
    })
  return result
}

export default function enhance(typeComposer: TypeComposer) {
  const getUserInfoResolver = new Resolver<GQUserDocument, GQResolverContext>({
    name: 'getUserInfo',
    type: typeComposer,
    args: {
      _id: { type: new GraphQLNonNull(GraphQLMongoID) }
    },
    resolve: getUserInfoResolve
  })
  typeComposer.addResolver(getUserInfoResolver)
}
