import gql from 'graphql-tag'
import UIThread from './components/UIThread'
import ReactionCompose from '../Reaction/ReactionCompose.component'
export const THREAD_FRAGMENT = gql`
  ${UIThread.fragments.comment}
  fragment ReadThread on Thread {
    _id
    comments: commentConnection {
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
  }
`
export const REMOVE_COMMENT_MUTATION = gql`
  mutation ($id: MongoID!) {
    remove(_id: $id) {
      recordId
    }
  }
`

export const THREAD_QUERY = gql`
${UIThread.fragments.thread}
${UIThread.fragments.comment}
query ($filter: FilterFindOneThreadInput, $after: String, $first: Int, $userId: String) {
  viewer(userId: $userId) {
    thread(filter: $filter) {
      _id
      comments: commentConnection(after: $after, first: $first, sort: CREATEDAT_DESC) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          endCursor
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
}
`

export const ADD_REACTION_MUTATION = gql`
mutation($type: String!, $contentId: MongoID!, $userId: String!, $contentType: String!) {
  addReaction(
    contentType: $contentType
    contentId: $contentId
  	userId: $userId
    type: $type
  )
}
`

export const REMOVE_REACTION_MUTATION = gql`
mutation($contentId: MongoID!, $userId: String!, $contentType: String!) {
  removeReaction(
    contentType: $contentType,
    contentId: $contentId
  	userId: $userId
  )
}
`

export const THREAD_REACTION_QUERY = gql`
${ReactionCompose.fragments.threadReaction}
query ($filter: FilterFindOneThreadInput$userId: String) {
  viewer(userId: $userId) {
    thread(filter: $filter) {
      _id
      ...ThreadReaction
    }
  }
}
`

export const LOAD_MORE_REPLY_COMMENT = gql`
${UIThread.fragments.comment}
query ($_id: MongoID!, $last: Int!, $before: String){
  comment(_id: $_id) {
    ...UICommentDataFragment
    loadCommentConnection: commentConnection(last: $last, before: $before, sort: CREATEDAT_ASC) {
      pageInfo {
        hasPreviousPage
      }
      edges {
        cursor
        node {
          ...UICommentDataFragment
        }
      }
    }
  }
}
`
