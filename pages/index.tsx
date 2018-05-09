import Thread from '../components/UIThread'
import ThreadReaction from '../components/UIThread/Reaction.container'
import * as localStorage from 'localforage'
import * as React from 'react'
import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory/lib/inMemoryCache'
import { ApolloLink } from 'apollo-link'

const SIGN_IN_WITH_EMAIL_MUTATION = `
  mutation signin($username: String!, $password: String!) {
    login(email: $username, password: $password) {
      isLoggedIn
      sessionToken
      user {
        email
        authors {
          id
          _id
          name
          profilePicture
        }
        profilePicture
      }
    }
  }
`
const graphqlEndpoint = '/graphql'
interface IndexPropTypes {
  config: ApplicationConfig
  url: any
}
export default class Index extends React.Component<
  IndexPropTypes,
  {
    username: string
    password: string
    token: any
    user: any
    threadId: string
  }
  > {
  public static getInitialProps = (Thread as any).getInitialProps
  // private nap: ApolloClient<any>
  constructor(props: IndexPropTypes) {
    super(props)
    this.state = {
      username: '',
      password: '',
      token: undefined,
      user: undefined,
      threadId: '5a55b7e7ae592800134d12f6'
    }
    this.onChange = this.onChange.bind(this)
    this.login = this.login.bind(this)

    // const httpLink = new HttpLink({
    //   uri: this.props.config.NAP_URI
    // })
    // const middlewareLink = new ApolloLink((operation, forward) => {
    //   operation.setContext({
    //     headers: {
    //       authorization: 'Bearer ' + this.state.token || null
    //     }
    //   });
    //   return forward(operation);
    // });
    // this.nap = new ApolloClient(({
    //   link: middlewareLink.concat(httpLink),
    //   cache: new InMemoryCache({})
    // }) as any)
  }
  public onChange(key: any) {
    return (e: React.ChangeEvent<any>) => {
      console.log(key, e.target.value)
      this.setState({ [key]: e.target.value })
    }
  }

  public async componentDidMount() {
    const token = await localStorage.getItem('token')
    if (token) {
      this.setState({ token })
      const response = await fetch(this.props.config.NAP_URI, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + this.state.token || null
        },
        body: JSON.stringify({
          query: `
            query {
              user {
                email
                name
                _id
                authors {
                  id
                  _id
                  name
                  profilePicture
                }
                profilePicture
              }
            }
        `
        })
      })
      const result = await response.json()
      this.setState({
        user: result.data.user
      })
    }
  }
  public async login() {
    const payload = {
      query: SIGN_IN_WITH_EMAIL_MUTATION,
      variables: {
        username: this.state.username,
        password: this.state.password
      }
    }
    const response = await fetch(this.props.config.NAP_URI, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const result = await response.json()
    console.log(result.data.login.sessionToken)
    try {
      await localStorage.setItem('token', result.data.login.sessionToken)
    } catch (e) {
      alert('something went wrong')
    }
  }
  public render() {
    if (this.state.user && this.state.token) {
      const userListForComment = [
        {
          name: this.state.user.name,
          _id: `user.${this.state.user._id}`,
          profilePicture: this.state.user.profilePicture
        },
        ...this.state.user.authors.map((author) => ({
          ...author,
          _id: `author.${author.id}`
        }))
      ]
      const encodeUserList = JSON.stringify(userListForComment)
      return (
        <div style={{ position: 'relative' }}>
          {this.state.user.email}
          <button onClick={() => this.setState({ threadId: '5a55b7e7ae592800134d12f6' })}>
            {'ซื้อแล้ว'}
          </button>
          <button
            onClick={() =>
              this.setState({ threadId: '5a718979c0163b000f32d710' })
            }
          >
            {'ยังไม่ได้ซื้อ'}
          </button>
          <button
            onClick={() =>
              this.setState({ threadId: '5a55b7e7ae592800134d12f6' })
            }
          >
            {'mock-6'}
          </button>
          {this.state.threadId}
          {this.state.token}
          <br/>
          <ThreadReaction
            style={{ marginTop: 80, marginBottom: 80 }}
            direction="left"
            graphQLEndpoint={graphqlEndpoint}
            url={{
              ...this.props.url,
              query: {
                contentId: `episode.${this.state.threadId || 'comment-test'}`,
                users: encodeUserList,
                sessionToken: this.state.token,
                appId: 'Jamplay'
              }
            }}
          />
          <br/>
          <Thread
            graphQLEndpoint={graphqlEndpoint}
            url={{
              ...this.props.url,
              query: {
                contentId: `episode.${this.state.threadId || 'comment-test'}`,
                users: encodeUserList,
                sessionToken: this.state.token,
                appId: 'Jamplay'
              }
            }}
          />
        </div>
      )
    }
    return (
      <div>
        <input
          value={this.state.username}
          onChange={this.onChange('username')}
        />
        <input
          value={this.state.password}
          onChange={this.onChange('password')}
        />
        <button onClick={this.login}>{'submit'}</button>
        {/* <Thread
          graphQLEndpoint={'/graphql'}
          url={{
            ...this.props.url,
            query: {
              contentId: `episode.${this.state.threadId || 'comment-test'}`,
              sessionToken: this.state.token,
              appId: 'Jamplay'
            }
          }}
        /> */}
      </div>
    )
  }
}
