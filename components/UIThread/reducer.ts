
declare global {
  interface GBThreadState {
      hasNextPage?: boolean
  }
  interface ApplicationState {
    thread: GBThreadState

  }
}

export const threadReducer = (state, action) => {
  switch (action.type) {
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
