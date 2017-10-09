import * as React from 'react'
import ApolloClient from 'apollo-client'
import Link from 'apollo-link-http'
import Cache from 'apollo-cache-inmemory'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
const hoistNonReactStatic = require('hoist-non-react-statics')
import passthrough from 'react-passthrough'

import initStore from './store.factory'

export default function withReduxApollo(WrappedComponent: React.ComponentClass) {

  class ConnectWithReduxAndApollo extends React.Component<{ client: ApolloClient<Cache>}, {}> {
    private client: ApolloClient<Cache>
    constructor(props) {
      super(props)
    }
    public static getInitialProps(ctx) {
      let config: ApplicationConfig;
      if (typeof window === 'undefined') {
        config = require('../config')
      } else {
        config = (window as any).config
      }
      return {
        config
      }
    }

    public render() {

      // this render is on the top of any page
      // it should render only once per reload
      // you can keep tracking this render method
      // by console.log to maintain performance

      const cache =  new Cache({
        dataIdFromObject: (value: any) => value._id
      }).restore({})
      const link: any = new Link({ uri: '/graphql' })
      let client;
      let store;
      if (typeof window !== 'undefined') {
        const globalWindow: any = window
        if (!(window as any).client) {
          globalWindow.client = new ApolloClient({ link, cache });
          globalWindow.store = initStore({
            apolloClient: globalWindow.client,
            initialState: {
              global: {
                loading: true
              }
            },
          })
        }
        client = (window as any).client
        store = (window as any).store
      } else {

        // server-side apollo and store
        console.log('render ssr')

        client = new ApolloClient({ link, cache })
        store = initStore({
          apolloClient: client,
          // server-side initial state
          initialState: {
            global: {
              loading: false
            }
          }
        })
      }
      const enhanceElement = React.createElement<any, any, any>(WrappedComponent, { })
      const storeElement = React.createElement(Provider, {
        store
      }, enhanceElement)
      return React.createElement(ApolloProvider, {
        client,
      }, storeElement)
    }
  }

  return hoistNonReactStatic(ConnectWithReduxAndApollo, WrappedComponent)
}
