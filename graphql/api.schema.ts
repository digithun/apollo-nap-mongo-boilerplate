import { makeExecutableSchema } from 'graphql-tools';
import config from '../config'

// Define global Models
declare global {

}

export default makeExecutableSchema({
  typeDefs: `
    type API {
      commentCount(appId: String!, contentIds: [String!]!): [Int!]!
    }
    type Query {
      api(key: String!): API
    }
  `,
  resolvers: {
    Query: {
      api: (source, args, context) => {
        if (args.key !== config.API_KEY) {
          throw new Error('key not valid')
        }
        return {}
      },
    },
    API: {
      commentCount: async (source, args, context: GQResolverContext) => {
        const threads = await context.models.Thread.find({ appId: args.appId, contentId: { $in: args.contentIds } }, { _id: 1, contentId: 1 })
        const threadIds = threads.map((t) => t._id)
        const result: any[] = await context.models.Comment.aggregate([
          { $match: { threadId: { $in: threadIds } } },
          { $group: { _id: '$threadId', count: { $sum: 1 } } }
        ])
        return args.contentIds.map((id) => {
          const foundThread = threads.find((t) => t.contentId === id)
          if (!foundThread) { return 0 }
          const r = result.find((_r) => _r._id.toString() === foundThread._id.toString())
          if (!r) { return 0 }
          return r.count
        })
      }
    }
  }
})
