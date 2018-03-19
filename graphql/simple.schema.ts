import { makeExecutableSchema } from 'graphql-tools';

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
      version: () => {
        const packageInfo = require('../package.json')
        return packageInfo.version
      },
    }
  }
})
