import { Reducer } from 'redux';
declare global  {
    interface GlobalState {
        loading?: boolean;
    }
    interface ApplicationState {
        global: GlobalState;
    }
}
declare const _default: {
    global: Reducer<GlobalState>;
    reply: (state: GBCommentType, action: any) => any;
    thread: (state: any, action: any) => any;
};
export default _default;
