import * as mongoose from 'mongoose'
import { reactionTypes } from './types'
const mongooseDelete = require('mongoose-delete')
declare global {

  type GBReactionType = {
    _id: any
    contentType: "COMMENT" | "THREAD"
    contentId: any
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
  contentType: { type: mongoose.Schema.Types.String, required: true, enum: ["COMMENT", "THREAD"] },
  contentId: { type: mongoose.Schema.Types.ObjectId, required: true },
  type: { type: mongoose.Schema.Types.String, enum: reactionTypes, required: true },
  
}, { timestamps: true })

reactionSchema.plugin(mongooseDelete, { overrideMethods: true })

reactionSchema.statics.getSummary = async function (contentType, contentId) {
  const result = await this.aggregate([
    { $match: { contentId, contentType, deleted: { $ne: true } } },
    { $group: { _id: "$type", 'count': { '$sum': 1 } } }
  ])
  return result.map(r => ({ type: r._id, count: r.count }))
}

export default reactionSchema
