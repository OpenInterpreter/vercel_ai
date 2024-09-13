"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  useAssistant: () => useAssistant,
  useChat: () => useChat,
  useCompletion: () => useCompletion
});
module.exports = __toCommonJS(src_exports);

// src/use-chat.ts
var import_ui_utils = require("@ai-sdk/ui-utils");
var import_sswr = require("sswr");
var import_store = require("svelte/store");
var getStreamedResponse = async (api, chatRequest, mutate, mutateStreamData, existingData, extraMetadata, previousMessages, abortControllerRef, generateId2, streamProtocol, onFinish, onResponse, onToolCall, sendExtraMessageFields, fetch2, keepLastMessageOnError) => {
  mutate(chatRequest.messages);
  const constructedMessagesPayload = sendExtraMessageFields ? chatRequest.messages : chatRequest.messages.map(
    ({
      role,
      content,
      name,
      data,
      annotations,
      function_call,
      tool_calls,
      tool_call_id,
      toolInvocations
    }) => ({
      role,
      content,
      ...name !== void 0 && { name },
      ...data !== void 0 && { data },
      ...annotations !== void 0 && { annotations },
      ...toolInvocations !== void 0 && { toolInvocations },
      // outdated function/tool call handling (TODO deprecate):
      tool_call_id,
      ...function_call !== void 0 && { function_call },
      ...tool_calls !== void 0 && { tool_calls }
    })
  );
  return await (0, import_ui_utils.callChatApi)({
    api,
    body: {
      messages: constructedMessagesPayload,
      data: chatRequest.data,
      ...extraMetadata.body,
      ...chatRequest.body,
      ...chatRequest.functions !== void 0 && {
        functions: chatRequest.functions
      },
      ...chatRequest.function_call !== void 0 && {
        function_call: chatRequest.function_call
      },
      ...chatRequest.tools !== void 0 && {
        tools: chatRequest.tools
      },
      ...chatRequest.tool_choice !== void 0 && {
        tool_choice: chatRequest.tool_choice
      }
    },
    streamProtocol,
    credentials: extraMetadata.credentials,
    headers: {
      ...extraMetadata.headers,
      ...chatRequest.headers
    },
    abortController: () => abortControllerRef,
    restoreMessagesOnFailure() {
      if (!keepLastMessageOnError) {
        mutate(previousMessages);
      }
    },
    onResponse,
    onUpdate(merged, data) {
      mutate([...chatRequest.messages, ...merged]);
      mutateStreamData([...existingData || [], ...data || []]);
    },
    onFinish,
    generateId: generateId2,
    onToolCall,
    fetch: fetch2
  });
};
var uniqueId = 0;
var store = {};
function isAssistantMessageWithCompletedToolCalls(message) {
  return message.role === "assistant" && message.toolInvocations && message.toolInvocations.length > 0 && message.toolInvocations.every((toolInvocation) => "result" in toolInvocation);
}
function countTrailingAssistantMessages(messages) {
  let count = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      count++;
    } else {
      break;
    }
  }
  return count;
}
function useChat({
  api = "/api/chat",
  id,
  initialMessages = [],
  initialInput = "",
  sendExtraMessageFields,
  experimental_onFunctionCall,
  experimental_onToolCall,
  messageStore,
  streamMode,
  streamProtocol,
  onResponse,
  onFinish,
  onError,
  onToolCall,
  credentials,
  headers,
  body,
  generateId: generateId2 = import_ui_utils.generateId,
  fetch: fetch2,
  keepLastMessageOnError = false,
  maxToolRoundtrips = 0
} = {}) {
  if (streamMode) {
    streamProtocol != null ? streamProtocol : streamProtocol = streamMode === "text" ? "text" : void 0;
  }
  const chatId = id || `chat-${uniqueId++}`;
  const key = `${api}|${chatId}`;
  const {
    data,
    mutate: originalMutate,
    isLoading: isSWRLoading
  } = (0, import_sswr.useSWR)(key, {
    fetcher: () => store[key] || initialMessages,
    fallbackData: initialMessages
  });
  const streamData = (0, import_store.writable)(void 0);
  const loading = (0, import_store.writable)(false);
  data.set(initialMessages);
  const mutate = (data2) => {
    store[key] = data2;
    return originalMutate(data2);
  };
  messageStore = data;
  let abortController = null;
  const extraMetadata = {
    credentials,
    headers,
    body
  };
  const error = (0, import_store.writable)(void 0);
  async function triggerRequest(chatRequest) {
    const messagesSnapshot = (0, import_store.get)(messageStore);
    const messageCount = messagesSnapshot.length;
    try {
      error.set(void 0);
      loading.set(true);
      abortController = new AbortController();
      await (0, import_ui_utils.processChatStream)({
        getStreamedResponse: () => getStreamedResponse(
          api,
          chatRequest,
          mutate,
          (data2) => {
            streamData.set(data2);
          },
          (0, import_store.get)(streamData),
          extraMetadata,
          (0, import_store.get)(messageStore),
          abortController,
          generateId2,
          streamProtocol,
          onFinish,
          onResponse,
          onToolCall,
          sendExtraMessageFields,
          fetch2,
          keepLastMessageOnError
        ),
        experimental_onFunctionCall,
        experimental_onToolCall,
        updateChatRequest: (chatRequestParam) => {
          chatRequest = chatRequestParam;
        },
        getCurrentMessages: () => (0, import_store.get)(messageStore)
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
      error.set(err);
    } finally {
      loading.set(false);
    }
    const newMessagesSnapshot = (0, import_store.get)(messageStore);
    const lastMessage = newMessagesSnapshot[newMessagesSnapshot.length - 1];
    if (
      // ensure we actually have new messages (to prevent infinite loops in case of errors):
      newMessagesSnapshot.length > messageCount && // ensure there is a last message:
      lastMessage != null && // check if the feature is enabled:
      maxToolRoundtrips > 0 && // check that roundtrip is possible:
      isAssistantMessageWithCompletedToolCalls(lastMessage) && // limit the number of automatic roundtrips:
      countTrailingAssistantMessages(newMessagesSnapshot) <= maxToolRoundtrips
    ) {
      await triggerRequest({ messages: newMessagesSnapshot });
    }
  }
  const append = async (message, {
    options,
    functions,
    function_call,
    tools,
    tool_choice,
    data: data2,
    headers: headers2,
    body: body2
  } = {}) => {
    if (!message.id) {
      message.id = generateId2();
    }
    const requestOptions = {
      headers: headers2 != null ? headers2 : options == null ? void 0 : options.headers,
      body: body2 != null ? body2 : options == null ? void 0 : options.body
    };
    const currentMessages = (0, import_store.get)(messageStore);
    const chatRequest = {
      messages: currentMessages.concat(message),
      options: requestOptions,
      headers: requestOptions.headers,
      body: requestOptions.body,
      data: data2,
      ...functions !== void 0 && { functions },
      ...function_call !== void 0 && { function_call },
      ...tools !== void 0 && { tools },
      ...tool_choice !== void 0 && { tool_choice }
    };
    return triggerRequest(chatRequest);
  };
  const reload = async ({
    options,
    functions,
    function_call,
    tools,
    tool_choice,
    data: data2,
    headers: headers2,
    body: body2
  } = {}) => {
    const messagesSnapshot = (0, import_store.get)(messageStore);
    if (messagesSnapshot.length === 0)
      return null;
    const requestOptions = {
      headers: headers2 != null ? headers2 : options == null ? void 0 : options.headers,
      body: body2 != null ? body2 : options == null ? void 0 : options.body
    };
    const lastMessage = messagesSnapshot.at(-1);
    if ((lastMessage == null ? void 0 : lastMessage.role) === "assistant") {
      const chatRequest2 = {
        messages: messagesSnapshot.slice(0, -1),
        options: requestOptions,
        headers: requestOptions.headers,
        body: requestOptions.body,
        data: data2,
        ...functions !== void 0 && { functions },
        ...function_call !== void 0 && { function_call },
        ...tools !== void 0 && { tools },
        ...tool_choice !== void 0 && { tool_choice }
      };
      return triggerRequest(chatRequest2);
    }
    const chatRequest = {
      messages: messagesSnapshot,
      options: requestOptions,
      headers: requestOptions.headers,
      body: requestOptions.body,
      data: data2
    };
    return triggerRequest(chatRequest);
  };
  const stop = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  const setMessages = (messagesArg) => {
    if (typeof messagesArg === "function") {
      messagesArg = messagesArg((0, import_store.get)(messageStore));
    }
    mutate(messagesArg);
  };
  const input = (0, import_store.writable)(initialInput);
  const handleSubmit = (event, options = {}) => {
    var _a, _b, _c, _d, _e;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = (0, import_store.get)(input);
    if (!inputValue && !options.allowEmptySubmit)
      return;
    const requestOptions = {
      headers: (_c = options.headers) != null ? _c : (_b = options.options) == null ? void 0 : _b.headers,
      body: (_e = options.body) != null ? _e : (_d = options.options) == null ? void 0 : _d.body
    };
    const currentMessages = (0, import_store.get)(messageStore);
    const chatRequest = {
      messages: !inputValue && options.allowEmptySubmit ? currentMessages : currentMessages.concat({
        id: generateId2(),
        content: inputValue,
        role: "user",
        createdAt: /* @__PURE__ */ new Date()
      }),
      options: requestOptions,
      body: requestOptions.body,
      headers: requestOptions.headers,
      data: options.data
    };
    triggerRequest(chatRequest);
    input.set("");
  };
  const isLoading = (0, import_store.derived)(
    [isSWRLoading, loading],
    ([$isSWRLoading, $loading]) => {
      return $isSWRLoading || $loading;
    }
  );
  const addToolResult = ({
    toolCallId,
    result
  }) => {
    var _a;
    const messagesSnapshot = (_a = (0, import_store.get)(messageStore)) != null ? _a : [];
    const updatedMessages = messagesSnapshot.map(
      (message, index, arr) => (
        // update the tool calls in the last assistant message:
        index === arr.length - 1 && message.role === "assistant" && message.toolInvocations ? {
          ...message,
          toolInvocations: message.toolInvocations.map(
            (toolInvocation) => toolInvocation.toolCallId === toolCallId ? { ...toolInvocation, result } : toolInvocation
          )
        } : message
      )
    );
    messageStore.set(updatedMessages);
    const lastMessage = updatedMessages[updatedMessages.length - 1];
    if (isAssistantMessageWithCompletedToolCalls(lastMessage)) {
      triggerRequest({ messages: updatedMessages });
    }
  };
  return {
    messages: messageStore,
    error,
    append,
    reload,
    stop,
    setMessages,
    input,
    handleSubmit,
    isLoading,
    data: streamData,
    addToolResult
  };
}

// src/use-completion.ts
var import_ui_utils2 = require("@ai-sdk/ui-utils");
var import_sswr2 = require("sswr");
var import_store2 = require("svelte/store");
var uniqueId2 = 0;
var store2 = {};
function useCompletion({
  api = "/api/completion",
  id,
  initialCompletion = "",
  initialInput = "",
  credentials,
  headers,
  body,
  streamMode,
  streamProtocol,
  onResponse,
  onFinish,
  onError,
  fetch: fetch2
} = {}) {
  if (streamMode) {
    streamProtocol != null ? streamProtocol : streamProtocol = streamMode === "text" ? "text" : void 0;
  }
  const completionId = id || `completion-${uniqueId2++}`;
  const key = `${api}|${completionId}`;
  const {
    data,
    mutate: originalMutate,
    isLoading: isSWRLoading
  } = (0, import_sswr2.useSWR)(key, {
    fetcher: () => store2[key] || initialCompletion,
    fallbackData: initialCompletion
  });
  const streamData = (0, import_store2.writable)(void 0);
  const loading = (0, import_store2.writable)(false);
  data.set(initialCompletion);
  const mutate = (data2) => {
    store2[key] = data2;
    return originalMutate(data2);
  };
  const completion = data;
  const error = (0, import_store2.writable)(void 0);
  let abortController = null;
  const complete = async (prompt, options) => {
    const existingData = (0, import_store2.get)(streamData);
    return (0, import_ui_utils2.callCompletionApi)({
      api,
      prompt,
      credentials,
      headers: {
        ...headers,
        ...options == null ? void 0 : options.headers
      },
      body: {
        ...body,
        ...options == null ? void 0 : options.body
      },
      streamProtocol,
      setCompletion: mutate,
      setLoading: (loadingState) => loading.set(loadingState),
      setError: (err) => error.set(err),
      setAbortController: (controller) => {
        abortController = controller;
      },
      onResponse,
      onFinish,
      onError,
      onData(data2) {
        streamData.set([...existingData || [], ...data2 || []]);
      },
      fetch: fetch2
    });
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
  const input = (0, import_store2.writable)(initialInput);
  const handleSubmit = (event) => {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = (0, import_store2.get)(input);
    return inputValue ? complete(inputValue) : void 0;
  };
  const isLoading = (0, import_store2.derived)(
    [isSWRLoading, loading],
    ([$isSWRLoading, $loading]) => {
      return $isSWRLoading || $loading;
    }
  );
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
var import_store3 = require("svelte/store");
var getOriginalFetch = () => fetch;
var uniqueId3 = 0;
var store3 = {};
function useAssistant({
  api,
  threadId: threadIdParam,
  credentials,
  headers,
  body,
  onError,
  fetch: fetch2
}) {
  const threadIdStore = (0, import_store3.writable)(threadIdParam);
  const key = `${api}|${threadIdParam != null ? threadIdParam : `completion-${uniqueId3++}`}`;
  const messages = (0, import_store3.writable)(store3[key] || []);
  const input = (0, import_store3.writable)("");
  const status = (0, import_store3.writable)("awaiting_message");
  const error = (0, import_store3.writable)(void 0);
  let abortController = null;
  const mutateMessages = (newMessages) => {
    store3[key] = newMessages;
    messages.set(newMessages);
  };
  async function append(message, requestOptions) {
    var _a, _b, _c, _d, _e;
    status.set("in_progress");
    abortController = new AbortController();
    mutateMessages([
      ...(0, import_store3.get)(messages),
      { ...message, id: (_a = message.id) != null ? _a : (0, import_ui_utils3.generateId)() }
    ]);
    input.set("");
    try {
      const actualFetch = fetch2 != null ? fetch2 : getOriginalFetch();
      const response = await actualFetch(api, {
        method: "POST",
        credentials,
        signal: abortController.signal,
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          ...body,
          // always use user-provided threadId when available:
          threadId: (_b = threadIdParam != null ? threadIdParam : (0, import_store3.get)(threadIdStore)) != null ? _b : null,
          message: message.content,
          // optional request data:
          data: requestOptions == null ? void 0 : requestOptions.data
        })
      });
      if (!response.ok) {
        throw new Error(
          (_c = await response.text()) != null ? _c : "Failed to fetch the assistant response."
        );
      }
      if (response.body == null) {
        throw new Error("The response body is empty.");
      }
      for await (const { type, value } of (0, import_ui_utils3.readDataStream)(
        response.body.getReader()
      )) {
        switch (type) {
          case "assistant_message": {
            mutateMessages([
              ...(0, import_store3.get)(messages),
              {
                id: value.id,
                role: value.role,
                content: value.content[0].text.value
              }
            ]);
            break;
          }
          case "text": {
            mutateMessages(
              (0, import_store3.get)(messages).map((msg, index, array) => {
                if (index === array.length - 1) {
                  return { ...msg, content: msg.content + value };
                }
                return msg;
              })
            );
            break;
          }
          case "data_message": {
            mutateMessages([
              ...(0, import_store3.get)(messages),
              {
                id: (_d = value.id) != null ? _d : (0, import_ui_utils3.generateId)(),
                role: "data",
                content: "",
                data: value.data
              }
            ]);
            break;
          }
          case "assistant_control_data": {
            threadIdStore.set(value.threadId);
            mutateMessages(
              (0, import_store3.get)(messages).map((msg, index, array) => {
                if (index === array.length - 1) {
                  return { ...msg, id: value.messageId };
                }
                return msg;
              })
            );
            break;
          }
          case "error": {
            error.set(new Error(value));
            break;
          }
        }
      }
    } catch (err) {
      if ((0, import_provider_utils.isAbortError)(error) && ((_e = abortController == null ? void 0 : abortController.signal) == null ? void 0 : _e.aborted)) {
        abortController = null;
        return;
      }
      if (onError && err instanceof Error) {
        onError(err);
      }
      error.set(err);
    } finally {
      abortController = null;
      status.set("awaiting_message");
    }
  }
  function setMessages(messages2) {
    mutateMessages(messages2);
  }
  function stop() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }
  async function submitMessage(event, requestOptions) {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = (0, import_store3.get)(input);
    if (!inputValue)
      return;
    await append({ role: "user", content: inputValue }, requestOptions);
  }
  return {
    messages,
    error,
    threadId: threadIdStore,
    input,
    append,
    submitMessage,
    status,
    setMessages,
    stop
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useAssistant,
  useChat,
  useCompletion
});
//# sourceMappingURL=index.js.map