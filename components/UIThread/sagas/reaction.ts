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

import { CommentListQueryResult, ThreadResultType, ThreadContext } from './types'
import { MAX_COMMENT_PER_REQUEST } from './constants'
import * as Actions from '../actions'

export default function * saga(context: ApplicationSagaContext, thread: ThreadContext) {
  /**
   * @AddReaction
  */
  yield takeEvery<{ type: string, payload: Actions.AddReactionPayload}>(Actions.addReaction, function*(action) {
    try {
      const commentInputData = yield select<ApplicationState>(
        (state) => state.reply
      )
      const apolloType = action.payload.contentType === "COMMENT" ? "Comment" : "Thread"
      let data = context.apolloClient.readFragment<{ __typename: string, userReaction?: { type: string, __typename: string }, reactionSummary?: { type: string, count: number }[] }>({
        id: action.payload.contentId,
        fragment: gql`
          fragment ReadReaction${apolloType} on ${apolloType} {
            reactionSummary
          }
        `
      })
      data.userReaction = { type: action.payload.type, __typename: "Reaction" }
      data.reactionSummary = data.reactionSummary || []
      if (data.reactionSummary.find(r => r.type === action.payload.type)) {
        data.reactionSummary = data.reactionSummary.map(r => ({ ...r, count: r.type === action.payload.type ? r.count + 1 : r.count }))
      } else {
        data.reactionSummary = [].concat([], data.reactionSummary, { type: action.payload.type, count: 1 })
      }
      context.apolloClient.writeFragment({
        id: action.payload.contentId,
        fragment: gql`
          fragment WriteReaction${apolloType} on ${apolloType} {
            userReaction {
              type
            }
            reactionSummary
          }
        `,
        data: {
          __typename: apolloType,
          userReaction: { type: action.payload.type, __typename: "Reaction" },
          reactionSummary: data.reactionSummary
        }
      })
      const mutationResult = yield call([context.apolloClient, context.apolloClient.mutate], {
        variables: {
          contentId: action.payload.contentId,
          contentType: action.payload.contentType,
          type: action.payload.type,
          userId: commentInputData.user._id
        },
        mutation: ADD_REACTION_MUTATION
      })
    } catch(error) {
      console.error(error)
    }
  })

  /**
   * @RemoveReaction
  */
  yield takeEvery<{
    payload: Actions.RemoveReactionPayload
    type: string
  }>(Actions.removeReaction, function*(action) {
    try {
      const commentInputData = yield select<ApplicationState>(
        (state) => state.reply
      )
      const apolloType = action.payload.contentType === "COMMENT" ? "Comment" : "Thread"
      let data = context.apolloClient.readFragment<{ __typename: string, userReaction?: { type: string, __typename: string }, reactionSummary?: { type: string, count: number }[] }>({
        id: action.payload.contentId,
        fragment: gql`
          fragment ReadReaction${apolloType} on ${apolloType} {
            userReaction {
              type
            }
            reactionSummary
          }
        `
      })
      const userReaction = data.userReaction
      data.userReaction = null
      data.reactionSummary = data.reactionSummary || []
      data.reactionSummary = data.reactionSummary.map(r => ({ ...r, count: r.type === userReaction.type ? r.count - 1 : r.count }))
      data.reactionSummary = data.reactionSummary.filter(r => r.count !== 0)
      context.apolloClient.writeFragment({
        id: action.payload.contentId,
        fragment: gql`
          fragment WriteReaction${apolloType} on ${apolloType} {
            userReaction {
              type
            }
            reactionSummary
          }
        `,
        data: {
          __typename: apolloType,
          userReaction: null,
          reactionSummary: data.reactionSummary
        }
      })
      const mutationResult = yield call([context.apolloClient, context.apolloClient.mutate], {
        variables: {
          contentId: action.payload.contentId,
          contentType: action.payload.contentType,
          userId: commentInputData.user._id
        },
        mutation: REMOVE_REACTION_MUTATION
      })
    } catch(error) {
      console.error(error)
    }
  })
}