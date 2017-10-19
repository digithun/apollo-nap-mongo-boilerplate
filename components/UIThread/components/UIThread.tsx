import * as React from 'react'
import gql from 'graphql-tag'
import Reply from './UIReplyInput'
import Layout from '../../Layout'
import UIComment from './UIComment'
interface ThreadPropTypes {
  url: any
  userList: GBUserType[]
  threadId: string
  comments: GBCommentType[]
}
interface UIThreadComponent extends React.ComponentClass<ThreadPropTypes> {
  fragments: {
    thread: any
  }
}
class UIThread extends React.Component<ThreadPropTypes, {}> {
  public static fragments = {
    thread: gql`
      ${ UIComment.fragments.comment}
      fragment UIThreadDataFragment on Thread {
        appId
        _id
        contentId
      }
    `
  }

  constructor(props) {
    super(props)
  }
  public render() {
    return (
      <Layout>
        <div>
          <Reply userList={this.props.userList} />
          <div style={{marginTop: 20}}>
          {this.props.comments.map((comment) => {
            return (
              <UIComment key={comment._id} {...comment} />
            )
          })}
          </div>
        </div>
      </Layout>
    )
  }
}

export default UIThread as UIThreadComponent
