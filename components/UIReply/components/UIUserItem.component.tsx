
import * as styledComponent from 'styled-components'
const styled = styledComponent.default
const css = styledComponent.css
import * as React from 'react'
import { UILabel } from '../../common/Label'

export const UIUserSelectorButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(0,0,0,0);
  &:hover {
    border: 2px solid ${(props: { theme?: UITheme }) => props.theme.pumpkin};
  }
`

export const UIUserImageThumbnailCircle = styled.div`
  background-size: cover;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  ${(props: { theme?: UITheme, src?: string }) => {
    if (props.src) {
      return ` background-image: url(${props.src}); `
    } else {
      return `background-color: ${props.theme.grey}`
    }
  }}
`
const ContainerRoot = styled.div`
  padding: 4px 28px;
  display: flex;
  position: relative;
  align-items: center;
  cursor: pointer;
`
type ContainerPropTypes = {
  theme?: UITheme
}

const Container = styled(ContainerRoot) `
  &:hover{
    background: ${(props: ContainerPropTypes) => props.theme.pumpkin};
    color: white;
  }
`
const NameLabel = styled(UILabel) `
  margin-left: 8px;
  font-size: 0.8em;
  -webkit-font-smoothing: antialiased;
  ${(props: { theme?: UITheme }) => props.theme.matteBlack};
`
const UserSelectButtonItem = styled(UIUserSelectorButton) `
  width: 25px;
  height: 25px;

  background-clip: padding-box;
  border: 1px solid rgba(0,0,0,0.15);
  &:hover {
    border: 1px solid rgba(0,0,0,0.15);
  }
`
interface UIUserItemPropTypes extends GBUserType {
  onMouseDown: () => void
}

export default (props: UIUserItemPropTypes) => (
  <Container onMouseDown={props.onMouseDown} >
    <UserSelectButtonItem>
      <UIUserImageThumbnailCircle src={props.profilePictureURL} />
    </UserSelectButtonItem>
    <NameLabel>{props.name}</NameLabel>
  </Container>
)
