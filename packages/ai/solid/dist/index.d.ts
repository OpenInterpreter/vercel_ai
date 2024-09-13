import { useChat as useChat$1, useCompletion as useCompletion$1 } from '@ai-sdk/solid';
export { CreateMessage, Message, UseChatHelpers, UseChatOptions } from '@ai-sdk/solid';

/**
 * @deprecated Use `useChat` from `@ai-sdk/solid` instead.
 */
declare const useChat: typeof useChat$1;
/**
 * @deprecated Use `useCompletion` from `@ai-sdk/solid` instead.
 */
declare const useCompletion: typeof useCompletion$1;

export { useChat, useCompletion };
