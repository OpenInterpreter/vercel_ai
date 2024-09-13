// src/use-assistant.ts
import { isAbortError } from "@ai-sdk/provider-utils";
import {
  generateId,
  readDataStream
} from "@ai-sdk/ui-utils";
import { useCallback, useRef, useState } from "react";
var getOriginalFetch = () => fetch;
function useAssistant({
  api,
  threadId: threadIdParam,
  credentials,
  headers,
  body,
  onError,
  fetch: fetch2
}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentThreadId, setCurrentThreadId] = useState(
    void 0
  );
  const [status, setStatus] = useState("awaiting_message");
  const [error, setError] = useState(void 0);
  const handleInputChange = (event) => {
    setInput(event.target.value);
  };
  const abortControllerRef = useRef(null);
  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  const append = async (message, requestOptions) => {
    var _a, _b;
    setStatus("in_progress");
    setMessages((messages2) => {
      var _a2;
      return [
        ...messages2,
        {
          ...message,
          id: (_a2 = message.id) != null ? _a2 : generateId()
        }
      ];
    });
    setInput("");
    const abortController = new AbortController();
    try {
      abortControllerRef.current = abortController;
      const actualFetch = fetch2 != null ? fetch2 : getOriginalFetch();
      const response = await actualFetch(api, {
        method: "POST",
        credentials,
        signal: abortController.signal,
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          ...body,
          // always use user-provided threadId when available:
          threadId: (_a = threadIdParam != null ? threadIdParam : currentThreadId) != null ? _a : null,
          message: message.content,
          // optional request data:
          data: requestOptions == null ? void 0 : requestOptions.data
        })
      });
      if (!response.ok) {
        throw new Error(
          (_b = await response.text()) != null ? _b : "Failed to fetch the assistant response."
        );
      }
      if (response.body == null) {
        throw new Error("The response body is empty.");
      }
      for await (const { type, value } of readDataStream(
        response.body.getReader()
      )) {
        switch (type) {
          case "assistant_message": {
            setMessages((messages2) => [
              ...messages2,
              {
                id: value.id,
                role: value.role,
                content: value.content[0].text.value
              }
            ]);
            break;
          }
          case "text": {
            setMessages((messages2) => {
              const lastMessage = messages2[messages2.length - 1];
              return [
                ...messages2.slice(0, messages2.length - 1),
                {
                  id: lastMessage.id,
                  role: lastMessage.role,
                  content: lastMessage.content + value
                }
              ];
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
          case "assistant_control_data": {
            setCurrentThreadId(value.threadId);
            setMessages((messages2) => {
              const lastMessage = messages2[messages2.length - 1];
              lastMessage.id = value.messageId;
              return [...messages2.slice(0, messages2.length - 1), lastMessage];
            });
            break;
          }
          case "error": {
            setError(new Error(value));
            break;
          }
        }
      }
    } catch (error2) {
      if (isAbortError(error2) && abortController.signal.aborted) {
        abortControllerRef.current = null;
        return;
      }
      if (onError && error2 instanceof Error) {
        onError(error2);
      }
      setError(error2);
    } finally {
      abortControllerRef.current = null;
      setStatus("awaiting_message");
    }
  };
  const submitMessage = async (event, requestOptions) => {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    if (input === "") {
      return;
    }
    append({ role: "user", content: input }, requestOptions);
  };
  const setThreadId = (threadId) => {
    setCurrentThreadId(threadId);
    setMessages([]);
  };
  return {
    append,
    messages,
    setMessages,
    threadId: currentThreadId,
    setThreadId,
    input,
    setInput,
    handleInputChange,
    submitMessage,
    status,
    error,
    stop
  };
}
var experimental_useAssistant = useAssistant;

// src/use-chat.ts
import {
  callChatApi,
  generateId as generateIdFunc,
  processChatStream
} from "@ai-sdk/ui-utils";
import { useCallback as useCallback2, useEffect, useId, useRef as useRef2, useState as useState2 } from "react";
import useSWR from "swr";
var getStreamedResponse = async (api, chatRequest, mutate, mutateStreamData, existingData, extraMetadataRef, messagesRef, abortControllerRef, generateId2, streamProtocol, onFinish, onResponse, onToolCall, sendExtraMessageFields, experimental_prepareRequestBody, fetch2, keepLastMessageOnError) => {
  var _a;
  const previousMessages = messagesRef.current;
  mutate(chatRequest.messages, false);
  const constructedMessagesPayload = sendExtraMessageFields ? chatRequest.messages : chatRequest.messages.map(
    ({
      role,
      content,
      experimental_attachments,
      name,
      data,
      annotations,
      toolInvocations,
      function_call,
      tool_calls,
      tool_call_id
    }) => ({
      role,
      content,
      ...experimental_attachments !== void 0 && {
        experimental_attachments
      },
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
  return await callChatApi({
    api,
    body: (_a = experimental_prepareRequestBody == null ? void 0 : experimental_prepareRequestBody({
      messages: chatRequest.messages,
      requestData: chatRequest.data,
      requestBody: chatRequest.body
    })) != null ? _a : {
      messages: constructedMessagesPayload,
      data: chatRequest.data,
      ...extraMetadataRef.current.body,
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
    credentials: extraMetadataRef.current.credentials,
    headers: {
      ...extraMetadataRef.current.headers,
      ...chatRequest.headers
    },
    abortController: () => abortControllerRef.current,
    restoreMessagesOnFailure() {
      if (!keepLastMessageOnError) {
        mutate(previousMessages, false);
      }
    },
    onResponse,
    onUpdate(merged, data) {
      mutate([...chatRequest.messages, ...merged], false);
      mutateStreamData([...existingData || [], ...data || []], false);
    },
    onToolCall,
    onFinish,
    generateId: generateId2,
    fetch: fetch2
  });
};
function useChat({
  api = "/api/chat",
  id,
  initialMessages,
  initialInput = "",
  sendExtraMessageFields,
  experimental_onFunctionCall,
  experimental_onToolCall,
  onToolCall,
  experimental_prepareRequestBody,
  experimental_maxAutomaticRoundtrips = 0,
  maxAutomaticRoundtrips = experimental_maxAutomaticRoundtrips,
  maxToolRoundtrips = maxAutomaticRoundtrips,
  streamMode,
  streamProtocol,
  onResponse,
  onFinish,
  onError,
  credentials,
  headers,
  body,
  generateId: generateId2 = generateIdFunc,
  fetch: fetch2,
  keepLastMessageOnError = false
} = {}) {
  if (streamMode) {
    streamProtocol != null ? streamProtocol : streamProtocol = streamMode === "text" ? "text" : void 0;
  }
  const hookId = useId();
  const idKey = id != null ? id : hookId;
  const chatKey = typeof api === "string" ? [api, idKey] : idKey;
  const [initialMessagesFallback] = useState2([]);
  const { data: messages, mutate } = useSWR(
    [chatKey, "messages"],
    null,
    { fallbackData: initialMessages != null ? initialMessages : initialMessagesFallback }
  );
  const { data: isLoading = false, mutate: mutateLoading } = useSWR(
    [chatKey, "loading"],
    null
  );
  const { data: streamData, mutate: mutateStreamData } = useSWR([chatKey, "streamData"], null);
  const { data: error = void 0, mutate: setError } = useSWR([chatKey, "error"], null);
  const messagesRef = useRef2(messages || []);
  useEffect(() => {
    messagesRef.current = messages || [];
  }, [messages]);
  const abortControllerRef = useRef2(null);
  const extraMetadataRef = useRef2({
    credentials,
    headers,
    body
  });
  useEffect(() => {
    extraMetadataRef.current = {
      credentials,
      headers,
      body
    };
  }, [credentials, headers, body]);
  const triggerRequest = useCallback2(
    async (chatRequest) => {
      const messageCount = messagesRef.current.length;
      try {
        mutateLoading(true);
        setError(void 0);
        const abortController = new AbortController();
        abortControllerRef.current = abortController;
        await processChatStream({
          getStreamedResponse: () => getStreamedResponse(
            api,
            chatRequest,
            mutate,
            mutateStreamData,
            streamData,
            extraMetadataRef,
            messagesRef,
            abortControllerRef,
            generateId2,
            streamProtocol,
            onFinish,
            onResponse,
            onToolCall,
            sendExtraMessageFields,
            experimental_prepareRequestBody,
            fetch2,
            keepLastMessageOnError
          ),
          experimental_onFunctionCall,
          experimental_onToolCall,
          updateChatRequest: (chatRequestParam) => {
            chatRequest = chatRequestParam;
          },
          getCurrentMessages: () => messagesRef.current
        });
        abortControllerRef.current = null;
      } catch (err) {
        if (err.name === "AbortError") {
          abortControllerRef.current = null;
          return null;
        }
        if (onError && err instanceof Error) {
          onError(err);
        }
        setError(err);
      } finally {
        mutateLoading(false);
      }
      const messages2 = messagesRef.current;
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
    },
    [
      mutate,
      mutateLoading,
      api,
      extraMetadataRef,
      onResponse,
      onFinish,
      onError,
      setError,
      mutateStreamData,
      streamData,
      streamProtocol,
      sendExtraMessageFields,
      experimental_onFunctionCall,
      experimental_onToolCall,
      experimental_prepareRequestBody,
      onToolCall,
      maxToolRoundtrips,
      messagesRef,
      abortControllerRef,
      generateId2,
      fetch2,
      keepLastMessageOnError
    ]
  );
  const append = useCallback2(
    async (message, {
      options,
      functions,
      function_call,
      tools,
      tool_choice,
      data,
      headers: headers2,
      body: body2,
      experimental_attachments
    } = {}) => {
      if (!message.id) {
        message.id = generateId2();
      }
      const attachmentsForRequest = await prepareAttachmentsForRequest(
        experimental_attachments
      );
      const requestOptions = {
        headers: headers2 != null ? headers2 : options == null ? void 0 : options.headers,
        body: body2 != null ? body2 : options == null ? void 0 : options.body
      };
      const messages2 = messagesRef.current.concat({
        id: generateId2(),
        createdAt: /* @__PURE__ */ new Date(),
        role: "user",
        content: message.content,
        experimental_attachments: attachmentsForRequest.length > 0 ? attachmentsForRequest : void 0
      });
      const chatRequest = {
        messages: messages2,
        options: requestOptions,
        headers: requestOptions.headers,
        body: requestOptions.body,
        data,
        ...functions !== void 0 && { functions },
        ...function_call !== void 0 && { function_call },
        ...tools !== void 0 && { tools },
        ...tool_choice !== void 0 && { tool_choice }
      };
      return triggerRequest(chatRequest);
    },
    [triggerRequest, generateId2]
  );
  const reload = useCallback2(
    async ({
      options,
      functions,
      function_call,
      tools,
      tool_choice,
      data,
      headers: headers2,
      body: body2
    } = {}) => {
      if (messagesRef.current.length === 0)
        return null;
      const requestOptions = {
        headers: headers2 != null ? headers2 : options == null ? void 0 : options.headers,
        body: body2 != null ? body2 : options == null ? void 0 : options.body
      };
      const lastMessage = messagesRef.current[messagesRef.current.length - 1];
      if (lastMessage.role === "assistant") {
        const chatRequest2 = {
          messages: messagesRef.current.slice(0, -1),
          options: requestOptions,
          headers: requestOptions.headers,
          body: requestOptions.body,
          data,
          ...functions !== void 0 && { functions },
          ...function_call !== void 0 && { function_call },
          ...tools !== void 0 && { tools },
          ...tool_choice !== void 0 && { tool_choice }
        };
        return triggerRequest(chatRequest2);
      }
      const chatRequest = {
        messages: messagesRef.current,
        options: requestOptions,
        headers: requestOptions.headers,
        body: requestOptions.body,
        data,
        ...functions !== void 0 && { functions },
        ...function_call !== void 0 && { function_call },
        ...tools !== void 0 && { tools },
        ...tool_choice !== void 0 && { tool_choice }
      };
      return triggerRequest(chatRequest);
    },
    [triggerRequest]
  );
  const stop = useCallback2(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);
  const setMessages = useCallback2(
    (messages2) => {
      if (typeof messages2 === "function") {
        messages2 = messages2(messagesRef.current);
      }
      mutate(messages2, false);
      messagesRef.current = messages2;
    },
    [mutate]
  );
  const [input, setInput] = useState2(initialInput);
  const handleSubmit = useCallback2(
    async (event, options = {}, metadata) => {
      var _a, _b, _c, _d, _e;
      (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
      if (!input && !options.allowEmptySubmit)
        return;
      if (metadata) {
        extraMetadataRef.current = {
          ...extraMetadataRef.current,
          ...metadata
        };
      }
      const attachmentsForRequest = await prepareAttachmentsForRequest(
        options.experimental_attachments
      );
      const requestOptions = {
        headers: (_c = options.headers) != null ? _c : (_b = options.options) == null ? void 0 : _b.headers,
        body: (_e = options.body) != null ? _e : (_d = options.options) == null ? void 0 : _d.body
      };
      const messages2 = !input && !attachmentsForRequest.length && options.allowEmptySubmit ? messagesRef.current : messagesRef.current.concat({
        id: generateId2(),
        createdAt: /* @__PURE__ */ new Date(),
        role: "user",
        content: input,
        experimental_attachments: attachmentsForRequest.length > 0 ? attachmentsForRequest : void 0
      });
      const chatRequest = {
        messages: messages2,
        options: requestOptions,
        headers: requestOptions.headers,
        body: requestOptions.body,
        data: options.data
      };
      triggerRequest(chatRequest);
      setInput("");
    },
    [input, generateId2, triggerRequest]
  );
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const addToolResult = ({
    toolCallId,
    result
  }) => {
    const updatedMessages = messagesRef.current.map(
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
    mutate(updatedMessages, false);
    const lastMessage = updatedMessages[updatedMessages.length - 1];
    if (isAssistantMessageWithCompletedToolCalls(lastMessage)) {
      triggerRequest({ messages: updatedMessages });
    }
  };
  return {
    messages: messages || [],
    error,
    append,
    reload,
    stop,
    setMessages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    data: streamData,
    addToolResult,
    experimental_addToolResult: addToolResult
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
async function prepareAttachmentsForRequest(attachmentsFromOptions) {
  if (attachmentsFromOptions == null) {
    return [];
  }
  if (attachmentsFromOptions instanceof FileList) {
    return Promise.all(
      Array.from(attachmentsFromOptions).map(async (attachment) => {
        const { name, type } = attachment;
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (readerEvent) => {
            var _a;
            resolve((_a = readerEvent.target) == null ? void 0 : _a.result);
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(attachment);
        });
        return {
          name,
          contentType: type,
          url: dataUrl
        };
      })
    );
  }
  if (Array.isArray(attachmentsFromOptions)) {
    return attachmentsFromOptions;
  }
  throw new Error("Invalid attachments type");
}

// src/use-completion.ts
import {
  callCompletionApi
} from "@ai-sdk/ui-utils";
import { useCallback as useCallback3, useEffect as useEffect2, useId as useId2, useRef as useRef3, useState as useState3 } from "react";
import useSWR2 from "swr";
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
  fetch: fetch2,
  onResponse,
  onFinish,
  onError
} = {}) {
  if (streamMode) {
    streamProtocol != null ? streamProtocol : streamProtocol = streamMode === "text" ? "text" : void 0;
  }
  const hookId = useId2();
  const completionId = id || hookId;
  const { data, mutate } = useSWR2([api, completionId], null, {
    fallbackData: initialCompletion
  });
  const { data: isLoading = false, mutate: mutateLoading } = useSWR2(
    [completionId, "loading"],
    null
  );
  const { data: streamData, mutate: mutateStreamData } = useSWR2([completionId, "streamData"], null);
  const [error, setError] = useState3(void 0);
  const completion = data;
  const [abortController, setAbortController] = useState3(null);
  const extraMetadataRef = useRef3({
    credentials,
    headers,
    body
  });
  useEffect2(() => {
    extraMetadataRef.current = {
      credentials,
      headers,
      body
    };
  }, [credentials, headers, body]);
  const triggerRequest = useCallback3(
    async (prompt, options) => callCompletionApi({
      api,
      prompt,
      credentials: extraMetadataRef.current.credentials,
      headers: { ...extraMetadataRef.current.headers, ...options == null ? void 0 : options.headers },
      body: {
        ...extraMetadataRef.current.body,
        ...options == null ? void 0 : options.body
      },
      streamProtocol,
      fetch: fetch2,
      setCompletion: (completion2) => mutate(completion2, false),
      setLoading: mutateLoading,
      setError,
      setAbortController,
      onResponse,
      onFinish,
      onError,
      onData: (data2) => {
        mutateStreamData([...streamData || [], ...data2 || []], false);
      }
    }),
    [
      mutate,
      mutateLoading,
      api,
      extraMetadataRef,
      setAbortController,
      onResponse,
      onFinish,
      onError,
      setError,
      streamData,
      streamProtocol,
      fetch2,
      mutateStreamData
    ]
  );
  const stop = useCallback3(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  }, [abortController]);
  const setCompletion = useCallback3(
    (completion2) => {
      mutate(completion2, false);
    },
    [mutate]
  );
  const complete = useCallback3(
    async (prompt, options) => {
      return triggerRequest(prompt, options);
    },
    [triggerRequest]
  );
  const [input, setInput] = useState3(initialInput);
  const handleSubmit = useCallback3(
    (event) => {
      var _a;
      (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
      return input ? complete(input) : void 0;
    },
    [input, complete]
  );
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  return {
    completion,
    complete,
    error,
    setCompletion,
    stop,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    data: streamData
  };
}

// src/use-object.ts
import {
  isAbortError as isAbortError2,
  safeValidateTypes
} from "@ai-sdk/provider-utils";
import {
  asSchema,
  isDeepEqualData,
  parsePartialJson
} from "@ai-sdk/ui-utils";
import { useCallback as useCallback4, useId as useId3, useRef as useRef4, useState as useState4 } from "react";
import useSWR3 from "swr";
var getOriginalFetch2 = () => fetch;
function useObject({
  api,
  id,
  schema,
  // required, in the future we will use it for validation
  initialValue,
  fetch: fetch2,
  onError,
  onFinish
}) {
  const hookId = useId3();
  const completionId = id != null ? id : hookId;
  const { data, mutate } = useSWR3(
    [api, completionId],
    null,
    { fallbackData: initialValue }
  );
  const [error, setError] = useState4(void 0);
  const [isLoading, setIsLoading] = useState4(false);
  const abortControllerRef = useRef4(null);
  const stop = useCallback4(() => {
    var _a;
    try {
      (_a = abortControllerRef.current) == null ? void 0 : _a.abort();
    } catch (ignored) {
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);
  const submit = async (input) => {
    var _a;
    try {
      mutate(void 0);
      setIsLoading(true);
      setError(void 0);
      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const actualFetch = fetch2 != null ? fetch2 : getOriginalFetch2();
      const response = await actualFetch(api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortController.signal,
        body: JSON.stringify(input)
      });
      if (!response.ok) {
        throw new Error(
          (_a = await response.text()) != null ? _a : "Failed to fetch the response."
        );
      }
      if (response.body == null) {
        throw new Error("The response body is empty.");
      }
      let accumulatedText = "";
      let latestObject = void 0;
      await response.body.pipeThrough(new TextDecoderStream()).pipeTo(
        new WritableStream({
          write(chunk) {
            accumulatedText += chunk;
            const { value } = parsePartialJson(accumulatedText);
            const currentObject = value;
            if (!isDeepEqualData(latestObject, currentObject)) {
              latestObject = currentObject;
              mutate(currentObject);
            }
          },
          close() {
            setIsLoading(false);
            abortControllerRef.current = null;
            if (onFinish != null) {
              const validationResult = safeValidateTypes({
                value: latestObject,
                schema: asSchema(schema)
              });
              onFinish(
                validationResult.success ? { object: validationResult.value, error: void 0 } : { object: void 0, error: validationResult.error }
              );
            }
          }
        })
      );
    } catch (error2) {
      if (isAbortError2(error2)) {
        return;
      }
      if (onError && error2 instanceof Error) {
        onError(error2);
      }
      setIsLoading(false);
      setError(error2 instanceof Error ? error2 : new Error(String(error2)));
    }
  };
  return {
    setInput: submit,
    // Deprecated
    submit,
    object: data,
    error,
    isLoading,
    stop
  };
}
var experimental_useObject = useObject;
export {
  experimental_useAssistant,
  experimental_useObject,
  useAssistant,
  useChat,
  useCompletion
};
//# sourceMappingURL=index.mjs.map