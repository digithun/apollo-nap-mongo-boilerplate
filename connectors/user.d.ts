/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
import 'isomorphic-fetch';
export declare type GQUserConnector = {
    resolveUserInfo: (userId: string) => Promise<GBUserType>;
    getUserIdFromToken: (token: string) => Promise<string>;
    verifyAvailableUserId: (token: string, userId: string) => Promise<boolean>;
};
declare const _default: (config: {
    logger: ApplicationLogger;
    endpoint: string;
    userModel: mongoose.Model<GQUserDocument>;
}) => GQUserConnector;
export default _default;
