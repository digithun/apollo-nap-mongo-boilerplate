/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
declare global  {
    type GBThreadType = {
        _id: any;
        appId: string;
        contentId: string;
    };
    interface GQThreadDocument extends mongoose.Document, GBThreadType {
    }
}
declare const threadSchema: mongoose.Schema;
export default threadSchema;
