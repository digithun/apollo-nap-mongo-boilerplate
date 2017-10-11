import { Model } from 'mongoose'
import { TypeComposer } from 'graphql-compose'
import composeWithMongoose from 'graphql-compose-mongoose'

import enhanceGetUserInfo from './getUserInfo.resolver'
import schema from './user.schema'

export default {
  schema,
  createTypeComposer: (UserModel): TypeComposer => {
    const typeComposer = composeWithMongoose(UserModel) as TypeComposer
    enhanceGetUserInfo(typeComposer)
    return typeComposer
  }
} as GQTypeComposerStrategy<GQUserDocument>
