import * as React from 'react'

import styled from 'styled-components'
// const styled = require('styled-components').default
import { connect } from 'react-redux'
import { PrimaryButton } from '../../../../common/Button'
import { compose, withState } from 'recompose'
import { InputTextMultiline } from '../../../../common/Input'
import UIUserSelector from './UIUserSelector.component'
import withDict from '../../../../../lib/with-dict'

interface UICommentInputPropTypes {

  userList: GBUserType[]
  onChange: (value: GBCommentType) => void
  onConfirm: () => void
  value: GBCommentType
}

const CommentInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  font-size: 1em;
`
const ConfirmButton = styled(PrimaryButton) `
  margin-left: 8px;
`

type enchanceProps = {
  t?: UIi18nTranslator
  currentSelectedUserIndex: number
  loading?: boolean
  setCurrentSelectedUserIndex: (value: number) => void
}

class UICommentInput extends React.Component<UICommentInputPropTypes & enchanceProps, {}> {

  public render() {
    const props = this.props
    return (
      <CommentInputContainer>
        {props.userList.length > 0 ? <UIUserSelector onChange={this.onUserChange} users={props.userList} value={props.currentSelectedUserIndex} /> : null}
        <InputTextMultiline style={{ height: 60 }} onChange={this.onInputTextChange} value={props.value.message} placeholder={props.t('comment-input-placeholder')} />
        <ConfirmButton disabled={this.props.loading || this.props.value.message.length < 1} text={props.t('confirm')} onClick={props.onConfirm} />
      </CommentInputContainer>
    )
  }
  private onChange = (fieldName, value) => {
    const data = { ...this.props.value }
    data[fieldName] = value
    this.props.onChange(data)
  }
  private onInputTextChange = (e) => this.onChange('message', e.target.value)
  private onUserChange = (userIndex) => {
    this.onChange('user', this.props.userList[userIndex])
    this.props.setCurrentSelectedUserIndex(userIndex)
  }
}
interface UICommentInputComponent extends React.ComponentClass<UICommentInputPropTypes> {
  fragments: {

  }
}
export default compose<UICommentInputPropTypes & enchanceProps, UICommentInputPropTypes>(
  withDict,
  withState('currentSelectedUserIndex', 'setCurrentSelectedUserIndex', 0),
  connect((state: ApplicationState) => ({
    loading: state.global.loading
  }))
)(UICommentInput) as UICommentInputComponent
