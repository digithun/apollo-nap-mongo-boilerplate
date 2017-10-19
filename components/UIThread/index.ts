import { takeEvery, select, put } from 'redux-saga/effects'
import withApollo from '../../lib/with-redux-apollo'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { compose, withProps, withState } from 'recompose'
import UIThread from './components/UIThread'

const ThreadQuery = gql`
${UIThread.fragments.thread}
query ($filter: FilterFindOneThreadInput, $skip: Int) {
  thread(filter: $filter) {
    _id
    comments(skip: $skip, limit: 10, sort: _ID_DESC) {
      _id
      ...UICommentDataFragment
    }
    ...UIThreadDataFragment
  }
}
`

export function* replySaga(context: ApplicationSagaContext) {
  yield takeEvery<{ payload: GBCommentType, type: string }>('reply/confirm-create-comment', function* (action) {
    yield put({ type: 'global/loading-start' })
    const commentInputData = yield select<ApplicationState>((state) => state.reply)
    const variables = {
      filter: {
        contentId: context.url.query.contentId,
        appId: context.url.query.appId
      },
      skip: context.url.query.skip || 0
    }
    let queryResult = context.apolloClient.readQuery<GBThreadType>({
      query: ThreadQuery,
      variables
    }) as { thread: GBThreadType }
    if (!queryResult.thread) {

      // check if data is undefined
      // reload data if data is not available

      queryResult = yield context.apolloClient.query({
        query: ThreadQuery,
        variables
      })

    }
    try {
      yield context.apolloClient.mutate({
        variables: {
          record: {
            threadId: queryResult.thread._id,
            message: commentInputData.message,
            userId: commentInputData.user._id
          }
        },
        mutation: gql`
        ${UIThread.fragments.thread}
        mutation ($record: CreateOneCommentInput!) {
         reply (record: $record) {
           record {
             _id
             ...UICommentDataFragment
           }
           thread {
             _id
             ...UIThreadDataFragment
             comments(skip: 0, limit: 10, sort: _ID_DESC) {
              _id
              ...UICommentDataFragment
             }
           }
         }
        }
      `
      })
      yield put({ type: 'reply/clear' })
    } catch (e) {
      console.error(e)
      alert('ไม่สามารถ Comment ได้ เกิดข้อผิดพลาดบางอย่าง')
    }
    yield put({ type: 'global/loading-done' })
  })
}

export default compose(
  withApollo,
  withProps<{ userList: GBUserType[] }, { url: any }>((props) => ({
    userList: (props.url.query.users ? JSON.parse(props.url.query.users) : []),
    sessionToken: props.url.query.sessionToken,
  })),
  graphql<any, { url: any }>(ThreadQuery, {
    props: ({ data }) => {
      if (data.loading) {
        return {
          threadId: undefined,
          comments: []
        }
      }
      return {
        threadId: data.thread._id,
        comments: data.thread.comments
      }
    },
    options: (props) => {
      return {
        variables: {
          filter: {
            contentId: props.url.query.contentId,
            appId: props.url.query.appId
          },
          skip: props.url.query.skip || 0
        }
      }
    }
  }),
)(UIThread)
