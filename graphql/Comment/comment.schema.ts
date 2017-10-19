import * as mongoose from 'mongoose'
declare global {

  type GBReactionType = {
    actionType: | 'smile' | 'laugh' | 'sad'
    userId: string
  }
  type GBCommentType = {
    _id: any
    threadId?: any
    createdAt?: string
    updatedAt?: string
    replyToId?: any
    userId?: string
    commentType?: | 'text'
    message: string
    reactions?: GBReactionType[]

    // relation field
    user?: GBUserType
  }
  interface GQCommentDocument extends mongoose.Document, GBCommentType {
  }
}
const commentSchema = new mongoose.Schema({
  threadId: { type: mongoose.Schema.Types.ObjectId },
  replyToId: { type: mongoose.Schema.Types.ObjectId },
  userId: String,
  GBCommentType: {
    type: String,
    enum: ['TEXT'],
  },
  reactions: {
    default: [],
    type: {
      userId: {
        type: String,
        required: true
      },
      actionType: {
        type: String,
        enum: ['smile', 'laugh', 'sad'],
        require: true
      }
    }
  },
  message: {
    type: String,
    required: [true, 'comment, require message'],
    validate: {
      validator: (value) => {
        return value.length <= 300 && value.length > 0
      },
      msg: 'comment, should less than 300 length and more than 0'
    }
  },
}, { timestamps: true })

export default commentSchema
