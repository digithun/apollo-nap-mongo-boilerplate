import * as React from 'react'
import { compose } from 'recompose'
import * as moment from 'moment'
import gql from 'graphql-tag'
import styled from 'styled-components'
import withDict from '../../../../lib/with-dict'
import { UIUserImageThumbnailCircle } from '../UIReplyInput/components/UIUserItem.component'
import ReactionCompose from '../../../Reaction/ReactionCompose.component'
import { UIText } from '../../../common/Text'
import { UILabel } from '../../../common/Label'
import { OPTIMISTIC_COMMENT_ID } from '../../actions';
const UserNameLabel = styled(UILabel) `
`
const CommentCreatedAtLabel = styled(UILabel) `
  font-style: italic;
  color: ${(props: { theme?: UITheme }) => props.theme.darkGrey};
  font-size: 0.8rem;
`
const CommentContainer = styled.div`
  border-bottom: 1px solid ${(props: { theme?: UITheme }) => props.theme.matteWhite};
  padding: 10px 0;
  min-height: 90px;
  &:nth-last-child(1){
    border-bottom: none;
  }

  .comment-item__delete-button {
    font-size: 0.8em;
    color: ${(props: any) => props.theme.darkGrey};
    margin-right: 8px;
    cursor: pointer;
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
  padding: 0 56px;
  margin-top: 8px;
`
const ProfilePicture = styled(UIUserImageThumbnailCircle) `
`
interface UICommentPropTypes extends GBCommentType {
  className?: string
  isRemovable?: boolean
  onRemove?: (id: string) => void
  onAddReaction?: (type: string) => void
  onRemoveReaction?: () => void
  isAbleToReact?: boolean
  userReaction?: {
    type: string
  }
  reactionSummary?: any
  t?: any
}
interface UICommentComponent extends React.ComponentClass<UICommentPropTypes> {
  fragments: {
    comment: any
  }
}
const UICommentComponent = compose<UICommentPropTypes, {}>(
)((props: UICommentPropTypes) => !props.user ? <div onClick={console.log.bind(null, props)} >{'error'}</div> : (
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
          ? (<UIText onClick={props.onRemove.bind(null, props._id)} className='comment-item__delete-button'>
            {props.isRemovable ? props.t('delete') : null}
          </UIText>) : null
      }
    </CommentHeader>
    <TextContainer>
      <UIText>{props.message}</UIText>
    </TextContainer>
    <ReactionContainer>
      <ReactionCompose isAbleToReact={props.isAbleToReact} onAddReaction={props.onAddReaction} onRemoveReaction={props.onRemoveReaction} userReaction={props.userReaction} reactionSummary={props.reactionSummary}/>
    </ReactionContainer>
  </CommentContainer>
)) as UICommentComponent

const enchanceComponent = withDict<UICommentPropTypes, UICommentPropTypes>(UICommentComponent as any) as any
enchanceComponent.fragments = {
  comment: gql`
    ${ReactionCompose.fragments.commentReaction}
    fragment UICommentDataFragment on Comment {
      message
      _id
      createdAt
      userId
      user {
        name
        _id
        profilePicture
      }
      ...CommentReaction
    }
  `
}
export default enchanceComponent as any
