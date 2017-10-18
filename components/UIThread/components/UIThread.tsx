import * as React from 'react'

import Reply from './UIReplyInput'
import Layout from '../../Layout'

interface ThreadPropTypes {
  url: any
  userList: GBUserType[]
  threadId: string
  comments: GBCommentType[]
}
export default class UIThread extends React.Component<ThreadPropTypes, {}> {
  constructor(props) {
    super(props)
  }
  public render() {
    return (
      <Layout>
        <div>
          <Reply userList={this.props.userList} threadId={this.props.threadId} />
          {this.props.comments.map((comment) => {
            return (
              <div key={comment._id}>
                {comment.message}
              </div>
            )
          })}
        </div>
      </Layout>
    )
  }
}
