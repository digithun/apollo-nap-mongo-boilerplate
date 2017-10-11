import * as mongoose from 'mongoose'

export type GQUserConnector = {
  resolveUserInfo: (userId: string) => Promise<GBUserType>
  getUserIdFromToken: (token: string) => Promise<string>
}

export default (config: { logger: ApplicationLogger, endpoint: string, userModel: mongoose.Model<GQUserDocument> }): GQUserConnector => ({
  async resolveUserInfo(userId) {
    const user = await Promise.resolve({
      name: 'mock',
      profileImageURL: null,
      _id: userId
    })
    if (user && user._id) {
      config.userModel.findOneAndUpdate({
        _id: user._id
      }, {
        name: user.name,
        profileImageURL: user.profileImageURL
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
    return Promise.resolve('mock-user-id')
  }
})
