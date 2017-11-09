import { GQUserConnector } from './user';
export declare type GQConnectors = {
    User: GQUserConnector;
};
declare const _default: (config: {
    napEndpoint: string;
    models: GQApplicationModels;
    logger: ApplicationLogger;
}) => GQConnectors;
export default _default;
