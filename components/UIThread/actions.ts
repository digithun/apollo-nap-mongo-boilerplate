import { createAction } from 'redux-actions'

export type ConfirmCreateCommentPayload = GBCommentType
export const confirmCreateComment = createAction<ConfirmCreateCommentPayload>('reply/confirm-create-comment')

export const loadMoreReplyList = createAction('thread/load-more-reply')
export const set = createAction<GBThreadState>('thread/set')
