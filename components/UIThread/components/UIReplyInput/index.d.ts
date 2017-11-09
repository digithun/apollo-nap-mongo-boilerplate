/// <reference types="react" />
import * as React from 'react';
declare global  {
    interface ApplicationState {
        reply: GBCommentType;
    }
}
export declare const replyReducer: (state: GBCommentType, action: any) => any;
declare const _default: React.ComponentClass<{
    userList: GBUserType[];
}>;
export default _default;
