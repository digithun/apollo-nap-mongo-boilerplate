/// <reference types="express" />
/// <reference types="mongoose" />
import * as express from 'express';
import { Connection } from 'mongoose';
import { GQConnectors } from './connectors';
declare global  {
    interface ApplicationLogger {
        log: (message: string) => void;
    }
    interface SVContext {
        server?: express.Application;
        config: ApplicationConfig;
        logger: ApplicationLogger;
        __connection: Connection;
    }
    interface GQResolverContext extends SVContext, express.Request {
        models: GQApplicationModels;
        connectors: GQConnectors;
        token: string;
    }
}
export default function init(context: SVContext): Promise<{
    start: () => Promise<void>;
}>;
