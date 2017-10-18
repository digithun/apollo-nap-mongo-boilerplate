import * as React from 'react'

import Reply from './UIReplyInput'
import Layout from '../../Layout'

export default class UIThread extends React.Component<{ url: any, userList: GBUserType[], threadId: string }, {}> {
  constructor(props) {
    super(props)
  }
  public render() {
    console.log(this.props)
    return (
    <Layout>
      <Reply userList={this.props.userList} threadId={this.props.threadId} />
    </Layout>
    )
  }
}
