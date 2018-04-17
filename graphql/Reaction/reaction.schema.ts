import * as mongoose from 'mongoose'
import { reactionTypes } from './types'
const mongooseDelete = require('mongoose-delete')
declare global {

  type GBReactionType = {
    _id: any
    commentId: any
    createdAt?: string
    updatedAt?: string
    userId: string
    type: ReactionType
  }
  interface GQReactionDocument extends mongoose.Document, GBReactionType {
  }
}
const reactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  commentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: mongoose.Schema.Types.String, enum: reactionTypes, required: true },
  
}, { timestamps: true })

reactionSchema.plugin(mongooseDelete, { overrideMethods: true })

reactionSchema.statics.aggregateByCommentId = async function (commentId) {
  const result = await this.aggregate([
    { $match: { commentId, deleted: { $ne: true } } },
    { $group: { _id: "$type", 'count': { '$sum': 1 } } }
  ])
  return result
}

export default reactionSchema
