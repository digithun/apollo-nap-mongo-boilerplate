/// <reference types="react" />
import * as React from 'react';
import 'react';
declare module 'react' {
    interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
        jsx?: string;
        global?: string;
    }
}
export default class Layout extends React.Component<{}, {}> {
    componentDidMount(): void;
    render(): JSX.Element;
}
