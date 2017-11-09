
import { takeEvery, select, put } from 'redux-saga/effects'
import { ObservableQuery } from 'apollo-client'
import * as Actions from './actions'
import { ThreadQuery } from './graphql'
import gql from 'graphql-tag'
import UIThread from './components/UIThread'
export const MAX_COMMENT_PER_REQUEST = 3
interface ThreadResultType extends GBThreadType {
  comments: GQConnectionResult<GBCommentType>
}
interface CommentListQueryResult {
  thread: ThreadResultType
}
export function getLatestCursorOfConnectionEdges(connection: GQConnectionResult<GBCommentType>): string {
  if (connection.edges.length <= 0) {
    return undefined
  }
  return connection.edges[connection.edges.length - 1].cursor
}
async function initFetchQuery(context: ApplicationSagaContext, variables: any): Promise<ObservableQuery<CommentListQueryResult>> {

  const firstCommentQuery = context.apolloClient.watchQuery<CommentListQueryResult>({
    query: ThreadQuery,
    variables
  })
  const firstCommentList = await firstCommentQuery.result()
  const loadMoreCommentQuery = context.apolloClient.watchQuery<CommentListQueryResult>({
    query: ThreadQuery,
    variables: {
      ...variables,
      after: getLatestCursorOfConnectionEdges(firstCommentList.data.thread.comments)
    }
  })
  await loadMoreCommentQuery.result()
  return loadMoreCommentQuery
}

export function* replySaga(context: ApplicationSagaContext) {

  const ThreadQueryVariables = {
    filter: {
      contentId: context.url.query.contentId,
      appId: context.url.query.appId
    },
    first: MAX_COMMENT_PER_REQUEST,
  }



  /**
   * Begin fetching first data
   */
  yield put({ type: 'global/loading-start' })
  const commentObservableQuery: ObservableQuery<CommentListQueryResult> = yield initFetchQuery(context, ThreadQueryVariables)
  const result = yield commentObservableQuery.result()
  yield put(Actions.set({ hasNextPage: result.data.thread.comments.pageInfo.hasNextPage }))
  yield put({ type: 'global/loading-done' })


  /**
   * reload thread information if contentId change
   */
  yield takeEvery<{type: string, payload: string}>(Actions.reload, function*(action) {
    ThreadQueryVariables.filter.contentId = action.payload
    initFetchQuery(context, ThreadQueryVariables)
  })


  /**
   * Loadmore from latest cursor
   * and rewrite to loadmoreComment collection
   */
  yield takeEvery<{ type: string }>(Actions.loadMoreReplyList, function*(action) {
    yield put({ type: 'global/loading-start' })
    const data = context.apolloClient.readQuery<CommentListQueryResult>({ query: ThreadQuery, variables: commentObservableQuery.variables })
    const lastCursor = getLatestCursorOfConnectionEdges(data.thread.comments)
    const loadMoreCommentResult: { data: CommentListQueryResult } = yield context.apolloClient.query<CommentListQueryResult>({
      query: ThreadQuery,
      variables: {
        ...ThreadQueryVariables,
        after: lastCursor
      }
    })

    context.apolloClient.writeQuery({
      query: ThreadQuery,
      variables: {
        ...commentObservableQuery.variables,
      },
      data: Object.assign({}, data, {
        thread: {
          ...data.thread,
          comments: {
            ...data.thread.comments,
            edges: [...data.thread.comments.edges, ...loadMoreCommentResult.data.thread.comments.edges]
          }
        }
      })
    })

    yield put(Actions.set({ hasNextPage: loadMoreCommentResult.data.thread.comments.pageInfo.hasNextPage }))
    yield put({ type: 'global/loading-done' })

  })

  /**
   * reply/confirm-create-comment
   * reply comment to thread
   */
  yield takeEvery<{ payload: Actions.ConfirmCreateCommentPayload, type: string }>(Actions.confirmCreateComment, function*(action) {
    yield put({ type: 'global/loading-start' })
    const commentInputData = yield select<ApplicationState>((state) => state.reply)
    const variables = ThreadQueryVariables
    let queryResult = context.apolloClient.readQuery<{ thread: GBThreadType }>({
      query: ThreadQuery,
      variables
    })
    if (!queryResult.thread) {

      // check if data is undefined
      // reload data if data is not available

      queryResult = yield context.apolloClient.query({
        query: ThreadQuery,
        variables
      })

    }
    const data = context.apolloClient.readQuery<any>({ query: ThreadQuery, variables: ThreadQueryVariables })
    context.apolloClient.writeQuery({
      query: ThreadQuery,
      variables: ThreadQueryVariables,
      data: Object.assign({}, data, {
        thread: {
          ...data.thread,
          comments: {
            ...data.thread.comments,
            edges: [
              {
                __typename: 'CommentEdge',
                cursor: '',
                node: {
                  _id: 'optimisitc-comment-id',
                  createdAt: new Date(),
                  threadId: queryResult.thread._id,
                  message: commentInputData.message,
                  user: {
                    ...commentInputData.user,
                    __typename: 'User'
                  },
                  __typename: 'Comment'
                }
              },
              ...data.thread.comments.edges,
            ]
          }
        }
      })
    })
    try {
      const mutationResult = yield context.apolloClient.mutate({
        variables: {
          record: {
            threadId: queryResult.thread._id,
            message: commentInputData.message,
            userId: commentInputData.user._id,
          }
        },
        mutation: gql`
        ${UIThread.fragments.comment}
        mutation ($record: CreateOneCommentInput!) {
         reply (record: $record) {
           record {
             _id
             ...UICommentDataFragment
           }
         }
        }
      ` })
      context.apolloClient.writeQuery({
        query: ThreadQuery,
        variables: ThreadQueryVariables,
        data: Object.assign({}, data, {
          thread: {
            ...data.thread,
            comments: {
              ...data.thread.comments,
              edges: [
                {
                  __typename: 'CommentEdge',
                  cursor: '',
                  node: {
                    _id: mutationResult.data.reply.record._id,
                    createdAt: new Date(),
                    threadId: queryResult.thread._id,
                    message: commentInputData.message,
                    user: {
                      ...commentInputData.user,
                      __typename: 'User'
                    },
                    __typename: 'Comment'
                  }
                },
                ...data.thread.comments.edges.filter(( node ) => node._id !== 'optimistic-comment-id'),
              ]
            }
          }
        })
      })
      yield put({ type: 'reply/clear' })
    } catch (e) {
      console.error(e)
      alert('ไม่สามารถ Comment ได้ เกิดข้อผิดพลาดบางอย่าง')
    }
    yield put({ type: 'global/loading-done' })
  })
}
