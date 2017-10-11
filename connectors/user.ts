import * as mongoose from 'mongoose'
import ApolloClient from 'apollo-client'
import Link from 'apollo-link-http'
import Cache from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

const UserInfoResolver = gql`
  query UserInfoResolver($userId: String!){
    resolveUserInfo(_id: $userId) {
      _id
      name
      profilePictureURL
    }
  }
`

const getUserIdFromTokenQuery = gql`
  query getUserIdFromToken($token: String!){
    getUserIdFromToken(token: $token)
  }
`

export type GQUserConnector = {
  resolveUserInfo: (userId: string) => Promise<GBUserType>
  getUserIdFromToken: (token: string) => Promise<string>
}

export default (config: { logger: ApplicationLogger, endpoint: string, userModel: mongoose.Model<GQUserDocument> }): GQUserConnector => {
  const nap = new ApolloClient(({
    link: new Link({
      uri: config.endpoint
    }),
    cache: new Cache({})
  }) as any)
  return {
    async resolveUserInfo(userId) {
      if (!userId) {
        return null
      }
      const user = await nap.query<{resolveUserInfo: GBUserType}>({
        query: UserInfoResolver,
        variables: { userId },
        fetchPolicy: 'network-only'
      })
        .then((result) => result.data ? result.data.resolveUserInfo : null)
        .catch((error) => {
          config.logger.log(`nap error: ${error.message}`)
          return null
        })
      if (user && user._id) {
        config.userModel.findOneAndUpdate({
          _id: userId
        }, {
          name: user.name,
          profilePictureURL: user.profilePictureURL
        }, {
          upsert: true
        }).exec().catch((error) => {
          config.logger.log(`cant update user [${userId}] with message error: ${error.message}`)
        })
      }
      if (!user) {
        return config.userModel.findById(userId)
      }
      return user
    },
    getUserIdFromToken(token) {
      return nap.query<{getUserIdFromToken: string}>({
        query: getUserIdFromTokenQuery,
        variables: { token },
        fetchPolicy: 'network-only'
      })
        .then((result) => result.data ? result.data.getUserIdFromToken : null)
        .catch((error) => {
          config.logger.log(`nap error: ${error.message}`)
          return null
        })
    }
  }
}
