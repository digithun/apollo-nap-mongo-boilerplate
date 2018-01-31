import { mergeSchemas } from 'graphql-tools';

import createSchemaFromCompose from './compose.schema'
import simpleSchema from './simple.schema'

let __models
export function getModels(context: SVContext) {
  if (__models) {
    return __models
  } else {
    // create model if not initial
    throw new Error('Unimplemented: index.ts/getModels')
  }
}
export function createGraphQLSchema(context: SVContext) {

  const graphqlComposeSchema = createSchemaFromCompose(context)

  const schemas = [simpleSchema, graphqlComposeSchema.schema]
  __models = graphqlComposeSchema.models
  return {
    models: __models,
    schema: mergeSchemas({
      schemas,
      resolvers: (mergeInfo) => ({

      })
    })
  }
}
