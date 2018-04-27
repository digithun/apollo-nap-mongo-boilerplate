import CommentInput from './components/UICommentInput.component'
import { takeEvery } from 'redux-saga/effects'
import * as React from 'react'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { compose, withProps, withState } from 'recompose'
import { DISABLED_TEXT_INPUT_DIALOG, reply } from '../../actions';

declare global {
  interface ReplyState extends GBCommentType {
    isTextInputDisabled?: boolean
    currentSelectedUserIndex?: number
  }
  interface ApplicationState {
    reply: ReplyState
  }
}
export const replyReducer = (state: ReplyState, action) => {
  if (!state) {
    return {
      currentSelectedUserIndex: 0,
    }
  }
  switch (action.type) {
    case 'reply/set-selected-user-index': {
      return {
        ...state,
        currentSelectedUserIndex: action.payload
      }
    }
    case DISABLED_TEXT_INPUT_DIALOG: {
      return {
        ...state,
        isTextInputDisabled: action.payload
      }
    }
    case 'reply/clear': {
      return {
        currentSelectedUserIndex: state.currentSelectedUserIndex,
        _id: 'init',
        commentType: 'text',
        message: '',
        user: {
          ...state.user
        },
      }
    }
    case 'reply/input-update': {
      return {
        currentSelectedUserIndex: 0,
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
  connect<{}, {}, { value: GBCommentType, threadId: string }>((state: ApplicationState) => ({
    value: state.reply,
  })),
  connect<{}, {}, { value: GBCommentType }>(null, (dispatch, ownProps) => {
    return {
      onChange: (payload) => dispatch({ type: 'reply/input-update', payload }),
      onConfirm: () => dispatch(reply({ message: ownProps.value.message })),
      setCurrentSelectedUserIndex: (userIndex) => dispatch({ type: 'reply/set-selected-user-index', payload: userIndex })
    }
  })
)(CommentInput) as React.ComponentClass<{
  userList: GBUserType[]
  disabled?: Boolean
  disabledPlaceholder?: String
}>
