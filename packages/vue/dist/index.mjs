// src/use-chat.ts
import {
  callChatApi,
  generateId as generateIdFunc,
  processChatStream
} from "@ai-sdk/ui-utils";
import swrv from "swrv";
import { ref, unref } from "vue";
var uniqueId = 0;
var useSWRV = swrv.default || swrv;
var store = {};
function useChat({
  api = "/api/chat",
  id,
  initialMessages = [],
  initialInput = "",
  sendExtraMessageFields,
  experimental_onFunctionCall,
  streamMode,
  streamProtocol,
  onResponse,
  onFinish,
  onError,
  credentials,
  headers: metadataHeaders,
  body: metadataBody,
  generateId: generateId2 = generateIdFunc,
  fetch: fetch2,
  keepLastMessageOnError = false
} = {}) {
  var _a, _b;
  if (streamMode) {
    streamProtocol != null ? streamProtocol : streamProtocol = streamMode === "text" ? "text" : void 0;
  }
  const chatId = id || `chat-${uniqueId++}`;
  const key = `${api}|${chatId}`;
  const { data: messagesData, mutate: originalMutate } = useSWRV(
    key,
    () => store[key] || initialMessages
  );
  const { data: isLoading, mutate: mutateLoading } = useSWRV(
    `${chatId}-loading`,
    null
  );
  (_a = isLoading.value) != null ? _a : isLoading.value = false;
  (_b = messagesData.value) != null ? _b : messagesData.value = initialMessages;
  const mutate = (data) => {
    store[key] = data;
    return originalMutate();
  };
  const messages = messagesData;
  const error = ref(void 0);
  const streamData = ref(void 0);
  let abortController = null;
  async function triggerRequest(messagesSnapshot, { options, data, headers, body } = {}) {
    try {
      error.value = void 0;
      mutateLoading(() => true);
      abortController = new AbortController();
      const previousMessages = messagesSnapshot;
      mutate(messagesSnapshot);
      const requestOptions = {
        headers: headers != null ? headers : options == null ? void 0 : options.headers,
        body: body != null ? body : options == null ? void 0 : options.body
      };
      let chatRequest = {
        messages: messagesSnapshot,
        options: requestOptions,
        body: requestOptions.body,
        headers: requestOptions.headers,
        data
      };
      await processChatStream({
        getStreamedResponse: async () => {
          var _a2;
          const existingData = (_a2 = streamData.value) != null ? _a2 : [];
          const constructedMessagesPayload = sendExtraMessageFields ? chatRequest.messages : chatRequest.messages.map(
            ({
              role,
              content,
              name,
              data: data2,
              annotations,
              function_call
            }) => ({
              role,
              content,
              ...name !== void 0 && { name },
              ...data2 !== void 0 && { data: data2 },
              ...annotations !== void 0 && { annotations },
              // outdated function/tool call handling (TODO deprecate):
              ...function_call !== void 0 && { function_call }
            })
          );
          return await callChatApi({
            api,
            body: {
              messages: constructedMessagesPayload,
              data: chatRequest.data,
              ...unref(metadataBody),
              // Use unref to unwrap the ref value
              ...requestOptions.body
            },
            streamProtocol,
            headers: {
              ...metadataHeaders,
              ...requestOptions.headers
            },
            abortController: () => abortController,
            credentials,
            onResponse,
            onUpdate(merged, data2) {
              mutate([...chatRequest.messages, ...merged]);
              streamData.value = [...existingData, ...data2 != null ? data2 : []];
            },
            onFinish(message, options2) {
              mutate([...chatRequest.messages, message]);
              onFinish == null ? void 0 : onFinish(message, options2);
            },
            restoreMessagesOnFailure() {
              if (!keepLastMessageOnError) {
                mutate(previousMessages);
              }
            },
            generateId: generateId2,
            onToolCall: void 0,
            // not implemented yet
            fetch: fetch2
          });
        },
        experimental_onFunctionCall,
        updateChatRequest(newChatRequest) {
          chatRequest = newChatRequest;
        },
        getCurrentMessages: () => messages.value
      });
      abortController = null;
    } catch (err) {
      if (err.name === "AbortError") {
        abortController = null;
        return null;
      }
      if (onError && err instanceof Error) {
        onError(err);
      }
      error.value = err;
    } finally {
      mutateLoading(() => false);
    }
  }
  const append = async (message, options) => {
    if (!message.id) {
      message.id = generateId2();
    }
    return triggerRequest(messages.value.concat(message), options);
  };
  const reload = async (options) => {
    const messagesSnapshot = messages.value;
    if (messagesSnapshot.length === 0)
      return null;
    const lastMessage = messagesSnapshot[messagesSnapshot.length - 1];
    if (lastMessage.role === "assistant") {
      return triggerRequest(messagesSnapshot.slice(0, -1), options);
    }
    return triggerRequest(messagesSnapshot, options);
  };
  const stop = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  const setMessages = (messagesArg) => {
    if (typeof messagesArg === "function") {
      messagesArg = messagesArg(messages.value);
    }
    mutate(messagesArg);
  };
  const input = ref(initialInput);
  const handleSubmit = (event, options = {}) => {
    var _a2;
    (_a2 = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a2.call(event);
    const inputValue = input.value;
    if (!inputValue && !options.allowEmptySubmit)
      return;
    triggerRequest(
      !inputValue && options.allowEmptySubmit ? messages.value : messages.value.concat({
        id: generateId2(),
        createdAt: /* @__PURE__ */ new Date(),
        content: inputValue,
        role: "user"
      }),
      options
    );
    input.value = "";
  };
  return {
    messages,
    append,
    error,
    reload,
    stop,
    setMessages,
    input,
    handleSubmit,
    isLoading,
    data: streamData
  };
}

// src/use-completion.ts
import { callCompletionApi } from "@ai-sdk/ui-utils";
import swrv2 from "swrv";
import { ref as ref2, unref as unref2 } from "vue";
var uniqueId2 = 0;
var useSWRV2 = swrv2.default || swrv2;
var store2 = {};
function useCompletion({
  api = "/api/completion",
  id,
  initialCompletion = "",
  initialInput = "",
  credentials,
  headers,
  body,
  streamProtocol,
  onResponse,
  onFinish,
  onError,
  fetch: fetch2
} = {}) {
  var _a;
  const completionId = id || `completion-${uniqueId2++}`;
  const key = `${api}|${completionId}`;
  const { data, mutate: originalMutate } = useSWRV2(
    key,
    () => store2[key] || initialCompletion
  );
  const { data: isLoading, mutate: mutateLoading } = useSWRV2(
    `${completionId}-loading`,
    null
  );
  (_a = isLoading.value) != null ? _a : isLoading.value = false;
  const { data: streamData, mutate: mutateStreamData } = useSWRV2(`${completionId}-data`, null);
  data.value || (data.value = initialCompletion);
  const mutate = (data2) => {
    store2[key] = data2;
    return originalMutate();
  };
  const completion = data;
  const error = ref2(void 0);
  let abortController = null;
  async function triggerRequest(prompt, options) {
    var _a2;
    const existingData = (_a2 = streamData.value) != null ? _a2 : [];
    return callCompletionApi({
      api,
      prompt,
      credentials,
      headers: {
        ...headers,
        ...options == null ? void 0 : options.headers
      },
      body: {
        ...unref2(body),
        ...options == null ? void 0 : options.body
      },
      streamProtocol,
      setCompletion: mutate,
      setLoading: (loading) => mutateLoading(() => loading),
      setError: (err) => {
        error.value = err;
      },
      setAbortController: (controller) => {
        abortController = controller;
      },
      onResponse,
      onFinish,
      onError,
      onData: (data2) => {
        mutateStreamData(() => [...existingData, ...data2 != null ? data2 : []]);
      },
      fetch: fetch2
    });
  }
  const complete = async (prompt, options) => {
    return triggerRequest(prompt, options);
  };
  const stop = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  const setCompletion = (completion2) => {
    mutate(completion2);
  };
  const input = ref2(initialInput);
  const handleSubmit = (event) => {
    var _a2;
    (_a2 = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a2.call(event);
    const inputValue = input.value;
    return inputValue ? complete(inputValue) : void 0;
  };
  return {
    completion,
    complete,
    error,
    stop,
    setCompletion,
    input,
    handleSubmit,
    isLoading,
    data: streamData
  };
}

// src/use-assistant.ts
import { isAbortError } from "@ai-sdk/provider-utils";
import { readDataStream, generateId } from "@ai-sdk/ui-utils";
import { computed, readonly, ref as ref3 } from "vue";
function useAssistant({
  api,
  threadId: threadIdParam,
  credentials,
  headers,
  body,
  onError
}) {
  const messages = ref3([]);
  const input = ref3("");
  const currentThreadId = ref3(void 0);
  const status = ref3("awaiting_message");
  const error = ref3(void 0);
  const setMessages = (messageFactory) => {
    messages.value = messageFactory(messages.value);
  };
  const setCurrentThreadId = (newThreadId) => {
    currentThreadId.value = newThreadId;
    messages.value = [];
  };
  const handleInputChange = (event) => {
    var _a;
    input.value = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.value;
  };
  const isSending = computed(() => status.value === "in_progress");
  const abortController = ref3(null);
  const stop = computed(() => {
    return () => {
      if (abortController.value) {
        abortController.value.abort();
        abortController.value = null;
      }
    };
  });
  const append = async (message, requestOptions) => {
    var _a, _b, _c, _d;
    status.value = "in_progress";
    const newMessage = {
      ...message,
      id: (_a = message.id) != null ? _a : generateId()
    };
    setMessages((messages2) => [...messages2, newMessage]);
    input.value = "";
    const controller = new AbortController();
    try {
      abortController.value = controller;
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        body: JSON.stringify({
          ...body,
          // Message Content
          message: message.content,
          // Always Use User Provided Thread ID When Available
          threadId: (_b = threadIdParam != null ? threadIdParam : currentThreadId.value) != null ? _b : null,
          // Optional Request Data
          ...(requestOptions == null ? void 0 : requestOptions.data) && { data: requestOptions == null ? void 0 : requestOptions.data }
        }),
        signal: controller.signal,
        credentials
      });
      if (!response.ok) {
        throw new Error(
          (_c = response.statusText) != null ? _c : "An error occurred while sending the message"
        );
      }
      if (!response.body) {
        throw new Error("The response body is empty");
      }
      for await (const { type, value } of readDataStream(
        response.body.getReader()
      )) {
        switch (type) {
          case "assistant_message": {
            messages.value = [
              ...messages.value,
              {
                id: value.id,
                content: value.content[0].text.value,
                role: value.role
              }
            ];
            break;
          }
          case "assistant_control_data": {
            if (value.threadId) {
              currentThreadId.value = value.threadId;
            }
            setMessages((messages2) => {
              const lastMessage = messages2[messages2.length - 1];
              lastMessage.id = value.messageId;
              return [...messages2.slice(0, -1), lastMessage];
            });
            break;
          }
          case "text": {
            setMessages((messages2) => {
              const lastMessage = messages2[messages2.length - 1];
              lastMessage.content += value;
              return [...messages2.slice(0, -1), lastMessage];
            });
            break;
          }
          case "data_message": {
            setMessages((messages2) => {
              var _a2;
              return [
                ...messages2,
                {
                  id: (_a2 = value.id) != null ? _a2 : generateId(),
                  role: "data",
                  content: "",
                  data: value.data
                }
              ];
            });
            break;
          }
          case "error": {
            error.value = new Error(value);
          }
          default: {
            console.error("Unknown message type:", type);
            break;
          }
        }
      }
    } catch (err) {
      if (isAbortError(err) && ((_d = abortController.value) == null ? void 0 : _d.signal.aborted)) {
        abortController.value = null;
        return;
      }
      if (onError && err instanceof Error) {
        onError(err);
      }
      error.value = err;
    } finally {
      abortController.value = null;
      status.value = "awaiting_message";
    }
  };
  const submitMessage = async (event, requestOptions) => {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    if (!input.value)
      return;
    append(
      {
        role: "user",
        content: input.value
      },
      requestOptions
    );
  };
  return {
    append,
    messages,
    setMessages,
    threadId: readonly(currentThreadId),
    setThreadId: setCurrentThreadId,
    input,
    handleInputChange,
    handleSubmit: submitMessage,
    isSending,
    status,
    error,
    stop
  };
}
var experimental_useAssistant = useAssistant;
export {
  experimental_useAssistant,
  useAssistant,
  useChat,
  useCompletion
};
//# sourceMappingURL=index.mjs.map