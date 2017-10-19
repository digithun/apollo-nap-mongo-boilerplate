import { Reducer } from 'redux'
import { threadReducer } from '../components/UIThread/reducer'
import { replyReducer } from '../components/UIThread/components/UIReplyInput'

declare global {

  interface GlobalState {
    loading?: boolean
  }
  interface ApplicationState {
    global: GlobalState
  }
}
const globalReducer: Reducer<GlobalState> = (prevState, action) => {
  const state = Object.assign({}, prevState)
  switch (action.type) {
    case 'global/loading-start':
      return {
        ...state,
        loading: true
      }
    case 'global/loading-done':
      return {
        ...state,
        loading: false
      }
    case 'form/update':
    return {
      ...state,
      loading: !state.loading
    }
    default: {
      return {
        ...state
      }
    }
  }
}

export default {
  global: globalReducer,
  reply: replyReducer,
  thread: threadReducer
}
