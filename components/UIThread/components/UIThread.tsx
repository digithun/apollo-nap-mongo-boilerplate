import * as React from 'react'
import gql from 'graphql-tag'
import Reply from './UIReplyInput'
import Layout from '../../Layout'
import * as Button from '../../common/Button'
import * as Actions from '../actions'
import * as Label from '../../common/Label'
import UIComment from './UIComment'

const throttle = require('lodash/throttle')
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
  onReply = (id, message) => {
    this.props.dispatch(Actions.replyComment({ message: message, replyToId: id }))
  }

  public componentDidMount() {
    window.addEventListener('scroll', () => {
      if (this.props.hasNextPage && !this.props.loading) {
        let supportPageOffset = window.pageXOffset !== undefined
        let isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat')
        let scrollMaxY = document.body.offsetHeight - document.documentElement.clientHeight;
        let scroll = {
          x: supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
          y: supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop,
        }
        if (scroll.y >= scrollMaxY - 100) {
          this.props.requestLoadMoreComments()
        }
      }
    })
  }

  public componentDidUpdate() {
    setTimeout(() => {
      if (this.props.hasNextPage && !this.props.loading
        && document.body.scrollHeight < document.documentElement.clientHeight) {
        this.props.requestLoadMoreComments()
      }
    })
  }

  public render() {
    console.log('this.props.hasNextPage==>', this.props.hasNextPage)
    const Loadmore = this.props.hasNextPage
      ? (
        <Button.PrimaryButton onClick={this.props.requestLoadMoreComments} disabled={this.props.loading} >
          {this.props.loading ? 'กำลังโหลด' : 'โหลดเพิ่ม'}
        </Button.PrimaryButton>
      )
      : null

    return (
      <Layout>
        <div style={{ minHeight: 300, marginBottom: 100 }} className={this.props.threadId}>
          <Reply
            disabled={this.props.replyDisabled === true || this.props.userList.length <= 0}
            disabledPlaceholder={this.props.replyDisabledPlaceholder}
            userList={this.props.userList}
          />
          <div style={{ marginTop: 20, }}>
            {this.props.comments.map((comment) => {
              return (
                <UIComment
                  onReply={(message) => this.onReply(comment._id, message)}
                  onRemove={this.onRemove}
                  onAddReaction={this.onAddReaction}
                  onRemoveReaction={this.onRemoveReaction}
                  replyDisabled={this.props.replyDisabled}
                  key={comment._id}
                  userList={this.props.userList}
                  {...comment}
                />)
            })}
            {this.props.loadMoreComments.map((comment) => {
              return (
                <UIComment
                  onRemove={this.onRemove}
                  onAddReaction={this.onAddReaction}
                  onRemoveReaction={this.onRemoveReaction}
                  className='loadmore'
                  userList={this.props.userList}
                  replyDisabled={this.props.replyDisabled}
                  key={comment._id}
                  onReply={(message) => this.onReply(comment._id, message)}
                  {...comment}
                />)
            })}
          </div>
          <div style={{ color: '#bcbcbc', textAlign: 'center' }}>
            {
              this.props.comments.length !== 0
              ? Loadmore
              : this.props.loading
              ? <Button.PrimaryButton disabled>
                กำลังโหลด
              </Button.PrimaryButton>
              : 'ไม่มีคอมเม้นท์'
            }
          </div>
        </div>
      </Layout>
    )
  }

  private onRemove = (id) => {
    this.props.dispatch(Actions.remove(id))
  }
}

export default UIThread as UIThreadComponent
