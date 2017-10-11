import * as mongoose from 'mongoose'
declare global {
  interface GBUserType {
    name: string
    profilePictureURL: string
    _id: any
  }
  interface GQUserDocument extends mongoose.Document, GBUserType { }
}
const threadSchema = new mongoose.Schema({
  _id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  profilePictureURL: { type: String }
})

export default threadSchema
