declare global  {
    interface GBThreadState {
        hasNextPage?: boolean;
    }
    interface ApplicationState {
        thread: GBThreadState;
    }
}
export declare const threadReducer: (state: any, action: any) => any;
export {};
