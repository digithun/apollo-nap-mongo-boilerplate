/// <reference types="react" />
import Document from 'next/document';
export default class PageDocument extends Document {
    props: {
        styleTags: any;
    };
    static getInitialProps({renderPage}: {
        renderPage: any;
    }): any;
    render(): JSX.Element;
}
