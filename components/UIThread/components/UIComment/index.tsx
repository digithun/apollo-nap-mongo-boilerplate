import * as React from 'react'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import * as moment from 'moment'
import gql from 'graphql-tag'
import styled from 'styled-components'
import withDict from '../../../../lib/with-dict'
import { UIUserImageThumbnailCircle } from '../UIReplyInput/components/UIUserItem.component'
import { InputTextSingle } from '../../../common/Input'
import ReactionCompose from '../../../Reaction/ReactionCompose.component'
import { UIText } from '../../../common/Text'
import { UILabel } from '../../../common/Label'
import { PrimaryButton } from '../../../common/Button'
import { OPTIMISTIC_COMMENT_ID, loadMoreReplyComment } from '../../actions';
function isScrolledIntoView (el, offset = 0) {
  const elemTop = el.getBoundingClientRect().top
  const elemBottom = el.getBoundingClientRect().bottom

  const isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight + offset)
  return isVisible
}

function tryScrollToComponent (doc) {
  let scrolled = false
  if (doc.scrollIntoView && !isScrolledIntoView(doc)) {
    doc.scrollIntoView()
    scrolled = true
  }
  if (scrolled && doc.getBoundingClientRect().top <= 300) {
    window.scrollTo(0, window.pageYOffset - 300)
  }
  if (doc.focus) {
    doc.focus()
  }
}
const UserNameLabel = styled(UILabel) `
`
const CommentCreatedAtLabel = styled(UILabel) `
  font-style: italic;
  color: ${(props: { theme?: UITheme }) => props.theme.darkGrey};
  font-size: 0.8rem;
`
const ReplyCommentContainer = styled.div`
  margin-left: 48px;

  .load-more {
    display: inline-block;
    margin-bottom: 5px;
    cursor: pointer;
    color: ${(props: { theme?: UITheme }) => props.theme.pumpkin};
    font-size: 0.9rem;
    .arrow {
      margin-right: 5px;
      background-image: url(/static/comment-images/right-curve-arrow.png);
      background-position: center;
      background-size: contain;
      background-repeat: no-repeat;
    }
    img {
      opacity: 0;
      height: 0.9rem;
    }
  }

  .action .reaction-list {
    @media only screen and (max-width: 600px) {
      left: -109px;
    }
  }
`
const CommentContainer = styled.div`
  border-bottom: 1px solid ${(props: { theme?: UITheme }) => props.theme.matteWhite};
  padding: 10px 0;
  min-height: 90px;
  &:nth-last-child(1){
    border-bottom: none;
    margin-bottom: -8px;
  }

  .comment-item__delete-button {
    font-size: 0.8em;
    color: ${(props: any) => props.theme.darkGrey};
    margin-right: 8px;
    cursor: pointer;
  }

  .reply-comment {
    border-top: 1px solid ${(props: { theme?: UITheme }) => props.theme.matteWhite};
  }

  .reply-box {
    display: flex;
    align-items: center;
    @media only screen and (max-width: 600px) {
      flex-direction: column;
      align-items: flex-end;
    }
    .reply-box__input {
      @media only screen and (max-width: 600px) {
        min-width: 100%;
      }
      display: flex;
      flex: 1 0 auto;
      align-items: center;
      input {
        flex: 1 0 auto;
      }
    }
    .reply-box__submit {
      cursor: pointer;
      margin: 0 10px;
      @media only screen and (max-width: 600px) {
        margin: 0px;
        margin-top: 5px;
      }
    }
  }
`
const UserInfoWrap = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`
const ProfilePictureContainer = styled.div`
  width: 40px;
  height: 40px;
  position: relative;
  border-radius: 50%;
  flex: 0 0 40px;
  margin: 0 8px;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.15);
`
const CommentHeader = styled.div`
  display:flex;
  align-items: center;
`
const TextContainer = styled.div`
  padding: 0 56px ;
  margin-top: 8px;
`
const ReactionContainer = styled.div`
  display: flex;
  padding: 0 56px;
  margin: 8px 0;
  align-items: center;

  .reply {
    font-weight: bold;
    cursor: pointer;
  }
`
const ProfilePicture = styled(UIUserImageThumbnailCircle) `
`
function findUserListById(userList, _id) {
  for (const user of userList) {
    if (user._id === _id) {
      return user
    }
  }
}
function getIsRemovable(userList, comment) {
  if (!userList) return false
  return !!findUserListById(userList, comment.userId)
}
interface UICommentPropTypes extends GBCommentType {
  className?: string
  onRemove?: (id: string) => void
  onAddReaction?: (id: string, type: string) => void
  onRemoveReaction?: (id: string) => void
  selectedUser?: any
  replyDisabled?: boolean
  userReaction?: {
    type: string
  }
  userList?: any[]
  reactionSummary?: any
  t?: any
  commentConnection?: { count: number, pageInfo: { hasPreviousPage: boolean }, edges: { cursor: string, node: UICommentPropTypes }[] }
}
const _UICommentComponent = (props: UICommentPropTypes & { remainingComment?: number, replyLoading?: boolean, onLoadMoreReplyComment?: () => void, onLoadMoreComment?: any, hasMoreComment?: boolean, comments?: UICommentPropTypes[], showReplyInput?: boolean, onReplyMessageChange?: any, onReply?: any, replyMessage?: string, onWillReply?: any }) => !props.user ? <div onClick={console.log.bind(null, props)} >{'error'}</div> : (
  <CommentContainer className={props.className}>
    <CommentHeader>
      <UserInfoWrap>
        <ProfilePictureContainer>
          <ProfilePicture src={props.user.profilePicture} />
        </ProfilePictureContainer>
        <UserNameLabel style={{ fontWeight: 600 }}>
          <div>{props.user.name}</div>
          <CommentCreatedAtLabel>{props._id !== OPTIMISTIC_COMMENT_ID ?  moment(props.createdAt).fromNow() : '....'}</CommentCreatedAtLabel>
        </UserNameLabel>
      </UserInfoWrap>
      {
        props._id !== OPTIMISTIC_COMMENT_ID
          ? (<UIText onClick={props.onRemove ? props.onRemove.bind(null, props._id) : null} className='comment-item__delete-button'>
            {getIsRemovable(props.userList, props) ? props.t('delete') : null}
          </UIText>) : null
      }
    </CommentHeader>
    <TextContainer>
      <UIText>{props.message}</UIText>
    </TextContainer>
    <ReactionContainer>
      <ReactionCompose isAbleToReact={!!props.selectedUser} onAddReaction={(type) => props.onAddReaction && props.onAddReaction(props._id, type)} onRemoveReaction={() => props.onRemoveReaction && props.onRemoveReaction(props._id)} userReaction={props.userReaction} reactionSummary={props.reactionSummary}/>
      {
        props.selectedUser && !props.replyDisabled ? <div className='reply heavent' style={{ marginLeft: props.selectedUser ? 10 : 0 }} onClick={props.onWillReply}>{props.t('reply')}</div> : null
      }
    </ReactionContainer>
    <ReplyCommentContainer key='reply'>
      {
        props.hasMoreComment
        ? <div className='load-more heavent' onClick={props.onLoadMoreReplyComment}>
          <span className="arrow" style={{ marginRight: 5 }}><img src="/static/comment-images/right-curve-arrow.png"/></span>
          <span>{props.replyLoading ? props.t('loading') : props.t('comment/reply/load-more', { count: props.remainingComment })}</span>
        </div>
        : null
      }
      {
        props.comments && props.comments.length > 0
          ? <div className='reply-comment'>{
            props.comments.map((comment) =>
              <UICommentComponent
                key={comment._id}
                t={props.t}
                replyDisabled={true}
                selectedUser={props.selectedUser}
                onAddReaction={props.onAddReaction}
                onRemoveReaction={props.onRemoveReaction}
                onRemove={props.onRemove}
                userList={props.userList}
                {...comment}
              />
            )
          }</div>
          : null
      }
      {
        props.showReplyInput
          ? <div className='reply-box'>
            <div className='reply-box__input'>
              <ProfilePictureContainer>
                <ProfilePicture src={props.selectedUser.profilePicture} />
              </ProfilePictureContainer>
              <InputTextSingle id={`comment-input-box-${props._id}`} value={props.replyMessage} onChange={(e: any) => props.onReplyMessageChange(e.target.value)} />
            </div>
            <PrimaryButton className='reply-box__submit' onClick={props.onReply}>
              {props.t('confirm')}
            </PrimaryButton>
          </div>
          : null
      }
    </ReplyCommentContainer>
  </CommentContainer>
)

const UICommentComponent = withDict<UICommentPropTypes, UICommentPropTypes>(_UICommentComponent as any) as any


@(connect((state: ApplicationState, props: any) => ({
  replyLoading: !!state.comment.replyLoading[props._id],
  selectedUser: state.reply.user
}), (dispatch, ownProps) => ({
  loadMoreReply: () => dispatch(loadMoreReplyComment(ownProps._id)),
})) as any)
export default class UICommentContainer extends React.Component<UICommentPropTypes & { onReply?: (string) => any, loadMoreReply?: any, replyLoading?: boolean }> {
  state = {
    showReplyInput: false,
    replyMessage: "",
    showComment: false,
  }
  static fragments = {
    comment: gql`
      ${ReactionCompose.fragments.commentReaction}
      fragment UICommentDataFragment on Comment {
        message
        _id
        createdAt
        userId
        commentConnection(last: 3, sort: CREATEDAT_ASC) {
          count
          pageInfo {
            hasPreviousPage
          }
          edges {
            cursor
            node {
              _id
              message
              createdAt
              userId
              ...CommentReaction
              user {
                name
                _id
                profilePicture
              }
            }
          }
        }
        user {
          name
          _id
          profilePicture
        }
        ...CommentReaction
      }
    `
  }
  showReplyInput = () => {
    this.setState({ showReplyInput: !this.state.showReplyInput, showComment: true })
    if (!this.state.showReplyInput) {
      setTimeout(() => {
        const doc = document.getElementById(`comment-input-box-${this.props._id}`)
        tryScrollToComponent(doc)
      })
    }
  }
  onReplyMessageChange = (message) => this.setState({ replyMessage: message })
  onReply = () => {
    this.props.onReply && this.props.onReply(this.state.replyMessage)
    this.setState({ replyMessage: '', showReplyInput: false })
  }
  render() {
    return (
      <UICommentComponent
        {...this.props}
        remainingComment={this.state.showComment ? this.props.commentConnection.count - this.props.commentConnection.edges.length : this.props.commentConnection.count}
        comments={this.state.showComment ? this.props.commentConnection.edges.map(e => e.node) : []}
        hasMoreComment={this.state.showComment ? this.props.commentConnection.pageInfo.hasPreviousPage : this.props.commentConnection.count > 0}
        showReplyInput={this.state.showReplyInput}
        onWillReply={this.showReplyInput}
        onReplyMessageChange={this.onReplyMessageChange}
        onLoadMoreReplyComment={() => {
          if (this.state.showComment) {
            this.props.loadMoreReply && this.props.loadMoreReply()
          } else {
            this.setState({
              showComment: true
            })
          }
        }}
        replyMessage={this.state.replyMessage}
        onReply={this.onReply}
      />
    )
  }
}

export {
  UICommentComponent as Component
}
