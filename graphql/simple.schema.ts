import { makeExecutableSchema } from 'graphql-tools';
const packageInfo = require('../package.json')

// Define global Models
declare global {

}

export default makeExecutableSchema({
  typeDefs: `
    type Query {
      version: String
    }

  `,
  resolvers: {
    Query: {
      version: () => packageInfo.version,
    }
  }
})
