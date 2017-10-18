import * as mongoose from 'mongoose'
declare global {
  type GBThreadType = {
    _id: any
    appId: string
    contentId: string
  }
  interface GQThreadDocument extends mongoose.Document, GBThreadType { }
}
const threadSchema = new mongoose.Schema({
  appId: {
    required: true,
    type: String
  },
  contentId: {
    type: String,
    required: true
  },
})

export default threadSchema
