/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
declare global  {
    interface GBUserType {
        name: string;
        profilePicture: string;
        _id: any;
    }
    interface GQUserDocument extends mongoose.Document, GBUserType {
    }
}
declare const threadSchema: mongoose.Schema;
export default threadSchema;
