/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import { TypeComposer, ResolverNextRpCb } from 'graphql-compose';
declare global  {
    type GQReplyArgs = {
        record: {
            threadId: mongoose.Types.ObjectId;
            userId: string;
            message: string;
            replyToId?: string;
        };
    };
}
export declare const guardWrapResolver: ResolverNextRpCb<GQCommentDocument, GQResolverContext>;
export declare const assignUserResolver: ResolverNextRpCb<GQCommentDocument, GQResolverContext>;
export default function enchanceCreate(typeComposer: TypeComposer): void;
