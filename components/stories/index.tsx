import * as React from 'react'
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Layout from '../Layout'
import { InputTextMultiline } from '../common/Input'
import { PrimaryButton } from '../common/Button'
import theme from '../theme'
import CommentInput from '../UIThread/components/UIReplyInput/components/UICommentInput.component'
import { compose, withState, withProps } from 'recompose'
import UIUserSelector from '../UIThread/components/UIReplyInput/components/UIUserSelector.component'
const mockUsers = [
    {
      // tslint:disable-next-line:max-line-length
      profilePicture: 'https://avatars2.githubusercontent.com/u/7989797?v=4&s=88',
      _id: 'user.mon921049uiasjfoion;ba',
      name: 'Adam'
    },
    {
      // tslint:disable-next-line:max-line-length
      profilePicture: 'https://scontent.fbkk1-2.fna.fbcdn.net/v/t1.0-1/p320x320/21430120_1653576068006258_318321706779528767_n.jpg?oh=12a99727e41c19b4ab10a50151fd86f7&oe=5A837299',
      _id: 'author.93ur9ru923jiowfe909u3',
      name: 'Rungsikorn'
    }]
const UIUserSelectorWithToggle = withState('isToggleUserList', 'setToggleUserList', false)((props) => {

  // tslint:disable-next-line:jsx-no-lambda
  return (<UIUserSelector onChange={(value) => action(value)} value={0} users={mockUsers} />)
})
storiesOf('Common', module)
  .addDecorator((story) => (
    <Layout>{story()}</Layout>
  ))
  .add('InputTextMultiline', () => {
    return (
      <InputTextMultiline />
    )
  })
  .add('PrimaryButton', () => {
    return (
      <PrimaryButton text={'Confirm'} />
    )
  })
  .add('UserSelector', () => <UIUserSelectorWithToggle />)
  .add('PrimaryButton disabled', () => {
    return (
      <PrimaryButton text={'Confirm'} disabled />
    )
  })

const commentData: GBCommentType = {
  _id: 'mock',
  threadId: 'mockId',
  replyToId: 'some-id-123',
  user: mockUsers[0],
  commentType: 'text',
  message: 'Sawasdeeja',
  reactions: []
}

const CommentInputWithData = compose<any, any>(
  withState('value', 'setValue', commentData),
  withProps<any, any>( (props) => {
    return {
      onChange: (fieldName, value) => {
        const data = {...props.value}
        data[fieldName] = value
        console.log(data)
        console.log(props.value)
        // props.setValue(data)
      }

    }
  })
)(CommentInput)
storiesOf('Comment', module)
  .addDecorator((story) => (
    <Layout>{story()}</Layout>
  ))
  .add('CommentInput', () =>
    // tslint:disable-next-line:jsx-no-lambda
    (<CommentInputWithData userList={mockUsers} onConfirm={() => console.log('confirm')}  />))
