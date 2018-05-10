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
  disabled?: boolean
  disabledPlaceholder?: string
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

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    align-items: flex-end;
  }
  .input {
    @media only screen and (max-width: 600px) {
      min-width: 100%;
    }
    display: flex;
    flex: 1 0 auto;
    align-items: flex-start;
    input {
      flex: 1 0 auto;
    }
  }
  .submit {
    cursor: pointer;
    margin: 0 10px;
    @media only screen and (max-width: 600px) {
      margin: 0px;
      margin-top: 5px;
    }
  }
`
const ConfirmButton = styled(PrimaryButton) `
  margin-left: 8px;
`

type enchanceProps = {
  t?: UIi18nTranslator
  currentSelectedUserIndex: number
  isTextInputDisabled?: boolean
  loading?: boolean
  setCurrentSelectedUserIndex: (value: number) => void
}

class UICommentInput extends React.Component<UICommentInputPropTypes & enchanceProps, {}> {

  public render() {
    const props = this.props
    return (
      <CommentInputContainer>
        <div className="input">
          {props.userList.length > 0 ? <UIUserSelector onChange={this.onUserChange} users={props.userList} value={props.currentSelectedUserIndex} /> : null}
          <InputTextMultiline
            disabled={props.isTextInputDisabled || props.disabled}
            style={{ height: 60 }}
            onChange={this.onInputTextChange}
            value={props.value.message}
            placeholder={props.disabled ? props.disabledPlaceholder : props.t('comment-input-placeholder')}
          />
        </div>
        <ConfirmButton
          className="submit"
          disabled={this.props.isTextInputDisabled || this.props.value.message.length < 1 || props.disabled}
          text={props.t(this.props.isTextInputDisabled ? 'posting' : 'post')}
          onClick={props.onConfirm}
        />
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
// @ts-ignore
(UICommentInput as any).displayName = 'CommentInputDialog'
interface UICommentInputComponent extends React.ComponentClass<UICommentInputPropTypes> {
  fragments: {

  }
}
export default compose<UICommentInputPropTypes & enchanceProps, UICommentInputPropTypes>(
  withDict,
  connect((state: ApplicationState) => ({
    loading: state.global.loading,
    currentSelectedUserIndex: state.reply.currentSelectedUserIndex,
    isTextInputDisabled: state.reply.isTextInputDisabled
  }))
)(UICommentInput) as UICommentInputComponent
