import * as mongoose from 'mongoose'
import { TypeComposer, ResolverNextRpCb } from 'graphql-compose'

export default function enhanceRemove(typeComposer: TypeComposer) {

  // to reply comment
  // request should have session
  const removeResolver = typeComposer
    .getResolver('removeById')
    .clone({ name: 'remove' })
    .wrapResolve((next) => async (rp) => {
      const { args } = rp
      const context: GQResolverContext = rp.context

      const comment = await context.models.Comment.findById(args._id)
      if (!comment) {
        throw new Error('no comment id found')
      }

      if (!await context.connectors.User.verifyAvailableUserId(context.token, comment.userId)) {
        throw new Error('no permission')
      }
      return next(rp)
    })

  typeComposer.setResolver('remove', removeResolver)
}
