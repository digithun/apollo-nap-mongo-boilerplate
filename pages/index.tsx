import * as React from 'react'
import UIReply from '../components/UIReply'
import Layout from '../components/Layout'
import withApollo from '../lib/with-redux-apollo'
import { compose, withProps, withState } from 'recompose'
import { graphql } from 'react-apollo'
import { connect } from 'react-redux'
import gql from 'graphql-tag'

class CommentServicePage extends React.Component<{ onConfirm: () => void, userList: GBUserType[], setComment: (comment: GBCommentType) => void, comment: GBCommentType }, {}> {

  constructor(props) {
    super(props)
  }

  public render() {
    return (
      <Layout>
        <UIReply
          onChange={this.props.setComment}
          onConfirm={this.props.onConfirm}
          userList={this.props.userList}
          value={this.props.comment}
        />
      </Layout>
    )
  }
}

export default compose(
  withApollo,
  withProps<{ userList: GBUserType[] }, { url: any }>((props) => ({
    userList: (props.url.query.users ? JSON.parse(props.url.query.users) : []),
    sessionToken: props.url.query.sessionToken,
    threadId: props.url.query.threadId
  })),
  withState<{ threadId: string, userList: GBUserType[] }, GBCommentType, 'comment', 'setComment'>('comment', 'setComment', (props) => {
    return {
        threadId: props.threadId,
        user: props.userList[0],
        commentType: 'text',
        message: '',
        reactions: []
      }
  }),
  connect<{}, {}, {comment: GBCommentType}>(undefined, (dispatch, ownProps) => {
    return {
      onConfirm: () => dispatch({ type: 'reply/confirm-create-comment', payload: ownProps.comment })
    }
  }),
)(CommentServicePage)

// const styled = require('styled-components').default
