import * as mongoose from 'mongoose'
import { TypeComposer, ResolverNextRpCb } from 'graphql-compose'

export const guardWrapResolver: ResolverNextRpCb<GQCommentDocument,GQResolverContext> = (next) => {
  return async (rp) => {
    const args: GQCreateOneArgs<GBCommentType> = rp.args as any
    const thread = await rp.context.models.Thread.findById(args.record.threadId)
    if (!thread) {
      throw new Error('thread not exists')
    }
    if (args.record.replyToId) {
      const comment = await rp.context.models.Comment.findById(args.record.replyToId)
      if (!comment) {
        throw new Error('comment not exists')
      }
    }
    return next(rp)
  }
}

export const assignUserResolver: ResolverNextRpCb<GQCommentDocument,GQResolverContext> = next => {
  return async (rp) => {
    const args: GQCreateOneArgs<GBCommentType> = rp.args as any
    const userId = await rp.context.connectors.nap.getUserIdFromToken(rp.context.token)
    if (!userId) {
      throw new Error('unauthorized')
    }
    args.record.userId = userId
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
