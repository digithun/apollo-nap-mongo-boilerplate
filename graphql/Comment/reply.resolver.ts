import * as mongoose from 'mongoose'
import { TypeComposer, ResolverNextRpCb } from 'graphql-compose'

export const guardWrapResolver: ResolverNextRpCb<GQCommentDocument, GQResolverContext> = (next) => {
  return async (rp) => {
    const args: GQCreateOneArgs<GBCommentType> = rp.args as any
    const thread = await rp.context.models.Thread.findById(args.record.threadId)
    if (!rp.context.user) {
      throw new Error('unauthorized')
    }
    if (!thread) {
      throw new Error('thread not exists')
    }
    if (args.record.replyToId) {
      const comment = await rp.context.models.Comment.findById(args.record.replyToId)
      if (!comment) {
        throw new Error('comment not exists')
      }
      if (comment.threadId.toString() !== thread._id.toString()) {
        throw new Error('comment wrong thread id')
      }
    }
    return next(rp)
  }
}

export const assignUserResolver: ResolverNextRpCb<GQCommentDocument, GQResolverContext> = (next) => {
  return async (rp) => {
    const args: GQCreateOneArgs<GBCommentType> = rp.args as any
    args.record.userId = rp.context.user._id
    return next(rp)
  }
}

export default function enchanceCreate(typeComposer: TypeComposer) {
  const replyResolver = typeComposer
    .getResolver('createOne')
    .clone({ name: 'reply' })
    .wrapResolve(guardWrapResolver)
    .wrapResolve(assignUserResolver)
  replyResolver.description = 'Reply thread or comment'
  replyResolver.getArgTC('record').removeOtherFields(['message', 'replyToId', 'threadId'])
  replyResolver.makeRequired('record')
  replyResolver.getArgTC('record').makeRequired(['message', 'threadId'])
  typeComposer.setResolver('reply', replyResolver)
}
