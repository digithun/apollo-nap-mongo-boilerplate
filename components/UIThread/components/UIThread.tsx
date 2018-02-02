import * as React from 'react'
import gql from 'graphql-tag'
import Reply from './UIReplyInput'
import Layout from '../../Layout'
import * as Button from '../../common/Button'
import * as Actions from '../actions'
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
  dispatch?: (action: any) => void

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
  public findUserListById(_id) {
    for (const user of this.props.userList) {
      console.log(user._id, _id)
      if (user._id === _id) {
        return user
      }
    }
  }
  public render() {
    console.log('this.props.hasNextPage==>', this.props.hasNextPage)
    const Loadmore = this.props.hasNextPage
      ? (
        <Button.PrimaryButton onClick={this.props.requestLoadMoreComments} disabled={this.props.loading} >
          {this.props.loading ? 'กำลังโหลด' : 'โหลดเพิ่ม'}
        </Button.PrimaryButton>
      ) :
      (
        <Label.UILabel style={{ fontSize: '0.8rem' }} >
          {this.props.loadMoreComments.length > 20 ? 'สิ้นสุด... กันทีไม่ว่า ชาตินี้ ชาติไหน คอมเม้นหมดแล้วจ้า 👋🏼' : ''}
        </Label.UILabel>
      )

    return (
      <Layout>
        <div style={{minHeight: 300}} className={this.props.threadId}>
          <Reply userList={this.props.userList} />
          <div style={{ marginTop: 20,  }}>
            {this.props.comments.map((comment) => {
              return (<UIComment onRemove={(id) => this.props.dispatch(Actions.remove(id))} key={comment._id} isRemovable={!!this.findUserListById(comment.userId)} {...comment} />)
            })}
            {this.props.loadMoreComments.map((comment) => {
              return (<UIComment onRemove={(id) => this.props.dispatch(Actions.remove(id))} className='loadmore' isRemovable={!!this.findUserListById(comment.userId)} key={comment._id} {...comment} />)
            })}
          </div>
          <div style={{ color: '#bcbcbc', textAlign: 'center' }}>
            {this.props.comments.length !== 0 ? Loadmore : 'ไม่มีคอมเม้นท์'}
          </div>
        </div>
      </Layout>
    )
  }
}

export default UIThread as UIThreadComponent
