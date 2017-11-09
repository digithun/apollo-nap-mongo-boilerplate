declare global  {
    interface ApplicationConfig {
        dev: boolean;
        MONGODB_URI: string;
        NAP_URI: string;
        PORT: string;
    }
}
declare const config: ApplicationConfig;
export default config;
export {};
