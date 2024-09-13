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
  asSchema: () => asSchema,
  callChatApi: () => callChatApi,
  callCompletionApi: () => callCompletionApi,
  createChunkDecoder: () => createChunkDecoder,
  formatStreamPart: () => formatStreamPart,
  generateId: () => import_provider_utils3.generateId,
  getTextFromDataUrl: () => getTextFromDataUrl,
  isDeepEqualData: () => isDeepEqualData,
  jsonSchema: () => jsonSchema,
  parsePartialJson: () => parsePartialJson,
  parseStreamPart: () => parseStreamPart,
  processChatStream: () => processChatStream,
  processDataProtocolResponse: () => processDataProtocolResponse,
  readDataStream: () => readDataStream,
  zodSchema: () => zodSchema
});
module.exports = __toCommonJS(src_exports);
var import_provider_utils3 = require("@ai-sdk/provider-utils");

// src/process-data-protocol-response.ts
var import_provider_utils = require("@ai-sdk/provider-utils");

// src/parse-partial-json.ts
var import_secure_json_parse = __toESM(require("secure-json-parse"));

// src/fix-json.ts
function fixJson(input) {
  const stack = ["ROOT"];
  let lastValidIndex = -1;
  let literalStart = null;
  function processValueStart(char, i, swapState) {
    {
      switch (char) {
        case '"': {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_STRING");
          break;
        }
        case "f":
        case "t":
        case "n": {
          lastValidIndex = i;
          literalStart = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_LITERAL");
          break;
        }
        case "-": {
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_NUMBER");
          break;
        }
        case "{": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_OBJECT_START");
          break;
        }
        case "[": {
          lastValidIndex = i;
          stack.pop();
          stack.push(swapState);
          stack.push("INSIDE_ARRAY_START");
          break;
        }
      }
    }
  }
  function processAfterObjectValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_OBJECT_AFTER_COMMA");
        break;
      }
      case "}": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  function processAfterArrayValue(char, i) {
    switch (char) {
      case ",": {
        stack.pop();
        stack.push("INSIDE_ARRAY_AFTER_COMMA");
        break;
      }
      case "]": {
        lastValidIndex = i;
        stack.pop();
        break;
      }
    }
  }
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const currentState = stack[stack.length - 1];
    switch (currentState) {
      case "ROOT":
        processValueStart(char, i, "FINISH");
        break;
      case "INSIDE_OBJECT_START": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
          case "}": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_COMMA": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_KEY": {
        switch (char) {
          case '"': {
            stack.pop();
            stack.push("INSIDE_OBJECT_AFTER_KEY");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_AFTER_KEY": {
        switch (char) {
          case ":": {
            stack.pop();
            stack.push("INSIDE_OBJECT_BEFORE_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_OBJECT_BEFORE_VALUE": {
        processValueStart(char, i, "INSIDE_OBJECT_AFTER_VALUE");
        break;
      }
      case "INSIDE_OBJECT_AFTER_VALUE": {
        processAfterObjectValue(char, i);
        break;
      }
      case "INSIDE_STRING": {
        switch (char) {
          case '"': {
            stack.pop();
            lastValidIndex = i;
            break;
          }
          case "\\": {
            stack.push("INSIDE_STRING_ESCAPE");
            break;
          }
          default: {
            lastValidIndex = i;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_START": {
        switch (char) {
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_VALUE": {
        switch (char) {
          case ",": {
            stack.pop();
            stack.push("INSIDE_ARRAY_AFTER_COMMA");
            break;
          }
          case "]": {
            lastValidIndex = i;
            stack.pop();
            break;
          }
          default: {
            lastValidIndex = i;
            break;
          }
        }
        break;
      }
      case "INSIDE_ARRAY_AFTER_COMMA": {
        processValueStart(char, i, "INSIDE_ARRAY_AFTER_VALUE");
        break;
      }
      case "INSIDE_STRING_ESCAPE": {
        stack.pop();
        lastValidIndex = i;
        break;
      }
      case "INSIDE_NUMBER": {
        switch (char) {
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            lastValidIndex = i;
            break;
          }
          case "e":
          case "E":
          case "-":
          case ".": {
            break;
          }
          case ",": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "}": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
              processAfterObjectValue(char, i);
            }
            break;
          }
          case "]": {
            stack.pop();
            if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
              processAfterArrayValue(char, i);
            }
            break;
          }
          default: {
            stack.pop();
            break;
          }
        }
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, i + 1);
        if (!"false".startsWith(partialLiteral) && !"true".startsWith(partialLiteral) && !"null".startsWith(partialLiteral)) {
          stack.pop();
          if (stack[stack.length - 1] === "INSIDE_OBJECT_AFTER_VALUE") {
            processAfterObjectValue(char, i);
          } else if (stack[stack.length - 1] === "INSIDE_ARRAY_AFTER_VALUE") {
            processAfterArrayValue(char, i);
          }
        } else {
          lastValidIndex = i;
        }
        break;
      }
    }
  }
  let result = input.slice(0, lastValidIndex + 1);
  for (let i = stack.length - 1; i >= 0; i--) {
    const state = stack[i];
    switch (state) {
      case "INSIDE_STRING": {
        result += '"';
        break;
      }
      case "INSIDE_OBJECT_KEY":
      case "INSIDE_OBJECT_AFTER_KEY":
      case "INSIDE_OBJECT_AFTER_COMMA":
      case "INSIDE_OBJECT_START":
      case "INSIDE_OBJECT_BEFORE_VALUE":
      case "INSIDE_OBJECT_AFTER_VALUE": {
        result += "}";
        break;
      }
      case "INSIDE_ARRAY_START":
      case "INSIDE_ARRAY_AFTER_COMMA":
      case "INSIDE_ARRAY_AFTER_VALUE": {
        result += "]";
        break;
      }
      case "INSIDE_LITERAL": {
        const partialLiteral = input.substring(literalStart, input.length);
        if ("true".startsWith(partialLiteral)) {
          result += "true".slice(partialLiteral.length);
        } else if ("false".startsWith(partialLiteral)) {
          result += "false".slice(partialLiteral.length);
        } else if ("null".startsWith(partialLiteral)) {
          result += "null".slice(partialLiteral.length);
        }
      }
    }
  }
  return result;
}

// src/parse-partial-json.ts
function parsePartialJson(jsonText) {
  if (jsonText === void 0) {
    return { value: void 0, state: "undefined-input" };
  }
  try {
    return {
      value: import_secure_json_parse.default.parse(jsonText),
      state: "successful-parse"
    };
  } catch (ignored) {
    try {
      return {
        value: import_secure_json_parse.default.parse(fixJson(jsonText)),
        state: "repaired-parse"
      };
    } catch (ignored2) {
    }
  }
  return { value: void 0, state: "failed-parse" };
}

// src/stream-parts.ts
var textStreamPart = {
  code: "0",
  name: "text",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"text" parts expect a string value.');
    }
    return { type: "text", value };
  }
};
var functionCallStreamPart = {
  code: "1",
  name: "function_call",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("function_call" in value) || typeof value.function_call !== "object" || value.function_call == null || !("name" in value.function_call) || !("arguments" in value.function_call) || typeof value.function_call.name !== "string" || typeof value.function_call.arguments !== "string") {
      throw new Error(
        '"function_call" parts expect an object with a "function_call" property.'
      );
    }
    return {
      type: "function_call",
      value
    };
  }
};
var dataStreamPart = {
  code: "2",
  name: "data",
  parse: (value) => {
    if (!Array.isArray(value)) {
      throw new Error('"data" parts expect an array value.');
    }
    return { type: "data", value };
  }
};
var errorStreamPart = {
  code: "3",
  name: "error",
  parse: (value) => {
    if (typeof value !== "string") {
      throw new Error('"error" parts expect a string value.');
    }
    return { type: "error", value };
  }
};
var assistantMessageStreamPart = {
  code: "4",
  name: "assistant_message",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("id" in value) || !("role" in value) || !("content" in value) || typeof value.id !== "string" || typeof value.role !== "string" || value.role !== "assistant" || !Array.isArray(value.content) || !value.content.every(
      (item) => item != null && typeof item === "object" && "type" in item && item.type === "text" && "text" in item && item.text != null && typeof item.text === "object" && "value" in item.text && typeof item.text.value === "string"
    )) {
      throw new Error(
        '"assistant_message" parts expect an object with an "id", "role", and "content" property.'
      );
    }
    return {
      type: "assistant_message",
      value
    };
  }
};
var assistantControlDataStreamPart = {
  code: "5",
  name: "assistant_control_data",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("threadId" in value) || !("messageId" in value) || typeof value.threadId !== "string" || typeof value.messageId !== "string") {
      throw new Error(
        '"assistant_control_data" parts expect an object with a "threadId" and "messageId" property.'
      );
    }
    return {
      type: "assistant_control_data",
      value: {
        threadId: value.threadId,
        messageId: value.messageId
      }
    };
  }
};
var dataMessageStreamPart = {
  code: "6",
  name: "data_message",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("role" in value) || !("data" in value) || typeof value.role !== "string" || value.role !== "data") {
      throw new Error(
        '"data_message" parts expect an object with a "role" and "data" property.'
      );
    }
    return {
      type: "data_message",
      value
    };
  }
};
var toolCallsStreamPart = {
  code: "7",
  name: "tool_calls",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("tool_calls" in value) || typeof value.tool_calls !== "object" || value.tool_calls == null || !Array.isArray(value.tool_calls) || value.tool_calls.some(
      (tc) => tc == null || typeof tc !== "object" || !("id" in tc) || typeof tc.id !== "string" || !("type" in tc) || typeof tc.type !== "string" || !("function" in tc) || tc.function == null || typeof tc.function !== "object" || !("arguments" in tc.function) || typeof tc.function.name !== "string" || typeof tc.function.arguments !== "string"
    )) {
      throw new Error(
        '"tool_calls" parts expect an object with a ToolCallPayload.'
      );
    }
    return {
      type: "tool_calls",
      value
    };
  }
};
var messageAnnotationsStreamPart = {
  code: "8",
  name: "message_annotations",
  parse: (value) => {
    if (!Array.isArray(value)) {
      throw new Error('"message_annotations" parts expect an array value.');
    }
    return { type: "message_annotations", value };
  }
};
var toolCallStreamPart = {
  code: "9",
  name: "tool_call",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("toolName" in value) || typeof value.toolName !== "string" || !("args" in value) || typeof value.args !== "object") {
      throw new Error(
        '"tool_call" parts expect an object with a "toolCallId", "toolName", and "args" property.'
      );
    }
    return {
      type: "tool_call",
      value
    };
  }
};
var toolResultStreamPart = {
  code: "a",
  name: "tool_result",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("result" in value)) {
      throw new Error(
        '"tool_result" parts expect an object with a "toolCallId" and a "result" property.'
      );
    }
    return {
      type: "tool_result",
      value
    };
  }
};
var toolCallStreamingStartStreamPart = {
  code: "b",
  name: "tool_call_streaming_start",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("toolName" in value) || typeof value.toolName !== "string") {
      throw new Error(
        '"tool_call_streaming_start" parts expect an object with a "toolCallId" and "toolName" property.'
      );
    }
    return {
      type: "tool_call_streaming_start",
      value
    };
  }
};
var toolCallDeltaStreamPart = {
  code: "c",
  name: "tool_call_delta",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("toolCallId" in value) || typeof value.toolCallId !== "string" || !("argsTextDelta" in value) || typeof value.argsTextDelta !== "string") {
      throw new Error(
        '"tool_call_delta" parts expect an object with a "toolCallId" and "argsTextDelta" property.'
      );
    }
    return {
      type: "tool_call_delta",
      value
    };
  }
};
var finishMessageStreamPart = {
  code: "d",
  name: "finish_message",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("finishReason" in value) || typeof value.finishReason !== "string") {
      throw new Error(
        '"finish_message" parts expect an object with a "finishReason" property.'
      );
    }
    const result = {
      finishReason: value.finishReason
    };
    if ("usage" in value && value.usage != null && typeof value.usage === "object" && "promptTokens" in value.usage && "completionTokens" in value.usage) {
      result.usage = {
        promptTokens: typeof value.usage.promptTokens === "number" ? value.usage.promptTokens : Number.NaN,
        completionTokens: typeof value.usage.completionTokens === "number" ? value.usage.completionTokens : Number.NaN
      };
    }
    return {
      type: "finish_message",
      value: result
    };
  }
};
var finishRoundtripStreamPart = {
  code: "e",
  name: "finish_roundtrip",
  parse: (value) => {
    if (value == null || typeof value !== "object" || !("finishReason" in value) || typeof value.finishReason !== "string") {
      throw new Error(
        '"finish_roundtrip" parts expect an object with a "finishReason" property.'
      );
    }
    const result = {
      finishReason: value.finishReason
    };
    if ("usage" in value && value.usage != null && typeof value.usage === "object" && "promptTokens" in value.usage && "completionTokens" in value.usage) {
      result.usage = {
        promptTokens: typeof value.usage.promptTokens === "number" ? value.usage.promptTokens : Number.NaN,
        completionTokens: typeof value.usage.completionTokens === "number" ? value.usage.completionTokens : Number.NaN
      };
    }
    return {
      type: "finish_roundtrip",
      value: result
    };
  }
};
var streamParts = [
  textStreamPart,
  functionCallStreamPart,
  dataStreamPart,
  errorStreamPart,
  assistantMessageStreamPart,
  assistantControlDataStreamPart,
  dataMessageStreamPart,
  toolCallsStreamPart,
  messageAnnotationsStreamPart,
  toolCallStreamPart,
  toolResultStreamPart,
  toolCallStreamingStartStreamPart,
  toolCallDeltaStreamPart,
  finishMessageStreamPart,
  finishRoundtripStreamPart
];
var streamPartsByCode = {
  [textStreamPart.code]: textStreamPart,
  [functionCallStreamPart.code]: functionCallStreamPart,
  [dataStreamPart.code]: dataStreamPart,
  [errorStreamPart.code]: errorStreamPart,
  [assistantMessageStreamPart.code]: assistantMessageStreamPart,
  [assistantControlDataStreamPart.code]: assistantControlDataStreamPart,
  [dataMessageStreamPart.code]: dataMessageStreamPart,
  [toolCallsStreamPart.code]: toolCallsStreamPart,
  [messageAnnotationsStreamPart.code]: messageAnnotationsStreamPart,
  [toolCallStreamPart.code]: toolCallStreamPart,
  [toolResultStreamPart.code]: toolResultStreamPart,
  [toolCallStreamingStartStreamPart.code]: toolCallStreamingStartStreamPart,
  [toolCallDeltaStreamPart.code]: toolCallDeltaStreamPart,
  [finishMessageStreamPart.code]: finishMessageStreamPart,
  [finishRoundtripStreamPart.code]: finishRoundtripStreamPart
};
var StreamStringPrefixes = {
  [textStreamPart.name]: textStreamPart.code,
  [functionCallStreamPart.name]: functionCallStreamPart.code,
  [dataStreamPart.name]: dataStreamPart.code,
  [errorStreamPart.name]: errorStreamPart.code,
  [assistantMessageStreamPart.name]: assistantMessageStreamPart.code,
  [assistantControlDataStreamPart.name]: assistantControlDataStreamPart.code,
  [dataMessageStreamPart.name]: dataMessageStreamPart.code,
  [toolCallsStreamPart.name]: toolCallsStreamPart.code,
  [messageAnnotationsStreamPart.name]: messageAnnotationsStreamPart.code,
  [toolCallStreamPart.name]: toolCallStreamPart.code,
  [toolResultStreamPart.name]: toolResultStreamPart.code,
  [toolCallStreamingStartStreamPart.name]: toolCallStreamingStartStreamPart.code,
  [toolCallDeltaStreamPart.name]: toolCallDeltaStreamPart.code,
  [finishMessageStreamPart.name]: finishMessageStreamPart.code,
  [finishRoundtripStreamPart.name]: finishRoundtripStreamPart.code
};
var validCodes = streamParts.map((part) => part.code);
var parseStreamPart = (line) => {
  const firstSeparatorIndex = line.indexOf(":");
  if (firstSeparatorIndex === -1) {
    throw new Error("Failed to parse stream string. No separator found.");
  }
  const prefix = line.slice(0, firstSeparatorIndex);
  if (!validCodes.includes(prefix)) {
    throw new Error(`Failed to parse stream string. Invalid code ${prefix}.`);
  }
  const code = prefix;
  const textValue = line.slice(firstSeparatorIndex + 1);
  const jsonValue = JSON.parse(textValue);
  return streamPartsByCode[code].parse(jsonValue);
};
function formatStreamPart(type, value) {
  const streamPart = streamParts.find((part) => part.name === type);
  if (!streamPart) {
    throw new Error(`Invalid stream part type: ${type}`);
  }
  return `${streamPart.code}:${JSON.stringify(value)}
`;
}

// src/read-data-stream.ts
var NEWLINE = "\n".charCodeAt(0);
function concatChunks(chunks, totalLength) {
  const concatenatedChunks = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    concatenatedChunks.set(chunk, offset);
    offset += chunk.length;
  }
  chunks.length = 0;
  return concatenatedChunks;
}
async function* readDataStream(reader, {
  isAborted
} = {}) {
  const decoder = new TextDecoder();
  const chunks = [];
  let totalLength = 0;
  while (true) {
    const { value } = await reader.read();
    if (value) {
      chunks.push(value);
      totalLength += value.length;
      if (value[value.length - 1] !== NEWLINE) {
        continue;
      }
    }
    if (chunks.length === 0) {
      break;
    }
    const concatenatedChunks = concatChunks(chunks, totalLength);
    totalLength = 0;
    const streamParts2 = decoder.decode(concatenatedChunks, { stream: true }).split("\n").filter((line) => line !== "").map(parseStreamPart);
    for (const streamPart of streamParts2) {
      yield streamPart;
    }
    if (isAborted == null ? void 0 : isAborted()) {
      reader.cancel();
      break;
    }
  }
}

// src/process-data-protocol-response.ts
function assignAnnotationsToMessage(message, annotations) {
  if (!message || !annotations || !annotations.length)
    return message;
  return { ...message, annotations: [...annotations] };
}
async function processDataProtocolResponse({
  reader,
  abortControllerRef,
  update,
  onToolCall,
  onFinish,
  generateId: generateId2 = import_provider_utils.generateId,
  getCurrentDate = () => /* @__PURE__ */ new Date()
}) {
  var _a;
  const createdAt = getCurrentDate();
  let prefixMap = {};
  let nextPrefixMap = void 0;
  const previousMessages = [];
  const data = [];
  let message_annotations = void 0;
  const partialToolCalls = {};
  let usage = {
    completionTokens: NaN,
    promptTokens: NaN,
    totalTokens: NaN
  };
  let finishReason = "unknown";
  for await (const { type, value } of readDataStream(reader, {
    isAborted: () => (abortControllerRef == null ? void 0 : abortControllerRef.current) === null
  })) {
    if (type === "error") {
      throw new Error(value);
    }
    if (type === "finish_roundtrip") {
      nextPrefixMap = {};
      continue;
    }
    if (type === "finish_message") {
      finishReason = value.finishReason;
      if (value.usage != null) {
        const { completionTokens, promptTokens } = value.usage;
        usage = {
          completionTokens,
          promptTokens,
          totalTokens: completionTokens + promptTokens
        };
      }
      continue;
    }
    if (nextPrefixMap) {
      if (prefixMap.text) {
        previousMessages.push(prefixMap.text);
      }
      if (prefixMap.function_call) {
        previousMessages.push(prefixMap.function_call);
      }
      if (prefixMap.tool_calls) {
        previousMessages.push(prefixMap.tool_calls);
      }
      prefixMap = nextPrefixMap;
      nextPrefixMap = void 0;
    }
    if (type === "text") {
      if (prefixMap["text"]) {
        prefixMap["text"] = {
          ...prefixMap["text"],
          content: (prefixMap["text"].content || "") + value
        };
      } else {
        prefixMap["text"] = {
          id: generateId2(),
          role: "assistant",
          content: value,
          createdAt
        };
      }
    }
    if (type === "tool_call_streaming_start") {
      if (prefixMap.text == null) {
        prefixMap.text = {
          id: generateId2(),
          role: "assistant",
          content: "",
          createdAt
        };
      }
      if (prefixMap.text.toolInvocations == null) {
        prefixMap.text.toolInvocations = [];
      }
      partialToolCalls[value.toolCallId] = {
        text: "",
        toolName: value.toolName,
        prefixMapIndex: prefixMap.text.toolInvocations.length
      };
      prefixMap.text.toolInvocations.push({
        state: "partial-call",
        toolCallId: value.toolCallId,
        toolName: value.toolName,
        args: void 0
      });
    } else if (type === "tool_call_delta") {
      const partialToolCall = partialToolCalls[value.toolCallId];
      partialToolCall.text += value.argsTextDelta;
      const { value: partialArgs } = parsePartialJson(partialToolCall.text);
      prefixMap.text.toolInvocations[partialToolCall.prefixMapIndex] = {
        state: "partial-call",
        toolCallId: value.toolCallId,
        toolName: partialToolCall.toolName,
        args: partialArgs
      };
      prefixMap.text.internalUpdateId = generateId2();
    } else if (type === "tool_call") {
      if (partialToolCalls[value.toolCallId] != null) {
        prefixMap.text.toolInvocations[partialToolCalls[value.toolCallId].prefixMapIndex] = { state: "call", ...value };
      } else {
        if (prefixMap.text == null) {
          prefixMap.text = {
            id: generateId2(),
            role: "assistant",
            content: "",
            createdAt
          };
        }
        if (prefixMap.text.toolInvocations == null) {
          prefixMap.text.toolInvocations = [];
        }
        prefixMap.text.toolInvocations.push({
          state: "call",
          ...value
        });
      }
      prefixMap.text.internalUpdateId = generateId2();
      if (onToolCall) {
        const result = await onToolCall({ toolCall: value });
        if (result != null) {
          prefixMap.text.toolInvocations[prefixMap.text.toolInvocations.length - 1] = { state: "result", ...value, result };
        }
      }
    } else if (type === "tool_result") {
      const toolInvocations = (_a = prefixMap.text) == null ? void 0 : _a.toolInvocations;
      if (toolInvocations == null) {
        throw new Error("tool_result must be preceded by a tool_call");
      }
      const toolInvocationIndex = toolInvocations.findIndex(
        (invocation) => invocation.toolCallId === value.toolCallId
      );
      if (toolInvocationIndex === -1) {
        throw new Error(
          "tool_result must be preceded by a tool_call with the same toolCallId"
        );
      }
      toolInvocations[toolInvocationIndex] = {
        ...toolInvocations[toolInvocationIndex],
        state: "result",
        ...value
      };
    }
    let functionCallMessage = null;
    if (type === "function_call") {
      prefixMap["function_call"] = {
        id: generateId2(),
        role: "assistant",
        content: "",
        function_call: value.function_call,
        name: value.function_call.name,
        createdAt
      };
      functionCallMessage = prefixMap["function_call"];
    }
    let toolCallMessage = null;
    if (type === "tool_calls") {
      prefixMap["tool_calls"] = {
        id: generateId2(),
        role: "assistant",
        content: "",
        tool_calls: value.tool_calls,
        createdAt
      };
      toolCallMessage = prefixMap["tool_calls"];
    }
    if (type === "data") {
      data.push(...value);
    }
    let responseMessage = prefixMap["text"];
    if (type === "message_annotations") {
      if (!message_annotations) {
        message_annotations = [...value];
      } else {
        message_annotations.push(...value);
      }
      functionCallMessage = assignAnnotationsToMessage(
        prefixMap["function_call"],
        message_annotations
      );
      toolCallMessage = assignAnnotationsToMessage(
        prefixMap["tool_calls"],
        message_annotations
      );
      responseMessage = assignAnnotationsToMessage(
        prefixMap["text"],
        message_annotations
      );
    }
    if (message_annotations == null ? void 0 : message_annotations.length) {
      if (prefixMap.text) {
        prefixMap.text.annotations = [...message_annotations];
      }
      if (prefixMap.function_call) {
        prefixMap.function_call.annotations = [...message_annotations];
      }
      if (prefixMap.tool_calls) {
        prefixMap.tool_calls.annotations = [...message_annotations];
      }
    }
    const merged = [functionCallMessage, toolCallMessage, responseMessage].filter(Boolean).map((message) => ({
      ...assignAnnotationsToMessage(message, message_annotations)
    }));
    update([...previousMessages, ...merged], [...data]);
  }
  onFinish == null ? void 0 : onFinish({ message: prefixMap.text, finishReason, usage });
  return {
    messages: [
      prefixMap.text,
      prefixMap.function_call,
      prefixMap.tool_calls
    ].filter(Boolean),
    data
  };
}

// src/call-chat-api.ts
var getOriginalFetch = () => fetch;
async function callChatApi({
  api,
  body,
  streamProtocol = "data",
  credentials,
  headers,
  abortController,
  restoreMessagesOnFailure,
  onResponse,
  onUpdate,
  onFinish,
  onToolCall,
  generateId: generateId2,
  fetch: fetch2 = getOriginalFetch()
}) {
  var _a, _b;
  const response = await fetch2(api, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    signal: (_a = abortController == null ? void 0 : abortController()) == null ? void 0 : _a.signal,
    credentials
  }).catch((err) => {
    restoreMessagesOnFailure();
    throw err;
  });
  if (onResponse) {
    try {
      await onResponse(response);
    } catch (err) {
      throw err;
    }
  }
  if (!response.ok) {
    restoreMessagesOnFailure();
    throw new Error(
      (_b = await response.text()) != null ? _b : "Failed to fetch the chat response."
    );
  }
  if (!response.body) {
    throw new Error("The response body is empty.");
  }
  const reader = response.body.getReader();
  switch (streamProtocol) {
    case "text": {
      const decoder = createChunkDecoder();
      const resultMessage = {
        id: generateId2(),
        createdAt: /* @__PURE__ */ new Date(),
        role: "assistant",
        content: ""
      };
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        resultMessage.content += decoder(value);
        onUpdate([{ ...resultMessage }], []);
        if ((abortController == null ? void 0 : abortController()) === null) {
          reader.cancel();
          break;
        }
      }
      onFinish == null ? void 0 : onFinish(resultMessage, {
        usage: { completionTokens: NaN, promptTokens: NaN, totalTokens: NaN },
        finishReason: "unknown"
      });
      return {
        messages: [resultMessage],
        data: []
      };
    }
    case "data": {
      return await processDataProtocolResponse({
        reader,
        abortControllerRef: abortController != null ? { current: abortController() } : void 0,
        update: onUpdate,
        onToolCall,
        onFinish({ message, finishReason, usage }) {
          if (onFinish && message != null) {
            onFinish(message, { usage, finishReason });
          }
        },
        generateId: generateId2
      });
    }
    default: {
      const exhaustiveCheck = streamProtocol;
      throw new Error(`Unknown stream protocol: ${exhaustiveCheck}`);
    }
  }
}

// src/call-completion-api.ts
var getOriginalFetch2 = () => fetch;
async function callCompletionApi({
  api,
  prompt,
  credentials,
  headers,
  body,
  streamProtocol = "data",
  setCompletion,
  setLoading,
  setError,
  setAbortController,
  onResponse,
  onFinish,
  onError,
  onData,
  fetch: fetch2 = getOriginalFetch2()
}) {
  try {
    setLoading(true);
    setError(void 0);
    const abortController = new AbortController();
    setAbortController(abortController);
    setCompletion("");
    const res = await fetch2(api, {
      method: "POST",
      body: JSON.stringify({
        prompt,
        ...body
      }),
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...headers
      },
      signal: abortController.signal
    }).catch((err) => {
      throw err;
    });
    if (onResponse) {
      try {
        await onResponse(res);
      } catch (err) {
        throw err;
      }
    }
    if (!res.ok) {
      throw new Error(
        await res.text() || "Failed to fetch the chat response."
      );
    }
    if (!res.body) {
      throw new Error("The response body is empty.");
    }
    let result = "";
    const reader = res.body.getReader();
    switch (streamProtocol) {
      case "text": {
        const decoder = createChunkDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          result += decoder(value);
          setCompletion(result);
          if (abortController === null) {
            reader.cancel();
            break;
          }
        }
        break;
      }
      case "data": {
        for await (const { type, value } of readDataStream(reader, {
          isAborted: () => abortController === null
        })) {
          switch (type) {
            case "text": {
              result += value;
              setCompletion(result);
              break;
            }
            case "data": {
              onData == null ? void 0 : onData(value);
              break;
            }
          }
        }
        break;
      }
      default: {
        const exhaustiveCheck = streamProtocol;
        throw new Error(`Unknown stream protocol: ${exhaustiveCheck}`);
      }
    }
    if (onFinish) {
      onFinish(prompt, result);
    }
    setAbortController(null);
    return result;
  } catch (err) {
    if (err.name === "AbortError") {
      setAbortController(null);
      return null;
    }
    if (err instanceof Error) {
      if (onError) {
        onError(err);
      }
    }
    setError(err);
  } finally {
    setLoading(false);
  }
}

// src/create-chunk-decoder.ts
function createChunkDecoder(complex) {
  const decoder = new TextDecoder();
  if (!complex) {
    return function(chunk) {
      if (!chunk)
        return "";
      return decoder.decode(chunk, { stream: true });
    };
  }
  return function(chunk) {
    const decoded = decoder.decode(chunk, { stream: true }).split("\n").filter((line) => line !== "");
    return decoded.map(parseStreamPart).filter(Boolean);
  };
}

// src/data-url.ts
function getTextFromDataUrl(dataUrl) {
  const [header, base64Content] = dataUrl.split(",");
  const mimeType = header.split(";")[0].split(":")[1];
  if (mimeType == null || base64Content == null) {
    throw new Error("Invalid data URL format");
  }
  try {
    return window.atob(base64Content);
  } catch (error) {
    throw new Error(`Error decoding data URL`);
  }
}

// src/is-deep-equal-data.ts
function isDeepEqualData(obj1, obj2) {
  if (obj1 === obj2)
    return true;
  if (obj1 == null || obj2 == null)
    return false;
  if (typeof obj1 !== "object" && typeof obj2 !== "object")
    return obj1 === obj2;
  if (obj1.constructor !== obj2.constructor)
    return false;
  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }
  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length)
      return false;
    for (let i = 0; i < obj1.length; i++) {
      if (!isDeepEqualData(obj1[i], obj2[i]))
        return false;
    }
    return true;
  }
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length)
    return false;
  for (const key of keys1) {
    if (!keys2.includes(key))
      return false;
    if (!isDeepEqualData(obj1[key], obj2[key]))
      return false;
  }
  return true;
}

// src/process-chat-stream.ts
async function processChatStream({
  getStreamedResponse,
  experimental_onFunctionCall,
  experimental_onToolCall,
  updateChatRequest,
  getCurrentMessages
}) {
  while (true) {
    const messagesAndDataOrJustMessage = await getStreamedResponse();
    if ("messages" in messagesAndDataOrJustMessage) {
      let hasFollowingResponse = false;
      for (const message of messagesAndDataOrJustMessage.messages) {
        if ((message.function_call === void 0 || typeof message.function_call === "string") && (message.tool_calls === void 0 || typeof message.tool_calls === "string")) {
          continue;
        }
        hasFollowingResponse = true;
        if (experimental_onFunctionCall) {
          const functionCall = message.function_call;
          if (typeof functionCall !== "object") {
            console.warn(
              "experimental_onFunctionCall should not be defined when using tools"
            );
            continue;
          }
          const functionCallResponse = await experimental_onFunctionCall(
            getCurrentMessages(),
            functionCall
          );
          if (functionCallResponse === void 0) {
            hasFollowingResponse = false;
            break;
          }
          updateChatRequest(functionCallResponse);
        }
        if (experimental_onToolCall) {
          const toolCalls = message.tool_calls;
          if (!Array.isArray(toolCalls) || toolCalls.some((toolCall) => typeof toolCall !== "object")) {
            console.warn(
              "experimental_onToolCall should not be defined when using tools"
            );
            continue;
          }
          const toolCallResponse = await experimental_onToolCall(getCurrentMessages(), toolCalls);
          if (toolCallResponse === void 0) {
            hasFollowingResponse = false;
            break;
          }
          updateChatRequest(toolCallResponse);
        }
      }
      if (!hasFollowingResponse) {
        break;
      }
    } else {
      let fixFunctionCallArguments2 = function(response) {
        for (const message of response.messages) {
          if (message.tool_calls !== void 0) {
            for (const toolCall of message.tool_calls) {
              if (typeof toolCall === "object") {
                if (toolCall.function.arguments && typeof toolCall.function.arguments !== "string") {
                  toolCall.function.arguments = JSON.stringify(
                    toolCall.function.arguments
                  );
                }
              }
            }
          }
          if (message.function_call !== void 0) {
            if (typeof message.function_call === "object") {
              if (message.function_call.arguments && typeof message.function_call.arguments !== "string") {
                message.function_call.arguments = JSON.stringify(
                  message.function_call.arguments
                );
              }
            }
          }
        }
      };
      var fixFunctionCallArguments = fixFunctionCallArguments2;
      const streamedResponseMessage = messagesAndDataOrJustMessage;
      if ((streamedResponseMessage.function_call === void 0 || typeof streamedResponseMessage.function_call === "string") && (streamedResponseMessage.tool_calls === void 0 || typeof streamedResponseMessage.tool_calls === "string")) {
        break;
      }
      if (experimental_onFunctionCall) {
        const functionCall = streamedResponseMessage.function_call;
        if (!(typeof functionCall === "object")) {
          console.warn(
            "experimental_onFunctionCall should not be defined when using tools"
          );
          continue;
        }
        const functionCallResponse = await experimental_onFunctionCall(getCurrentMessages(), functionCall);
        if (functionCallResponse === void 0)
          break;
        fixFunctionCallArguments2(functionCallResponse);
        updateChatRequest(functionCallResponse);
      }
      if (experimental_onToolCall) {
        const toolCalls = streamedResponseMessage.tool_calls;
        if (!(typeof toolCalls === "object")) {
          console.warn(
            "experimental_onToolCall should not be defined when using functions"
          );
          continue;
        }
        const toolCallResponse = await experimental_onToolCall(getCurrentMessages(), toolCalls);
        if (toolCallResponse === void 0)
          break;
        fixFunctionCallArguments2(toolCallResponse);
        updateChatRequest(toolCallResponse);
      }
    }
  }
}

// src/schema.ts
var import_provider_utils2 = require("@ai-sdk/provider-utils");
var import_zod_to_json_schema = __toESM(require("zod-to-json-schema"));
var schemaSymbol = Symbol.for("vercel.ai.schema");
function jsonSchema(jsonSchema2, {
  validate
} = {}) {
  return {
    [schemaSymbol]: true,
    _type: void 0,
    // should never be used directly
    [import_provider_utils2.validatorSymbol]: true,
    jsonSchema: jsonSchema2,
    validate
  };
}
function isSchema(value) {
  return typeof value === "object" && value !== null && schemaSymbol in value && value[schemaSymbol] === true && "jsonSchema" in value && "validate" in value;
}
function asSchema(schema) {
  return isSchema(schema) ? schema : zodSchema(schema);
}
function zodSchema(zodSchema2) {
  return jsonSchema(
    // we assume that zodToJsonSchema will return a valid JSONSchema7:
    (0, import_zod_to_json_schema.default)(zodSchema2),
    {
      validate: (value) => {
        const result = zodSchema2.safeParse(value);
        return result.success ? { success: true, value: result.data } : { success: false, error: result.error };
      }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  asSchema,
  callChatApi,
  callCompletionApi,
  createChunkDecoder,
  formatStreamPart,
  generateId,
  getTextFromDataUrl,
  isDeepEqualData,
  jsonSchema,
  parsePartialJson,
  parseStreamPart,
  processChatStream,
  processDataProtocolResponse,
  readDataStream,
  zodSchema
});
//# sourceMappingURL=index.js.map