import styled from 'styled-components'
import * as React from 'react'
import { UIPopoverContainer } from '../../../../common/Popover'
import UIUserItem, { UIUserImageThumbnailCircle, UIUserSelectorButton } from './UIUserItem.component'
import { UILabel } from '../../../../common/Label'
import withDict from '../../../../../lib/with-dict'
import { compose, withState } from 'recompose'

interface UIUserSelectorPropTypes {
  users: GBUserType[]
  value: number
  onChange: (value: number) => void
}
const Container = styled.div`
  position: relative;
  margin: 0 8px;
`
const UserListWrap = styled.div`
  padding: 3px 0 7px 0;
  border-bottom: 4px solid ${(props) => props.theme.pumpkin};
`

const UserListTitle = styled(UILabel) `
  color: ${(props: { theme?: UITheme }) => props.theme.darkGrey};
  font-size: 0.8em;
  padding: 4px 8px;
  white-space: nowrap;
`

const Arrow = styled.div`
  margin: 5px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 6px solid transparent;
  border-top: 8px solid #333333;
`

const CircleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
type enchancePropType = {
  t?: UIi18nTranslator
  isToggleUserList: boolean
  setToggleUserList: (toggleUserList: boolean) => void
}
export default compose<enchancePropType & UIUserSelectorPropTypes, {}>(
  withDict,
  withState('isToggleUserList', 'setToggleUserList', false)
)((props) => {
  const toggleUserList = () => props.setToggleUserList(!props.isToggleUserList)
  const onCloseUserList = () => props.setToggleUserList(false)
  const onSelectUserItem = (value) => (() => {
    onCloseUserList()
    props.onChange(value)
  })
  return (
    <Container>
      <CircleContainer>
        <UIUserSelectorButton onMouseDown={toggleUserList}>
          <UIUserImageThumbnailCircle src={props.users[props.value].profilePicture} />
        </UIUserSelectorButton>
        <Arrow/>
      </CircleContainer>
      <UIPopoverContainer onClose={onCloseUserList} visible={props.isToggleUserList} direction='down'>
        <UserListWrap>
          <UserListTitle>{props.t('your-authors')}</UserListTitle>
          {props.users.map((user, index) => (
            <UIUserItem onMouseDown={onSelectUserItem(index)} key={user._id} {...user} />
          ))}
        </UserListWrap>
      </UIPopoverContainer>
    </Container>
  )
}) as React.ComponentClass<UIUserSelectorPropTypes>
