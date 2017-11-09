/// <reference types="react" />
import * as React from 'react';
import ApolloClient from 'apollo-client';
import 'isomorphic-fetch';
declare global  {
    interface ApplicationApolloClient extends ApolloClient<Cache> {
    }
    interface CommentServiceComponentProps {
        url: any;
        graphQLEndpoint?: string;
    }
}
export default function withReduxApollo(WrappedComponent: React.ComponentClass): any;
