import { takeEvery } from 'redux-saga/effects'
import withApollo from '../../lib/with-redux-apollo'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withProps, withState } from 'recompose'
import UIThread from './components/UIThread'

export function* replySaga(context: ApplicationSagaContext) {
  yield takeEvery<{ payload: GBCommentType, type: string }>('reply/confirm-create-comment', function*(action) {
    console.log(action.payload)

    try {
      yield context.apolloClient.mutate({
        variables: {
          record: {
            threadId: action.payload.threadId,
            message: action.payload.message,
            userId: action.payload.user._id
          }
        },
        mutation: gql`
        mutation ($record: CreateOneCommentInput!) {
         reply (record: $record) {
           recordId
           record {
             message
             _id
             user {
               name
               profilePicture
               _id
             }
           }
         }
        }
      `
      })
    } catch (e) {
      console.error(e)
      alert('ไม่สามารถ Comment ได้ เกิดข้อผิดพลาดบางอย่าง')
    }
  })
}

export default compose(
  withApollo,
  withProps<{ userList: GBUserType[] }, { url: any }>((props) => ({
    userList: (props.url.query.users ? JSON.parse(props.url.query.users) : []),
    sessionToken: props.url.query.sessionToken,
    threadId: props.url.query.threadId
  })),
  graphql<any, { url: any }>(gql`
    query ($filter: FilterFindOneThreadInput, $skip: Int) {
      thread(filter: $filter) {
        appId
        _id
        contentId
        comments(skip: $skip, limit: 10) {
          user {
            name
            profilePicture
          }
          _id
          message
        }
      }
    }
  `, {
      props: ({ data }) => {
        return {
          threadId: data.loading ? undefined : data.thread._id,
        }
      },
      options: (props) => {
        return {
          variables: {
            filter: {
              contentId: props.url.query.contentId,
              appId: props.url.query.appId
            },
            skip: 0
          }
        }
      }
    }),
)(UIThread)
