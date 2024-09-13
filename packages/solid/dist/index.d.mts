import { FetchFunction } from '@ai-sdk/provider-utils';
import { Message, CreateMessage, ChatRequestOptions, JSONValue, UseChatOptions as UseChatOptions$1, RequestOptions, UseCompletionOptions } from '@ai-sdk/ui-utils';
export { CreateMessage, Message, UseCompletionOptions } from '@ai-sdk/ui-utils';
import { Accessor, Setter, JSX } from 'solid-js';

type UseChatHelpers = {
    /** Current messages in the chat */
    messages: Accessor<Message[]>;
    /** The error object of the API request */
    error: Accessor<undefined | Error>;
    /**
     * Append a user message to the chat list. This triggers the API call to fetch
     * the assistant's response.
     * @param message The message to append
     * @param options Additional options to pass to the API call
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
    input: Accessor<string>;
    /** Signal setter to update the input value */
    setInput: Setter<string>;
    /** An input/textarea-ready onChange handler to control the value of the input */
    handleInputChange: JSX.ChangeEventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, Event>;
    /** Form submission handler to automatically reset input and append a user message */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }, chatRequestOptions?: ChatRequestOptions) => void;
    /** Whether the API request is in progress */
    isLoading: Accessor<boolean>;
    /** Additional data added on the server via StreamData */
    data: Accessor<JSONValue[] | undefined>;
    /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
      */
    fetch?: FetchFunction;
};
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
declare function useChat(rawUseChatOptions?: UseChatOptions | Accessor<UseChatOptions>): UseChatHelpers & {
    addToolResult: ({ toolCallId, result, }: {
        toolCallId: string;
        result: any;
    }) => void;
};

type UseCompletionHelpers = {
    /** The current completion result */
    completion: Accessor<string>;
    /** The error object of the API request */
    error: Accessor<undefined | Error>;
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
    input: Accessor<string>;
    /** Signal Setter to update the input value */
    setInput: Setter<string>;
    /** An input/textarea-ready onChange handler to control the value of the input */
    handleInputChange: JSX.ChangeEventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, Event>;
    /**
     * Form submission handler to automatically reset input and append a user message
     * @example
     * ```jsx
     * <form onSubmit={handleSubmit}>
     *  <input value={input()} />
     * </form>
     * ```
     */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => void;
    /** Whether the API request is in progress */
    isLoading: Accessor<boolean>;
    /** Additional data added on the server via StreamData */
    data: Accessor<JSONValue[] | undefined>;
    /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
      */
    fetch?: FetchFunction;
};
declare function useCompletion(rawUseCompletionOptions?: UseCompletionOptions | Accessor<UseCompletionOptions>): UseCompletionHelpers;

export { UseChatHelpers, UseChatOptions, UseCompletionHelpers, useChat, useCompletion };
