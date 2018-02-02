
import { takeEvery, select, put, call } from 'redux-saga/effects'
import { ObservableQuery } from 'apollo-client'
import * as Actions from './actions'
import { ThreadQuery, REMOVE_COMMENT_MUTATION, THREAD_FRAGMENT } from './graphql'
import gql from 'graphql-tag'
import UIThread from './components/UIThread'
import ApolloClient from 'apollo-client/ApolloClient';
import { OPTIMISTIC_COMMENT_ID, ALERT_ACTIONS, ERROR_ACTIONS } from './actions';
import { request } from 'https';
export const MAX_COMMENT_PER_REQUEST = 3
interface ThreadResultType extends GBThreadType {
  comments: GQConnectionResult<GBCommentType>
}
interface CommentListQueryResult {
  thread: ThreadResultType
}
export function getLatestCursorOfConnectionEdges(connection: GQConnectionResult<GBCommentType>): string {
  // remove deprecated method and use pageInfo.endCursor
  //
  // if (connection.edges.length <= 0) {
  //   return undefined
  // }
  // return connection.edges[connection.edges.length - 1].cursor

  return connection.pageInfo.endCursor
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

/**
 * Remove comment saga handler
 * - will receive thread Id from payload
 * - mutate and wait for response to confirm delete
 */

function removeComment(context: ApplicationSagaContext, loadMoreQuery: ObservableQuery<CommentListQueryResult>) {
  return function*({ type, payload }) {
    try {
      // ### Optimistic part ###
      // create variables for first 3 comment query

      function filterCommentFromTheadById(variables: any, commentId: any) {
        let data: CommentListQueryResult = context.apolloClient.readQuery({
          query: ThreadQuery,
          variables
        })
        data = Object.assign({}, data, {
          thread: {
            ...data.thread,
            comments: {
              ...data.thread.comments,
              edges: data.thread.comments.edges.filter((edge: any) => edge.node._id !== commentId),
            }
          }
        })
        context.apolloClient.writeQuery({
          query: ThreadQuery,
          variables,
          data
        })
      }

      const ThreadQueryVariables = {
        filter: {
          contentId: context.url.query.contentId,
          appId: context.url.query.appId
        },
        first: MAX_COMMENT_PER_REQUEST,
      }

      // get data from first 3 comment and "loadmore" query
      // and filter out comment in payload
      yield call(filterCommentFromTheadById, ThreadQueryVariables, payload)
      yield call(filterCommentFromTheadById, loadMoreQuery.variables, payload)

      // ### End optimistic part ###

      // start mutate at remote server

      yield call(context.apolloClient.mutate, {
        mutation: REMOVE_COMMENT_MUTATION,
        variables: {
          id: payload
        }
      })
      yield put({ type: ALERT_ACTIONS, payload: { message: 'comment-has-been-deleted' } })

    } catch (e) {
      console.error(e)
    }

  }
}

export function* replySaga(context: ApplicationSagaContext) {

  const { apolloClient } = context
  const ThreadQueryVariables = {
    filter: {
      contentId: context.url.query.contentId,
      appId: context.url.query.appId
    },
    first: MAX_COMMENT_PER_REQUEST,
  }

  /**
   * @Init data
   * Begin fetching first data
   */
  yield put({ type: 'global/loading-start' })
  let commentObservableQuery: ObservableQuery<CommentListQueryResult> = yield call(initFetchQuery, context, ThreadQueryVariables)
  let result = yield commentObservableQuery.result()
  yield put(Actions.set({ hasNextPage: result.data.thread.comments.pageInfo.hasNextPage }))
  yield put({ type: 'global/loading-done' })

  yield takeEvery(Actions.remove, removeComment(context, commentObservableQuery))
  /**
   * @Refetch
   * global/reload
   * reload thread information if contentId change
   */
  yield takeEvery<{ type: string, payload: string }>(Actions.reload, function*(action) {
    ThreadQueryVariables.filter.contentId = action.payload
    commentObservableQuery = yield call(initFetchQuery, context, ThreadQueryVariables)
    result = yield commentObservableQuery.result()
    yield put(Actions.set({ hasNextPage: result.data.thread.comments.pageInfo.hasNextPage }))
  })

  /**
   * @loadmore event
   * Loadmore from latest cursor
   * and rewrite to loadmoreComment collection
   */
  yield takeEvery<{ type: string }>(Actions.loadMoreReplyList, function*(action) {
    yield put({ type: 'global/loading-start' })
    const data: CommentListQueryResult = yield call([apolloClient, apolloClient.readQuery], { query: ThreadQuery, variables: commentObservableQuery.variables })
    const lastCursor = getLatestCursorOfConnectionEdges(data.thread.comments)
    const loadMoreCommentResult: { data: CommentListQueryResult } = yield call(apolloClient.query, {
      query: ThreadQuery,
      variables: {
        ...ThreadQueryVariables,
        after: lastCursor
      }
    })

    yield call([apolloClient, apolloClient.writeQuery], {
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
   * @Create new commment
   * reply/confirm-create-comment
   * reply comment to thread
   */

  yield takeEvery<{ payload: Actions.ConfirmCreateCommentPayload, type: string }>(Actions.confirmCreateComment, function*(action) {
    yield put({ type: 'global/loading-start' })

    const commentInputData = yield select<ApplicationState>((state) => state.reply)
    const variables = ThreadQueryVariables
    try {
      if (commentInputData.message.length > 300) {
        alert('Limit 300 charactors')
        yield put({ type: 'global/loading-done' })
        return
      }
    } catch (e) {
      console.error(e)
    }
    let queryResult: { thread: GBThreadType } = yield call([apolloClient, apolloClient.readQuery], {
      query: ThreadQuery,
      variables
    })
    console.log('get result from query')
    if (!queryResult.thread) {

      // check if data is undefined
      // reload data if data is not available

      queryResult = yield call(apolloClient.query, {
        query: ThreadQuery,
        variables
      })

    }
    const data: { thread: ThreadResultType } = yield call([apolloClient, apolloClient.readQuery], { query: ThreadQuery, variables: ThreadQueryVariables })
    yield call([apolloClient, apolloClient.writeQuery], {
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
                  _id: OPTIMISTIC_COMMENT_ID,
                  createdAt: new Date(),
                  threadId: queryResult.thread._id,
                  message: commentInputData.message,
                  userId: commentInputData.user._id,
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
      yield put({ type: Actions.DISABLED_TEXT_INPUT_DIALOG, payload: true })
      const mutationResult = yield call([apolloClient, apolloClient.mutate], {
        variables: {
          record: {
            contentId: queryResult.thread.contentId,
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
      yield call([apolloClient, apolloClient.writeQuery], {
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
                    userId: commentInputData.user._id,
                    user: {
                      ...commentInputData.user,
                      __typename: 'User'
                    },
                    __typename: 'Comment'
                  }
                },
                ...data.thread.comments.edges.filter((node: any) => node._id !== 'optimistic-comment-id'),
              ]
            }
          }
        })
      })
      yield put({ type: 'reply/clear' })
      yield put({ type: Actions.DISABLED_TEXT_INPUT_DIALOG, payload: false })
    } catch (e) {
      console.error(e)
      alert('ไม่สามารถ Comment ได้ เกิดข้อผิดพลาดบางอย่าง')
    }
    yield put({ type: 'global/loading-done' })
  })
}
