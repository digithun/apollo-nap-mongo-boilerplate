import { createAction } from 'redux-actions'

export type ConfirmCreateCommentPayload = GBCommentType
export const confirmCreateComment = createAction<ConfirmCreateCommentPayload>('reply/confirm-create-comment')

export const ALERT_ACTIONS = 'dialog/alert'
export const ERROR_ACTIONS = 'dialog/error'

export const DISABLED_TEXT_INPUT_DIALOG = 'reply/disabled-text-input-dialog'

export const OPTIMISTIC_COMMENT_ID = 'optimistic-comment-id'
export const loadMoreReplyList = createAction('thread/load-more-reply')
export const set = createAction<GBThreadState>('thread/set')
export const remove = createAction<string>('thread/remove')
export const reload = createAction<string>('global/reload')
export const addReaction = createAction<{ contentType: string, contentId: string, type: string }>('reaction/add')
export const removeReaction = createAction<{ contentType: string, contentId: string }>('reaction/remove')
