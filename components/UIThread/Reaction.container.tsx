import withApollo from '../../lib/with-redux-apollo'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withProps, withState } from 'recompose'
import * as Actions from './actions'
import { ApolloClient } from 'apollo-client';
import { THREAD_REACTION_QUERY } from './graphql'
import ReactionCompose from '../Reaction/ReactionCompose.component'

export default compose(
  withApollo,
  connect((state: ApplicationState, props: any) => ({
    isAbleToReact: state.reply.user ? true : false, 
    userId: state.reply.user ? state.reply.user._id : null, 
    loading: state.global.loading
  }), (dispatch) => ({
    dispatch,
  })),
  graphql<any, any, any>(
    THREAD_REACTION_QUERY,
    {
      props: ({ data }) => {
        if (!data.viewer || !data.viewer.thread) {
          return {}
        }
        return { thread: data.viewer.thread, reactionSummary: data.viewer.thread.reactionSummary, userReaction: data.viewer.thread.userReaction }
      },
      options: props => ({
        fetchPolicy: "cache-only",
        variables: {
          filter: {
            contentId: props.url.query.contentId,
            appId: props.url.query.appId,
          },
          userId: props.userId,
        },
      })
    }
  ),
  connect((state: ApplicationState, props: any) => ({
    isAbleToReact: state.reply.user ? true : false, 
    userId: state.reply.user ? state.reply.user._id : null, 
    loading: state.global.loading
  }), (dispatch, props) => ({
    onAddReaction: (type) => {
      if (!props.thread) return
      dispatch(Actions.addReaction({type, contentId: props.thread._id, contentType: "THREAD"}))
    },
    onRemoveReaction: () => {
      if (!props.thread) return
      dispatch(Actions.removeReaction({ contentId: props.thread._id, contentType: "THREAD"}))
    },
    dispatch,
  })),
  withProps({
    isCenter: true
  })
)(ReactionCompose) as React.ComponentClass<CommentServiceComponentProps> as any
