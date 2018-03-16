import * as React from 'react'
import ApolloClient from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import {
  IntrospectionFragmentMatcher,
  InMemoryCache
} from 'apollo-cache-inmemory'
import { Provider } from 'react-redux'
import { ApolloProvider } from 'react-apollo'
const hoistNonReactStatic = require('hoist-non-react-statics')
import passthrough from 'react-passthrough'
import 'isomorphic-fetch'
import initStore from './store.factory'

const fragmentMacherResult = require('../static/fragmentTypes.json')
declare global {
  interface ApplicationApolloClient extends ApolloClient<Cache> { }
  type CommentServiceURLPropTypes = {
    query: {
      contentId: any
      users: any
      sessionToken: any
      appId: any
    }
  }
  interface CommentServiceComponentProps {
    url: CommentServiceURLPropTypes
    graphQLEndpoint?: string
    cache?: any
  }
}

export default function withReduxApollo(
  WrappedComponent: React.ComponentClass
) {
  class ConnectWithReduxAndApollo extends React.Component<
    CommentServiceComponentProps,
    {}
    > {
    private client: ApolloClient<Cache>
    constructor(props) {
      super(props)
      if (typeof window !== 'undefined') {
        (window as any).config = props.config
      }
    }
    public static getInitialProps(ctx) {
      let config: ApplicationConfig
      if (typeof window === 'undefined') {
        config = require('../config').default
      } else {
        config = (window as any).config
      }
      if ((WrappedComponent as any).getInitialProps) {
        const WrappedComponentInitialProps = (WrappedComponent as any).getInitialProps(
          ctx
        )
        return {
          config,
          ...WrappedComponentInitialProps
        }
      }
      return {
        config
      }
    }

    public componentWillReceiveProps(nextProps) {
      const globalWindow: any = window
      if (globalWindow.__CommentServiceReduxStore) {
        globalWindow.__CommentServiceReduxStore.dispatch({
          type: 'global/reload',
          payload: {
            query: nextProps.url.query
          }
        })
      }
    }

    public render() {
      // this render is on the top of any page
      // it should render only once per reload
      // you can keep tracking this render method
      // by console.log to maintain performance
      console.log(
        `Display comment section for ${this.props.url.query.contentId}`
      )
      try {
        let client
        let store

        let userList = [];
        if (this.props.url.query.users) {
          userList = JSON.parse(this.props.url.query.users)
        }

        const initialState = {
          global: {
            loading: true
          },
          reply: {
            _id: 'init',
            currentSelectedUserIndex: 0,
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
          if (!(window as any).__CommentServiceApolloClient) {
            let cache
            if (!this.props.cache) {
              cache = new InMemoryCache({
                dataIdFromObject: (value: any) => value._id,
                fragmentMatcher: new IntrospectionFragmentMatcher({
                  introspectionQueryResultData: fragmentMacherResult
                })
              }).restore({}) as any
            } else {
              cache = this.props.cache
            }

            const link: any = new HttpLink({
              uri: this.props.graphQLEndpoint || '/graphql',
              headers: {
                authorization: `Bearer ${this.props.url.query.sessionToken}`
              }
            })
            globalWindow.__CommentServiceApolloClient = new ApolloClient({
              link,
              cache
            })
            globalWindow.__CommentServiceReduxStore = initStore({
              apolloClient: globalWindow.__CommentServiceApolloClient,
              initialState,
              url: this.props.url
            })
          }
          client = (window as any).__CommentServiceApolloClient
          store = (window as any).__CommentServiceReduxStore
        } else {
          // server-side apollo and store
          // client = new ApolloClient({ link, cache })
          // store = initStore({ initialState, apolloClient: client, url: this.props.url })
          return React.createElement('div', '...')
        }
        const enhanceElement = React.createElement<any, any, any>(
          WrappedComponent,
          {
            ...this.props
          }
        )
        const storeElement = React.createElement(
          Provider,
          {
            store
          },
          enhanceElement
        )
        return React.createElement(
          ApolloProvider,
          {
            client
          },
          storeElement
        )
      } catch (e) {
        console.log(e)
        return React.createElement('div')
      }
    }
  }

  return hoistNonReactStatic(ConnectWithReduxAndApollo, WrappedComponent)
}
