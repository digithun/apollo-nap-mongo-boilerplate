import { takeEvery, select, put, call } from 'redux-saga/effects'
import gql from 'graphql-tag'
import {
  THREAD_QUERY,
  REMOVE_COMMENT_MUTATION,
  THREAD_FRAGMENT,
  ADD_REACTION_MUTATION,
  REMOVE_REACTION_MUTATION,
  THREAD_REACTION_QUERY
} from '../graphql'
import UIThread from '../components/UIThread'

import { CommentListQueryResult, ThreadResultType, ThreadContext } from './types'
import { MAX_COMMENT_PER_REQUEST } from './constants'
import * as Actions from '../actions'

export default function * saga(context: ApplicationSagaContext, thread: ThreadContext) {
  /** @Create new commment
  * reply comment to comment
  */
  yield takeEvery<{
    payload: Actions.ReplyCommentPayload
    type: string
  }>(Actions.replyComment, function*(action) {
    yield put({ type: 'global/loading-start' })
    try {
      const commentInputData = yield select<ApplicationState>(
        (state) => state.reply
      )
      let queryResult: { viewer: { thread: GBThreadType } } = yield call(
        [context.apolloClient, context.apolloClient.readQuery],
        {
          query: THREAD_QUERY,
          variables: thread.queryVariables
        }
      )
      const data = context.apolloClient.readFragment<any>({
        id: action.payload.replyToId,
        fragment: UIThread.fragments.comment,
        fragmentName: "UICommentDataFragment"
      })
      context.apolloClient.writeFragment({
        id: action.payload.replyToId,
        fragment: UIThread.fragments.comment,
        fragmentName: "UICommentDataFragment",
        data: {
          ...data,
          commentConnection: {
            ...data.commentConnection,
            edges: [].concat(data.commentConnection.edges, [{
              __typename: 'CommentEdge',
              cursor: '',
              node: {
                _id: Actions.OPTIMISTIC_COMMENT_ID,
                createdAt: new Date(),
                threadId: queryResult.viewer.thread._id,
                message: action.payload.message,
                userId: commentInputData.user._id,
                userReaction: null,
                reactionSummary: null,
                user: {
                  ...commentInputData.user,
                  __typename: 'User'
                },
                __typename: 'Comment'
              }
            }])
          }
        }
      })
      const mutationResult = yield call([context.apolloClient, context.apolloClient.mutate], {
        variables: {
          record: {
            contentId: queryResult.viewer.thread.contentId,
            message: action.payload.message,
            userId: commentInputData.user._id,
            replyToId: action.payload.replyToId
          }
        },
        mutation: gql`
          ${UIThread.fragments.comment}
          mutation($record: CreateOneCommentInput!) {
            reply(record: $record) {
              record {
                _id
                ...UICommentDataFragment
              }
            }
          }
        `
      })
      context.apolloClient.writeFragment({
        id: action.payload.replyToId,
        fragment: UIThread.fragments.comment,
        fragmentName: "UICommentDataFragment",
        data: {
          ...data,
          commentConnection: {
            ...data.commentConnection,
            edges: [].concat(data.commentConnection.edges, [{
              __typename: 'CommentEdge',
              cursor: '',
              node: {
                _id: mutationResult.data.reply.record._id,
                createdAt: new Date(),
                threadId: queryResult.viewer.thread._id,
                message: action.payload.message,
                userId: commentInputData.user._id,
                userReaction: null,
                reactionSummary: null,
                user: {
                  ...commentInputData.user,
                  __typename: 'User'
                },
                __typename: 'Comment'
              }
            }])
          }
        }
      })
    } catch(error) {
      console.error(error)
    } finally {
      yield put({ type: 'global/loading-done' })
    }
  })
  /** @Create new commment
  * reply/confirm-create-comment
  * reply comment to thread
  */
  yield takeEvery<{
    payload: Actions.ReplyPayload
    type: string
  }>(Actions.reply, function*(action) {
    yield put({ type: 'global/loading-start' })
    const message = action.payload.message

    const commentInputData = yield select<ApplicationState>(
      (state) => state.reply
    )
    const variables = thread.queryVariables
    try {
      if (message.length > 300) {
        alert('Limit 300 charactors')
        yield put({ type: 'global/loading-done' })
        return
      }
    } catch (e) {
      console.error(e)
    }
    let queryResult: { viewer: { thread: GBThreadType } } = yield call(
      [context.apolloClient, context.apolloClient.readQuery],
      {
        query: THREAD_QUERY,
        variables
      }
    )
    console.log('get result from query')
    if (!queryResult.viewer.thread) {
      // check if data is undefined
      // reload data if data is not available

      queryResult = yield call(context.apolloClient.query, {
        query: THREAD_QUERY,
        variables
      })
    }
    const data: { viewer: { thread: ThreadResultType } } = yield call(
      [context.apolloClient, context.apolloClient.readQuery],
      { query: THREAD_QUERY, variables: thread.queryVariables }
    )
    console.log(queryResult, commentInputData)
    if (!commentInputData.user) {
      yield call(alert, 'no user selected')
      return
    }
    yield call([context.apolloClient, context.apolloClient.writeQuery], {
      query: THREAD_QUERY,
      variables: thread.queryVariables,
      data: Object.assign({}, data, {
        viewer: {
          ...data.viewer,
          thread: {
            ...data.viewer.thread,
            comments: {
              ...data.viewer.thread.comments,
              edges: [
                {
                  __typename: 'CommentEdge',
                  cursor: '',
                  node: {
                    _id: Actions.OPTIMISTIC_COMMENT_ID,
                    createdAt: new Date(),
                    threadId: queryResult.viewer.thread._id,
                    message: message,
                    userId: commentInputData.user._id,
                    userReaction: null,
                    reactionSummary: null,
                    commentConnection: {
                      __typename: 'CommentConnection',
                      pageInfo: {
                        __typename: 'PageInfo',
                        hasNextPage: false
                      },
                      edges: []
                    },
                    user: {
                      ...commentInputData.user,
                      __typename: 'User'
                    },
                    __typename: 'Comment'
                  }
                },
                ...data.viewer.thread.comments.edges
              ]
            }
          }
        }
      })
    })

    try {
      yield put({ type: Actions.DISABLED_TEXT_INPUT_DIALOG, payload: true })
      const mutationResult = yield call([context.apolloClient, context.apolloClient.mutate], {
        variables: {
          record: {
            contentId: queryResult.viewer.thread.contentId,
            message: message,
            userId: commentInputData.user._id
          }
        },
        mutation: gql`
          ${UIThread.fragments.comment}
          mutation($record: CreateOneCommentInput!) {
            reply(record: $record) {
              record {
                _id
                ...UICommentDataFragment
              }
            }
          }
        `
      })
      yield call([context.apolloClient, context.apolloClient.writeQuery], {
        query: THREAD_QUERY,
        variables: thread.queryVariables,
        data: Object.assign({}, data, {
          viewer: {
            ...data.viewer,
            thread: {
              ...data.viewer.thread,
              comments: {
                ...data.viewer.thread.comments,
                edges: [
                  {
                    __typename: 'CommentEdge',
                    cursor: '',
                    node: {
                      _id: mutationResult.data.reply.record._id,
                      createdAt: new Date(),
                      threadId: queryResult.viewer.thread._id,
                      message: message,
                      userId: commentInputData.user._id,
                      userReaction: null,
                      commentConnection: {
                        __typename: 'CommentConnection',
                        pageInfo: {
                          __typename: 'PageInfo',
                          hasNextPage: false
                        },
                        edges: []
                      },
                      reactionSummary: null,
                      user: {
                        ...commentInputData.user,
                        __typename: 'User'
                      },
                      __typename: 'Comment'
                    }
                  },
                  ...data.viewer.thread.comments.edges.filter(
                    (node: any) => node._id !== 'optimistic-comment-id'
                  )
                ]
              }
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