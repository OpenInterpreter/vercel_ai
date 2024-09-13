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
  useChat: () => useChat,
  useCompletion: () => useCompletion
});
module.exports = __toCommonJS(src_exports);

// src/use-chat.ts
var import_ui_utils = require("@ai-sdk/ui-utils");
var import_solid_js = require("solid-js");
var import_store = require("solid-js/store");
var getStreamedResponse = async (api, chatRequest, mutate, setStreamData, streamData, extraMetadata, messagesRef, abortController, generateId, streamProtocol, onFinish, onResponse, onToolCall, sendExtraMessageFields, fetch, keepLastMessageOnError) => {
  var _a;
  const previousMessages = messagesRef;
  mutate(chatRequest.messages);
  const existingStreamData = (_a = streamData()) != null ? _a : [];
  const constructedMessagesPayload = sendExtraMessageFields ? chatRequest.messages : chatRequest.messages.map(
    ({ role, content, name, data, annotations, toolInvocations }) => ({
      role,
      content,
      ...name !== void 0 && { name },
      ...data !== void 0 && { data },
      ...annotations !== void 0 && { annotations },
      ...toolInvocations !== void 0 && { toolInvocations }
    })
  );
  return await (0, import_ui_utils.callChatApi)({
    api,
    body: {
      messages: constructedMessagesPayload,
      data: chatRequest.data,
      ...extraMetadata.body,
      ...chatRequest.body
    },
    streamProtocol,
    credentials: extraMetadata.credentials,
    headers: {
      ...extraMetadata.headers,
      ...chatRequest.headers
    },
    abortController: () => abortController,
    restoreMessagesOnFailure() {
      if (!keepLastMessageOnError) {
        mutate(previousMessages);
      }
    },
    onResponse,
    onUpdate(merged, data) {
      mutate([...chatRequest.messages, ...merged]);
      setStreamData([...existingStreamData, ...data != null ? data : []]);
    },
    onToolCall,
    onFinish,
    generateId,
    fetch
  });
};
var [store, setStore] = (0, import_store.createStore)({});
function useChat(rawUseChatOptions = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const useChatOptions = (0, import_solid_js.createMemo)(
    () => convertToAccessorOptions(rawUseChatOptions)
  );
  const api = (0, import_solid_js.createMemo)(() => {
    var _a2, _b2, _c2;
    return (_c2 = (_b2 = (_a2 = useChatOptions()).api) == null ? void 0 : _b2.call(_a2)) != null ? _c2 : "/api/chat";
  });
  const generateId = (0, import_solid_js.createMemo)(
    () => {
      var _a2, _b2, _c2;
      return (_c2 = (_b2 = (_a2 = useChatOptions()).generateId) == null ? void 0 : _b2.call(_a2)) != null ? _c2 : import_ui_utils.generateId;
    }
  );
  const idKey = (0, import_solid_js.createMemo)(
    () => {
      var _a2, _b2, _c2;
      return (_c2 = (_b2 = (_a2 = useChatOptions()).id) == null ? void 0 : _b2.call(_a2)) != null ? _c2 : `chat-${(0, import_solid_js.createUniqueId)()}`;
    }
  );
  const chatKey = (0, import_solid_js.createMemo)(() => `${api()}|${idKey()}|messages`);
  const messages = (0, import_solid_js.createMemo)(() => {
    var _a2, _b2, _c2, _d2;
    return (_d2 = (_c2 = store[chatKey()]) != null ? _c2 : (_b2 = (_a2 = useChatOptions()).initialMessages) == null ? void 0 : _b2.call(_a2)) != null ? _d2 : [];
  });
  const mutate = (data) => {
    setStore(chatKey(), data);
  };
  const [error, setError] = (0, import_solid_js.createSignal)(void 0);
  const [streamData, setStreamData] = (0, import_solid_js.createSignal)(
    void 0
  );
  const [isLoading, setIsLoading] = (0, import_solid_js.createSignal)(false);
  let messagesRef = messages() || [];
  (0, import_solid_js.createEffect)(() => {
    messagesRef = messages() || [];
  });
  let abortController = null;
  let extraMetadata = {
    credentials: (_b = (_a = useChatOptions()).credentials) == null ? void 0 : _b.call(_a),
    headers: (_d = (_c = useChatOptions()).headers) == null ? void 0 : _d.call(_c),
    body: (_f = (_e = useChatOptions()).body) == null ? void 0 : _f.call(_e)
  };
  (0, import_solid_js.createEffect)(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    extraMetadata = {
      credentials: (_b2 = (_a2 = useChatOptions()).credentials) == null ? void 0 : _b2.call(_a2),
      headers: (_d2 = (_c2 = useChatOptions()).headers) == null ? void 0 : _d2.call(_c2),
      body: (_f2 = (_e2 = useChatOptions()).body) == null ? void 0 : _f2.call(_e2)
    };
  });
  const triggerRequest = async (chatRequest) => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2;
    const messageCount = messagesRef.length;
    try {
      setError(void 0);
      setIsLoading(true);
      abortController = new AbortController();
      await (0, import_ui_utils.processChatStream)({
        getStreamedResponse: () => {
          var _a3, _b3, _c3, _d3, _e3, _f3, _g3, _h2, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
          return getStreamedResponse(
            api(),
            chatRequest,
            mutate,
            setStreamData,
            streamData,
            extraMetadata,
            messagesRef,
            abortController,
            generateId(),
            // streamMode is deprecated, use streamProtocol instead:
            ((_e3 = (_b3 = (_a3 = useChatOptions()).streamProtocol) == null ? void 0 : _b3.call(_a3)) != null ? _e3 : ((_d3 = (_c3 = useChatOptions()).streamMode) == null ? void 0 : _d3.call(_c3)) === "text") ? "text" : void 0,
            (_g3 = (_f3 = useChatOptions()).onFinish) == null ? void 0 : _g3.call(_f3),
            (_i = (_h2 = useChatOptions()).onResponse) == null ? void 0 : _i.call(_h2),
            (_k = (_j = useChatOptions()).onToolCall) == null ? void 0 : _k.call(_j),
            (_m = (_l = useChatOptions()).sendExtraMessageFields) == null ? void 0 : _m.call(_l),
            (_o = (_n = useChatOptions()).fetch) == null ? void 0 : _o.call(_n),
            (_r = (_q = (_p = useChatOptions()).keepLastMessageOnError) == null ? void 0 : _q.call(_p)) != null ? _r : false
          );
        },
        experimental_onFunctionCall: (_b2 = (_a2 = useChatOptions()).experimental_onFunctionCall) == null ? void 0 : _b2.call(_a2),
        updateChatRequest(newChatRequest) {
          chatRequest = newChatRequest;
        },
        getCurrentMessages: () => messagesRef
      });
      abortController = null;
    } catch (err) {
      if (err.name === "AbortError") {
        abortController = null;
        return null;
      }
      const onError = (_d2 = (_c2 = useChatOptions()).onError) == null ? void 0 : _d2.call(_c2);
      if (onError && err instanceof Error) {
        onError(err);
      }
      setError(err);
    } finally {
      setIsLoading(false);
    }
    const maxToolRoundtrips = (_g2 = (_f2 = (_e2 = useChatOptions()).maxToolRoundtrips) == null ? void 0 : _f2.call(_e2)) != null ? _g2 : 0;
    const messages2 = messagesRef;
    const lastMessage = messages2[messages2.length - 1];
    if (
      // ensure we actually have new messages (to prevent infinite loops in case of errors):
      messages2.length > messageCount && // ensure there is a last message:
      lastMessage != null && // check if the feature is enabled:
      maxToolRoundtrips > 0 && // check that roundtrip is possible:
      isAssistantMessageWithCompletedToolCalls(lastMessage) && // limit the number of automatic roundtrips:
      countTrailingAssistantMessages(messages2) <= maxToolRoundtrips
    ) {
      await triggerRequest({ messages: messages2 });
    }
  };
  const append = async (message, { options, data, headers, body } = {}) => {
    if (!message.id) {
      message.id = generateId()();
    }
    const requestOptions = {
      headers: headers != null ? headers : options == null ? void 0 : options.headers,
      body: body != null ? body : options == null ? void 0 : options.body
    };
    const chatRequest = {
      messages: messagesRef.concat(message),
      options: requestOptions,
      headers: requestOptions.headers,
      body: requestOptions.body,
      data
    };
    return triggerRequest(chatRequest);
  };
  const reload = async ({
    options,
    data,
    headers,
    body
  } = {}) => {
    if (messagesRef.length === 0)
      return null;
    const requestOptions = {
      headers: headers != null ? headers : options == null ? void 0 : options.headers,
      body: body != null ? body : options == null ? void 0 : options.body
    };
    const lastMessage = messagesRef[messagesRef.length - 1];
    if (lastMessage.role === "assistant") {
      const chatRequest2 = {
        messages: messagesRef.slice(0, -1),
        options: requestOptions,
        headers: requestOptions.headers,
        body: requestOptions.body,
        data
      };
      return triggerRequest(chatRequest2);
    }
    const chatRequest = {
      messages: messagesRef,
      options: requestOptions,
      headers: requestOptions.headers,
      body: requestOptions.body,
      data
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
      messagesArg = messagesArg(messagesRef);
    }
    mutate(messagesArg);
    messagesRef = messagesArg;
  };
  const [input, setInput] = (0, import_solid_js.createSignal)(
    ((_h = (_g = useChatOptions()).initialInput) == null ? void 0 : _h.call(_g)) || ""
  );
  const handleSubmit = (event, options = {}, metadata) => {
    var _a2, _b2, _c2, _d2, _e2;
    (_a2 = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a2.call(event);
    const inputValue = input();
    if (!inputValue && !options.allowEmptySubmit)
      return;
    if (metadata) {
      extraMetadata = {
        ...extraMetadata,
        ...metadata
      };
    }
    const requestOptions = {
      headers: (_c2 = options.headers) != null ? _c2 : (_b2 = options.options) == null ? void 0 : _b2.headers,
      body: (_e2 = options.body) != null ? _e2 : (_d2 = options.options) == null ? void 0 : _d2.body
    };
    const chatRequest = {
      messages: !inputValue && options.allowEmptySubmit ? messagesRef : messagesRef.concat({
        id: generateId()(),
        role: "user",
        content: inputValue,
        createdAt: /* @__PURE__ */ new Date()
      }),
      options: requestOptions,
      body: requestOptions.body,
      headers: requestOptions.headers,
      data: options.data
    };
    triggerRequest(chatRequest);
    setInput("");
  };
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const addToolResult = ({
    toolCallId,
    result
  }) => {
    var _a2;
    const messagesSnapshot = (_a2 = messages()) != null ? _a2 : [];
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
    mutate(updatedMessages);
    const lastMessage = updatedMessages[updatedMessages.length - 1];
    if (isAssistantMessageWithCompletedToolCalls(lastMessage)) {
      triggerRequest({ messages: updatedMessages });
    }
  };
  return {
    messages,
    append,
    error,
    reload,
    stop,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    data: streamData,
    addToolResult
  };
}
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
function convertToAccessorOptions(options) {
  const resolvedOptions = typeof options === "function" ? options() : options;
  return Object.entries(resolvedOptions).reduce(
    (reactiveOptions, [key, value]) => {
      reactiveOptions[key] = (0, import_solid_js.createMemo)(
        () => value
      );
      return reactiveOptions;
    },
    {}
  );
}

// src/use-completion.ts
var import_ui_utils2 = require("@ai-sdk/ui-utils");
var import_solid_js2 = require("solid-js");
var import_store2 = require("solid-js/store");
var [store2, setStore2] = (0, import_store2.createStore)({});
function useCompletion(rawUseCompletionOptions = {}) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const useCompletionOptions = (0, import_solid_js2.createMemo)(
    () => convertToAccessorOptions2(rawUseCompletionOptions)
  );
  const api = (0, import_solid_js2.createMemo)(
    () => {
      var _a2, _b2, _c2;
      return (_c2 = (_b2 = (_a2 = useCompletionOptions()).api) == null ? void 0 : _b2.call(_a2)) != null ? _c2 : "/api/completion";
    }
  );
  const idKey = (0, import_solid_js2.createMemo)(
    () => {
      var _a2, _b2, _c2;
      return (_c2 = (_b2 = (_a2 = useCompletionOptions()).id) == null ? void 0 : _b2.call(_a2)) != null ? _c2 : `completion-${(0, import_solid_js2.createUniqueId)()}`;
    }
  );
  const completionKey = (0, import_solid_js2.createMemo)(() => `${api()}|${idKey()}|completion`);
  const completion = (0, import_solid_js2.createMemo)(
    () => {
      var _a2, _b2, _c2;
      return (_c2 = store2[completionKey()]) != null ? _c2 : (_b2 = (_a2 = useCompletionOptions()).initialCompletion) == null ? void 0 : _b2.call(_a2);
    }
  );
  const mutate = (data) => {
    setStore2(completionKey(), data);
  };
  const [error, setError] = (0, import_solid_js2.createSignal)(void 0);
  const [streamData, setStreamData] = (0, import_solid_js2.createSignal)(
    void 0
  );
  const [isLoading, setIsLoading] = (0, import_solid_js2.createSignal)(false);
  const [abortController, setAbortController] = (0, import_solid_js2.createSignal)(null);
  let extraMetadata = {
    credentials: (_b = (_a = useCompletionOptions()).credentials) == null ? void 0 : _b.call(_a),
    headers: (_d = (_c = useCompletionOptions()).headers) == null ? void 0 : _d.call(_c),
    body: (_f = (_e = useCompletionOptions()).body) == null ? void 0 : _f.call(_e)
  };
  (0, import_solid_js2.createEffect)(() => {
    var _a2, _b2, _c2, _d2, _e2, _f2;
    extraMetadata = {
      credentials: (_b2 = (_a2 = useCompletionOptions()).credentials) == null ? void 0 : _b2.call(_a2),
      headers: (_d2 = (_c2 = useCompletionOptions()).headers) == null ? void 0 : _d2.call(_c2),
      body: (_f2 = (_e2 = useCompletionOptions()).body) == null ? void 0 : _f2.call(_e2)
    };
  });
  const complete = async (prompt, options) => {
    var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j, _k, _l, _m, _n, _o, _p;
    const existingData = (_a2 = streamData()) != null ? _a2 : [];
    return (0, import_ui_utils2.callCompletionApi)({
      api: api(),
      prompt,
      credentials: (_c2 = (_b2 = useCompletionOptions()).credentials) == null ? void 0 : _c2.call(_b2),
      headers: { ...extraMetadata.headers, ...options == null ? void 0 : options.headers },
      body: {
        ...extraMetadata.body,
        ...options == null ? void 0 : options.body
      },
      // streamMode is deprecated, use streamProtocol instead:
      streamProtocol: ((_h2 = (_e2 = (_d2 = useCompletionOptions()).streamProtocol) == null ? void 0 : _e2.call(_d2)) != null ? _h2 : ((_g2 = (_f2 = useCompletionOptions()).streamMode) == null ? void 0 : _g2.call(_f2)) === "text") ? "text" : void 0,
      setCompletion: mutate,
      setLoading: setIsLoading,
      setError,
      setAbortController,
      onResponse: (_j = (_i2 = useCompletionOptions()).onResponse) == null ? void 0 : _j.call(_i2),
      onFinish: (_l = (_k = useCompletionOptions()).onFinish) == null ? void 0 : _l.call(_k),
      onError: (_n = (_m = useCompletionOptions()).onError) == null ? void 0 : _n.call(_m),
      onData: (data) => {
        setStreamData([...existingData, ...data != null ? data : []]);
      },
      fetch: (_p = (_o = useCompletionOptions()).fetch) == null ? void 0 : _p.call(_o)
    });
  };
  const stop = () => {
    if (abortController()) {
      abortController().abort();
    }
  };
  const setCompletion = (completion2) => {
    mutate(completion2);
  };
  const [input, setInput] = (0, import_solid_js2.createSignal)(
    (_i = (_h = (_g = useCompletionOptions()).initialInput) == null ? void 0 : _h.call(_g)) != null ? _i : ""
  );
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const handleSubmit = (event) => {
    var _a2;
    (_a2 = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a2.call(event);
    const inputValue = input();
    return inputValue ? complete(inputValue) : void 0;
  };
  return {
    completion,
    complete,
    error,
    stop,
    setCompletion,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    data: streamData
  };
}
function convertToAccessorOptions2(options) {
  const resolvedOptions = typeof options === "function" ? options() : options;
  return Object.entries(resolvedOptions).reduce(
    (reactiveOptions, [key, value]) => {
      reactiveOptions[key] = (0, import_solid_js2.createMemo)(
        () => value
      );
      return reactiveOptions;
    },
    {}
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useChat,
  useCompletion
});
//# sourceMappingURL=index.js.map