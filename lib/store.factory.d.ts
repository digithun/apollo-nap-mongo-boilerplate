import ApolloClient from 'apollo-client';
import { Store } from 'redux';
declare global  {
    interface ApplicationState {
    }
    interface ApplicationClientStoreConfig {
        apolloClient?: ApolloClient<any>;
        initialState?: ApplicationState;
        url: any;
    }
}
export default function (config: ApplicationClientStoreConfig): Store<ApplicationState>;
