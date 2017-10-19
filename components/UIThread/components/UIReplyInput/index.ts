import CommentInput from './components/UICommentInput.component'
import { takeEvery } from 'redux-saga/effects'
import * as React from 'react'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { compose, withProps, withState } from 'recompose'

declare global {
  interface ApplicationState {
    reply: GBCommentType
  }
}
export const replyReducer = (state: GBCommentType, action) => {

  switch (action.type) {
    case 'reply/clear': {
      return {
        _id: 'init',
        commentType: 'text',
        message: '',
        user: {
          ...state.user
        }
      }
    }
    case 'reply/input-update': {
      return {
        ...state,
        ...action.payload
      }
    }
  }
  return {
    ...state
  }
}
export default compose(
  connect<{}, {}, {value: GBCommentType, threadId: string}>((state: ApplicationState) => ({
    value: state.reply,
  }), (dispatch, ownProps) => {
    return {
      onChange: (payload) => dispatch({ type: 'reply/input-update', payload }),
      onConfirm: () => dispatch({ type: 'reply/confirm-create-comment' })
    }
  }),
)(CommentInput) as React.ComponentClass<{
  userList: GBUserType[]
}>
