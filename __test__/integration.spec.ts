import * as express from 'express'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import {
  IntrospectionFragmentMatcher,
  InMemoryCache
} from 'apollo-cache-inmemory'

import { Connection, Model } from 'mongoose'

import * as DBConnection from '../lib/db.connection'
import config from '../config'
import initServer from '../server'
import { Server } from 'http';
import gql from 'graphql-tag';

const SIGN_IN_WITH_EMAIL_MUTATION = `
  mutation signin($username: String!, $password: String!) {
    login(email: $username, password: $password) {
      isLoggedIn
      sessionToken
      user {
        email
        authors {
          id
          _id
          name
          profilePicture
        }
        profilePicture
      }
    }
  }
`

describe('Comment API integration test', () => {
  let client: any
  let clientWithToken: any
  let server: Server
  let token: string
  let __connection: Connection
  beforeAll(async () => {
    return new Promise(async (resolve, reject) => {
      __connection = await DBConnection.initConnection({
        logger: console,
        config
      })
      const SVContext: SVContext = {
        config,
        logger: console,
        __connection,
      }
      const sv = await initServer(SVContext)
      server = sv.server.listen(4912, () => {
        resolve()
        const cache: any = new InMemoryCache({})
        const link:any = new HttpLink({
          uri: 'http://localhost:4912/graphql'
        })
        const linkWithAuth = new HttpLink({
          uri: 'http://localhost:4912/graphql',
          headers: {
            authorization: `Bearer ${this.props.url.query.sessionToken}`
          }
        })
        client = new ApolloClient({ link, cache })
        clientWithToken = new ApolloClient({link: linkWithAuth, cache })
      })
      // get token
      const payload = {
        query: SIGN_IN_WITH_EMAIL_MUTATION,
        variables: {
          username: process.env.TEST_USERNAME,
          password: process.env.TEST_PASSWORD
        }
      }
      const response = await fetch(this.props.config.NAP_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      token = result.data.login.sessionToken
    })
  })
  it('should able to query comment without auth', async () => {
    const result = await client.query({
      query: gql`
        query {
          version
        }
      `
    })
    expect(result.data).toEqual(expect.anything())
  })
  it('should unable to reply without auth', async () => {
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation {
            reply(record: { userId: "user.5a4ef5dcba7783000fa79d3c", message: "test", contentId: "episode.599bbc8bf5be162888e5dabe" }) {
              recordId
            }
          }
     `
      })
    } catch (e) {
      expect(e.graphQLErrors[0].message).toEqual('unauthorized')
    }
  })

  it('should unable to reply without auth', async () => {
    try {
      const result = await client.mutate({
        mutation: gql`
          mutation {
            reply(record: { userId: "user.5a4ef5dcba7783000fa79d3c", message: "test", contentId: "episode.599bbc8bf5be162888e5dabe" }) {
              recordId
            }
          }
     `
      })
    } catch (e) {
      expect(e.graphQLErrors[0].message).toEqual('unauthorized')
    }
  })

  afterAll(async () => {
    __connection.close(() => {
      server.close()
    })
  })
})
