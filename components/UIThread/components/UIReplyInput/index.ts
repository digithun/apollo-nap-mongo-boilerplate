import CommentInput from './components/UICommentInput.component'
import { takeEvery } from 'redux-saga/effects'
import { connect } from 'react-redux'
import gql from 'graphql-tag'
import { compose, withProps, withState } from 'recompose'

export default compose(
  withState<{ threadId: string, userList: GBUserType[] }, GBCommentType, 'value', 'onChange'>('value', 'onChange', (props) => {
    return {
        _id: 'init',
        threadId: props.threadId,
        user: props.userList[0],
        commentType: 'text',
        message: '',
        reactions: []
      }
  }),
  connect<{}, {}, {value: GBCommentType, threadId: string}>(undefined, (dispatch, ownProps) => {
    return {
      onConfirm: () => dispatch({ type: 'reply/confirm-create-comment', payload: {
        ...ownProps.value,
        threadId: ownProps.threadId
      } })
    }
  }),
)(CommentInput) as React.ComponentClass<{
  userList: GBUserType[]
  threadId: string
}>
