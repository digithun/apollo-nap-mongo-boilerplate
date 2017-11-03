import gql from 'graphql-tag'
import UIThread from './components/UIThread'

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
