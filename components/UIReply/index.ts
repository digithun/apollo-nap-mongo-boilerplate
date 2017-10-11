import * as React from 'react'
import CommentInput from './components/UICommentInput.component'
import { compose, withState } from 'recompose'
declare global {
  interface UIReplyInputState extends GBCommentType {

  }
}

export function * replySaga(context: ApplicationSagaContext) {

}

export default CommentInput
