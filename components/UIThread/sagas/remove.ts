import { takeEvery, select, put, call } from 'redux-saga/effects'
import {
  THREAD_QUERY,
  REMOVE_COMMENT_MUTATION,
  THREAD_FRAGMENT,
  ADD_REACTION_MUTATION,
  REMOVE_REACTION_MUTATION,
  THREAD_REACTION_QUERY
} from '../graphql'

import { CommentListQueryResult, ThreadResultType, ThreadContext } from './types'
import { MAX_COMMENT_PER_REQUEST } from './constants'
import * as Actions from '../actions'

function filterById(connection, commentId){
  return {
    ...connection,
    pageInfo: connection.pageInfo,
    edges: connection.edges.filter(edge => edge.node._id !== commentId)
      .map(
        edge => edge.node.commentConnection ? {
          ...edge,
          node: {
            ...edge.node,
            commentConnection: filterById(edge.node.commentConnection, commentId)
          }
         } : edge
      )
  }
}

/**
 * Remove comment saga handler
 * - will receive thread Id from payload
 * - mutate and wait for response to confirm delete
 */
export default function * removeSaga(context: ApplicationSagaContext, thread: ThreadContext) {
  yield takeEvery<{ type: string, payload: string }>(Actions.remove, function*({ type, payload }) {
    // Confirm delete...
    const isRemoveConfirm = confirm('ยืนยันลบความคิดเห็น')
    if (!isRemoveConfirm) {
      return
    }

    try {
      // ### Optimistic part ###
      // create variables for first 3 comment query
      function filterCommentFromTheadById(variables: any, commentId: any) {
        console.log(variables.filter.contentId)
        let data: CommentListQueryResult = context.apolloClient.readQuery({
          query: THREAD_QUERY,
          variables
        })

        data = Object.assign({}, data, {
          viewer: {
            __typename: 'Viewer',
            thread: {
              ...data.viewer.thread,
              comments: filterById(data.viewer.thread.comments, commentId)
            }
          }
        })

        context.apolloClient.writeQuery({
          query: THREAD_QUERY,
          variables,
          data
        })
      }
      const commentInputData = yield select<ApplicationState>(
        (state) => state.reply
      )
      const url = yield select<ApplicationState>((state) => state.thread.url)

      // get data from first 3 comment and "loadmore" query
      // and filter out comment in payload
      yield call(filterCommentFromTheadById, thread.queryVariables, payload)
      yield call(
        filterCommentFromTheadById,
        thread.commentObservableQuery.variables,
        payload
      )

      // ### End optimistic part ###

      // start mutate at remote server
      yield call(context.apolloClient.mutate, {
        mutation: REMOVE_COMMENT_MUTATION,
        variables: {
          id: payload
        }
      })
      yield put({
        type: Actions.ALERT_ACTIONS,
        payload: { message: 'comment-has-been-deleted' }
      })
    } catch (e) {
      console.error(e)
    }
  })
}
