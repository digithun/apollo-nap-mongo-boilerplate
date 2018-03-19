import * as mongoose from 'mongoose'
import ApolloClient, { ApolloError } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'
import 'isomorphic-fetch'

type Config = { logger: ApplicationLogger, endpoint: string, userModel: mongoose.Model<GQUserDocument> }

const UserInfoResolver = gql`
  query UserInfoResolver($userId: String!){
    # return GQUserDocument
    resolveUserInfo(_id: $userId) {
      _id
      name
      profilePicture
    }
  }
`

const getUserIdFromTokenQuery = gql`
  query getUserIdFromToken($token: String!){
    # return string
    getUserIdFromToken(token: $token)
  }
`

const verifyAvailableCommentUserIdQuery = gql`
  query verifyAvailableCommentUserId($token: String!, $userId: String!){
    # return boolean
    verifyAvailableCommentUserId(token: $token, userId: $userId)
  }
`

const episodeQuery = gql`
 query($id: MongoID) {
   episode( _id: $id ) {
     _id
     isLockedBy
   }
 }
`

export type GQUserConnector = {
  resolveUserInfo: (userId: string) => Promise<GBUserType>
  getUserIdFromToken: (token: string) => Promise<string>
  verifyAvailableUserId: (token: string, userId: string) => Promise<boolean>

  checkAvaliableToReplyContentByToken: (token: string, contentId: string) => Promise<{ _id: any, isLockedBy?: string }>
}

const napConnector = (config: Config): GQUserConnector => {
  const nap = new ApolloClient(({
    link: new HttpLink({
      uri: config.endpoint
    }),
    cache: new InMemoryCache({})
  }) as any)
  return {
    async checkAvaliableToReplyContentByToken(token, contentId) {
      // split content prefix, id
      const content = contentId.split('.')
      const prefix = content[0]
      const id = content[1]
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: `
          query {
            ${prefix}(_id: "${id}") {
              _id
              isLockedBy
            }
          }
         `
        })
      })
      const result = await response.json()
      return result.data[prefix]
    },
    async resolveUserInfo(userId) {
      if (!userId) {
        return null
      }
      const user = await nap.query<{ resolveUserInfo: GBUserType }>({
        query: UserInfoResolver,
        variables: { userId },
        fetchPolicy: 'network-only'
      })
        .then((result) => result.data ? result.data.resolveUserInfo : null)
        .catch(async (error: ApolloError) => {
          config.logger.log(`nap error: ${error.message}`)
          return null
        })
      if (user && user._id) {
        config.userModel.findOneAndUpdate({
          _id: userId
        }, {
            name: user.name,
            profilePicture: user.profilePicture
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
      return nap.query<{ getUserIdFromToken: string }>({
        query: getUserIdFromTokenQuery,
        variables: { token },
        fetchPolicy: 'network-only'
      })
        .then((result) => result.data ? result.data.getUserIdFromToken : null)
        .catch((error) => {
          return null
        })
    },
    async verifyAvailableUserId(token, userId) {
      return nap.query<{ verifyAvailableCommentUserId: boolean }>({
        query: verifyAvailableCommentUserIdQuery,
        variables: { token, userId }
      })
        .then((result) => result.data.verifyAvailableCommentUserId)
        .catch((error) => {
          config.logger.log(`nap error: ${error.message}`)
          throw new Error('nap error')
        })
    }
  }
}

const casualConnector = (): GQUserConnector => {
  const casual = require('casual')
  const ctoi = (s: string): number => s.split('').reduce<number>((acc, c) => acc + c.charCodeAt(0), 0)
  return {
    async resolveUserInfo(userId) {
      if (!userId) {
        return null
      }
      casual.seed(ctoi(userId))
      return {
        _id: userId,
        name: casual.full_name,
        profilePicture: null
      }
    },
    async getUserIdFromToken(token) {
      casual.seed(ctoi(token))
      return casual.email
    },
    async verifyAvailableUserId(token, userId) {
      return true
    }
  }
}

export default (config: Config): GQUserConnector => {
  if (config.endpoint === 'CASUAL') {
    return casualConnector()
  }
  return napConnector(config)
}
