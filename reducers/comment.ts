import { Reducer } from 'redux'

declare global {

  interface CommentState {
    replyLoading: {
      [key:string]: boolean
    }
  }
  interface ApplicationState {
    comment: CommentState
  }
}

const reducer: Reducer<CommentState> = (state = {
  replyLoading: {}
}, action) => {
  if (action.type === 'comment/reply/load-more') {
    return {
      ...state,
      replyLoading: {
        ...state.replyLoading,
        [action.payload]: true
      }
    }
  }
  if (action.type === 'comment/reply/load-more-done') {
    return {
      ...state,
      replyLoading: {
        ...state.replyLoading,
        [action.payload]: false
      }
    }
  }
  return state
}

export default reducer
