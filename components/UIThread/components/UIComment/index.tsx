import * as React from 'react'
import { compose } from 'recompose'
import * as moment from 'moment'
import gql from 'graphql-tag'
import styled from 'styled-components'
import { UIUserImageThumbnailCircle } from '../UIReplyInput/components/UIUserItem.component'
import { UIText } from '../../../common/Text'
import { UILabel } from '../../../common/Label'
const UserNameLabel = styled(UILabel) `
`
const CommentCreatedAtLabel = styled(UILabel)`
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
`
const ProfilePicture = styled(UIUserImageThumbnailCircle) `
`
interface UICommentPropTypes extends GBCommentType {
  className?: string
}
interface UICommentComponent extends React.ComponentClass<UICommentPropTypes> {
  fragments: {
    comment: any
  }
}
const UICommentComponent = compose<UICommentPropTypes, {}>(
)((props: UICommentPropTypes) => !props.user ? <div onClick={() => { console.log(props) }} >{'error'}</div> : (
  <CommentContainer className={props.className}>
    <CommentHeader>
      <UserInfoWrap>
        <ProfilePictureContainer>
          <ProfilePicture src={props.user.profilePicture} />
        </ProfilePictureContainer>
        <UserNameLabel style={{ fontWeight: 600 }}>{props.user.name}</UserNameLabel>
      </UserInfoWrap>
      <CommentCreatedAtLabel>{moment(props.createdAt).fromNow()}</CommentCreatedAtLabel>
    </CommentHeader>
    <TextContainer>
      <UIText>{props.message}</UIText>
    </TextContainer>
  </CommentContainer>
)) as UICommentComponent
UICommentComponent.fragments = {
  comment: gql`
    fragment UICommentDataFragment on Comment {
      message
      _id
      createdAt
      user {
        name
        _id
        profilePicture
      }
    }
  `
}

export default UICommentComponent
