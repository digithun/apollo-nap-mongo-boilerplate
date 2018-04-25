import withApollo from '../../lib/with-redux-apollo'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withProps, withState } from 'recompose'
import * as Actions from './actions'
import { ApolloClient } from 'apollo-client';
import { ThreadQuery } from './graphql'
import UIThread from './components/UIThread'
import {saga, getLatestCursorOfConnectionEdges, constants } from './sagas'
export  {saga}

export default compose(
  withApollo,
  withProps<{ userList: GBUserType[] }, { url: any }>((props) => ({
    userList: (props.url.query.users ? JSON.parse(props.url.query.users) : []),
    sessionToken: props.url.query.sessionToken,
  })),

  /**
   * Read First 5 comment from local cache
   * by saga init
   */
  connect((state: ApplicationState, props: any) => ({
    hasNextPage: state.thread.hasNextPage,
    userId: state.reply.user ? state.reply.user._id : null, 
    loading: state.global.loading
  }), (dispatch) => ({
    requestLoadMoreComments: () => dispatch(Actions.loadMoreReplyList()),
    dispatch,
  })),

  graphql<any, { url: any, userId: any }>(ThreadQuery, {
    props: ({ data }) => {
      const viewer = data.viewer
      if (data.loading || !viewer || !viewer.thread) {
        return {
          threadId: undefined,
          comments: []
        }
      }
      const commentsLength = viewer.thread.comments.edges.length
      return {
        threadId: viewer.thread._id,
        comments: viewer.thread.comments.edges.map((edge) => edge.node),
        loadMoreCursor: getLatestCursorOfConnectionEdges(viewer.thread.comments)
      }
    },
    options: (props) => {
      return {
        fetchPolicy: 'cache-only',
        variables: {
          userId: props.userId,
          filter: {
            contentId: props.url.query.contentId,
            appId: props.url.query.appId
          },
          first: constants.MAX_COMMENT_PER_REQUEST
        }
      }
    }
  }),

  /**
   * Read loadMoreComent from local Cache
   * for more information read in Saga `UIThread/index.ts`
   */
  graphql<any, { url: any, threadId: string, loadMoreCursor: string, userId: string }>(ThreadQuery, {
    props: ({ data, ownProps: { loadMoreCursor } }) => {
      if (!loadMoreCursor) {
        return {
          loadMoreComments: []
        }
      }
      try {
        return {
          loadMoreComments: data.viewer.thread.comments.edges.map((edge) => edge.node)
        }
      } catch (e) {
        return {
          loadMoreComments: []
        }
      }
    },
    options: (props) => {
      const options = ({
        fetchPolicy: 'cache-only',
        variables: {
          filter: {
            contentId: props.url.query.contentId,
            appId: props.url.query.appId,
          },
          userId: props.userId,
          first: constants.MAX_COMMENT_PER_REQUEST,
          after: props.loadMoreCursor
        },
      })
      return options
    }
  })
)(UIThread) as React.ComponentClass<CommentServiceComponentProps>
