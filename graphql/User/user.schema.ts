import * as mongoose from 'mongoose'
declare global {
  interface GBUserType {
    name: string
    profilePicture: string
    _id: any
  }
  interface GQUserDocument extends mongoose.Document, GBUserType { }
}
const threadSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  profilePicture: { type: String }
})

export default threadSchema
