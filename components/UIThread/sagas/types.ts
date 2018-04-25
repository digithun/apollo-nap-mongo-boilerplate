import { ObservableQuery } from 'apollo-client'

/** 
 * ThreadContext
 * - context of thread for share between sagas
*/
export type ThreadContext = { commentObservableQuery: ObservableQuery<CommentListQueryResult>, queryVariables: any }
export interface ThreadResultType extends GBThreadType {
  comments: GQConnectionResult<GBCommentType>
}

export interface CommentListQueryResult {
  viewer: {
    thread: ThreadResultType
  }
}