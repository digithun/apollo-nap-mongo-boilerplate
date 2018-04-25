import { takeEvery, select, put, call, fork } from 'redux-saga/effects'
import { ObservableQuery } from 'apollo-client'
import * as Actions from '../actions'
import {
  THREAD_QUERY,
  THREAD_REACTION_QUERY
} from '../graphql'
import gql from 'graphql-tag'
import { request } from 'https'
import { CommentListQueryResult, ThreadContext } from './types'
import * as constants from './constants'

import removeSaga from './remove'
import replySaga from './reply'
import reactionSaga from './reaction'

export { constants }

let thread: ThreadContext = { commentObservableQuery: null, queryVariables: {} }

export function getLatestCursorOfConnectionEdges(
  connection: GQConnectionResult<GBCommentType>
): string {
  // remove deprecated method and use pageInfo.endCursor
  //
  // if (connection.edges.length <= 0) {
  // return undefined
  // }
  // return connection.edges[connection.edges.length - 1].cursor

  return connection.pageInfo.endCursor
}
async function initFetchQuery(
  context: ApplicationSagaContext,
  variables: any
): Promise<ObservableQuery<CommentListQueryResult>> {
  await context.apolloClient.query({
    query: THREAD_REACTION_QUERY,
    variables,
    fetchPolicy: "network-only"
  })

  const firstCommentQuery = context.apolloClient.watchQuery<
    CommentListQueryResult
    >({
      query: THREAD_QUERY,
      variables,
      fetchPolicy: "network-only"
    })
  const firstCommentList = await firstCommentQuery.result()
  console.log("firstCommentList", firstCommentList)
  const loadMoreCommentQuery = context.apolloClient.watchQuery<
    CommentListQueryResult
    >({
      query: THREAD_QUERY,
      variables: {
        ...variables,
        after: getLatestCursorOfConnectionEdges(
          firstCommentList.data.viewer.thread.comments
        )
      },
      fetchPolicy: "network-only"
    })
  return loadMoreCommentQuery
}

export function* saga(context: ApplicationSagaContext) {
  const { apolloClient } = context
  yield fork(removeSaga, context, thread)
  yield fork(reactionSaga, context, thread)
  yield fork(replySaga, context, thread)

  // set url query context to redux store
  yield put({
    type: 'thread/set-url-context',
    payload: { query: context.url.query }
  })
  const commentInputData = yield select<ApplicationState>(
    (state) => state.reply
  )
  thread.queryVariables = {
    filter: {
      contentId: context.url.query.contentId,
      appId: context.url.query.appId
    },
    userId: commentInputData.user ? commentInputData.user._id : null,
    first: constants.MAX_COMMENT_PER_REQUEST
  }

  /**
   * @Init data
   * Begin fetching first data
   */
  yield put({ type: 'global/loading-start' })
  thread.commentObservableQuery = yield call(
    initFetchQuery,
    context,
    thread.queryVariables
  )
  let result = yield thread.commentObservableQuery.result()

  yield put(
    Actions.set({
      hasNextPage: result.data.viewer.thread.comments.pageInfo.hasNextPage
    })
  )
  yield put({ type: 'global/loading-done' })

  /**
   * @reply/input-update
   * - will reload comment when change user profile
   */
  yield takeEvery<{ payload: { user?: { _id: string } } }>(
    "reply/set-selected-user-index" as any,
    function*(action) {
      const commentInputData = yield select<ApplicationState>(
        (state) => state.reply
      )
      thread.queryVariables.userId = commentInputData.user ? commentInputData.user._id : null
      thread.commentObservableQuery = yield call(
        initFetchQuery,
        context,
        thread.queryVariables
      )
      result = yield thread.commentObservableQuery.result()
      yield put(
        Actions.set({
          hasNextPage: result.data.viewer.thread.comments.pageInfo.hasNextPage
        })
      )
    }
  )

  /**
   * @Refetch
   * global/reload
   * reload thread information if contentId change
   */
  yield takeEvery<{ type: string; payload: CommentServiceURLPropTypes }>(
    Actions.reload,
    function*(action) {
      const { query } = action.payload
      thread.queryVariables.filter.contentId = query.contentId
      thread.commentObservableQuery = yield call(
        initFetchQuery,
        context,
        thread.queryVariables
      )
      result = yield thread.commentObservableQuery.result()
      yield put(
        Actions.set({
          hasNextPage: result.data.viewer.thread.comments.pageInfo.hasNextPage
        })
      )

      // update url query to redux store after reload finnish
      yield put({ type: 'thread/set-url-context', payload: action.payload })
    }
  )

  /**
   * @loadmore event
   * Loadmore from latest cursor
   * and rewrite to loadmoreComment collection
   */
  yield takeEvery<{ type: string }>(Actions.loadMoreReplyList, function*(
    action
  ) {
    yield put({ type: 'global/loading-start' })
    const data: CommentListQueryResult = yield call(
      [apolloClient, apolloClient.readQuery],
      { query: THREAD_QUERY, variables: thread.commentObservableQuery.variables }
    )
    const lastCursor = getLatestCursorOfConnectionEdges(data.viewer.thread.comments)

    const loadMoreCommentResult: { data: CommentListQueryResult } = yield call(
      apolloClient.query,
      {
        query: THREAD_QUERY,
        variables: {
          ...thread.queryVariables,
          after: lastCursor
        },
        fetchPolicy: "network-only"
      }
    )

    yield call([apolloClient, apolloClient.writeQuery], {
      query: THREAD_QUERY,
      variables: {
        ...thread.commentObservableQuery.variables
      },
      data: Object.assign({}, data, {
        viewer: {
          ...data.viewer,
          thread: {
            ...data.viewer.thread,
            comments: {
              ...data.viewer.thread.comments,
              edges: [
                ...data.viewer.thread.comments.edges,
                ...loadMoreCommentResult.data.viewer.thread.comments.edges
              ],
              pageInfo: {
                ...loadMoreCommentResult.data.viewer.thread.comments.pageInfo
              }

            }
          }
        }
      })
    })

    yield put(
      Actions.set({
        hasNextPage:
          loadMoreCommentResult.data.viewer.thread.comments.pageInfo.hasNextPage
      })
    )
    yield put({ type: 'global/loading-done' })
  })
}
