import { UseChatOptions as UseChatOptions$1, Message, CreateMessage, ChatRequestOptions, JSONValue, RequestOptions, UseCompletionOptions, AssistantStatus, UseAssistantOptions } from '@ai-sdk/ui-utils';
export { CreateMessage, Message, UseCompletionOptions } from '@ai-sdk/ui-utils';
import { Readable, Writable } from 'svelte/store';

type UseChatOptions = UseChatOptions$1 & {
    /**
    Maximal number of automatic roundtrips for tool calls.
  
    An automatic tool call roundtrip is a call to the server with the
    tool call results when all tool calls in the last assistant
    message have results.
  
    A maximum number is required to prevent infinite loops in the
    case of misconfigured tools.
  
    By default, it's set to 0, which will disable the feature.
    */
    maxToolRoundtrips?: number;
};
type UseChatHelpers = {
    /** Current messages in the chat */
    messages: Readable<Message[]>;
    /** The error object of the API request */
    error: Readable<undefined | Error>;
    /**
     * Append a user message to the chat list. This triggers the API call to fetch
     * the assistant's response.
     * @param message The message to append
     * @param chatRequestOptions Additional options to pass to the API call
     */
    append: (message: Message | CreateMessage, chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
    /**
     * Reload the last AI chat response for the given chat history. If the last
     * message isn't from the assistant, it will request the API to generate a
     * new response.
     */
    reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
    /**
     * Abort the current request immediately, keep the generated tokens if any.
     */
    stop: () => void;
    /**
     * Update the `messages` state locally. This is useful when you want to
     * edit the messages on the client, and then trigger the `reload` method
     * manually to regenerate the AI response.
     */
    setMessages: (messages: Message[] | ((messages: Message[]) => Message[])) => void;
    /** The current value of the input */
    input: Writable<string>;
    /** Form submission handler to automatically reset input and append a user message  */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }, chatRequestOptions?: ChatRequestOptions) => void;
    metadata?: Object;
    /** Whether the API request is in progress */
    isLoading: Readable<boolean | undefined>;
    /** Additional data added on the server via StreamData */
    data: Readable<JSONValue[] | undefined>;
    /**
    Maximal number of automatic roundtrips for tool calls.
  
    An automatic tool call roundtrip is a call to the server with the
    tool call results when all tool calls in the last assistant
    message have results.
  
    A maximum number is required to prevent infinite loops in the
    case of misconfigured tools.
  
    By default, it's set to 0, which will disable the feature.
    */
    maxToolRoundtrips?: number;
};
/**
 * @deprecated Use `useChat` from `@ai-sdk/svelte` instead.
 */
declare function useChat({ api, id, initialMessages, initialInput, sendExtraMessageFields, experimental_onFunctionCall, experimental_onToolCall, streamMode, streamProtocol, onResponse, onFinish, onError, onToolCall, credentials, headers, body, generateId, fetch, keepLastMessageOnError, maxToolRoundtrips, }?: UseChatOptions): UseChatHelpers & {
    addToolResult: ({ toolCallId, result, }: {
        toolCallId: string;
        result: any;
    }) => void;
};

type UseCompletionHelpers = {
    /** The current completion result */
    completion: Readable<string>;
    /** The error object of the API request */
    error: Readable<undefined | Error>;
    /**
     * Send a new prompt to the API endpoint and update the completion state.
     */
    complete: (prompt: string, options?: RequestOptions) => Promise<string | null | undefined>;
    /**
     * Abort the current API request but keep the generated tokens.
     */
    stop: () => void;
    /**
     * Update the `completion` state locally.
     */
    setCompletion: (completion: string) => void;
    /** The current value of the input */
    input: Writable<string>;
    /**
     * Form submission handler to automatically reset input and append a user message
     * @example
     * ```jsx
     * <form onSubmit={handleSubmit}>
     *  <input onChange={handleInputChange} value={input} />
     * </form>
     * ```
     */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => void;
    /** Whether the API request is in progress */
    isLoading: Readable<boolean | undefined>;
    /** Additional data added on the server via StreamData */
    data: Readable<JSONValue[] | undefined>;
};
/**
 * @deprecated Use `useCompletion` from `@ai-sdk/svelte` instead.
 */
declare function useCompletion({ api, id, initialCompletion, initialInput, credentials, headers, body, streamMode, streamProtocol, onResponse, onFinish, onError, fetch, }?: UseCompletionOptions): UseCompletionHelpers;

type UseAssistantHelpers = {
    /**
     * The current array of chat messages.
     */
    messages: Readable<Message[]>;
    /**
     * Update the message store with a new array of messages.
     */
    setMessages: (messages: Message[]) => void;
    /**
     * The current thread ID.
     */
    threadId: Readable<string | undefined>;
    /**
     * The current value of the input field.
     */
    input: Writable<string>;
    /**
     * Append a user message to the chat list. This triggers the API call to fetch
     * the assistant's response.
     * @param message The message to append
     * @param requestOptions Additional options to pass to the API call
     */
    append: (message: Message | CreateMessage, requestOptions?: {
        data?: Record<string, string>;
    }) => Promise<void>;
    /**
  Abort the current request immediately, keep the generated tokens if any.
     */
    stop: () => void;
    /**
     * Form submission handler that automatically resets the input field and appends a user message.
     */
    submitMessage: (event?: {
        preventDefault?: () => void;
    }, requestOptions?: {
        data?: Record<string, string>;
    }) => Promise<void>;
    /**
     * The current status of the assistant. This can be used to show a loading indicator.
     */
    status: Readable<AssistantStatus>;
    /**
     * The error thrown during the assistant message processing, if any.
     */
    error: Readable<undefined | Error>;
};
/**
 * @deprecated Use `useAssistant` from `@ai-sdk/svelte` instead.
 */
declare function useAssistant({ api, threadId: threadIdParam, credentials, headers, body, onError, fetch, }: UseAssistantOptions): UseAssistantHelpers;

export { UseAssistantHelpers, UseChatHelpers, UseChatOptions, UseCompletionHelpers, useAssistant, useChat, useCompletion };
