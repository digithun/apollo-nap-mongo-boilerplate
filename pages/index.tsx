import * as React from 'react'
import UIReply from '../components/UIReply'
import Layout from '../components/Layout'
import withApollo from '../lib/with-redux-apollo'
import { withProps, compose } from 'recompose'
import * as qs from 'query-string'

class CommentServicePage extends React.Component<{userList: GBUserType[]}, any> {

  constructor(props) {
    super(props)
    console.log(props)
  }
  public componentDidMount() {
    const s = encodeURIComponent(JSON.stringify([
      {
        // tslint:disable-next-line:max-line-length
        thumbnailImageURL: 'https://avatars2.githubusercontent.com/u/7989797?v=4&s=88',
        _id: 'user.mon921049uiasjfoion;ba',
        name: 'Adam'
      },
      {
        // tslint:disable-next-line:max-line-length
        thumbnailImageURL: 'https://scontent.fbkk1-2.fna.fbcdn.net/v/t1.0-1/p320x320/21430120_1653576068006258_318321706779528767_n.jpg?oh=12a99727e41c19b4ab10a50151fd86f7&oe=5A837299',
        _id: 'author.93ur9ru923jiowfe909u3',
        name: 'Rungsikorn'
      }]))
    console.log(s)
  }
  public render() {
    return (
      <Layout>
        <UIReply
          onChange={(value) => { }}
          onConfirm={() => { }}
          userList={this.props.userList}
          value={{
            threadId: 'mockId',
            replyToId: 'some-id-123',
            user: {
              thumbnailImageURL: 'https://avatars2.githubusercontent.com/u/7989797?v=4&s=88',
              _id: 'mockId1',
              name: 'Adam'
            },
            commentType: 'text',
            message: 'Sawasdeeja',
            reactions: []
          }} />
      </Layout>
    )
  }
}

export default compose(
  withApollo,
  withProps<{ userList: GBUserType[]}, {url: any}> ((props) => ({
    userList: (props.url.query.users ? JSON.parse(props.url.query.users) : []),
    sessionToken: props.url.query.sessionToken,
    threadId: props.url.query.threadId
   }))
)(CommentServicePage)

// const styled = require('styled-components').default
