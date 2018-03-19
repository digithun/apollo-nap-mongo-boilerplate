import * as mongoose from 'mongoose'
import { TypeComposer, ResolverNextRpCb } from 'graphql-compose'
import gql from 'graphql-tag';

declare global {
  type GQReplyArgs = {
    record: {
      threadId?: mongoose.Types.ObjectId
      userId: string
      message: string
      replyToId?: string
      contentId?: string
    }
  }
}

export const guardWrapResolver: ResolverNextRpCb<GQCommentDocument, GQResolverContext> = (next) => {
  return async (rp) => {
    const args: GQReplyArgs = rp.args as any
    const { context } = rp

    /**
     * Check content is visible in platform
     * by split prefix and id
     */
    const words = args.record.contentId.split('.')
    const prefix = words[0]
    const id = words[1]
    if (prefix && id) {
      try {

        const response = await fetch(context.config.NAP_URI, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: `
              query {
                ${prefix} (_id: "${id}") {
                  _id
                }
              }
            `
          })
        })
        const result = await response.json()
        if (!result.data.episode) {
          throw new Error('no-content')
        }
      } catch (e) {
        console.error(e)
        const error = new Error()
        error.name = 'error/content-not-found'
        throw error
      }
    }

    const thread = await rp.context.models.Thread.findOne({ contentId: args.record.contentId })
    // if (!rp.context.user) {
    //   throw new Error('unauthorized')
    // }
    if (!rp.context.token) {
      throw new Error('unauthorized')
    }
    if (!await rp.context.connectors.User.verifyAvailableUserId(rp.context.token, args.record.userId)) {
      throw new Error('no permission')
    }
    if (!thread) {
      throw new Error('thread not exists')
    }

    // check if episode avaiable to reploy
    const content = await rp.context.connectors.User.checkAvaliableToReplyContentByToken(rp.context.token, rp.args.record.contentId)
    if (content.isLockedBy) {
        throw new Error(`episode/is-locked-by-${content.isLockedBy}`)
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
    rp.args.record.threadId = thread._id
    return next(rp)
  }
}

export const assignUserResolver: ResolverNextRpCb<GQCommentDocument, GQResolverContext> = (next) => {
  return async (rp) => {
    // const args: GQCreateOneArgs<GBCommentType> = rp.args as any
    // args.record.userId = rp.context.user._id
    return next(rp)
  }
}

export default function enchanceCreate(typeComposer: TypeComposer) {

  // to reply comment
  // request should have session
  const replyResolver = typeComposer
    .getResolver('createOne')
    .clone({ name: 'reply' })
    .wrapResolve(guardWrapResolver)

  replyResolver.description = 'Reply thread or comment'
  replyResolver.getArgTC('record').removeOtherFields(['message', 'replyToId', 'userId'])
  replyResolver.makeRequired('record')
  replyResolver.getArgTC('record').addFields({
    contentId: {
      type: 'String!'
    }
  })
  replyResolver.getArgTC('record').makeRequired(['message', 'threadId', 'userId'])

  typeComposer.setResolver('reply', replyResolver)
}
