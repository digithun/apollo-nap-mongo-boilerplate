import { TypeComposer, ResolverNextRpCb, Resolver, ResolverRpCb } from 'graphql-compose'

export const guardWrapResolver: ResolverNextRpCb<GQCommentDocument, GQResolverContext> = (next) => {
  return async (rp) => {
    const args: any = rp.args as any
    const { context } = rp

    const comment = await rp.context.models.Comment.findById(rp.args.commentId)
    if (!comment) {
      throw new Error('comment not exists')
    }
    if (!rp.context.token) {
      throw new Error('unauthorized')
    }
    if (!await rp.context.connectors.User.verifyAvailableUserId(rp.context.token, rp.args.userId)) {
      throw new Error('no permission')
    }
    return next(rp)
  }
}
