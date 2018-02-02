import gql from 'graphql-tag'
import UIThread from './components/UIThread'
export const THREAD_FRAGMENT = gql`
  fragment ThreadData on Thread {
    commentComment {
      edges {
        node {
          userId
          _id
        }
      }
    }
  }
`
export const REMOVE_COMMENT_MUTATION = gql`
  mutation ($id: MongoID!) {
    remove(_id: $id) {
      recordId
    }
  }
`

export const ThreadQuery = gql`
${UIThread.fragments.thread}
${UIThread.fragments.comment}
query ($filter: FilterFindOneThreadInput, $after: String, $first: Int) {
  thread(filter: $filter) {
    _id
    comments: commentConnection(after: $after, first: $first, sort: CREATEDAT_DESC) {
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
      edges {
        cursor
        node {
          _id
          ...UICommentDataFragment
        }
      }
    }
    ...UIThreadDataFragment
  }
}
`
