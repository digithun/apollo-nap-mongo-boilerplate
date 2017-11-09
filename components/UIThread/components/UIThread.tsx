import * as React from 'react'
import gql from 'graphql-tag'
import Reply from './UIReplyInput'
import Layout from '../../Layout'
import * as Button from '../../common/Button'
import * as Label from '../../common/Label'
import UIComment from './UIComment'
interface ThreadPropTypes {
  url: any
  userList: GBUserType[]
  threadId: string
  comments: GBCommentType[]
  loadMoreComments: GBCommentType[]
  loadMoreCursor: string
  requestLoadMoreComments: () => void

  loading: boolean
  hasNextPage: boolean
}
interface UIThreadComponent extends React.ComponentClass<ThreadPropTypes> {
  fragments: {
    thread: any
    comment: any
  }
}
class UIThread extends React.Component<ThreadPropTypes, {}> {
  public static fragments = {
    thread: gql`
      fragment UIThreadDataFragment on Thread {
        appId
        _id
        contentId
      }
    `,
    comment: UIComment.fragments.comment
  }

  constructor(props) {
    super(props)
  }
  public render() {
    return (
      <Layout>
        <div className={this.props.threadId}>
          <Reply userList={this.props.userList} />
          <div style={{ marginTop: 20 }}>
            {this.props.comments.map((comment) => {
              return (<UIComment key={comment._id} {...comment} />)
            })}
            {this.props.loadMoreComments.map((comment) => {
              return (<UIComment className='loadmore' key={comment._id} {...comment} />)
            })}
          </div>

          {this.props.hasNextPage
            ? <Button.PrimaryButton
              onClick={this.props.requestLoadMoreComments}
              disabled={this.props.loading}
            >
              {this.props.loading ? 'กำลังโหลด' : 'โหลดเพิ่ม'}
            </Button.PrimaryButton>
            : <Label.UILabel style={{ fontSize: '0.8rem' }} >
              {this.props.loadMoreComments.length > 20 ? 'สิ้นสุด... กันทีไม่ว่า ชาตินี้ ชาติไหน คอมเม้นหมดแล้วจ้า 👋🏼' : ''}
            </Label.UILabel>
          }
        </div>
      </Layout>
    )
  }
}

export default UIThread as UIThreadComponent
