import { TypeComposer, ResolverNextRpCb, Resolver, ResolverRpCb } from 'graphql-compose'

export const guardWrapResolver: ResolverNextRpCb<GQCommentDocument, GQResolverContext> = (next) => {
  return async (rp) => {
    const args: any = rp.args as any
    const { context } = rp

    if (args.contentType === "THREAD") {
      const thread = await rp.context.models.Thread.findById(rp.args.contentId)
      if (!thread) {
        throw new Error('thread not exists')
      }
    } else if (args.contentType === "COMMENT") {
      const comment = await rp.context.models.Comment.findById(rp.args.contentId)
      if (!comment) {
        throw new Error('comment not exists')
      }
    }
    if (!rp.context.token) {
      throw new Error('unauthorized')
    }
    // if (!await rp.context.connectors.User.verifyAvailableUserId(rp.context.token, rp.args.userId)) {
    //   throw new Error('no permission')
    // }
    return next(rp)
  }
}

export const updateReactionSummary = async (models: GQApplicationModels, contentType, contentId) => {
  const reactionSummary = await models.Reaction.getSummary(contentType, contentId)
  if (contentType === "THREAD") {
    await models.Thread.findOneAndUpdate({ _id: contentId }, { $set: { reactionSummary } }, { new: true })
  } else if (contentType === "COMMENT") {
    await models.Comment.findOneAndUpdate({ _id: contentId }, { $set: { reactionSummary } }, { new: true })
  }
}
