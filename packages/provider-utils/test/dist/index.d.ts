import { SetupServer } from 'msw/node';
import { JsonBodyType } from 'msw';

declare function convertArrayToAsyncIterable<T>(values: T[]): AsyncIterable<T>;

declare function convertArrayToReadableStream<T>(values: T[]): ReadableStream<T>;

declare function convertAsyncIterableToArray<T>(iterable: AsyncIterable<T>): Promise<T[]>;

declare function convertReadableStreamToArray<T>(stream: ReadableStream<T>): Promise<T[]>;

declare function convertResponseStreamToArray(response: Response): Promise<string[]>;

declare class JsonTestServer {
    readonly server: SetupServer;
    responseHeaders: Record<string, string>;
    responseBodyJson: any;
    request: Request | undefined;
    constructor(url: string);
    getRequestBodyJson(): Promise<any>;
    getRequestHeaders(): Promise<Record<string, string>>;
    getRequestUrlSearchParams(): Promise<URLSearchParams>;
    getRequestUrl(): Promise<string>;
    setupTestEnvironment(): void;
}

declare class StreamingTestServer {
    readonly server: SetupServer;
    responseHeaders: Record<string, string>;
    responseChunks: any[];
    request: Request | undefined;
    constructor(url: string);
    getRequestBodyJson(): Promise<any>;
    getRequestHeaders(): Promise<Record<string, string>>;
    getRequestUrlSearchParams(): Promise<URLSearchParams>;
    setupTestEnvironment(): void;
}

type TestServerJsonBodyType = JsonBodyType;
type TestServerResponse = {
    url: string;
    headers?: Record<string, string>;
} & ({
    type: 'json-value';
    content: TestServerJsonBodyType;
} | {
    type: 'stream-values';
    content: Array<string>;
} | {
    type: 'controlled-stream';
    id?: string;
} | {
    type: 'error';
    status: number;
    content?: string;
});
declare class TestServerCall {
    private request;
    constructor(request: Request);
    getRequestBodyJson(): Promise<any>;
    getRequestHeaders(): Record<string, string>;
    getRequestUrlSearchParams(): URLSearchParams;
}
declare function withTestServer(responses: Array<TestServerResponse> | TestServerResponse, testFunction: (options: {
    calls: () => Array<TestServerCall>;
    call: (index: number) => TestServerCall;
    getStreamController: (id: string) => ReadableStreamDefaultController<string>;
    streamController: ReadableStreamDefaultController<string>;
}) => Promise<void>): () => Promise<void>;
declare function describeWithTestServer(description: string, responses: Array<TestServerResponse> | TestServerResponse, testFunction: (options: {
    calls: () => Array<TestServerCall>;
    call: (index: number) => TestServerCall;
    getStreamController: (id: string) => ReadableStreamDefaultController<string>;
    streamController: ReadableStreamDefaultController<string>;
}) => void): void;

/**
 * @deprecated Use `convertReadableStreamToArray` instead.
 */
declare const convertStreamToArray: typeof convertReadableStreamToArray;

export { JsonTestServer, StreamingTestServer, type TestServerJsonBodyType, type TestServerResponse, convertArrayToAsyncIterable, convertArrayToReadableStream, convertAsyncIterableToArray, convertReadableStreamToArray, convertResponseStreamToArray, convertStreamToArray, describeWithTestServer, withTestServer };
