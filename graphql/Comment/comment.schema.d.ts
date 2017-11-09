/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
declare global  {
    type GBReactionType = {
        actionType: 'smile' | 'laugh' | 'sad';
        userId: string;
    };
    type GBCommentType = {
        _id: any;
        threadId?: any;
        createdAt?: string;
        updatedAt?: string;
        replyToId?: any;
        userId?: string;
        commentType?: 'text';
        message: string;
        reactions?: GBReactionType[];
        user?: GBUserType;
    };
    interface GQCommentDocument extends mongoose.Document, GBCommentType {
    }
}
declare const commentSchema: mongoose.Schema;
export default commentSchema;
