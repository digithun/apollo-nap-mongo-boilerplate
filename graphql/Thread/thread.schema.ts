import * as mongoose from 'mongoose'
declare global {
  type GBThreadType = {
    appId: string
    contentId: string
    contentPrefix: string
  }
  interface GQThreadDocument extends mongoose.Document, GBThreadType { }
}
const threadSchema = new mongoose.Schema({
  appId: {
    required: true,
    type: String
  },

  contentPrefix: {
    required: true,
    type: String
  },
  contentId: {
    type: String,
    unique: true,
    required: true
  },
})

export default threadSchema
