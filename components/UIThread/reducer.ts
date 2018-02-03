import { DISABLED_TEXT_INPUT_DIALOG } from './actions';

declare global {
  interface GBThreadState {
      hasNextPage?: boolean
      url?: CommentServiceURLPropTypes
  }
  interface ApplicationState {
    thread: GBThreadState

  }
}

export const threadReducer = (state, action) => {
  switch (action.type) {
    case 'thread/set-url-context': {
      console.log(action)
      return {
        ...state,
        url: {
          query: {
            ...action.payload.query
          }
        },
      }
    }
    case 'thread/set': {
      return {
        ...state,
        ...action.payload
      }
    }
  }
  return {
    ...state
  }
}
