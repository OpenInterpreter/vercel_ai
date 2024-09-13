import { Message, CreateMessage, ChatRequestOptions, JSONValue, UseChatOptions, RequestOptions, UseCompletionOptions, AssistantStatus, UseAssistantOptions } from '@ai-sdk/ui-utils';
export { CreateMessage, Message, UseChatOptions, UseCompletionOptions } from '@ai-sdk/ui-utils';
import { Ref, ComputedRef } from 'vue';

type UseChatHelpers = {
    /** Current messages in the chat */
    messages: Ref<Message[]>;
    /** The error object of the API request */
    error: Ref<undefined | Error>;
    /**
     * Append a user message to the chat list. This triggers the API call to fetch
     * the assistant's response.
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
    input: Ref<string>;
    /** Form submission handler to automatically reset input and append a user message  */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }, chatRequestOptions?: ChatRequestOptions) => void;
    /** Whether the API request is in progress */
    isLoading: Ref<boolean | undefined>;
    /** Additional data added on the server via StreamData */
    data: Ref<JSONValue[] | undefined>;
};
declare function useChat({ api, id, initialMessages, initialInput, sendExtraMessageFields, experimental_onFunctionCall, streamMode, streamProtocol, onResponse, onFinish, onError, credentials, headers: metadataHeaders, body: metadataBody, generateId, fetch, keepLastMessageOnError, }?: UseChatOptions): UseChatHelpers;

type UseCompletionHelpers = {
    /** The current completion result */
    completion: Ref<string>;
    /** The error object of the API request */
    error: Ref<undefined | Error>;
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
    input: Ref<string>;
    /**
     * Form submission handler to automatically reset input and append a user message
     * @example
     * ```jsx
     * <form @submit="handleSubmit">
     *  <input @change="handleInputChange" v-model="input" />
     * </form>
     * ```
     */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => void;
    /** Whether the API request is in progress */
    isLoading: Ref<boolean | undefined>;
    /** Additional data added on the server via StreamData */
    data: Ref<JSONValue[] | undefined>;
};
declare function useCompletion({ api, id, initialCompletion, initialInput, credentials, headers, body, streamProtocol, onResponse, onFinish, onError, fetch, }?: UseCompletionOptions): UseCompletionHelpers;

/**
 * A vue.js composable function to interact with the assistant API.
 */

type UseAssistantHelpers = {
    /**
     * The current array of chat messages.
     */
    messages: Ref<Message[]>;
    /**
     * Update the message store with a new array of messages.
     */
    setMessages: (messagesProcessor: (messages: Message[]) => Message[]) => void;
    /**
     * The current thread ID.
     */
    threadId: Ref<string | undefined>;
    /**
     * Set the current thread ID. Specifying a thread ID will switch to that thread, if it exists. If set to 'undefined', a new thread will be created. For both cases, `threadId` will be updated with the new value and `messages` will be cleared.
     */
    setThreadId: (threadId: string | undefined) => void;
    /**
     * The current value of the input field.
     */
    input: Ref<string>;
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
     * Abort the current request immediately, keep the generated tokens if any.
     */
    stop: ComputedRef<() => void>;
    /**
     * Handler for the `onChange` event of the input field to control the input's value.
     */
    handleInputChange: (e: Event & {
        target: HTMLInputElement;
    }) => void;
    /**
     * Handler for the `onSubmit` event of the form to append a user message and reset the input.
     */
    handleSubmit: (e: Event & {
        target: HTMLFormElement;
    }) => void;
    /**
     * Whether the assistant is currently sending a message.
     */
    isSending: ComputedRef<boolean>;
    /**
     * The current status of the assistant.
     */
    status: Ref<AssistantStatus>;
    /**
     * The current error, if any.
     */
    error: Ref<Error | undefined>;
};
declare function useAssistant({ api, threadId: threadIdParam, credentials, headers, body, onError, }: UseAssistantOptions): UseAssistantHelpers;
/**
 * @deprecated Use `useAssistant` instead.
 */
declare const experimental_useAssistant: typeof useAssistant;

export { UseAssistantHelpers, UseChatHelpers, UseCompletionHelpers, experimental_useAssistant, useAssistant, useChat, useCompletion };
