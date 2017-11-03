import { Provider } from 'react-redux'
import ApolloClient from 'apollo-client'
import { applyMiddleware, createStore, Store, combineReducers } from 'redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'

import initialSagas from '../sagas'
import reducers from '../reducers'

declare var module: any;
declare global {

  interface ApplicationState {
    //
  }

  interface ApplicationClientStoreConfig {
    apolloClient?: ApolloClient<any>
    initialState?: ApplicationState
    url: any
  }
}

let __store: Store<ApplicationState>;
export default function(config: ApplicationClientStoreConfig) {
  const sagaMiddleware = createSagaMiddleware()
  let middlewares = applyMiddleware(sagaMiddleware)
  if (typeof window !== 'undefined') {
    middlewares = applyMiddleware(sagaMiddleware, logger)
  }

  const rootReducer = combineReducers<ApplicationState>(reducers)
  console.log('Create redux store with init state', config.initialState)
  __store = createStore<ApplicationState>(rootReducer, config.initialState, middlewares)
  if (typeof window !== 'undefined') {
    sagaMiddleware.run(initialSagas({
      apolloClient: config.apolloClient,
      store: __store,
      url: config.url
    }))
  }

  if ((module as any).hot) {
    console.log('Hot loading enabled !')
    module.hot.accept(['../reducers/index.js', '../sagas/index.js'], () => {
      console.log('Reload reducer...')
      const nextRootReducer = require('../reducers').default
      __store.replaceReducer(combineReducers(nextRootReducer))
      console.log('Reload sagas...')
    }, 1000)
  }
  return __store
}
