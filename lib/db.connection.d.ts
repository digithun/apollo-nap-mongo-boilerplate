/// <reference types="mongoose" />
import * as mongoose from 'mongoose';
declare global  {
    interface DBConnectionContext {
        logger: ApplicationLogger;
        config: ApplicationConfig;
    }
}
export declare function initConnection(context: DBConnectionContext): Promise<mongoose.Connection>;
