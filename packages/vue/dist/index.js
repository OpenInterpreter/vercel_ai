"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  experimental_useAssistant: () => experimental_useAssistant,
  useAssistant: () => useAssistant,
  useChat: () => useChat,
  useCompletion: () => useCompletion
});
module.exports = __toCommonJS(src_exports);

// src/use-chat.ts
var import_ui_utils = require("@ai-sdk/ui-utils");
var import_swrv = __toESM(require("swrv"));
var import_vue = require("vue");
var uniqueId = 0;
var useSWRV = import_swrv.default.default || import_swrv.default;
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
  generateId: generateId2 = import_ui_utils.generateId,
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
  const error = (0, import_vue.ref)(void 0);
  const streamData = (0, import_vue.ref)(void 0);
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
      await (0, import_ui_utils.processChatStream)({
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
          return await (0, import_ui_utils.callChatApi)({
            api,
            body: {
              messages: constructedMessagesPayload,
              data: chatRequest.data,
              ...(0, import_vue.unref)(metadataBody),
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
  const input = (0, import_vue.ref)(initialInput);
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
var import_ui_utils2 = require("@ai-sdk/ui-utils");
var import_swrv2 = __toESM(require("swrv"));
var import_vue2 = require("vue");
var uniqueId2 = 0;
var useSWRV2 = import_swrv2.default.default || import_swrv2.default;
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
  const error = (0, import_vue2.ref)(void 0);
  let abortController = null;
  async function triggerRequest(prompt, options) {
    var _a2;
    const existingData = (_a2 = streamData.value) != null ? _a2 : [];
    return (0, import_ui_utils2.callCompletionApi)({
      api,
      prompt,
      credentials,
      headers: {
        ...headers,
        ...options == null ? void 0 : options.headers
      },
      body: {
        ...(0, import_vue2.unref)(body),
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
  const input = (0, import_vue2.ref)(initialInput);
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
var import_provider_utils = require("@ai-sdk/provider-utils");
var import_ui_utils3 = require("@ai-sdk/ui-utils");
var import_vue3 = require("vue");
function useAssistant({
  api,
  threadId: threadIdParam,
  credentials,
  headers,
  body,
  onError
}) {
  const messages = (0, import_vue3.ref)([]);
  const input = (0, import_vue3.ref)("");
  const currentThreadId = (0, import_vue3.ref)(void 0);
  const status = (0, import_vue3.ref)("awaiting_message");
  const error = (0, import_vue3.ref)(void 0);
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
  const isSending = (0, import_vue3.computed)(() => status.value === "in_progress");
  const abortController = (0, import_vue3.ref)(null);
  const stop = (0, import_vue3.computed)(() => {
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
      id: (_a = message.id) != null ? _a : (0, import_ui_utils3.generateId)()
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
      for await (const { type, value } of (0, import_ui_utils3.readDataStream)(
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
                  id: (_a2 = value.id) != null ? _a2 : (0, import_ui_utils3.generateId)(),
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
      if ((0, import_provider_utils.isAbortError)(err) && ((_d = abortController.value) == null ? void 0 : _d.signal.aborted)) {
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
    threadId: (0, import_vue3.readonly)(currentThreadId),
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  experimental_useAssistant,
  useAssistant,
  useChat,
  useCompletion
});
//# sourceMappingURL=index.js.map