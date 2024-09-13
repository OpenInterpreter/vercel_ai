import * as _ai_sdk_react from '@ai-sdk/react';
import { useChat as useChat$1, useCompletion as useCompletion$1, useAssistant as useAssistant$1 } from '@ai-sdk/react';
export { CreateMessage, Message, UseChatHelpers, UseChatOptions } from '@ai-sdk/react';

declare const useChat: typeof useChat$1;
declare const useCompletion: typeof useCompletion$1;
declare const useAssistant: typeof useAssistant$1;
declare const experimental_useObject: <RESULT, INPUT = any>({ api, id, schema, initialValue, fetch, onError, onFinish, }: _ai_sdk_react.Experimental_UseObjectOptions<RESULT>) => _ai_sdk_react.Experimental_UseObjectHelpers<RESULT, INPUT>;

export { experimental_useObject, useAssistant, useChat, useCompletion };
import * as react_jsx_runtime from 'react/jsx-runtime';

type Props = {
    /**
     * A ReadableStream produced by the AI SDK.
     */
    stream: ReadableStream;
};
/**
A React Server Component that recursively renders a stream of tokens.
Can only be used inside of server components.

@deprecated Use RSCs / Generative AI instead.
 */
declare function Tokens(props: Props): Promise<react_jsx_runtime.JSX.Element>;

export { Tokens };
