import * as React from 'react'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
const hoistNonReactStatic = require('hoist-non-react-statics')
import passthrough from 'react-passthrough'
import 'isomorphic-fetch'
import initStore from './store.factory'
declare global {
  interface ApplicationApolloClient extends ApolloClient<Cache> { }
}

export default function withReduxApollo(WrappedComponent: React.ComponentClass) {

  class ConnectWithReduxAndApollo extends React.Component<{ url: any }, {}> {
    private client: ApolloClient<Cache>
    constructor(props) {
      super(props)
    }
    public static getInitialProps(ctx) {
      console.log(ctx.query)
      let config: ApplicationConfig;
      if (typeof window === 'undefined') {
        config = require('../config')
      } else {
        config = (window as any).config
      }
      if ((WrappedComponent as any).getInitialProps) {
        const WrappedComponentInitialProps = (WrappedComponent as any).getInitialProps(ctx)
        return {
          config,
          ...WrappedComponentInitialProps
        }
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
      try {

        const cache = new InMemoryCache({
          dataIdFromObject: (value: any) => value._id
        }).restore({}) as any

        const link: any = new HttpLink({
          uri: '/graphql',
          headers: {
            authorization: `Bearer ${this.props.url.query.sessionToken}`
          }
        })

        let client;
        let store;

        console.log(this.props.url.query.users)
        const userList = JSON.parse(this.props.url.query.users)
        const initialState = {
          global: {
            loading: false
          },
          reply: {
            _id: 'init',
            user: userList[0],
            message: '',
            reactions: []
          },
          thread: {
            users: userList,
            threadId: '',
            hasNextPage: true
          }
        } as ApplicationState
        if (typeof window !== 'undefined') {
          const globalWindow: any = window
          if (!(window as any).client) {
            globalWindow.client = new ApolloClient({ link, cache });
            globalWindow.store = initStore({ apolloClient: globalWindow.client, initialState, url: this.props.url })
          }
          client = (window as any).client
          store = (window as any).store
        } else {

          // server-side apollo and store
          console.log('render ssr')

          client = new ApolloClient({ link, cache })
          store = initStore({ initialState, apolloClient: client, url: this.props.url })
        }
        const enhanceElement = React.createElement<any, any, any>(WrappedComponent, {
          ...this.props
        })
        const storeElement = React.createElement(Provider, {
          store
        }, enhanceElement)
        return React.createElement(ApolloProvider, {
          client,
        }, storeElement)

      } catch (e) {
        console.log(e)
        return React.createElement('div')
      }
    }
  }

  return hoistNonReactStatic(ConnectWithReduxAndApollo, WrappedComponent)
}
