import * as React from 'react'
import gql from 'graphql-tag'
import Reply from './UIReplyInput'
import Layout from '../../Layout'
import * as Button from '../../common/Button'
import * as Actions from '../actions'
import * as Label from '../../common/Label'
import UIComment from './UIComment'

const debounce = require('lodash/debounce')
interface ThreadPropTypes {
  userId: string
  replyDisabled?: boolean
  replyDisabledPlaceholder?: string
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
  onAddReaction = (id, type) => {
    this.props.dispatch(Actions.addReaction({ type, contentId: id, contentType: "COMMENT" }))
  }
  onRemoveReaction = (id) => {
    this.props.dispatch(Actions.removeReaction({ contentId: id, contentType: "COMMENT" }))
  }

  public componentDidMount() {
    window.addEventListener('scroll', debounce(() => {
      if (this.props.hasNextPage && !this.props.loading) {
        let supportPageOffset = window.pageXOffset !== undefined
        let isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat')
        let scrollMaxY = document.body.offsetHeight - document.documentElement.clientHeight;
        let scroll = {
          x: supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
          y: supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop,
        }
        if (scroll.y >= scrollMaxY) {
          console.log('-===================================================')
          this.props.requestLoadMoreComments()
        }
      }
    }, 100))
  }

  public componentDidUpdate() {
    setTimeout(() => {
      if (this.props.hasNextPage && !this.props.loading
        && document.body.scrollHeight < document.documentElement.clientHeight) {
        this.props.requestLoadMoreComments()
      }
    })
  }

  public findUserListById(_id) {
    for (const user of this.props.userList) {
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
        <div style={{ minHeight: 300 }} className={this.props.threadId}>
          <Reply
            disabled={this.props.replyDisabled === true || this.props.userList.length <= 0}
            disabledPlaceholder={this.props.replyDisabledPlaceholder}
            userList={this.props.userList}
          />
          <div style={{ marginTop: 20, }}>
            {this.props.comments.map((comment) => {
              return (<UIComment isAbleToReact={!!this.props.userId} onRemove={this.onRemove} onAddReaction={(type) => this.onAddReaction(comment._id, type)} onRemoveReaction={() => this.onRemoveReaction(comment._id)} key={comment._id} isRemovable={!!this.findUserListById(comment.userId)} {...comment} />)
            })}
            {this.props.loadMoreComments.map((comment) => {
              return (
                <UIComment
                  isAbleToReact={!!this.props.userId}
                  onRemove={this.onRemove}
                  onAddReaction={(type) => this.onAddReaction(comment._id, type)}
                  onRemoveReaction={() => this.onRemoveReaction(comment._id)}
                  className='loadmore'
                  isRemovable={this.getIsRemovable(comment)}
                  key={comment._id}
                  {...comment}
                />)
            })}
          </div>
          <div style={{ color: '#bcbcbc', textAlign: 'center' }}>
            {this.props.comments.length !== 0 ? Loadmore : 'ไม่มีคอมเม้นท์'}
          </div>
        </div>
      </Layout>
    )
  }

  private onRemove = (id) => {
    this.props.dispatch(Actions.remove(id))
  }
  private getIsRemovable = (comment) => {
    return !!this.findUserListById(comment.userId)
  }
}

export default UIThread as UIThreadComponent
