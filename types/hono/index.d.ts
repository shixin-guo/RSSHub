declare module 'hono' {
    export class Hono {
        fetch: any;
        request(path: string): Promise<{ json(): Promise<any> }>;
        use(...middleware: any[]): this;
        get(path: string, handler: any): this;
        route(path: string, app: any): this;
        notFound(handler: any): this;
        onError(handler: any): this;
        basePath(path: string): this;
    }

    export type Handler = (ctx: any) => Promise<any>;
}

declare module 'hono/compress' {
    export function compress(): any;
}

declare module 'hono/jsx-renderer' {
    export function jsxRenderer(fn: any, options?: any): any;
}

declare module 'hono/trailing-slash' {
    export function trimTrailingSlash(): any;
}
