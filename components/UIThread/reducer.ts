
declare global {
  interface ApplicationState {
    thread: {
      users: GBUserType[]
    }
  }
}

export const threadReducer = (state, action) => {
  return {
    ...state
  }
}
