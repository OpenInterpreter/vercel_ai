import { useChat as useChat$1, useCompletion as useCompletion$1, useAssistant as useAssistant$1 } from '@ai-sdk/vue';
export { CreateMessage, Message, UseAssistantHelpers, UseChatHelpers, UseChatOptions } from '@ai-sdk/vue';

/**
 * @deprecated Use `useChat` from `@ai-sdk/vue` instead.
 */
declare const useChat: typeof useChat$1;
/**
 * @deprecated Use `useCompletion` from `@ai-sdk/vue` instead.
 */
declare const useCompletion: typeof useCompletion$1;
/**
 * @deprecated Use `useAssistant` from `@ai-sdk/vue` instead.
 */
declare const useAssistant: typeof useAssistant$1;

export { useAssistant, useChat, useCompletion };
