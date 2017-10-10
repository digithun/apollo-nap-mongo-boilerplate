export type GQNapConnector = {
  resolveUserInfo: (userId: string) => Promise<GBUserType>
  getUserIdFromToken: (token: string) => Promise<string>
}

export default (config: { endpoint: string }) : GQNapConnector => ({
  resolveUserInfo(userId) {
    return Promise.resolve({
      name: 'mock',
      thumbnailImageURL: null,
      _id: 'mock'
    })
  },
  getUserIdFromToken(token) {
    return Promise.resolve('mock-user-id')
  }
})
