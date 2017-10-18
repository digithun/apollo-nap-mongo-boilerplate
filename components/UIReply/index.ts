import CommentInput from './components/UICommentInput.component'
import { takeEvery } from 'redux-saga/effects'
export default CommentInput

export function * replySaga(context: ApplicationSagaContext) {
  yield takeEvery<{ payload: UIReplyInputState, type: string }>('reply/confirm-create-comment', function *(action) {
    console.log(action.payload)
  })
}

console.log(replySaga)
