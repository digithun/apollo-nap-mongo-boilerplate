import { TypeComposer } from 'graphql-compose'

export function createThreadWrapResolver(next) {
  return async (rp) => {
    const context: GQResolverContext = rp.context
    const result = await next(rp)
    if (!result) {
      context.logger.log('Thread: Create new thread...')
      try {
        const newThread = await context.models.Thread.create({
          appId: rp.args.filter.appId,
          contentPrefix: rp.args.filter.contentPrefix,
          contentId: rp.args.filter.contentId
        })
        return newThread
      } catch (e) {
        context.logger.log(e)
        throw new Error('Create thread error')
      }
    }
    return result
  }
}

export default function enchanceCreate(typeComposer: TypeComposer) {
  const findAndUpdateThread = typeComposer
    .getResolver('findOne')
    .wrapResolve(createThreadWrapResolver)
  findAndUpdateThread.description = 'Find thread by AppId, ContentPrefix and ContentId'
  findAndUpdateThread.getArgTC('filter').makeRequired('appId')
  findAndUpdateThread.getArgTC('filter').makeRequired('contentId')
  findAndUpdateThread.getArgTC('filter').removeField('_ids')
  typeComposer.setResolver('findAndUpdate', findAndUpdateThread)
}
