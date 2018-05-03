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
import { OPTIMISTIC_COMMENT_ID, loadMoreReplyComment } from '../../actions';
const UserNameLabel = styled(UILabel) `
`
const CommentCreatedAtLabel = styled(UILabel) `
  font-style: italic;
  color: ${(props: { theme?: UITheme }) => props.theme.darkGrey};
  font-size: 0.8rem;
`
const ReplyCommentContainer = styled.div`
  margin-left: 56px;

  .load-more {
    display: inline-block;
    margin-bottom: 5px;
    cursor: pointer;
    color: blue;
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

  .input-box {
    display: flex;
    align-items: center;
    input {
      flex: 1 1 100%;
    }
    img {
      cursor: pointer;
      margin: 0 10px;
      width: 25px;
      height: 25px;
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
  return !!findUserListById(userList, comment.userId)
}
interface UICommentPropTypes extends GBCommentType {
  className?: string
  onRemove?: (id: string) => void
  onAddReaction?: (id: string, type: string) => void
  onRemoveReaction?: (id: string) => void
  isLoggedIn?: boolean
  replyDisabled?: boolean
  userReaction?: {
    type: string
  }
  userList?: any[]
  reactionSummary?: any
  t?: any
  commentConnection?: { pageInfo: { hasPreviousPage: boolean }, edges: { cursor: string, node: UICommentPropTypes }[] }
}
const _UICommentComponent = (props: UICommentPropTypes & { replyLoading?: boolean, onLoadMoreReplyComment?: () => void, onLoadMoreComment?: any, hasMoreComment?: boolean, comments?: UICommentPropTypes[], showReplyInput?: boolean, onReplyMessageChange?: any, onReply?: any, replyMessage?: string, onWillReply?: any }) => !props.user ? <div onClick={console.log.bind(null, props)} >{'error'}</div> : (
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
      <ReactionCompose isAbleToReact={props.isLoggedIn} onAddReaction={(type) => props.onAddReaction && props.onAddReaction(props._id, type)} onRemoveReaction={() => props.onRemoveReaction && props.onRemoveReaction(props._id)} userReaction={props.userReaction} reactionSummary={props.reactionSummary}/>
      {
        props.isLoggedIn && !props.replyDisabled ? <div className='reply heavent' style={{ marginLeft: props.isLoggedIn ? 10 : 0 }} onClick={props.onWillReply}>{props.t('reply')}</div> : null
      }
    </ReactionContainer>
    <ReplyCommentContainer key='reply'>
      {
        props.replyLoading
        ? <div>loading</div>
        : props.hasMoreComment
        ? <div className='load-more heavent' onClick={props.onLoadMoreReplyComment}>
          {props.t('comment/reply/load-more')}
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
                isLoggedIn={props.isLoggedIn}
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
          ? <div className='input-box'>
            <InputTextSingle className='left' value={props.replyMessage} onChange={e => props.onReplyMessageChange(e.target.value)} />
            <img className='right' src="/static/comment-images/reaction/reaction-like.png" onClick={props.onReply}/>
          </div>
          : null
      }
    </ReplyCommentContainer>
  </CommentContainer>
)

const UICommentComponent = withDict<UICommentPropTypes, UICommentPropTypes>(_UICommentComponent as any) as any


@(connect((state: ApplicationState, props: any) => ({
  replyLoading: !!state.comment.replyLoading[props._id]
}), (dispatch, ownProps) => ({
  loadMoreReply: () => dispatch(loadMoreReplyComment(ownProps._id)),
})) as any)
export default class UICommentContainer extends React.Component<UICommentPropTypes & { onReply?: (string) => any, loadMoreReply?: any, replyLoading?: boolean }> {
  state = {
    showReplyInput: false,
    replyMessage: "",
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
  showReplyInput = () => this.setState({ showReplyInput: !this.state.showReplyInput })
  onReplyMessageChange = (message) => this.setState({ replyMessage: message })
  onReply = () => {
    this.props.onReply && this.props.onReply(this.state.replyMessage)
    this.setState({ replyMessage: '' })
  }
  render() {
    return (
      <UICommentComponent
        {...this.props}
        comments={this.props.commentConnection.edges.map(e => e.node)}
        hasMoreComment={this.props.commentConnection.pageInfo.hasPreviousPage}
        showReplyInput={this.state.showReplyInput}
        onWillReply={this.showReplyInput}
        onReplyMessageChange={this.onReplyMessageChange}
        onLoadMoreReplyComment={this.props.loadMoreReply}
        replyMessage={this.state.replyMessage}
        onReply={this.onReply}
      />
    )
  }
}

export {
  UICommentComponent as Component
}
