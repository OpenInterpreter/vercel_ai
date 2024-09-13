"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name11 in all)
    __defProp(target, name11, { get: all[name11], enumerable: true });
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

// streams/index.ts
var streams_exports = {};
__export(streams_exports, {
  AISDKError: () => import_provider16.AISDKError,
  AIStream: () => AIStream,
  APICallError: () => import_provider16.APICallError,
  AWSBedrockAnthropicMessagesStream: () => AWSBedrockAnthropicMessagesStream,
  AWSBedrockAnthropicStream: () => AWSBedrockAnthropicStream,
  AWSBedrockCohereStream: () => AWSBedrockCohereStream,
  AWSBedrockLlama2Stream: () => AWSBedrockLlama2Stream,
  AWSBedrockStream: () => AWSBedrockStream,
  AnthropicStream: () => AnthropicStream,
  AssistantResponse: () => AssistantResponse,
  CohereStream: () => CohereStream,
  DownloadError: () => DownloadError,
  EmptyResponseBodyError: () => import_provider16.EmptyResponseBodyError,
  GoogleGenerativeAIStream: () => GoogleGenerativeAIStream,
  HuggingFaceStream: () => HuggingFaceStream,
  InkeepStream: () => InkeepStream,
  InvalidArgumentError: () => InvalidArgumentError,
  InvalidDataContentError: () => InvalidDataContentError,
  InvalidMessageRoleError: () => InvalidMessageRoleError,
  InvalidPromptError: () => import_provider16.InvalidPromptError,
  InvalidResponseDataError: () => import_provider16.InvalidResponseDataError,
  InvalidToolArgumentsError: () => InvalidToolArgumentsError,
  JSONParseError: () => import_provider16.JSONParseError,
  LangChainAdapter: () => langchain_adapter_exports,
  LangChainStream: () => LangChainStream,
  LoadAPIKeyError: () => import_provider16.LoadAPIKeyError,
  MessageConversionError: () => MessageConversionError,
  MistralStream: () => MistralStream,
  NoContentGeneratedError: () => import_provider16.NoContentGeneratedError,
  NoObjectGeneratedError: () => NoObjectGeneratedError,
  NoSuchModelError: () => import_provider16.NoSuchModelError,
  NoSuchProviderError: () => NoSuchProviderError,
  NoSuchToolError: () => NoSuchToolError,
  OpenAIStream: () => OpenAIStream,
  ReplicateStream: () => ReplicateStream,
  RetryError: () => RetryError,
  StreamData: () => StreamData2,
  StreamingTextResponse: () => StreamingTextResponse,
  TypeValidationError: () => import_provider16.TypeValidationError,
  UnsupportedFunctionalityError: () => import_provider16.UnsupportedFunctionalityError,
  convertToCoreMessages: () => convertToCoreMessages,
  cosineSimilarity: () => cosineSimilarity,
  createCallbacksTransformer: () => createCallbacksTransformer,
  createEventStreamTransformer: () => createEventStreamTransformer,
  createStreamDataTransformer: () => createStreamDataTransformer,
  embed: () => embed,
  embedMany: () => embedMany,
  experimental_AssistantResponse: () => experimental_AssistantResponse,
  experimental_StreamData: () => experimental_StreamData,
  experimental_createModelRegistry: () => experimental_createModelRegistry,
  experimental_createProviderRegistry: () => experimental_createProviderRegistry,
  experimental_customProvider: () => experimental_customProvider,
  experimental_generateObject: () => experimental_generateObject,
  experimental_generateText: () => experimental_generateText,
  experimental_streamObject: () => experimental_streamObject,
  experimental_streamText: () => experimental_streamText,
  experimental_wrapLanguageModel: () => experimental_wrapLanguageModel,
  formatStreamPart: () => import_ui_utils10.formatStreamPart,
  generateId: () => generateId2,
  generateObject: () => generateObject,
  generateText: () => generateText,
  jsonSchema: () => import_ui_utils6.jsonSchema,
  nanoid: () => nanoid,
  parseStreamPart: () => import_ui_utils10.parseStreamPart,
  processDataProtocolResponse: () => import_ui_utils10.processDataProtocolResponse,
  readDataStream: () => import_ui_utils10.readDataStream,
  readableFromAsyncIterable: () => readableFromAsyncIterable,
  streamObject: () => streamObject,
  streamText: () => streamText,
  streamToResponse: () => streamToResponse,
  tool: () => tool,
  trimStartOfStreamHelper: () => trimStartOfStreamHelper
});
module.exports = __toCommonJS(streams_exports);
var import_ui_utils10 = require("@ai-sdk/ui-utils");
var import_provider_utils11 = require("@ai-sdk/provider-utils");

// core/index.ts
var import_ui_utils6 = require("@ai-sdk/ui-utils");

// util/retry-with-exponential-backoff.ts
var import_provider2 = require("@ai-sdk/provider");
var import_provider_utils = require("@ai-sdk/provider-utils");

// util/delay.ts
async function delay(delayInMs) {
  return delayInMs === void 0 ? Promise.resolve() : new Promise((resolve) => setTimeout(resolve, delayInMs));
}

// util/retry-error.ts
var import_provider = require("@ai-sdk/provider");
var name = "AI_RetryError";
var marker = `vercel.ai.error.${name}`;
var symbol = Symbol.for(marker);
var _a;
var RetryError = class extends import_provider.AISDKError {
  constructor({
    message,
    reason,
    errors
  }) {
    super({ name, message });
    this[_a] = true;
    this.reason = reason;
    this.errors = errors;
    this.lastError = errors[errors.length - 1];
  }
  static isInstance(error) {
    return import_provider.AISDKError.hasMarker(error, marker);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isRetryError(error) {
    return error instanceof Error && error.name === name && typeof error.reason === "string" && Array.isArray(error.errors);
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      reason: this.reason,
      lastError: this.lastError,
      errors: this.errors
    };
  }
};
_a = symbol;

// util/retry-with-exponential-backoff.ts
var retryWithExponentialBackoff = ({
  maxRetries = 2,
  initialDelayInMs = 2e3,
  backoffFactor = 2
} = {}) => async (f) => _retryWithExponentialBackoff(f, {
  maxRetries,
  delayInMs: initialDelayInMs,
  backoffFactor
});
async function _retryWithExponentialBackoff(f, {
  maxRetries,
  delayInMs,
  backoffFactor
}, errors = []) {
  try {
    return await f();
  } catch (error) {
    if ((0, import_provider_utils.isAbortError)(error)) {
      throw error;
    }
    if (maxRetries === 0) {
      throw error;
    }
    const errorMessage = (0, import_provider_utils.getErrorMessage)(error);
    const newErrors = [...errors, error];
    const tryNumber = newErrors.length;
    if (tryNumber > maxRetries) {
      throw new RetryError({
        message: `Failed after ${tryNumber} attempts. Last error: ${errorMessage}`,
        reason: "maxRetriesExceeded",
        errors: newErrors
      });
    }
    if (error instanceof Error && import_provider2.APICallError.isAPICallError(error) && error.isRetryable === true && tryNumber <= maxRetries) {
      await delay(delayInMs);
      return _retryWithExponentialBackoff(
        f,
        { maxRetries, delayInMs: backoffFactor * delayInMs, backoffFactor },
        newErrors
      );
    }
    if (tryNumber === 1) {
      throw error;
    }
    throw new RetryError({
      message: `Failed after ${tryNumber} attempts with non-retryable error: '${errorMessage}'`,
      reason: "errorNotRetryable",
      errors: newErrors
    });
  }
}

// core/telemetry/assemble-operation-name.ts
function assembleOperationName({
  operationId,
  telemetry
}) {
  return {
    // standardized operation and resource name:
    "operation.name": `${operationId}${(telemetry == null ? void 0 : telemetry.functionId) != null ? ` ${telemetry.functionId}` : ""}`,
    "resource.name": telemetry == null ? void 0 : telemetry.functionId,
    // detailed, AI SDK specific data:
    "ai.operationId": operationId,
    "ai.telemetry.functionId": telemetry == null ? void 0 : telemetry.functionId
  };
}

// core/telemetry/get-base-telemetry-attributes.ts
function getBaseTelemetryAttributes({
  model,
  settings,
  telemetry,
  headers
}) {
  var _a11;
  return {
    "ai.model.provider": model.provider,
    "ai.model.id": model.modelId,
    // settings:
    ...Object.entries(settings).reduce((attributes, [key, value]) => {
      attributes[`ai.settings.${key}`] = value;
      return attributes;
    }, {}),
    // add metadata as attributes:
    ...Object.entries((_a11 = telemetry == null ? void 0 : telemetry.metadata) != null ? _a11 : {}).reduce(
      (attributes, [key, value]) => {
        attributes[`ai.telemetry.metadata.${key}`] = value;
        return attributes;
      },
      {}
    ),
    // request headers
    ...Object.entries(headers != null ? headers : {}).reduce((attributes, [key, value]) => {
      if (value !== void 0) {
        attributes[`ai.request.headers.${key}`] = value;
      }
      return attributes;
    }, {})
  };
}

// core/telemetry/get-tracer.ts
var import_api = require("@opentelemetry/api");

// core/telemetry/noop-tracer.ts
var noopTracer = {
  startSpan() {
    return noopSpan;
  },
  startActiveSpan(name11, arg1, arg2, arg3) {
    if (typeof arg1 === "function") {
      return arg1(noopSpan);
    }
    if (typeof arg2 === "function") {
      return arg2(noopSpan);
    }
    if (typeof arg3 === "function") {
      return arg3(noopSpan);
    }
  }
};
var noopSpan = {
  spanContext() {
    return noopSpanContext;
  },
  setAttribute() {
    return this;
  },
  setAttributes() {
    return this;
  },
  addEvent() {
    return this;
  },
  addLink() {
    return this;
  },
  addLinks() {
    return this;
  },
  setStatus() {
    return this;
  },
  updateName() {
    return this;
  },
  end() {
    return this;
  },
  isRecording() {
    return false;
  },
  recordException() {
    return this;
  }
};
var noopSpanContext = {
  traceId: "",
  spanId: "",
  traceFlags: 0
};

// core/telemetry/get-tracer.ts
var testTracer = void 0;
function getTracer({ isEnabled }) {
  if (!isEnabled) {
    return noopTracer;
  }
  if (testTracer) {
    return testTracer;
  }
  return import_api.trace.getTracer("ai");
}

// core/telemetry/record-span.ts
var import_api2 = require("@opentelemetry/api");
function recordSpan({
  name: name11,
  tracer,
  attributes,
  fn,
  endWhenDone = true
}) {
  return tracer.startActiveSpan(name11, { attributes }, async (span) => {
    try {
      const result = await fn(span);
      if (endWhenDone) {
        span.end();
      }
      return result;
    } catch (error) {
      try {
        if (error instanceof Error) {
          span.recordException({
            name: error.name,
            message: error.message,
            stack: error.stack
          });
          span.setStatus({
            code: import_api2.SpanStatusCode.ERROR,
            message: error.message
          });
        } else {
          span.setStatus({ code: import_api2.SpanStatusCode.ERROR });
        }
      } finally {
        span.end();
      }
      throw error;
    }
  });
}

// core/telemetry/select-telemetry-attributes.ts
function selectTelemetryAttributes({
  telemetry,
  attributes
}) {
  return Object.entries(attributes).reduce((attributes2, [key, value]) => {
    if (value === void 0) {
      return attributes2;
    }
    if (typeof value === "object" && "input" in value && typeof value.input === "function") {
      if ((telemetry == null ? void 0 : telemetry.recordInputs) === false) {
        return attributes2;
      }
      const result = value.input();
      return result === void 0 ? attributes2 : { ...attributes2, [key]: result };
    }
    if (typeof value === "object" && "output" in value && typeof value.output === "function") {
      if ((telemetry == null ? void 0 : telemetry.recordOutputs) === false) {
        return attributes2;
      }
      const result = value.output();
      return result === void 0 ? attributes2 : { ...attributes2, [key]: result };
    }
    return { ...attributes2, [key]: value };
  }, {});
}

// core/embed/embed.ts
async function embed({
  model,
  value,
  maxRetries,
  abortSignal,
  headers,
  experimental_telemetry: telemetry
}) {
  var _a11;
  const baseTelemetryAttributes = getBaseTelemetryAttributes({
    model,
    telemetry,
    headers,
    settings: { maxRetries }
  });
  const tracer = getTracer({ isEnabled: (_a11 = telemetry == null ? void 0 : telemetry.isEnabled) != null ? _a11 : false });
  return recordSpan({
    name: "ai.embed",
    attributes: selectTelemetryAttributes({
      telemetry,
      attributes: {
        ...assembleOperationName({ operationId: "ai.embed", telemetry }),
        ...baseTelemetryAttributes,
        "ai.value": { input: () => JSON.stringify(value) }
      }
    }),
    tracer,
    fn: async (span) => {
      const retry = retryWithExponentialBackoff({ maxRetries });
      const { embedding, usage, rawResponse } = await retry(
        () => (
          // nested spans to align with the embedMany telemetry data:
          recordSpan({
            name: "ai.embed.doEmbed",
            attributes: selectTelemetryAttributes({
              telemetry,
              attributes: {
                ...assembleOperationName({
                  operationId: "ai.embed.doEmbed",
                  telemetry
                }),
                ...baseTelemetryAttributes,
                // specific settings that only make sense on the outer level:
                "ai.values": { input: () => [JSON.stringify(value)] }
              }
            }),
            tracer,
            fn: async (doEmbedSpan) => {
              var _a12;
              const modelResponse = await model.doEmbed({
                values: [value],
                abortSignal,
                headers
              });
              const embedding2 = modelResponse.embeddings[0];
              const usage2 = (_a12 = modelResponse.usage) != null ? _a12 : { tokens: NaN };
              doEmbedSpan.setAttributes(
                selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    "ai.embeddings": {
                      output: () => modelResponse.embeddings.map(
                        (embedding3) => JSON.stringify(embedding3)
                      )
                    },
                    "ai.usage.tokens": usage2.tokens
                  }
                })
              );
              return {
                embedding: embedding2,
                usage: usage2,
                rawResponse: modelResponse.rawResponse
              };
            }
          })
        )
      );
      span.setAttributes(
        selectTelemetryAttributes({
          telemetry,
          attributes: {
            "ai.embedding": { output: () => JSON.stringify(embedding) },
            "ai.usage.tokens": usage.tokens
          }
        })
      );
      return new DefaultEmbedResult({ value, embedding, usage, rawResponse });
    }
  });
}
var DefaultEmbedResult = class {
  constructor(options) {
    this.value = options.value;
    this.embedding = options.embedding;
    this.usage = options.usage;
    this.rawResponse = options.rawResponse;
  }
};

// core/util/split-array.ts
function splitArray(array, chunkSize) {
  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0");
  }
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

// core/embed/embed-many.ts
async function embedMany({
  model,
  values,
  maxRetries,
  abortSignal,
  headers,
  experimental_telemetry: telemetry
}) {
  var _a11;
  const baseTelemetryAttributes = getBaseTelemetryAttributes({
    model,
    telemetry,
    headers,
    settings: { maxRetries }
  });
  const tracer = getTracer({ isEnabled: (_a11 = telemetry == null ? void 0 : telemetry.isEnabled) != null ? _a11 : false });
  return recordSpan({
    name: "ai.embedMany",
    attributes: selectTelemetryAttributes({
      telemetry,
      attributes: {
        ...assembleOperationName({ operationId: "ai.embedMany", telemetry }),
        ...baseTelemetryAttributes,
        // specific settings that only make sense on the outer level:
        "ai.values": {
          input: () => values.map((value) => JSON.stringify(value))
        }
      }
    }),
    tracer,
    fn: async (span) => {
      const retry = retryWithExponentialBackoff({ maxRetries });
      const maxEmbeddingsPerCall = model.maxEmbeddingsPerCall;
      if (maxEmbeddingsPerCall == null) {
        const { embeddings: embeddings2, usage } = await retry(() => {
          return recordSpan({
            name: "ai.embedMany.doEmbed",
            attributes: selectTelemetryAttributes({
              telemetry,
              attributes: {
                ...assembleOperationName({
                  operationId: "ai.embedMany.doEmbed",
                  telemetry
                }),
                ...baseTelemetryAttributes,
                // specific settings that only make sense on the outer level:
                "ai.values": {
                  input: () => values.map((value) => JSON.stringify(value))
                }
              }
            }),
            tracer,
            fn: async (doEmbedSpan) => {
              var _a12;
              const modelResponse = await model.doEmbed({
                values,
                abortSignal,
                headers
              });
              const embeddings3 = modelResponse.embeddings;
              const usage2 = (_a12 = modelResponse.usage) != null ? _a12 : { tokens: NaN };
              doEmbedSpan.setAttributes(
                selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    "ai.embeddings": {
                      output: () => embeddings3.map((embedding) => JSON.stringify(embedding))
                    },
                    "ai.usage.tokens": usage2.tokens
                  }
                })
              );
              return { embeddings: embeddings3, usage: usage2 };
            }
          });
        });
        span.setAttributes(
          selectTelemetryAttributes({
            telemetry,
            attributes: {
              "ai.embeddings": {
                output: () => embeddings2.map((embedding) => JSON.stringify(embedding))
              },
              "ai.usage.tokens": usage.tokens
            }
          })
        );
        return new DefaultEmbedManyResult({ values, embeddings: embeddings2, usage });
      }
      const valueChunks = splitArray(values, maxEmbeddingsPerCall);
      const embeddings = [];
      let tokens = 0;
      for (const chunk of valueChunks) {
        const { embeddings: responseEmbeddings, usage } = await retry(() => {
          return recordSpan({
            name: "ai.embedMany.doEmbed",
            attributes: selectTelemetryAttributes({
              telemetry,
              attributes: {
                ...assembleOperationName({
                  operationId: "ai.embedMany.doEmbed",
                  telemetry
                }),
                ...baseTelemetryAttributes,
                // specific settings that only make sense on the outer level:
                "ai.values": {
                  input: () => chunk.map((value) => JSON.stringify(value))
                }
              }
            }),
            tracer,
            fn: async (doEmbedSpan) => {
              var _a12;
              const modelResponse = await model.doEmbed({
                values: chunk,
                abortSignal,
                headers
              });
              const embeddings2 = modelResponse.embeddings;
              const usage2 = (_a12 = modelResponse.usage) != null ? _a12 : { tokens: NaN };
              doEmbedSpan.setAttributes(
                selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    "ai.embeddings": {
                      output: () => embeddings2.map((embedding) => JSON.stringify(embedding))
                    },
                    "ai.usage.tokens": usage2.tokens
                  }
                })
              );
              return { embeddings: embeddings2, usage: usage2 };
            }
          });
        });
        embeddings.push(...responseEmbeddings);
        tokens += usage.tokens;
      }
      span.setAttributes(
        selectTelemetryAttributes({
          telemetry,
          attributes: {
            "ai.embeddings": {
              output: () => embeddings.map((embedding) => JSON.stringify(embedding))
            },
            "ai.usage.tokens": tokens
          }
        })
      );
      return new DefaultEmbedManyResult({
        values,
        embeddings,
        usage: { tokens }
      });
    }
  });
}
var DefaultEmbedManyResult = class {
  constructor(options) {
    this.values = options.values;
    this.embeddings = options.embeddings;
    this.usage = options.usage;
  }
};

// core/generate-object/generate-object.ts
var import_provider_utils6 = require("@ai-sdk/provider-utils");

// core/prompt/convert-to-language-model-prompt.ts
var import_provider_utils3 = require("@ai-sdk/provider-utils");

// util/download-error.ts
var import_provider3 = require("@ai-sdk/provider");
var name2 = "AI_DownloadError";
var marker2 = `vercel.ai.error.${name2}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var DownloadError = class extends import_provider3.AISDKError {
  constructor({
    url,
    statusCode,
    statusText,
    cause,
    message = cause == null ? `Failed to download ${url}: ${statusCode} ${statusText}` : `Failed to download ${url}: ${cause}`
  }) {
    super({ name: name2, message, cause });
    this[_a2] = true;
    this.url = url;
    this.statusCode = statusCode;
    this.statusText = statusText;
  }
  static isInstance(error) {
    return import_provider3.AISDKError.hasMarker(error, marker2);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isDownloadError(error) {
    return error instanceof Error && error.name === name2 && typeof error.url === "string" && (error.statusCode == null || typeof error.statusCode === "number") && (error.statusText == null || typeof error.statusText === "string");
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      url: this.url,
      statusCode: this.statusCode,
      statusText: this.statusText,
      cause: this.cause
    };
  }
};
_a2 = symbol2;

// util/download.ts
async function download({
  url,
  fetchImplementation = fetch
}) {
  var _a11;
  const urlText = url.toString();
  try {
    const response = await fetchImplementation(urlText);
    if (!response.ok) {
      throw new DownloadError({
        url: urlText,
        statusCode: response.status,
        statusText: response.statusText
      });
    }
    return {
      data: new Uint8Array(await response.arrayBuffer()),
      mimeType: (_a11 = response.headers.get("content-type")) != null ? _a11 : void 0
    };
  } catch (error) {
    if (DownloadError.isInstance(error)) {
      throw error;
    }
    throw new DownloadError({ url: urlText, cause: error });
  }
}

// core/util/detect-image-mimetype.ts
var mimeTypeSignatures = [
  { mimeType: "image/gif", bytes: [71, 73, 70] },
  { mimeType: "image/png", bytes: [137, 80, 78, 71] },
  { mimeType: "image/jpeg", bytes: [255, 216] },
  { mimeType: "image/webp", bytes: [82, 73, 70, 70] }
];
function detectImageMimeType(image) {
  for (const { bytes, mimeType } of mimeTypeSignatures) {
    if (image.length >= bytes.length && bytes.every((byte, index) => image[index] === byte)) {
      return mimeType;
    }
  }
  return void 0;
}

// core/prompt/data-content.ts
var import_provider_utils2 = require("@ai-sdk/provider-utils");

// core/prompt/invalid-data-content-error.ts
var import_provider4 = require("@ai-sdk/provider");
var name3 = "AI_InvalidDataContentError";
var marker3 = `vercel.ai.error.${name3}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var InvalidDataContentError = class extends import_provider4.AISDKError {
  constructor({
    content,
    cause,
    message = `Invalid data content. Expected a base64 string, Uint8Array, ArrayBuffer, or Buffer, but got ${typeof content}.`
  }) {
    super({ name: name3, message, cause });
    this[_a3] = true;
    this.content = content;
  }
  static isInstance(error) {
    return import_provider4.AISDKError.hasMarker(error, marker3);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isInvalidDataContentError(error) {
    return error instanceof Error && error.name === name3 && error.content != null;
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      cause: this.cause,
      content: this.content
    };
  }
};
_a3 = symbol3;

// core/prompt/data-content.ts
var import_zod = require("zod");
var dataContentSchema = import_zod.z.union([
  import_zod.z.string(),
  import_zod.z.instanceof(Uint8Array),
  import_zod.z.instanceof(ArrayBuffer),
  import_zod.z.custom(
    // Buffer might not be available in some environments such as CloudFlare:
    (value) => {
      var _a11, _b;
      return (_b = (_a11 = globalThis.Buffer) == null ? void 0 : _a11.isBuffer(value)) != null ? _b : false;
    },
    { message: "Must be a Buffer" }
  )
]);
function convertDataContentToUint8Array(content) {
  if (content instanceof Uint8Array) {
    return content;
  }
  if (typeof content === "string") {
    try {
      return (0, import_provider_utils2.convertBase64ToUint8Array)(content);
    } catch (error) {
      throw new InvalidDataContentError({
        message: "Invalid data content. Content string is not a base64-encoded media.",
        content,
        cause: error
      });
    }
  }
  if (content instanceof ArrayBuffer) {
    return new Uint8Array(content);
  }
  throw new InvalidDataContentError({ content });
}
function convertUint8ArrayToText(uint8Array) {
  try {
    return new TextDecoder().decode(uint8Array);
  } catch (error) {
    throw new Error("Error decoding Uint8Array to text");
  }
}

// core/prompt/invalid-message-role-error.ts
var import_provider5 = require("@ai-sdk/provider");
var name4 = "AI_InvalidMessageRoleError";
var marker4 = `vercel.ai.error.${name4}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var InvalidMessageRoleError = class extends import_provider5.AISDKError {
  constructor({
    role,
    message = `Invalid message role: '${role}'. Must be one of: "system", "user", "assistant", "tool".`
  }) {
    super({ name: name4, message });
    this[_a4] = true;
    this.role = role;
  }
  static isInstance(error) {
    return import_provider5.AISDKError.hasMarker(error, marker4);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isInvalidMessageRoleError(error) {
    return error instanceof Error && error.name === name4 && typeof error.role === "string";
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      role: this.role
    };
  }
};
_a4 = symbol4;

// core/prompt/convert-to-language-model-prompt.ts
async function convertToLanguageModelPrompt({
  prompt,
  modelSupportsImageUrls = true,
  downloadImplementation = download
}) {
  const languageModelMessages = [];
  if (prompt.system != null) {
    languageModelMessages.push({ role: "system", content: prompt.system });
  }
  const downloadedImages = modelSupportsImageUrls || prompt.messages == null ? null : await downloadImages(prompt.messages, downloadImplementation);
  const promptType = prompt.type;
  switch (promptType) {
    case "prompt": {
      languageModelMessages.push({
        role: "user",
        content: [{ type: "text", text: prompt.prompt }]
      });
      break;
    }
    case "messages": {
      languageModelMessages.push(
        ...prompt.messages.map(
          (message) => convertToLanguageModelMessage(message, downloadedImages)
        )
      );
      break;
    }
    default: {
      const _exhaustiveCheck = promptType;
      throw new Error(`Unsupported prompt type: ${_exhaustiveCheck}`);
    }
  }
  return languageModelMessages;
}
function convertToLanguageModelMessage(message, downloadedImages) {
  const role = message.role;
  switch (role) {
    case "system": {
      return {
        role: "system",
        content: message.content,
        providerMetadata: message.experimental_providerMetadata
      };
    }
    case "user": {
      if (typeof message.content === "string") {
        return {
          role: "user",
          content: [{ type: "text", text: message.content }],
          providerMetadata: message.experimental_providerMetadata
        };
      }
      return {
        role: "user",
        content: message.content.map((part) => {
          var _a11, _b, _c;
          switch (part.type) {
            case "text": {
              return {
                type: "text",
                text: part.text,
                providerMetadata: part.experimental_providerMetadata
              };
            }
            case "image": {
              if (part.image instanceof URL) {
                if (downloadedImages == null) {
                  return {
                    type: "image",
                    image: part.image,
                    mimeType: part.mimeType,
                    providerMetadata: part.experimental_providerMetadata
                  };
                } else {
                  const downloadedImage = downloadedImages[part.image.toString()];
                  return {
                    type: "image",
                    image: downloadedImage.data,
                    mimeType: (_a11 = part.mimeType) != null ? _a11 : downloadedImage.mimeType,
                    providerMetadata: part.experimental_providerMetadata
                  };
                }
              }
              if (typeof part.image === "string") {
                try {
                  const url = new URL(part.image);
                  switch (url.protocol) {
                    case "http:":
                    case "https:": {
                      if (downloadedImages == null) {
                        return {
                          type: "image",
                          image: url,
                          mimeType: part.mimeType,
                          providerMetadata: part.experimental_providerMetadata
                        };
                      } else {
                        const downloadedImage = downloadedImages[part.image];
                        return {
                          type: "image",
                          image: downloadedImage.data,
                          mimeType: (_b = part.mimeType) != null ? _b : downloadedImage.mimeType,
                          providerMetadata: part.experimental_providerMetadata
                        };
                      }
                    }
                    case "data:": {
                      try {
                        const [header, base64Content] = part.image.split(",");
                        const mimeType = header.split(";")[0].split(":")[1];
                        if (mimeType == null || base64Content == null) {
                          throw new Error("Invalid data URL format");
                        }
                        return {
                          type: "image",
                          image: convertDataContentToUint8Array(base64Content),
                          mimeType,
                          providerMetadata: part.experimental_providerMetadata
                        };
                      } catch (error) {
                        throw new Error(
                          `Error processing data URL: ${(0, import_provider_utils3.getErrorMessage)(
                            message
                          )}`
                        );
                      }
                    }
                    default: {
                      throw new Error(
                        `Unsupported URL protocol: ${url.protocol}`
                      );
                    }
                  }
                } catch (_ignored) {
                }
              }
              const imageUint8 = convertDataContentToUint8Array(part.image);
              return {
                type: "image",
                image: imageUint8,
                mimeType: (_c = part.mimeType) != null ? _c : detectImageMimeType(imageUint8),
                providerMetadata: part.experimental_providerMetadata
              };
            }
          }
        }).filter((part) => part.type !== "text" || part.text !== ""),
        providerMetadata: message.experimental_providerMetadata
      };
    }
    case "assistant": {
      if (typeof message.content === "string") {
        return {
          role: "assistant",
          content: [{ type: "text", text: message.content }],
          providerMetadata: message.experimental_providerMetadata
        };
      }
      return {
        role: "assistant",
        content: message.content.filter(
          // remove empty text parts:
          (part) => part.type !== "text" || part.text !== ""
        ).map((part) => {
          const { experimental_providerMetadata, ...rest } = part;
          return {
            ...rest,
            providerMetadata: experimental_providerMetadata
          };
        }),
        providerMetadata: message.experimental_providerMetadata
      };
    }
    case "tool": {
      return {
        role: "tool",
        content: message.content.map((part) => ({
          type: "tool-result",
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          result: part.result,
          providerMetadata: part.experimental_providerMetadata
        })),
        providerMetadata: message.experimental_providerMetadata
      };
    }
    default: {
      const _exhaustiveCheck = role;
      throw new InvalidMessageRoleError({ role: _exhaustiveCheck });
    }
  }
}
async function downloadImages(messages, downloadImplementation) {
  const urls = messages.filter((message) => message.role === "user").map((message) => message.content).filter(
    (content) => Array.isArray(content)
  ).flat().filter((part) => part.type === "image").map((part) => part.image).map(
    (part) => (
      // support string urls in image parts:
      typeof part === "string" && (part.startsWith("http:") || part.startsWith("https:")) ? new URL(part) : part
    )
  ).filter((image) => image instanceof URL);
  const downloadedImages = await Promise.all(
    urls.map(async (url) => ({
      url,
      data: await downloadImplementation({ url })
    }))
  );
  return Object.fromEntries(
    downloadedImages.map(({ url, data }) => [url.toString(), data])
  );
}

// errors/invalid-argument-error.ts
var import_provider6 = require("@ai-sdk/provider");
var name5 = "AI_InvalidArgumentError";
var marker5 = `vercel.ai.error.${name5}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var InvalidArgumentError = class extends import_provider6.AISDKError {
  constructor({
    parameter,
    value,
    message
  }) {
    super({
      name: name5,
      message: `Invalid argument for parameter ${parameter}: ${message}`
    });
    this[_a5] = true;
    this.parameter = parameter;
    this.value = value;
  }
  static isInstance(error) {
    return import_provider6.AISDKError.hasMarker(error, marker5);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isInvalidArgumentError(error) {
    return error instanceof Error && error.name === name5 && typeof error.parameter === "string" && typeof error.value === "string";
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      parameter: this.parameter,
      value: this.value
    };
  }
};
_a5 = symbol5;

// core/prompt/prepare-call-settings.ts
function prepareCallSettings({
  maxTokens,
  temperature,
  topP,
  presencePenalty,
  frequencyPenalty,
  stopSequences,
  seed,
  maxRetries
}) {
  if (maxTokens != null) {
    if (!Number.isInteger(maxTokens)) {
      throw new InvalidArgumentError({
        parameter: "maxTokens",
        value: maxTokens,
        message: "maxTokens must be an integer"
      });
    }
    if (maxTokens < 1) {
      throw new InvalidArgumentError({
        parameter: "maxTokens",
        value: maxTokens,
        message: "maxTokens must be >= 1"
      });
    }
  }
  if (temperature != null) {
    if (typeof temperature !== "number") {
      throw new InvalidArgumentError({
        parameter: "temperature",
        value: temperature,
        message: "temperature must be a number"
      });
    }
  }
  if (topP != null) {
    if (typeof topP !== "number") {
      throw new InvalidArgumentError({
        parameter: "topP",
        value: topP,
        message: "topP must be a number"
      });
    }
  }
  if (presencePenalty != null) {
    if (typeof presencePenalty !== "number") {
      throw new InvalidArgumentError({
        parameter: "presencePenalty",
        value: presencePenalty,
        message: "presencePenalty must be a number"
      });
    }
  }
  if (frequencyPenalty != null) {
    if (typeof frequencyPenalty !== "number") {
      throw new InvalidArgumentError({
        parameter: "frequencyPenalty",
        value: frequencyPenalty,
        message: "frequencyPenalty must be a number"
      });
    }
  }
  if (seed != null) {
    if (!Number.isInteger(seed)) {
      throw new InvalidArgumentError({
        parameter: "seed",
        value: seed,
        message: "seed must be an integer"
      });
    }
  }
  if (maxRetries != null) {
    if (!Number.isInteger(maxRetries)) {
      throw new InvalidArgumentError({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be an integer"
      });
    }
    if (maxRetries < 0) {
      throw new InvalidArgumentError({
        parameter: "maxRetries",
        value: maxRetries,
        message: "maxRetries must be >= 0"
      });
    }
  }
  return {
    maxTokens,
    temperature: temperature != null ? temperature : 0,
    topP,
    presencePenalty,
    frequencyPenalty,
    stopSequences: stopSequences != null && stopSequences.length > 0 ? stopSequences : void 0,
    seed,
    maxRetries: maxRetries != null ? maxRetries : 2
  };
}

// core/prompt/validate-prompt.ts
var import_provider7 = require("@ai-sdk/provider");
var import_provider_utils4 = require("@ai-sdk/provider-utils");
var import_zod6 = require("zod");

// core/prompt/message.ts
var import_zod5 = require("zod");

// core/types/provider-metadata.ts
var import_zod3 = require("zod");

// core/types/json-value.ts
var import_zod2 = require("zod");
var jsonValueSchema = import_zod2.z.lazy(
  () => import_zod2.z.union([
    import_zod2.z.null(),
    import_zod2.z.string(),
    import_zod2.z.number(),
    import_zod2.z.boolean(),
    import_zod2.z.record(import_zod2.z.string(), jsonValueSchema),
    import_zod2.z.array(jsonValueSchema)
  ])
);

// core/types/provider-metadata.ts
var providerMetadataSchema = import_zod3.z.record(
  import_zod3.z.string(),
  import_zod3.z.record(import_zod3.z.string(), jsonValueSchema)
);

// core/prompt/content-part.ts
var import_zod4 = require("zod");
var textPartSchema = import_zod4.z.object({
  type: import_zod4.z.literal("text"),
  text: import_zod4.z.string(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var imagePartSchema = import_zod4.z.object({
  type: import_zod4.z.literal("image"),
  image: import_zod4.z.union([dataContentSchema, import_zod4.z.instanceof(URL)]),
  mimeType: import_zod4.z.string().optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var toolCallPartSchema = import_zod4.z.object({
  type: import_zod4.z.literal("tool-call"),
  toolCallId: import_zod4.z.string(),
  toolName: import_zod4.z.string(),
  args: import_zod4.z.unknown()
});
var toolResultPartSchema = import_zod4.z.object({
  type: import_zod4.z.literal("tool-result"),
  toolCallId: import_zod4.z.string(),
  toolName: import_zod4.z.string(),
  result: import_zod4.z.unknown(),
  isError: import_zod4.z.boolean().optional(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});

// core/prompt/message.ts
var coreSystemMessageSchema = import_zod5.z.object({
  role: import_zod5.z.literal("system"),
  content: import_zod5.z.string(),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreUserMessageSchema = import_zod5.z.object({
  role: import_zod5.z.literal("user"),
  content: import_zod5.z.union([
    import_zod5.z.string(),
    import_zod5.z.array(import_zod5.z.union([textPartSchema, imagePartSchema]))
  ]),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreAssistantMessageSchema = import_zod5.z.object({
  role: import_zod5.z.literal("assistant"),
  content: import_zod5.z.union([
    import_zod5.z.string(),
    import_zod5.z.array(import_zod5.z.union([textPartSchema, toolCallPartSchema]))
  ]),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreToolMessageSchema = import_zod5.z.object({
  role: import_zod5.z.literal("tool"),
  content: import_zod5.z.array(toolResultPartSchema),
  experimental_providerMetadata: providerMetadataSchema.optional()
});
var coreMessageSchema = import_zod5.z.union([
  coreSystemMessageSchema,
  coreUserMessageSchema,
  coreAssistantMessageSchema,
  coreToolMessageSchema
]);

// core/prompt/validate-prompt.ts
function validatePrompt(prompt) {
  if (prompt.prompt == null && prompt.messages == null) {
    throw new import_provider7.InvalidPromptError({
      prompt,
      message: "prompt or messages must be defined"
    });
  }
  if (prompt.prompt != null && prompt.messages != null) {
    throw new import_provider7.InvalidPromptError({
      prompt,
      message: "prompt and messages cannot be defined at the same time"
    });
  }
  if (prompt.system != null && typeof prompt.system !== "string") {
    throw new import_provider7.InvalidPromptError({
      prompt,
      message: "system must be a string"
    });
  }
  if (prompt.prompt != null) {
    if (typeof prompt.prompt !== "string") {
      throw new import_provider7.InvalidPromptError({
        prompt,
        message: "prompt must be a string"
      });
    }
    return {
      type: "prompt",
      prompt: prompt.prompt,
      messages: void 0,
      system: prompt.system
    };
  }
  if (prompt.messages != null) {
    const validationResult = (0, import_provider_utils4.safeValidateTypes)({
      value: prompt.messages,
      schema: import_zod6.z.array(coreMessageSchema)
    });
    if (!validationResult.success) {
      throw new import_provider7.InvalidPromptError({
        prompt,
        message: "messages must be an array of CoreMessage",
        cause: validationResult.error
      });
    }
    return {
      type: "messages",
      prompt: void 0,
      messages: prompt.messages,
      // only possible case bc of checks above
      system: prompt.system
    };
  }
  throw new Error("unreachable");
}

// core/types/usage.ts
function calculateLanguageModelUsage(usage) {
  return {
    promptTokens: usage.promptTokens,
    completionTokens: usage.completionTokens,
    totalTokens: usage.promptTokens + usage.completionTokens
  };
}

// core/util/prepare-response-headers.ts
function prepareResponseHeaders(init, {
  contentType,
  dataStreamVersion
}) {
  var _a11;
  const headers = new Headers((_a11 = init == null ? void 0 : init.headers) != null ? _a11 : {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", contentType);
  }
  if (dataStreamVersion !== void 0) {
    headers.set("X-Vercel-AI-Data-Stream", dataStreamVersion);
  }
  return headers;
}

// core/generate-object/inject-json-instruction.ts
var DEFAULT_SCHEMA_PREFIX = "JSON schema:";
var DEFAULT_SCHEMA_SUFFIX = "You MUST answer with a JSON object that matches the JSON schema above.";
var DEFAULT_GENERIC_SUFFIX = "You MUST answer with JSON.";
function injectJsonInstruction({
  prompt,
  schema,
  schemaPrefix = schema != null ? DEFAULT_SCHEMA_PREFIX : void 0,
  schemaSuffix = schema != null ? DEFAULT_SCHEMA_SUFFIX : DEFAULT_GENERIC_SUFFIX
}) {
  return [
    prompt != null && prompt.length > 0 ? prompt : void 0,
    prompt != null && prompt.length > 0 ? "" : void 0,
    // add a newline if prompt is not null
    schemaPrefix,
    schema != null ? JSON.stringify(schema) : void 0,
    schemaSuffix
  ].filter((line) => line != null).join("\n");
}

// core/generate-object/no-object-generated-error.ts
var import_provider8 = require("@ai-sdk/provider");
var name6 = "AI_NoObjectGeneratedError";
var marker6 = `vercel.ai.error.${name6}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var NoObjectGeneratedError = class extends import_provider8.AISDKError {
  // used in isInstance
  constructor({ message = "No object generated." } = {}) {
    super({ name: name6, message });
    this[_a6] = true;
  }
  static isInstance(error) {
    return import_provider8.AISDKError.hasMarker(error, marker6);
  }
  /**
   * @deprecated Use isInstance instead.
   */
  static isNoObjectGeneratedError(error) {
    return error instanceof Error && error.name === name6;
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      cause: this.cause,
      message: this.message,
      stack: this.stack
    };
  }
};
_a6 = symbol6;

// core/generate-object/output-strategy.ts
var import_provider9 = require("@ai-sdk/provider");
var import_provider_utils5 = require("@ai-sdk/provider-utils");
var import_ui_utils = require("@ai-sdk/ui-utils");

// core/util/async-iterable-stream.ts
function createAsyncIterableStream(source, transformer) {
  const transformedStream = source.pipeThrough(
    new TransformStream(transformer)
  );
  transformedStream[Symbol.asyncIterator] = () => {
    const reader = transformedStream.getReader();
    return {
      async next() {
        const { done, value } = await reader.read();
        return done ? { done: true, value: void 0 } : { done: false, value };
      }
    };
  };
  return transformedStream;
}

// core/generate-object/output-strategy.ts
var noSchemaOutputStrategy = {
  type: "no-schema",
  jsonSchema: void 0,
  validatePartialResult({ value, textDelta }) {
    return { success: true, value: { partial: value, textDelta } };
  },
  validateFinalResult(value) {
    return value === void 0 ? { success: false, error: new NoObjectGeneratedError() } : { success: true, value };
  },
  createElementStream() {
    throw new import_provider9.UnsupportedFunctionalityError({
      functionality: "element streams in no-schema mode"
    });
  }
};
var objectOutputStrategy = (schema) => ({
  type: "object",
  jsonSchema: schema.jsonSchema,
  validatePartialResult({ value, textDelta }) {
    return {
      success: true,
      value: {
        // Note: currently no validation of partial results:
        partial: value,
        textDelta
      }
    };
  },
  validateFinalResult(value) {
    return (0, import_provider_utils5.safeValidateTypes)({ value, schema });
  },
  createElementStream() {
    throw new import_provider9.UnsupportedFunctionalityError({
      functionality: "element streams in object mode"
    });
  }
});
var arrayOutputStrategy = (schema) => {
  const { $schema, ...itemSchema } = schema.jsonSchema;
  return {
    type: "enum",
    // wrap in object that contains array of elements, since most LLMs will not
    // be able to generate an array directly:
    // possible future optimization: use arrays directly when model supports grammar-guided generation
    jsonSchema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        elements: { type: "array", items: itemSchema }
      },
      required: ["elements"],
      additionalProperties: false
    },
    validatePartialResult({ value, latestObject, isFirstDelta, isFinalDelta }) {
      var _a11;
      if (!(0, import_provider9.isJSONObject)(value) || !(0, import_provider9.isJSONArray)(value.elements)) {
        return {
          success: false,
          error: new import_provider9.TypeValidationError({
            value,
            cause: "value must be an object that contains an array of elements"
          })
        };
      }
      const inputArray = value.elements;
      const resultArray = [];
      for (let i = 0; i < inputArray.length; i++) {
        const element = inputArray[i];
        const result = (0, import_provider_utils5.safeValidateTypes)({ value: element, schema });
        if (i === inputArray.length - 1 && !isFinalDelta) {
          continue;
        }
        if (!result.success) {
          return result;
        }
        resultArray.push(result.value);
      }
      const publishedElementCount = (_a11 = latestObject == null ? void 0 : latestObject.length) != null ? _a11 : 0;
      let textDelta = "";
      if (isFirstDelta) {
        textDelta += "[";
      }
      if (publishedElementCount > 0) {
        textDelta += ",";
      }
      textDelta += resultArray.slice(publishedElementCount).map((element) => JSON.stringify(element)).join(",");
      if (isFinalDelta) {
        textDelta += "]";
      }
      return {
        success: true,
        value: {
          partial: resultArray,
          textDelta
        }
      };
    },
    validateFinalResult(value) {
      if (!(0, import_provider9.isJSONObject)(value) || !(0, import_provider9.isJSONArray)(value.elements)) {
        return {
          success: false,
          error: new import_provider9.TypeValidationError({
            value,
            cause: "value must be an object that contains an array of elements"
          })
        };
      }
      const inputArray = value.elements;
      for (const element of inputArray) {
        const result = (0, import_provider_utils5.safeValidateTypes)({ value: element, schema });
        if (!result.success) {
          return result;
        }
      }
      return { success: true, value: inputArray };
    },
    createElementStream(originalStream) {
      let publishedElements = 0;
      return createAsyncIterableStream(originalStream, {
        transform(chunk, controller) {
          switch (chunk.type) {
            case "object": {
              const array = chunk.object;
              for (; publishedElements < array.length; publishedElements++) {
                controller.enqueue(array[publishedElements]);
              }
              break;
            }
            case "text-delta":
            case "finish":
              break;
            case "error":
              controller.error(chunk.error);
              break;
            default: {
              const _exhaustiveCheck = chunk;
              throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
            }
          }
        }
      });
    }
  };
};
var enumOutputStrategy = (enumValues) => {
  return {
    type: "enum",
    // wrap in object that contains result, since most LLMs will not
    // be able to generate an enum value directly:
    // possible future optimization: use enums directly when model supports top-level enums
    jsonSchema: {
      $schema: "http://json-schema.org/draft-07/schema#",
      type: "object",
      properties: {
        result: { type: "string", enum: enumValues }
      },
      required: ["result"],
      additionalProperties: false
    },
    validateFinalResult(value) {
      if (!(0, import_provider9.isJSONObject)(value) || typeof value.result !== "string") {
        return {
          success: false,
          error: new import_provider9.TypeValidationError({
            value,
            cause: 'value must be an object that contains a string in the "result" property.'
          })
        };
      }
      const result = value.result;
      return enumValues.includes(result) ? { success: true, value: result } : {
        success: false,
        error: new import_provider9.TypeValidationError({
          value,
          cause: "value must be a string in the enum"
        })
      };
    },
    validatePartialResult() {
      throw new import_provider9.UnsupportedFunctionalityError({
        functionality: "partial results in enum mode"
      });
    },
    createElementStream() {
      throw new import_provider9.UnsupportedFunctionalityError({
        functionality: "element streams in enum mode"
      });
    }
  };
};
function getOutputStrategy({
  output,
  schema,
  enumValues
}) {
  switch (output) {
    case "object":
      return objectOutputStrategy((0, import_ui_utils.asSchema)(schema));
    case "array":
      return arrayOutputStrategy((0, import_ui_utils.asSchema)(schema));
    case "enum":
      return enumOutputStrategy(enumValues);
    case "no-schema":
      return noSchemaOutputStrategy;
    default: {
      const _exhaustiveCheck = output;
      throw new Error(`Unsupported output: ${_exhaustiveCheck}`);
    }
  }
}

// core/generate-object/validate-object-generation-input.ts
function validateObjectGenerationInput({
  output,
  mode,
  schema,
  schemaName,
  schemaDescription,
  enumValues
}) {
  if (output != null && output !== "object" && output !== "array" && output !== "enum" && output !== "no-schema") {
    throw new InvalidArgumentError({
      parameter: "output",
      value: output,
      message: "Invalid output type."
    });
  }
  if (output === "no-schema") {
    if (mode === "auto" || mode === "tool") {
      throw new InvalidArgumentError({
        parameter: "mode",
        value: mode,
        message: 'Mode must be "json" for no-schema output.'
      });
    }
    if (schema != null) {
      throw new InvalidArgumentError({
        parameter: "schema",
        value: schema,
        message: "Schema is not supported for no-schema output."
      });
    }
    if (schemaDescription != null) {
      throw new InvalidArgumentError({
        parameter: "schemaDescription",
        value: schemaDescription,
        message: "Schema description is not supported for no-schema output."
      });
    }
    if (schemaName != null) {
      throw new InvalidArgumentError({
        parameter: "schemaName",
        value: schemaName,
        message: "Schema name is not supported for no-schema output."
      });
    }
    if (enumValues != null) {
      throw new InvalidArgumentError({
        parameter: "enumValues",
        value: enumValues,
        message: "Enum values are not supported for no-schema output."
      });
    }
  }
  if (output === "object") {
    if (schema == null) {
      throw new InvalidArgumentError({
        parameter: "schema",
        value: schema,
        message: "Schema is required for object output."
      });
    }
    if (enumValues != null) {
      throw new InvalidArgumentError({
        parameter: "enumValues",
        value: enumValues,
        message: "Enum values are not supported for object output."
      });
    }
  }
  if (output === "array") {
    if (schema == null) {
      throw new InvalidArgumentError({
        parameter: "schema",
        value: schema,
        message: "Element schema is required for array output."
      });
    }
    if (enumValues != null) {
      throw new InvalidArgumentError({
        parameter: "enumValues",
        value: enumValues,
        message: "Enum values are not supported for array output."
      });
    }
  }
  if (output === "enum") {
    if (schema != null) {
      throw new InvalidArgumentError({
        parameter: "schema",
        value: schema,
        message: "Schema is not supported for enum output."
      });
    }
    if (schemaDescription != null) {
      throw new InvalidArgumentError({
        parameter: "schemaDescription",
        value: schemaDescription,
        message: "Schema description is not supported for enum output."
      });
    }
    if (schemaName != null) {
      throw new InvalidArgumentError({
        parameter: "schemaName",
        value: schemaName,
        message: "Schema name is not supported for enum output."
      });
    }
    if (enumValues == null) {
      throw new InvalidArgumentError({
        parameter: "enumValues",
        value: enumValues,
        message: "Enum values are required for enum output."
      });
    }
    for (const value of enumValues) {
      if (typeof value !== "string") {
        throw new InvalidArgumentError({
          parameter: "enumValues",
          value,
          message: "Enum values must be strings."
        });
      }
    }
  }
}

// core/generate-object/generate-object.ts
var originalGenerateId = (0, import_provider_utils6.createIdGenerator)({ prefix: "aiobj-", length: 24 });
async function generateObject({
  model,
  enum: enumValues,
  // rename bc enum is reserved by typescript
  schema: inputSchema,
  schemaName,
  schemaDescription,
  mode,
  output = "object",
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  headers,
  experimental_telemetry: telemetry,
  experimental_providerMetadata: providerMetadata,
  _internal: {
    generateId: generateId3 = originalGenerateId,
    currentDate = () => /* @__PURE__ */ new Date()
  } = {},
  ...settings
}) {
  var _a11;
  validateObjectGenerationInput({
    output,
    mode,
    schema: inputSchema,
    schemaName,
    schemaDescription,
    enumValues
  });
  const outputStrategy = getOutputStrategy({
    output,
    schema: inputSchema,
    enumValues
  });
  if (outputStrategy.type === "no-schema" && mode === void 0) {
    mode = "json";
  }
  const baseTelemetryAttributes = getBaseTelemetryAttributes({
    model,
    telemetry,
    headers,
    settings: { ...settings, maxRetries }
  });
  const tracer = getTracer({ isEnabled: (_a11 = telemetry == null ? void 0 : telemetry.isEnabled) != null ? _a11 : false });
  return recordSpan({
    name: "ai.generateObject",
    attributes: selectTelemetryAttributes({
      telemetry,
      attributes: {
        ...assembleOperationName({
          operationId: "ai.generateObject",
          telemetry
        }),
        ...baseTelemetryAttributes,
        // specific settings that only make sense on the outer level:
        "ai.prompt": {
          input: () => JSON.stringify({ system, prompt, messages })
        },
        "ai.schema": outputStrategy.jsonSchema != null ? { input: () => JSON.stringify(outputStrategy.jsonSchema) } : void 0,
        "ai.schema.name": schemaName,
        "ai.schema.description": schemaDescription,
        "ai.settings.output": outputStrategy.type,
        "ai.settings.mode": mode
      }
    }),
    tracer,
    fn: async (span) => {
      const retry = retryWithExponentialBackoff({ maxRetries });
      if (mode === "auto" || mode == null) {
        mode = model.defaultObjectGenerationMode;
      }
      let result;
      let finishReason;
      let usage;
      let warnings;
      let rawResponse;
      let response;
      let logprobs;
      let resultProviderMetadata;
      switch (mode) {
        case "json": {
          const validatedPrompt = validatePrompt({
            system: outputStrategy.jsonSchema == null ? injectJsonInstruction({ prompt: system }) : model.supportsStructuredOutputs ? system : injectJsonInstruction({
              prompt: system,
              schema: outputStrategy.jsonSchema
            }),
            prompt,
            messages
          });
          const promptMessages = await convertToLanguageModelPrompt({
            prompt: validatedPrompt,
            modelSupportsImageUrls: model.supportsImageUrls
          });
          const inputFormat = validatedPrompt.type;
          const generateResult = await retry(
            () => recordSpan({
              name: "ai.generateObject.doGenerate",
              attributes: selectTelemetryAttributes({
                telemetry,
                attributes: {
                  ...assembleOperationName({
                    operationId: "ai.generateObject.doGenerate",
                    telemetry
                  }),
                  ...baseTelemetryAttributes,
                  "ai.prompt.format": {
                    input: () => inputFormat
                  },
                  "ai.prompt.messages": {
                    input: () => JSON.stringify(promptMessages)
                  },
                  "ai.settings.mode": mode,
                  // standardized gen-ai llm span attributes:
                  "gen_ai.system": model.provider,
                  "gen_ai.request.model": model.modelId,
                  "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                  "gen_ai.request.max_tokens": settings.maxTokens,
                  "gen_ai.request.presence_penalty": settings.presencePenalty,
                  "gen_ai.request.temperature": settings.temperature,
                  "gen_ai.request.top_k": settings.topK,
                  "gen_ai.request.top_p": settings.topP
                }
              }),
              tracer,
              fn: async (span2) => {
                var _a12, _b, _c, _d, _e, _f;
                const result2 = await model.doGenerate({
                  mode: {
                    type: "object-json",
                    schema: outputStrategy.jsonSchema,
                    name: schemaName,
                    description: schemaDescription
                  },
                  ...prepareCallSettings(settings),
                  inputFormat,
                  prompt: promptMessages,
                  providerMetadata,
                  abortSignal,
                  headers
                });
                if (result2.text === void 0) {
                  throw new NoObjectGeneratedError();
                }
                const responseData = {
                  id: (_b = (_a12 = result2.response) == null ? void 0 : _a12.id) != null ? _b : generateId3(),
                  timestamp: (_d = (_c = result2.response) == null ? void 0 : _c.timestamp) != null ? _d : currentDate(),
                  modelId: (_f = (_e = result2.response) == null ? void 0 : _e.modelId) != null ? _f : model.modelId
                };
                span2.setAttributes(
                  selectTelemetryAttributes({
                    telemetry,
                    attributes: {
                      "ai.response.finishReason": result2.finishReason,
                      "ai.response.object": { output: () => result2.text },
                      "ai.response.id": responseData.id,
                      "ai.response.model": responseData.modelId,
                      "ai.response.timestamp": responseData.timestamp.toISOString(),
                      "ai.usage.promptTokens": result2.usage.promptTokens,
                      "ai.usage.completionTokens": result2.usage.completionTokens,
                      // deprecated:
                      "ai.finishReason": result2.finishReason,
                      "ai.result.object": { output: () => result2.text },
                      // standardized gen-ai llm span attributes:
                      "gen_ai.response.finish_reasons": [result2.finishReason],
                      "gen_ai.response.id": responseData.id,
                      "gen_ai.response.model": responseData.modelId,
                      "gen_ai.usage.prompt_tokens": result2.usage.promptTokens,
                      "gen_ai.usage.completion_tokens": result2.usage.completionTokens
                    }
                  })
                );
                return { ...result2, objectText: result2.text, responseData };
              }
            })
          );
          result = generateResult.objectText;
          finishReason = generateResult.finishReason;
          usage = generateResult.usage;
          warnings = generateResult.warnings;
          rawResponse = generateResult.rawResponse;
          logprobs = generateResult.logprobs;
          resultProviderMetadata = generateResult.providerMetadata;
          response = generateResult.responseData;
          break;
        }
        case "tool": {
          const validatedPrompt = validatePrompt({
            system,
            prompt,
            messages
          });
          const promptMessages = await convertToLanguageModelPrompt({
            prompt: validatedPrompt,
            modelSupportsImageUrls: model.supportsImageUrls
          });
          const inputFormat = validatedPrompt.type;
          const generateResult = await retry(
            () => recordSpan({
              name: "ai.generateObject.doGenerate",
              attributes: selectTelemetryAttributes({
                telemetry,
                attributes: {
                  ...assembleOperationName({
                    operationId: "ai.generateObject.doGenerate",
                    telemetry
                  }),
                  ...baseTelemetryAttributes,
                  "ai.prompt.format": {
                    input: () => inputFormat
                  },
                  "ai.prompt.messages": {
                    input: () => JSON.stringify(promptMessages)
                  },
                  "ai.settings.mode": mode,
                  // standardized gen-ai llm span attributes:
                  "gen_ai.system": model.provider,
                  "gen_ai.request.model": model.modelId,
                  "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                  "gen_ai.request.max_tokens": settings.maxTokens,
                  "gen_ai.request.presence_penalty": settings.presencePenalty,
                  "gen_ai.request.temperature": settings.temperature,
                  "gen_ai.request.top_k": settings.topK,
                  "gen_ai.request.top_p": settings.topP
                }
              }),
              tracer,
              fn: async (span2) => {
                var _a12, _b, _c, _d, _e, _f, _g, _h;
                const result2 = await model.doGenerate({
                  mode: {
                    type: "object-tool",
                    tool: {
                      type: "function",
                      name: schemaName != null ? schemaName : "json",
                      description: schemaDescription != null ? schemaDescription : "Respond with a JSON object.",
                      parameters: outputStrategy.jsonSchema
                    }
                  },
                  ...prepareCallSettings(settings),
                  inputFormat,
                  prompt: promptMessages,
                  providerMetadata,
                  abortSignal,
                  headers
                });
                const objectText = (_b = (_a12 = result2.toolCalls) == null ? void 0 : _a12[0]) == null ? void 0 : _b.args;
                if (objectText === void 0) {
                  throw new NoObjectGeneratedError();
                }
                const responseData = {
                  id: (_d = (_c = result2.response) == null ? void 0 : _c.id) != null ? _d : generateId3(),
                  timestamp: (_f = (_e = result2.response) == null ? void 0 : _e.timestamp) != null ? _f : currentDate(),
                  modelId: (_h = (_g = result2.response) == null ? void 0 : _g.modelId) != null ? _h : model.modelId
                };
                span2.setAttributes(
                  selectTelemetryAttributes({
                    telemetry,
                    attributes: {
                      "ai.response.finishReason": result2.finishReason,
                      "ai.response.object": { output: () => objectText },
                      "ai.response.id": responseData.id,
                      "ai.response.model": responseData.modelId,
                      "ai.response.timestamp": responseData.timestamp.toISOString(),
                      "ai.usage.promptTokens": result2.usage.promptTokens,
                      "ai.usage.completionTokens": result2.usage.completionTokens,
                      // deprecated:
                      "ai.finishReason": result2.finishReason,
                      "ai.result.object": { output: () => objectText },
                      // standardized gen-ai llm span attributes:
                      "gen_ai.response.finish_reasons": [result2.finishReason],
                      "gen_ai.response.id": responseData.id,
                      "gen_ai.response.model": responseData.modelId,
                      "gen_ai.usage.input_tokens": result2.usage.promptTokens,
                      "gen_ai.usage.output_tokens": result2.usage.completionTokens
                    }
                  })
                );
                return { ...result2, objectText, responseData };
              }
            })
          );
          result = generateResult.objectText;
          finishReason = generateResult.finishReason;
          usage = generateResult.usage;
          warnings = generateResult.warnings;
          rawResponse = generateResult.rawResponse;
          logprobs = generateResult.logprobs;
          resultProviderMetadata = generateResult.providerMetadata;
          response = generateResult.responseData;
          break;
        }
        case void 0: {
          throw new Error(
            "Model does not have a default object generation mode."
          );
        }
        default: {
          const _exhaustiveCheck = mode;
          throw new Error(`Unsupported mode: ${_exhaustiveCheck}`);
        }
      }
      const parseResult = (0, import_provider_utils6.safeParseJSON)({ text: result });
      if (!parseResult.success) {
        throw parseResult.error;
      }
      const validationResult = outputStrategy.validateFinalResult(
        parseResult.value
      );
      if (!validationResult.success) {
        throw validationResult.error;
      }
      span.setAttributes(
        selectTelemetryAttributes({
          telemetry,
          attributes: {
            "ai.response.finishReason": finishReason,
            "ai.response.object": {
              output: () => JSON.stringify(validationResult.value)
            },
            "ai.usage.promptTokens": usage.promptTokens,
            "ai.usage.completionTokens": usage.completionTokens,
            // deprecated:
            "ai.finishReason": finishReason,
            "ai.result.object": {
              output: () => JSON.stringify(validationResult.value)
            }
          }
        })
      );
      return new DefaultGenerateObjectResult({
        object: validationResult.value,
        finishReason,
        usage: calculateLanguageModelUsage(usage),
        warnings,
        response: {
          ...response,
          headers: rawResponse == null ? void 0 : rawResponse.headers
        },
        logprobs,
        providerMetadata: resultProviderMetadata
      });
    }
  });
}
var DefaultGenerateObjectResult = class {
  constructor(options) {
    this.object = options.object;
    this.finishReason = options.finishReason;
    this.usage = options.usage;
    this.warnings = options.warnings;
    this.experimental_providerMetadata = options.providerMetadata;
    this.response = options.response;
    this.rawResponse = {
      headers: options.response.headers
    };
    this.logprobs = options.logprobs;
  }
  toJsonResponse(init) {
    var _a11;
    return new Response(JSON.stringify(this.object), {
      status: (_a11 = init == null ? void 0 : init.status) != null ? _a11 : 200,
      headers: prepareResponseHeaders(init, {
        contentType: "application/json; charset=utf-8"
      })
    });
  }
};
var experimental_generateObject = generateObject;

// core/generate-object/stream-object.ts
var import_ui_utils2 = require("@ai-sdk/ui-utils");

// util/create-resolvable-promise.ts
function createResolvablePromise() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve,
    reject
  };
}

// util/delayed-promise.ts
var DelayedPromise = class {
  constructor() {
    this.status = { type: "pending" };
    this._resolve = void 0;
    this._reject = void 0;
  }
  get value() {
    if (this.promise) {
      return this.promise;
    }
    this.promise = new Promise((resolve, reject) => {
      if (this.status.type === "resolved") {
        resolve(this.status.value);
      } else if (this.status.type === "rejected") {
        reject(this.status.error);
      }
      this._resolve = resolve;
      this._reject = reject;
    });
    return this.promise;
  }
  resolve(value) {
    var _a11;
    this.status = { type: "resolved", value };
    if (this.promise) {
      (_a11 = this._resolve) == null ? void 0 : _a11.call(this, value);
    }
  }
  reject(error) {
    var _a11;
    this.status = { type: "rejected", error };
    if (this.promise) {
      (_a11 = this._reject) == null ? void 0 : _a11.call(this, error);
    }
  }
};

// core/util/now.ts
function now() {
  var _a11, _b;
  return (_b = (_a11 = globalThis == null ? void 0 : globalThis.performance) == null ? void 0 : _a11.now()) != null ? _b : Date.now();
}

// core/generate-object/stream-object.ts
var import_provider_utils7 = require("@ai-sdk/provider-utils");

// core/util/prepare-outgoing-http-headers.ts
function prepareOutgoingHttpHeaders(init, {
  contentType,
  dataStreamVersion
}) {
  const headers = {};
  if ((init == null ? void 0 : init.headers) != null) {
    for (const [key, value] of Object.entries(init.headers)) {
      headers[key] = value;
    }
  }
  if (headers["Content-Type"] == null) {
    headers["Content-Type"] = contentType;
  }
  if (dataStreamVersion !== void 0) {
    headers["X-Vercel-AI-Data-Stream"] = dataStreamVersion;
  }
  return headers;
}

// core/util/write-to-server-response.ts
function writeToServerResponse({
  response,
  status,
  statusText,
  headers,
  stream
}) {
  response.writeHead(status != null ? status : 200, statusText, headers);
  const reader = stream.getReader();
  const read = async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done)
          break;
        response.write(value);
      }
    } catch (error) {
      throw error;
    } finally {
      response.end();
    }
  };
  read();
}

// core/generate-object/stream-object.ts
var originalGenerateId2 = (0, import_provider_utils7.createIdGenerator)({ prefix: "aiobj-", length: 24 });
async function streamObject({
  model,
  schema: inputSchema,
  schemaName,
  schemaDescription,
  mode,
  output = "object",
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  headers,
  experimental_telemetry: telemetry,
  experimental_providerMetadata: providerMetadata,
  onFinish,
  _internal: {
    generateId: generateId3 = originalGenerateId2,
    currentDate = () => /* @__PURE__ */ new Date(),
    now: now2 = now
  } = {},
  ...settings
}) {
  var _a11;
  validateObjectGenerationInput({
    output,
    mode,
    schema: inputSchema,
    schemaName,
    schemaDescription
  });
  const outputStrategy = getOutputStrategy({ output, schema: inputSchema });
  if (outputStrategy.type === "no-schema" && mode === void 0) {
    mode = "json";
  }
  const baseTelemetryAttributes = getBaseTelemetryAttributes({
    model,
    telemetry,
    headers,
    settings: { ...settings, maxRetries }
  });
  const tracer = getTracer({ isEnabled: (_a11 = telemetry == null ? void 0 : telemetry.isEnabled) != null ? _a11 : false });
  const retry = retryWithExponentialBackoff({ maxRetries });
  return recordSpan({
    name: "ai.streamObject",
    attributes: selectTelemetryAttributes({
      telemetry,
      attributes: {
        ...assembleOperationName({
          operationId: "ai.streamObject",
          telemetry
        }),
        ...baseTelemetryAttributes,
        // specific settings that only make sense on the outer level:
        "ai.prompt": {
          input: () => JSON.stringify({ system, prompt, messages })
        },
        "ai.schema": outputStrategy.jsonSchema != null ? { input: () => JSON.stringify(outputStrategy.jsonSchema) } : void 0,
        "ai.schema.name": schemaName,
        "ai.schema.description": schemaDescription,
        "ai.settings.output": outputStrategy.type,
        "ai.settings.mode": mode
      }
    }),
    tracer,
    endWhenDone: false,
    fn: async (rootSpan) => {
      if (mode === "auto" || mode == null) {
        mode = model.defaultObjectGenerationMode;
      }
      let callOptions;
      let transformer;
      switch (mode) {
        case "json": {
          const validatedPrompt = validatePrompt({
            system: outputStrategy.jsonSchema == null ? injectJsonInstruction({ prompt: system }) : model.supportsStructuredOutputs ? system : injectJsonInstruction({
              prompt: system,
              schema: outputStrategy.jsonSchema
            }),
            prompt,
            messages
          });
          callOptions = {
            mode: {
              type: "object-json",
              schema: outputStrategy.jsonSchema,
              name: schemaName,
              description: schemaDescription
            },
            ...prepareCallSettings(settings),
            inputFormat: validatedPrompt.type,
            prompt: await convertToLanguageModelPrompt({
              prompt: validatedPrompt,
              modelSupportsImageUrls: model.supportsImageUrls
            }),
            providerMetadata,
            abortSignal,
            headers
          };
          transformer = {
            transform: (chunk, controller) => {
              switch (chunk.type) {
                case "text-delta":
                  controller.enqueue(chunk.textDelta);
                  break;
                case "response-metadata":
                case "finish":
                case "error":
                  controller.enqueue(chunk);
                  break;
              }
            }
          };
          break;
        }
        case "tool": {
          const validatedPrompt = validatePrompt({
            system,
            prompt,
            messages
          });
          callOptions = {
            mode: {
              type: "object-tool",
              tool: {
                type: "function",
                name: schemaName != null ? schemaName : "json",
                description: schemaDescription != null ? schemaDescription : "Respond with a JSON object.",
                parameters: outputStrategy.jsonSchema
              }
            },
            ...prepareCallSettings(settings),
            inputFormat: validatedPrompt.type,
            prompt: await convertToLanguageModelPrompt({
              prompt: validatedPrompt,
              modelSupportsImageUrls: model.supportsImageUrls
            }),
            providerMetadata,
            abortSignal,
            headers
          };
          transformer = {
            transform(chunk, controller) {
              switch (chunk.type) {
                case "tool-call-delta":
                  controller.enqueue(chunk.argsTextDelta);
                  break;
                case "response-metadata":
                case "finish":
                case "error":
                  controller.enqueue(chunk);
                  break;
              }
            }
          };
          break;
        }
        case void 0: {
          throw new Error(
            "Model does not have a default object generation mode."
          );
        }
        default: {
          const _exhaustiveCheck = mode;
          throw new Error(`Unsupported mode: ${_exhaustiveCheck}`);
        }
      }
      const {
        result: { stream, warnings, rawResponse },
        doStreamSpan,
        startTimestampMs
      } = await retry(
        () => recordSpan({
          name: "ai.streamObject.doStream",
          attributes: selectTelemetryAttributes({
            telemetry,
            attributes: {
              ...assembleOperationName({
                operationId: "ai.streamObject.doStream",
                telemetry
              }),
              ...baseTelemetryAttributes,
              "ai.prompt.format": {
                input: () => callOptions.inputFormat
              },
              "ai.prompt.messages": {
                input: () => JSON.stringify(callOptions.prompt)
              },
              "ai.settings.mode": mode,
              // standardized gen-ai llm span attributes:
              "gen_ai.system": model.provider,
              "gen_ai.request.model": model.modelId,
              "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
              "gen_ai.request.max_tokens": settings.maxTokens,
              "gen_ai.request.presence_penalty": settings.presencePenalty,
              "gen_ai.request.temperature": settings.temperature,
              "gen_ai.request.top_k": settings.topK,
              "gen_ai.request.top_p": settings.topP
            }
          }),
          tracer,
          endWhenDone: false,
          fn: async (doStreamSpan2) => ({
            startTimestampMs: now2(),
            doStreamSpan: doStreamSpan2,
            result: await model.doStream(callOptions)
          })
        })
      );
      return new DefaultStreamObjectResult({
        outputStrategy,
        stream: stream.pipeThrough(new TransformStream(transformer)),
        warnings,
        rawResponse,
        onFinish,
        rootSpan,
        doStreamSpan,
        telemetry,
        startTimestampMs,
        modelId: model.modelId,
        now: now2,
        currentDate,
        generateId: generateId3
      });
    }
  });
}
var DefaultStreamObjectResult = class {
  constructor({
    stream,
    warnings,
    rawResponse,
    outputStrategy,
    onFinish,
    rootSpan,
    doStreamSpan,
    telemetry,
    startTimestampMs,
    modelId,
    now: now2,
    currentDate,
    generateId: generateId3
  }) {
    this.warnings = warnings;
    this.rawResponse = rawResponse;
    this.outputStrategy = outputStrategy;
    this.objectPromise = new DelayedPromise();
    const { resolve: resolveUsage, promise: usagePromise } = createResolvablePromise();
    this.usage = usagePromise;
    const { resolve: resolveResponse, promise: responsePromise } = createResolvablePromise();
    this.response = responsePromise;
    const {
      resolve: resolveProviderMetadata,
      promise: providerMetadataPromise
    } = createResolvablePromise();
    this.experimental_providerMetadata = providerMetadataPromise;
    let usage;
    let finishReason;
    let providerMetadata;
    let object;
    let error;
    let accumulatedText = "";
    let textDelta = "";
    let response = {
      id: generateId3(),
      timestamp: currentDate(),
      modelId
    };
    let latestObjectJson = void 0;
    let latestObject = void 0;
    let isFirstChunk = true;
    let isFirstDelta = true;
    const self = this;
    this.originalStream = stream.pipeThrough(
      new TransformStream({
        async transform(chunk, controller) {
          var _a11, _b, _c;
          if (isFirstChunk) {
            const msToFirstChunk = now2() - startTimestampMs;
            isFirstChunk = false;
            doStreamSpan.addEvent("ai.stream.firstChunk", {
              "ai.stream.msToFirstChunk": msToFirstChunk
            });
            doStreamSpan.setAttributes({
              "ai.stream.msToFirstChunk": msToFirstChunk
            });
          }
          if (typeof chunk === "string") {
            accumulatedText += chunk;
            textDelta += chunk;
            const { value: currentObjectJson, state: parseState } = (0, import_ui_utils2.parsePartialJson)(accumulatedText);
            if (currentObjectJson !== void 0 && !(0, import_ui_utils2.isDeepEqualData)(latestObjectJson, currentObjectJson)) {
              const validationResult = outputStrategy.validatePartialResult({
                value: currentObjectJson,
                textDelta,
                latestObject,
                isFirstDelta,
                isFinalDelta: parseState === "successful-parse"
              });
              if (validationResult.success && !(0, import_ui_utils2.isDeepEqualData)(latestObject, validationResult.value.partial)) {
                latestObjectJson = currentObjectJson;
                latestObject = validationResult.value.partial;
                controller.enqueue({
                  type: "object",
                  object: latestObject
                });
                controller.enqueue({
                  type: "text-delta",
                  textDelta: validationResult.value.textDelta
                });
                textDelta = "";
                isFirstDelta = false;
              }
            }
            return;
          }
          switch (chunk.type) {
            case "response-metadata": {
              response = {
                id: (_a11 = chunk.id) != null ? _a11 : response.id,
                timestamp: (_b = chunk.timestamp) != null ? _b : response.timestamp,
                modelId: (_c = chunk.modelId) != null ? _c : response.modelId
              };
              break;
            }
            case "finish": {
              if (textDelta !== "") {
                controller.enqueue({ type: "text-delta", textDelta });
              }
              finishReason = chunk.finishReason;
              usage = calculateLanguageModelUsage(chunk.usage);
              providerMetadata = chunk.providerMetadata;
              controller.enqueue({ ...chunk, usage, response });
              resolveUsage(usage);
              resolveProviderMetadata(providerMetadata);
              resolveResponse({
                ...response,
                headers: rawResponse == null ? void 0 : rawResponse.headers
              });
              const validationResult = outputStrategy.validateFinalResult(latestObjectJson);
              if (validationResult.success) {
                object = validationResult.value;
                self.objectPromise.resolve(object);
              } else {
                error = validationResult.error;
                self.objectPromise.reject(error);
              }
              break;
            }
            default: {
              controller.enqueue(chunk);
              break;
            }
          }
        },
        // invoke onFinish callback and resolve toolResults promise when the stream is about to close:
        async flush(controller) {
          try {
            const finalUsage = usage != null ? usage : {
              promptTokens: NaN,
              completionTokens: NaN,
              totalTokens: NaN
            };
            doStreamSpan.setAttributes(
              selectTelemetryAttributes({
                telemetry,
                attributes: {
                  "ai.response.finishReason": finishReason,
                  "ai.response.object": {
                    output: () => JSON.stringify(object)
                  },
                  "ai.response.id": response.id,
                  "ai.response.model": response.modelId,
                  "ai.response.timestamp": response.timestamp.toISOString(),
                  "ai.usage.promptTokens": finalUsage.promptTokens,
                  "ai.usage.completionTokens": finalUsage.completionTokens,
                  // deprecated
                  "ai.finishReason": finishReason,
                  "ai.result.object": { output: () => JSON.stringify(object) },
                  // standardized gen-ai llm span attributes:
                  "gen_ai.response.finish_reasons": [finishReason],
                  "gen_ai.response.id": response.id,
                  "gen_ai.response.model": response.modelId,
                  "gen_ai.usage.input_tokens": finalUsage.promptTokens,
                  "gen_ai.usage.output_tokens": finalUsage.completionTokens
                }
              })
            );
            doStreamSpan.end();
            rootSpan.setAttributes(
              selectTelemetryAttributes({
                telemetry,
                attributes: {
                  "ai.usage.promptTokens": finalUsage.promptTokens,
                  "ai.usage.completionTokens": finalUsage.completionTokens,
                  "ai.response.object": {
                    output: () => JSON.stringify(object)
                  },
                  // deprecated
                  "ai.result.object": { output: () => JSON.stringify(object) }
                }
              })
            );
            await (onFinish == null ? void 0 : onFinish({
              usage: finalUsage,
              object,
              error,
              rawResponse,
              response: {
                ...response,
                headers: rawResponse == null ? void 0 : rawResponse.headers
              },
              warnings,
              experimental_providerMetadata: providerMetadata
            }));
          } catch (error2) {
            controller.error(error2);
          } finally {
            rootSpan.end();
          }
        }
      })
    );
  }
  get object() {
    return this.objectPromise.value;
  }
  get partialObjectStream() {
    return createAsyncIterableStream(this.originalStream, {
      transform(chunk, controller) {
        switch (chunk.type) {
          case "object":
            controller.enqueue(chunk.object);
            break;
          case "text-delta":
          case "finish":
            break;
          case "error":
            controller.error(chunk.error);
            break;
          default: {
            const _exhaustiveCheck = chunk;
            throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
          }
        }
      }
    });
  }
  get elementStream() {
    return this.outputStrategy.createElementStream(this.originalStream);
  }
  get textStream() {
    return createAsyncIterableStream(this.originalStream, {
      transform(chunk, controller) {
        switch (chunk.type) {
          case "text-delta":
            controller.enqueue(chunk.textDelta);
            break;
          case "object":
          case "finish":
            break;
          case "error":
            controller.error(chunk.error);
            break;
          default: {
            const _exhaustiveCheck = chunk;
            throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
          }
        }
      }
    });
  }
  get fullStream() {
    return createAsyncIterableStream(this.originalStream, {
      transform(chunk, controller) {
        controller.enqueue(chunk);
      }
    });
  }
  pipeTextStreamToResponse(response, init) {
    writeToServerResponse({
      response,
      status: init == null ? void 0 : init.status,
      statusText: init == null ? void 0 : init.statusText,
      headers: prepareOutgoingHttpHeaders(init, {
        contentType: "text/plain; charset=utf-8"
      }),
      stream: this.textStream.pipeThrough(new TextEncoderStream())
    });
  }
  toTextStreamResponse(init) {
    var _a11;
    return new Response(this.textStream.pipeThrough(new TextEncoderStream()), {
      status: (_a11 = init == null ? void 0 : init.status) != null ? _a11 : 200,
      headers: prepareResponseHeaders(init, {
        contentType: "text/plain; charset=utf-8"
      })
    });
  }
};
var experimental_streamObject = streamObject;

// core/generate-text/generate-text.ts
var import_provider_utils9 = require("@ai-sdk/provider-utils");

// core/prompt/prepare-tools-and-tool-choice.ts
var import_ui_utils3 = require("@ai-sdk/ui-utils");

// core/util/is-non-empty-object.ts
function isNonEmptyObject(object) {
  return object != null && Object.keys(object).length > 0;
}

// core/prompt/prepare-tools-and-tool-choice.ts
function prepareToolsAndToolChoice({
  tools,
  toolChoice
}) {
  if (!isNonEmptyObject(tools)) {
    return {
      tools: void 0,
      toolChoice: void 0
    };
  }
  return {
    tools: Object.entries(tools).map(([name11, tool2]) => ({
      type: "function",
      name: name11,
      description: tool2.description,
      parameters: (0, import_ui_utils3.asSchema)(tool2.parameters).jsonSchema
    })),
    toolChoice: toolChoice == null ? { type: "auto" } : typeof toolChoice === "string" ? { type: toolChoice } : { type: "tool", toolName: toolChoice.toolName }
  };
}

// core/generate-text/to-response-messages.ts
function toResponseMessages({
  text = "",
  toolCalls,
  toolResults
}) {
  const responseMessages = [];
  responseMessages.push({
    role: "assistant",
    content: [{ type: "text", text }, ...toolCalls]
  });
  if (toolResults.length > 0) {
    responseMessages.push({
      role: "tool",
      content: toolResults.map((result) => ({
        type: "tool-result",
        toolCallId: result.toolCallId,
        toolName: result.toolName,
        result: result.result
      }))
    });
  }
  return responseMessages;
}

// core/generate-text/tool-call.ts
var import_provider_utils8 = require("@ai-sdk/provider-utils");
var import_ui_utils4 = require("@ai-sdk/ui-utils");

// errors/invalid-tool-arguments-error.ts
var import_provider10 = require("@ai-sdk/provider");
var name7 = "AI_InvalidToolArgumentsError";
var marker7 = `vercel.ai.error.${name7}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var InvalidToolArgumentsError = class extends import_provider10.AISDKError {
  constructor({
    toolArgs,
    toolName,
    cause,
    message = `Invalid arguments for tool ${toolName}: ${(0, import_provider10.getErrorMessage)(
      cause
    )}`
  }) {
    super({ name: name7, message, cause });
    this[_a7] = true;
    this.toolArgs = toolArgs;
    this.toolName = toolName;
  }
  static isInstance(error) {
    return import_provider10.AISDKError.hasMarker(error, marker7);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isInvalidToolArgumentsError(error) {
    return error instanceof Error && error.name === name7 && typeof error.toolName === "string" && typeof error.toolArgs === "string";
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      toolName: this.toolName,
      toolArgs: this.toolArgs
    };
  }
};
_a7 = symbol7;

// errors/no-such-tool-error.ts
var import_provider11 = require("@ai-sdk/provider");
var name8 = "AI_NoSuchToolError";
var marker8 = `vercel.ai.error.${name8}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var NoSuchToolError = class extends import_provider11.AISDKError {
  constructor({
    toolName,
    availableTools = void 0,
    message = `Model tried to call unavailable tool '${toolName}'. ${availableTools === void 0 ? "No tools are available." : `Available tools: ${availableTools.join(", ")}.`}`
  }) {
    super({ name: name8, message });
    this[_a8] = true;
    this.toolName = toolName;
    this.availableTools = availableTools;
  }
  static isInstance(error) {
    return import_provider11.AISDKError.hasMarker(error, marker8);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isNoSuchToolError(error) {
    return error instanceof Error && error.name === name8 && "toolName" in error && error.toolName != void 0 && typeof error.name === "string";
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      toolName: this.toolName,
      availableTools: this.availableTools
    };
  }
};
_a8 = symbol8;

// core/generate-text/tool-call.ts
function parseToolCall({
  toolCall,
  tools
}) {
  const toolName = toolCall.toolName;
  if (tools == null) {
    throw new NoSuchToolError({ toolName: toolCall.toolName });
  }
  const tool2 = tools[toolName];
  if (tool2 == null) {
    throw new NoSuchToolError({
      toolName: toolCall.toolName,
      availableTools: Object.keys(tools)
    });
  }
  const parseResult = (0, import_provider_utils8.safeParseJSON)({
    text: toolCall.args,
    schema: (0, import_ui_utils4.asSchema)(tool2.parameters)
  });
  if (parseResult.success === false) {
    throw new InvalidToolArgumentsError({
      toolName,
      toolArgs: toolCall.args,
      cause: parseResult.error
    });
  }
  return {
    type: "tool-call",
    toolCallId: toolCall.toolCallId,
    toolName,
    args: parseResult.value
  };
}

// core/generate-text/generate-text.ts
var originalGenerateId3 = (0, import_provider_utils9.createIdGenerator)({ prefix: "aitxt-", length: 24 });
async function generateText({
  model,
  tools,
  toolChoice,
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  headers,
  maxAutomaticRoundtrips = 0,
  maxToolRoundtrips = maxAutomaticRoundtrips,
  experimental_telemetry: telemetry,
  experimental_providerMetadata: providerMetadata,
  _internal: {
    generateId: generateId3 = originalGenerateId3,
    currentDate = () => /* @__PURE__ */ new Date()
  } = {},
  ...settings
}) {
  var _a11;
  const baseTelemetryAttributes = getBaseTelemetryAttributes({
    model,
    telemetry,
    headers,
    settings: { ...settings, maxRetries }
  });
  const tracer = getTracer({ isEnabled: (_a11 = telemetry == null ? void 0 : telemetry.isEnabled) != null ? _a11 : false });
  return recordSpan({
    name: "ai.generateText",
    attributes: selectTelemetryAttributes({
      telemetry,
      attributes: {
        ...assembleOperationName({
          operationId: "ai.generateText",
          telemetry
        }),
        ...baseTelemetryAttributes,
        // specific settings that only make sense on the outer level:
        "ai.prompt": {
          input: () => JSON.stringify({ system, prompt, messages })
        },
        "ai.settings.maxToolRoundtrips": maxToolRoundtrips
      }
    }),
    tracer,
    fn: async (span) => {
      var _a12, _b, _c, _d, _e;
      const retry = retryWithExponentialBackoff({ maxRetries });
      const validatedPrompt = validatePrompt({
        system,
        prompt,
        messages
      });
      const mode = {
        type: "regular",
        ...prepareToolsAndToolChoice({ tools, toolChoice })
      };
      const callSettings = prepareCallSettings(settings);
      const promptMessages = await convertToLanguageModelPrompt({
        prompt: validatedPrompt,
        modelSupportsImageUrls: model.supportsImageUrls
      });
      let currentModelResponse;
      let currentToolCalls = [];
      let currentToolResults = [];
      let roundtripCount = 0;
      const responseMessages = [];
      const roundtrips = [];
      const usage = {
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0
      };
      do {
        const currentInputFormat = roundtripCount === 0 ? validatedPrompt.type : "messages";
        currentModelResponse = await retry(
          () => recordSpan({
            name: "ai.generateText.doGenerate",
            attributes: selectTelemetryAttributes({
              telemetry,
              attributes: {
                ...assembleOperationName({
                  operationId: "ai.generateText.doGenerate",
                  telemetry
                }),
                ...baseTelemetryAttributes,
                "ai.prompt.format": { input: () => currentInputFormat },
                "ai.prompt.messages": {
                  input: () => JSON.stringify(promptMessages)
                },
                // standardized gen-ai llm span attributes:
                "gen_ai.system": model.provider,
                "gen_ai.request.model": model.modelId,
                "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                "gen_ai.request.max_tokens": settings.maxTokens,
                "gen_ai.request.presence_penalty": settings.presencePenalty,
                "gen_ai.request.stop_sequences": settings.stopSequences,
                "gen_ai.request.temperature": settings.temperature,
                "gen_ai.request.top_k": settings.topK,
                "gen_ai.request.top_p": settings.topP
              }
            }),
            tracer,
            fn: async (span2) => {
              var _a13, _b2, _c2, _d2, _e2, _f;
              const result = await model.doGenerate({
                mode,
                ...callSettings,
                inputFormat: currentInputFormat,
                prompt: promptMessages,
                providerMetadata,
                abortSignal,
                headers
              });
              const responseData = {
                id: (_b2 = (_a13 = result.response) == null ? void 0 : _a13.id) != null ? _b2 : generateId3(),
                timestamp: (_d2 = (_c2 = result.response) == null ? void 0 : _c2.timestamp) != null ? _d2 : currentDate(),
                modelId: (_f = (_e2 = result.response) == null ? void 0 : _e2.modelId) != null ? _f : model.modelId
              };
              span2.setAttributes(
                selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    "ai.response.finishReason": result.finishReason,
                    "ai.response.text": {
                      output: () => result.text
                    },
                    "ai.response.toolCalls": {
                      output: () => JSON.stringify(result.toolCalls)
                    },
                    "ai.response.id": responseData.id,
                    "ai.response.model": responseData.modelId,
                    "ai.response.timestamp": responseData.timestamp.toISOString(),
                    "ai.usage.promptTokens": result.usage.promptTokens,
                    "ai.usage.completionTokens": result.usage.completionTokens,
                    // deprecated:
                    "ai.finishReason": result.finishReason,
                    "ai.result.text": {
                      output: () => result.text
                    },
                    "ai.result.toolCalls": {
                      output: () => JSON.stringify(result.toolCalls)
                    },
                    // standardized gen-ai llm span attributes:
                    "gen_ai.response.finish_reasons": [result.finishReason],
                    "gen_ai.response.id": responseData.id,
                    "gen_ai.response.model": responseData.modelId,
                    "gen_ai.usage.input_tokens": result.usage.promptTokens,
                    "gen_ai.usage.output_tokens": result.usage.completionTokens
                  }
                })
              );
              return { ...result, response: responseData };
            }
          })
        );
        currentToolCalls = ((_a12 = currentModelResponse.toolCalls) != null ? _a12 : []).map(
          (modelToolCall) => parseToolCall({ toolCall: modelToolCall, tools })
        );
        currentToolResults = tools == null ? [] : await executeTools({
          toolCalls: currentToolCalls,
          tools,
          tracer,
          telemetry
        });
        const currentUsage = calculateLanguageModelUsage(
          currentModelResponse.usage
        );
        usage.completionTokens += currentUsage.completionTokens;
        usage.promptTokens += currentUsage.promptTokens;
        usage.totalTokens += currentUsage.totalTokens;
        roundtrips.push({
          text: (_b = currentModelResponse.text) != null ? _b : "",
          toolCalls: currentToolCalls,
          toolResults: currentToolResults,
          finishReason: currentModelResponse.finishReason,
          usage: currentUsage,
          warnings: currentModelResponse.warnings,
          logprobs: currentModelResponse.logprobs,
          response: {
            ...currentModelResponse.response,
            headers: (_c = currentModelResponse.rawResponse) == null ? void 0 : _c.headers
          }
        });
        const newResponseMessages = toResponseMessages({
          text: currentModelResponse.text,
          toolCalls: currentToolCalls,
          toolResults: currentToolResults
        });
        responseMessages.push(...newResponseMessages);
        promptMessages.push(
          ...newResponseMessages.map(
            (message) => convertToLanguageModelMessage(message, null)
          )
        );
      } while (
        // there are tool calls:
        currentToolCalls.length > 0 && // all current tool calls have results:
        currentToolResults.length === currentToolCalls.length && // the number of roundtrips is less than the maximum:
        roundtripCount++ < maxToolRoundtrips
      );
      span.setAttributes(
        selectTelemetryAttributes({
          telemetry,
          attributes: {
            "ai.response.finishReason": currentModelResponse.finishReason,
            "ai.response.text": {
              output: () => currentModelResponse.text
            },
            "ai.response.toolCalls": {
              output: () => JSON.stringify(currentModelResponse.toolCalls)
            },
            "ai.usage.promptTokens": currentModelResponse.usage.promptTokens,
            "ai.usage.completionTokens": currentModelResponse.usage.completionTokens,
            // deprecated:
            "ai.finishReason": currentModelResponse.finishReason,
            "ai.result.text": {
              output: () => currentModelResponse.text
            },
            "ai.result.toolCalls": {
              output: () => JSON.stringify(currentModelResponse.toolCalls)
            }
          }
        })
      );
      return new DefaultGenerateTextResult({
        // Always return a string so that the caller doesn't have to check for undefined.
        // If they need to check if the model did not return any text,
        // they can check the length of the string:
        text: (_d = currentModelResponse.text) != null ? _d : "",
        toolCalls: currentToolCalls,
        toolResults: currentToolResults,
        finishReason: currentModelResponse.finishReason,
        usage,
        warnings: currentModelResponse.warnings,
        response: {
          ...currentModelResponse.response,
          headers: (_e = currentModelResponse.rawResponse) == null ? void 0 : _e.headers
        },
        logprobs: currentModelResponse.logprobs,
        responseMessages,
        roundtrips,
        providerMetadata: currentModelResponse.providerMetadata
      });
    }
  });
}
async function executeTools({
  toolCalls,
  tools,
  tracer,
  telemetry
}) {
  const toolResults = await Promise.all(
    toolCalls.map(async (toolCall) => {
      const tool2 = tools[toolCall.toolName];
      if ((tool2 == null ? void 0 : tool2.execute) == null) {
        return void 0;
      }
      const result = await recordSpan({
        name: "ai.toolCall",
        attributes: selectTelemetryAttributes({
          telemetry,
          attributes: {
            ...assembleOperationName({
              operationId: "ai.toolCall",
              telemetry
            }),
            "ai.toolCall.name": toolCall.toolName,
            "ai.toolCall.id": toolCall.toolCallId,
            "ai.toolCall.args": {
              output: () => JSON.stringify(toolCall.args)
            }
          }
        }),
        tracer,
        fn: async (span) => {
          const result2 = await tool2.execute(toolCall.args);
          try {
            span.setAttributes(
              selectTelemetryAttributes({
                telemetry,
                attributes: {
                  "ai.toolCall.result": {
                    output: () => JSON.stringify(result2)
                  }
                }
              })
            );
          } catch (ignored) {
          }
          return result2;
        }
      });
      return {
        toolCallId: toolCall.toolCallId,
        toolName: toolCall.toolName,
        args: toolCall.args,
        result
      };
    })
  );
  return toolResults.filter(
    (result) => result != null
  );
}
var DefaultGenerateTextResult = class {
  constructor(options) {
    this.text = options.text;
    this.toolCalls = options.toolCalls;
    this.toolResults = options.toolResults;
    this.finishReason = options.finishReason;
    this.usage = options.usage;
    this.warnings = options.warnings;
    this.response = options.response;
    this.responseMessages = options.responseMessages;
    this.roundtrips = options.roundtrips;
    this.experimental_providerMetadata = options.providerMetadata;
    this.rawResponse = {
      headers: options.response.headers
    };
    this.logprobs = options.logprobs;
  }
};
var experimental_generateText = generateText;

// core/generate-text/stream-text.ts
var import_provider_utils10 = require("@ai-sdk/provider-utils");

// core/util/create-stitchable-stream.ts
function createStitchableStream() {
  let innerStreamReaders = [];
  let controller = null;
  let isClosed = false;
  const processPull = async () => {
    if (isClosed && innerStreamReaders.length === 0) {
      controller == null ? void 0 : controller.close();
      return;
    }
    if (innerStreamReaders.length === 0) {
      return;
    }
    try {
      const { value, done } = await innerStreamReaders[0].read();
      if (done) {
        innerStreamReaders.shift();
        if (innerStreamReaders.length > 0) {
          await processPull();
        } else if (isClosed) {
          controller == null ? void 0 : controller.close();
        }
      } else {
        controller == null ? void 0 : controller.enqueue(value);
      }
    } catch (error) {
      controller == null ? void 0 : controller.error(error);
      innerStreamReaders.shift();
      if (isClosed && innerStreamReaders.length === 0) {
        controller == null ? void 0 : controller.close();
      }
    }
  };
  return {
    stream: new ReadableStream({
      start(controllerParam) {
        controller = controllerParam;
      },
      pull: processPull,
      async cancel() {
        for (const reader of innerStreamReaders) {
          await reader.cancel();
        }
        innerStreamReaders = [];
        isClosed = true;
      }
    }),
    addStream: (innerStream) => {
      if (isClosed) {
        throw new Error("Cannot add inner stream: outer stream is closed");
      }
      innerStreamReaders.push(innerStream.getReader());
    },
    close: () => {
      isClosed = true;
      if (innerStreamReaders.length === 0) {
        controller == null ? void 0 : controller.close();
      }
    }
  };
}

// core/util/merge-streams.ts
function mergeStreams(stream1, stream2) {
  const reader1 = stream1.getReader();
  const reader2 = stream2.getReader();
  let lastRead1 = void 0;
  let lastRead2 = void 0;
  let stream1Done = false;
  let stream2Done = false;
  async function readStream1(controller) {
    try {
      if (lastRead1 == null) {
        lastRead1 = reader1.read();
      }
      const result = await lastRead1;
      lastRead1 = void 0;
      if (!result.done) {
        controller.enqueue(result.value);
      } else {
        controller.close();
      }
    } catch (error) {
      controller.error(error);
    }
  }
  async function readStream2(controller) {
    try {
      if (lastRead2 == null) {
        lastRead2 = reader2.read();
      }
      const result = await lastRead2;
      lastRead2 = void 0;
      if (!result.done) {
        controller.enqueue(result.value);
      } else {
        controller.close();
      }
    } catch (error) {
      controller.error(error);
    }
  }
  return new ReadableStream({
    async pull(controller) {
      try {
        if (stream1Done) {
          await readStream2(controller);
          return;
        }
        if (stream2Done) {
          await readStream1(controller);
          return;
        }
        if (lastRead1 == null) {
          lastRead1 = reader1.read();
        }
        if (lastRead2 == null) {
          lastRead2 = reader2.read();
        }
        const { result, reader } = await Promise.race([
          lastRead1.then((result2) => ({ result: result2, reader: reader1 })),
          lastRead2.then((result2) => ({ result: result2, reader: reader2 }))
        ]);
        if (!result.done) {
          controller.enqueue(result.value);
        }
        if (reader === reader1) {
          lastRead1 = void 0;
          if (result.done) {
            await readStream2(controller);
            stream1Done = true;
          }
        } else {
          lastRead2 = void 0;
          if (result.done) {
            stream2Done = true;
            await readStream1(controller);
          }
        }
      } catch (error) {
        controller.error(error);
      }
    },
    cancel() {
      reader1.cancel();
      reader2.cancel();
    }
  });
}

// core/generate-text/run-tools-transformation.ts
var import_ui_utils5 = require("@ai-sdk/ui-utils");
function runToolsTransformation({
  tools,
  generatorStream,
  toolCallStreaming,
  tracer,
  telemetry
}) {
  let canClose = false;
  const outstandingToolCalls = /* @__PURE__ */ new Set();
  let toolResultsStreamController = null;
  const toolResultsStream = new ReadableStream({
    start(controller) {
      toolResultsStreamController = controller;
    }
  });
  const activeToolCalls = {};
  const forwardStream = new TransformStream({
    transform(chunk, controller) {
      const chunkType = chunk.type;
      switch (chunkType) {
        case "text-delta":
        case "response-metadata":
        case "error": {
          controller.enqueue(chunk);
          break;
        }
        case "tool-call-delta": {
          if (toolCallStreaming) {
            if (!activeToolCalls[chunk.toolCallId]) {
              controller.enqueue({
                type: "tool-call-streaming-start",
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName
              });
              activeToolCalls[chunk.toolCallId] = true;
            }
            controller.enqueue({
              type: "tool-call-delta",
              toolCallId: chunk.toolCallId,
              toolName: chunk.toolName,
              argsTextDelta: chunk.argsTextDelta
            });
          }
          break;
        }
        case "tool-call": {
          const toolName = chunk.toolName;
          if (tools == null) {
            toolResultsStreamController.enqueue({
              type: "error",
              error: new NoSuchToolError({ toolName: chunk.toolName })
            });
            break;
          }
          const tool2 = tools[toolName];
          if (tool2 == null) {
            toolResultsStreamController.enqueue({
              type: "error",
              error: new NoSuchToolError({
                toolName: chunk.toolName,
                availableTools: Object.keys(tools)
              })
            });
            break;
          }
          try {
            const toolCall = parseToolCall({
              toolCall: chunk,
              tools
            });
            controller.enqueue(toolCall);
            if (tool2.execute != null) {
              const toolExecutionId = (0, import_ui_utils5.generateId)();
              outstandingToolCalls.add(toolExecutionId);
              recordSpan({
                name: "ai.toolCall",
                attributes: selectTelemetryAttributes({
                  telemetry,
                  attributes: {
                    ...assembleOperationName({
                      operationId: "ai.toolCall",
                      telemetry
                    }),
                    "ai.toolCall.name": toolCall.toolName,
                    "ai.toolCall.id": toolCall.toolCallId,
                    "ai.toolCall.args": {
                      output: () => JSON.stringify(toolCall.args)
                    }
                  }
                }),
                tracer,
                fn: async (span) => tool2.execute(toolCall.args).then(
                  (result) => {
                    toolResultsStreamController.enqueue({
                      ...toolCall,
                      type: "tool-result",
                      result
                    });
                    outstandingToolCalls.delete(toolExecutionId);
                    if (canClose && outstandingToolCalls.size === 0) {
                      toolResultsStreamController.close();
                    }
                    try {
                      span.setAttributes(
                        selectTelemetryAttributes({
                          telemetry,
                          attributes: {
                            "ai.toolCall.result": {
                              output: () => JSON.stringify(result)
                            }
                          }
                        })
                      );
                    } catch (ignored) {
                    }
                  },
                  (error) => {
                    toolResultsStreamController.enqueue({
                      type: "error",
                      error
                    });
                    outstandingToolCalls.delete(toolExecutionId);
                    if (canClose && outstandingToolCalls.size === 0) {
                      toolResultsStreamController.close();
                    }
                  }
                )
              });
            }
          } catch (error) {
            toolResultsStreamController.enqueue({
              type: "error",
              error
            });
          }
          break;
        }
        case "finish": {
          controller.enqueue({
            type: "finish",
            finishReason: chunk.finishReason,
            logprobs: chunk.logprobs,
            usage: calculateLanguageModelUsage(chunk.usage),
            experimental_providerMetadata: chunk.providerMetadata
          });
          break;
        }
        default: {
          const _exhaustiveCheck = chunkType;
          throw new Error(`Unhandled chunk type: ${_exhaustiveCheck}`);
        }
      }
    },
    flush() {
      canClose = true;
      if (outstandingToolCalls.size === 0) {
        toolResultsStreamController.close();
      }
    }
  });
  return new ReadableStream({
    async start(controller) {
      return Promise.all([
        generatorStream.pipeThrough(forwardStream).pipeTo(
          new WritableStream({
            write(chunk) {
              controller.enqueue(chunk);
            },
            close() {
            }
          })
        ),
        toolResultsStream.pipeTo(
          new WritableStream({
            write(chunk) {
              controller.enqueue(chunk);
            },
            close() {
              controller.close();
            }
          })
        )
      ]);
    }
  });
}

// core/generate-text/stream-text.ts
var originalGenerateId4 = (0, import_provider_utils10.createIdGenerator)({ prefix: "aitxt-", length: 24 });
async function streamText({
  model,
  tools,
  toolChoice,
  system,
  prompt,
  messages,
  maxRetries,
  abortSignal,
  headers,
  maxToolRoundtrips = 0,
  experimental_telemetry: telemetry,
  experimental_providerMetadata: providerMetadata,
  experimental_toolCallStreaming: toolCallStreaming = false,
  onChunk,
  onFinish,
  _internal: {
    now: now2 = now,
    generateId: generateId3 = originalGenerateId4,
    currentDate = () => /* @__PURE__ */ new Date()
  } = {},
  ...settings
}) {
  var _a11;
  const baseTelemetryAttributes = getBaseTelemetryAttributes({
    model,
    telemetry,
    headers,
    settings: { ...settings, maxRetries }
  });
  const tracer = getTracer({ isEnabled: (_a11 = telemetry == null ? void 0 : telemetry.isEnabled) != null ? _a11 : false });
  return recordSpan({
    name: "ai.streamText",
    attributes: selectTelemetryAttributes({
      telemetry,
      attributes: {
        ...assembleOperationName({ operationId: "ai.streamText", telemetry }),
        ...baseTelemetryAttributes,
        // specific settings that only make sense on the outer level:
        "ai.prompt": {
          input: () => JSON.stringify({ system, prompt, messages })
        }
      }
    }),
    tracer,
    endWhenDone: false,
    fn: async (rootSpan) => {
      const retry = retryWithExponentialBackoff({ maxRetries });
      const startRoundtrip = async ({
        promptMessages: promptMessages2,
        promptType
      }) => {
        const {
          result: { stream: stream2, warnings: warnings2, rawResponse: rawResponse2 },
          doStreamSpan: doStreamSpan2,
          startTimestampMs: startTimestampMs2
        } = await retry(
          () => recordSpan({
            name: "ai.streamText.doStream",
            attributes: selectTelemetryAttributes({
              telemetry,
              attributes: {
                ...assembleOperationName({
                  operationId: "ai.streamText.doStream",
                  telemetry
                }),
                ...baseTelemetryAttributes,
                "ai.prompt.format": {
                  input: () => promptType
                },
                "ai.prompt.messages": {
                  input: () => JSON.stringify(promptMessages2)
                },
                // standardized gen-ai llm span attributes:
                "gen_ai.system": model.provider,
                "gen_ai.request.model": model.modelId,
                "gen_ai.request.frequency_penalty": settings.frequencyPenalty,
                "gen_ai.request.max_tokens": settings.maxTokens,
                "gen_ai.request.presence_penalty": settings.presencePenalty,
                "gen_ai.request.stop_sequences": settings.stopSequences,
                "gen_ai.request.temperature": settings.temperature,
                "gen_ai.request.top_k": settings.topK,
                "gen_ai.request.top_p": settings.topP
              }
            }),
            tracer,
            endWhenDone: false,
            fn: async (doStreamSpan3) => ({
              startTimestampMs: now2(),
              // get before the call
              doStreamSpan: doStreamSpan3,
              result: await model.doStream({
                mode: {
                  type: "regular",
                  ...prepareToolsAndToolChoice({ tools, toolChoice })
                },
                ...prepareCallSettings(settings),
                inputFormat: promptType,
                prompt: promptMessages2,
                providerMetadata,
                abortSignal,
                headers
              })
            })
          })
        );
        return {
          result: {
            stream: runToolsTransformation({
              tools,
              generatorStream: stream2,
              toolCallStreaming,
              tracer,
              telemetry
            }),
            warnings: warnings2,
            rawResponse: rawResponse2
          },
          doStreamSpan: doStreamSpan2,
          startTimestampMs: startTimestampMs2
        };
      };
      const promptMessages = await convertToLanguageModelPrompt({
        prompt: validatePrompt({ system, prompt, messages }),
        modelSupportsImageUrls: model.supportsImageUrls
      });
      const {
        result: { stream, warnings, rawResponse },
        doStreamSpan,
        startTimestampMs
      } = await startRoundtrip({
        promptType: validatePrompt({ system, prompt, messages }).type,
        promptMessages
      });
      return new DefaultStreamTextResult({
        stream,
        warnings,
        rawResponse,
        onChunk,
        onFinish,
        rootSpan,
        doStreamSpan,
        telemetry,
        startTimestampMs,
        maxToolRoundtrips,
        startRoundtrip,
        promptMessages,
        modelId: model.modelId,
        now: now2,
        currentDate,
        generateId: generateId3
      });
    }
  });
}
var DefaultStreamTextResult = class {
  constructor({
    stream,
    warnings,
    rawResponse,
    onChunk,
    onFinish,
    rootSpan,
    doStreamSpan,
    telemetry,
    startTimestampMs,
    maxToolRoundtrips,
    startRoundtrip,
    promptMessages,
    modelId,
    now: now2,
    currentDate,
    generateId: generateId3
  }) {
    this.warnings = warnings;
    this.rawResponse = rawResponse;
    const { resolve: resolveUsage, promise: usagePromise } = createResolvablePromise();
    this.usage = usagePromise;
    const { resolve: resolveFinishReason, promise: finishReasonPromise } = createResolvablePromise();
    this.finishReason = finishReasonPromise;
    const { resolve: resolveText, promise: textPromise } = createResolvablePromise();
    this.text = textPromise;
    const { resolve: resolveToolCalls, promise: toolCallsPromise } = createResolvablePromise();
    this.toolCalls = toolCallsPromise;
    const { resolve: resolveToolResults, promise: toolResultsPromise } = createResolvablePromise();
    this.toolResults = toolResultsPromise;
    const {
      resolve: resolveProviderMetadata,
      promise: providerMetadataPromise
    } = createResolvablePromise();
    this.experimental_providerMetadata = providerMetadataPromise;
    const { resolve: resolveResponse, promise: responsePromise } = createResolvablePromise();
    this.response = responsePromise;
    const {
      stream: stitchableStream,
      addStream,
      close: closeStitchableStream
    } = createStitchableStream();
    this.originalStream = stitchableStream;
    const self = this;
    function addRoundtripStream({
      stream: stream2,
      startTimestamp,
      doStreamSpan: doStreamSpan2,
      currentToolRoundtrip,
      promptMessages: promptMessages2,
      usage = {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      }
    }) {
      const roundtripToolCalls = [];
      const roundtripToolResults = [];
      let roundtripFinishReason = "unknown";
      let roundtripUsage = {
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0
      };
      let roundtripProviderMetadata;
      let roundtripFirstChunk = true;
      let roundtripText = "";
      let roundtripLogProbs;
      let roundtripResponse = {
        id: generateId3(),
        timestamp: currentDate(),
        modelId
      };
      addStream(
        stream2.pipeThrough(
          new TransformStream({
            async transform(chunk, controller) {
              var _a11, _b, _c;
              if (roundtripFirstChunk) {
                const msToFirstChunk = now2() - startTimestamp;
                roundtripFirstChunk = false;
                doStreamSpan2.addEvent("ai.stream.firstChunk", {
                  "ai.response.msToFirstChunk": msToFirstChunk,
                  // deprecated:
                  "ai.stream.msToFirstChunk": msToFirstChunk
                });
                doStreamSpan2.setAttributes({
                  "ai.response.msToFirstChunk": msToFirstChunk,
                  // deprecated:
                  "ai.stream.msToFirstChunk": msToFirstChunk
                });
              }
              if (chunk.type === "text-delta" && chunk.textDelta.length === 0) {
                return;
              }
              const chunkType = chunk.type;
              switch (chunkType) {
                case "text-delta": {
                  controller.enqueue(chunk);
                  roundtripText += chunk.textDelta;
                  await (onChunk == null ? void 0 : onChunk({ chunk }));
                  break;
                }
                case "tool-call": {
                  controller.enqueue(chunk);
                  roundtripToolCalls.push(chunk);
                  await (onChunk == null ? void 0 : onChunk({ chunk }));
                  break;
                }
                case "tool-result": {
                  controller.enqueue(chunk);
                  roundtripToolResults.push(chunk);
                  await (onChunk == null ? void 0 : onChunk({ chunk }));
                  break;
                }
                case "response-metadata": {
                  roundtripResponse = {
                    id: (_a11 = chunk.id) != null ? _a11 : roundtripResponse.id,
                    timestamp: (_b = chunk.timestamp) != null ? _b : roundtripResponse.timestamp,
                    modelId: (_c = chunk.modelId) != null ? _c : roundtripResponse.modelId
                  };
                  break;
                }
                case "finish": {
                  roundtripUsage = chunk.usage;
                  roundtripFinishReason = chunk.finishReason;
                  roundtripProviderMetadata = chunk.experimental_providerMetadata;
                  roundtripLogProbs = chunk.logprobs;
                  const msToFinish = now2() - startTimestamp;
                  doStreamSpan2.addEvent("ai.stream.finish");
                  doStreamSpan2.setAttributes({
                    "ai.response.msToFinish": msToFinish,
                    "ai.response.avgCompletionTokensPerSecond": 1e3 * roundtripUsage.completionTokens / msToFinish
                  });
                  break;
                }
                case "tool-call-streaming-start":
                case "tool-call-delta": {
                  controller.enqueue(chunk);
                  await (onChunk == null ? void 0 : onChunk({ chunk }));
                  break;
                }
                case "error": {
                  controller.enqueue(chunk);
                  roundtripFinishReason = "error";
                  break;
                }
                default: {
                  const exhaustiveCheck = chunkType;
                  throw new Error(`Unknown chunk type: ${exhaustiveCheck}`);
                }
              }
            },
            // invoke onFinish callback and resolve toolResults promise when the stream is about to close:
            async flush(controller) {
              controller.enqueue({
                type: "roundtrip-finish",
                finishReason: roundtripFinishReason,
                usage: roundtripUsage,
                experimental_providerMetadata: roundtripProviderMetadata,
                logprobs: roundtripLogProbs,
                response: roundtripResponse
              });
              const telemetryToolCalls = roundtripToolCalls.length > 0 ? JSON.stringify(roundtripToolCalls) : void 0;
              try {
                doStreamSpan2.setAttributes(
                  selectTelemetryAttributes({
                    telemetry,
                    attributes: {
                      "ai.response.finishReason": roundtripFinishReason,
                      "ai.response.text": { output: () => roundtripText },
                      "ai.response.toolCalls": {
                        output: () => telemetryToolCalls
                      },
                      "ai.response.id": roundtripResponse.id,
                      "ai.response.model": roundtripResponse.modelId,
                      "ai.response.timestamp": roundtripResponse.timestamp.toISOString(),
                      "ai.usage.promptTokens": roundtripUsage.promptTokens,
                      "ai.usage.completionTokens": roundtripUsage.completionTokens,
                      // deprecated
                      "ai.finishReason": roundtripFinishReason,
                      "ai.result.text": { output: () => roundtripText },
                      "ai.result.toolCalls": {
                        output: () => telemetryToolCalls
                      },
                      // standardized gen-ai llm span attributes:
                      "gen_ai.response.finish_reasons": [roundtripFinishReason],
                      "gen_ai.response.id": roundtripResponse.id,
                      "gen_ai.response.model": roundtripResponse.modelId,
                      "gen_ai.usage.input_tokens": roundtripUsage.promptTokens,
                      "gen_ai.usage.output_tokens": roundtripUsage.completionTokens
                    }
                  })
                );
              } catch (error) {
              } finally {
                doStreamSpan2.end();
              }
              const combinedUsage = {
                promptTokens: usage.promptTokens + roundtripUsage.promptTokens,
                completionTokens: usage.completionTokens + roundtripUsage.completionTokens,
                totalTokens: usage.totalTokens + roundtripUsage.totalTokens
              };
              if (
                // there are tool calls:
                roundtripToolCalls.length > 0 && // all current tool calls have results:
                roundtripToolResults.length === roundtripToolCalls.length && // the number of roundtrips is less than the maximum:
                currentToolRoundtrip < maxToolRoundtrips
              ) {
                promptMessages2.push(
                  ...toResponseMessages({
                    text: roundtripText,
                    toolCalls: roundtripToolCalls,
                    toolResults: roundtripToolResults
                  }).map(
                    (message) => convertToLanguageModelMessage(message, null)
                  )
                );
                const {
                  result,
                  doStreamSpan: doStreamSpan3,
                  startTimestampMs: startTimestamp2
                } = await startRoundtrip({
                  promptType: "messages",
                  promptMessages: promptMessages2
                });
                self.warnings = result.warnings;
                self.rawResponse = result.rawResponse;
                addRoundtripStream({
                  stream: result.stream,
                  startTimestamp: startTimestamp2,
                  doStreamSpan: doStreamSpan3,
                  currentToolRoundtrip: currentToolRoundtrip + 1,
                  promptMessages: promptMessages2,
                  usage: combinedUsage
                });
                return;
              }
              try {
                controller.enqueue({
                  type: "finish",
                  finishReason: roundtripFinishReason,
                  usage: combinedUsage,
                  experimental_providerMetadata: roundtripProviderMetadata,
                  logprobs: roundtripLogProbs,
                  response: roundtripResponse
                });
                closeStitchableStream();
                rootSpan.setAttributes(
                  selectTelemetryAttributes({
                    telemetry,
                    attributes: {
                      "ai.response.finishReason": roundtripFinishReason,
                      "ai.response.text": { output: () => roundtripText },
                      "ai.response.toolCalls": {
                        output: () => telemetryToolCalls
                      },
                      "ai.usage.promptTokens": combinedUsage.promptTokens,
                      "ai.usage.completionTokens": combinedUsage.completionTokens,
                      // deprecated
                      "ai.finishReason": roundtripFinishReason,
                      "ai.result.text": { output: () => roundtripText },
                      "ai.result.toolCalls": {
                        output: () => telemetryToolCalls
                      }
                    }
                  })
                );
                resolveUsage(combinedUsage);
                resolveFinishReason(roundtripFinishReason);
                resolveText(roundtripText);
                resolveToolCalls(roundtripToolCalls);
                resolveProviderMetadata(roundtripProviderMetadata);
                resolveToolResults(roundtripToolResults);
                resolveResponse({
                  ...roundtripResponse,
                  headers: rawResponse == null ? void 0 : rawResponse.headers
                });
                await (onFinish == null ? void 0 : onFinish({
                  finishReason: roundtripFinishReason,
                  usage: combinedUsage,
                  text: roundtripText,
                  toolCalls: roundtripToolCalls,
                  // The tool results are inferred as a never[] type, because they are
                  // optional and the execute method with an inferred result type is
                  // optional as well. Therefore we need to cast the toolResults to any.
                  // The type exposed to the users will be correctly inferred.
                  toolResults: roundtripToolResults,
                  rawResponse,
                  response: {
                    ...roundtripResponse,
                    headers: rawResponse == null ? void 0 : rawResponse.headers
                  },
                  warnings,
                  experimental_providerMetadata: roundtripProviderMetadata
                }));
              } catch (error) {
                controller.error(error);
              } finally {
                rootSpan.end();
              }
            }
          })
        )
      );
    }
    addRoundtripStream({
      stream,
      startTimestamp: startTimestampMs,
      doStreamSpan,
      currentToolRoundtrip: 0,
      promptMessages,
      usage: void 0
    });
  }
  /**
  Split out a new stream from the original stream.
  The original stream is replaced to allow for further splitting,
  since we do not know how many times the stream will be split.
  
  Note: this leads to buffering the stream content on the server.
  However, the LLM results are expected to be small enough to not cause issues.
     */
  teeStream() {
    const [stream1, stream2] = this.originalStream.tee();
    this.originalStream = stream2;
    return stream1;
  }
  get textStream() {
    return createAsyncIterableStream(this.teeStream(), {
      transform(chunk, controller) {
        if (chunk.type === "text-delta") {
          controller.enqueue(chunk.textDelta);
        } else if (chunk.type === "error") {
          controller.error(chunk.error);
        }
      }
    });
  }
  get fullStream() {
    return createAsyncIterableStream(this.teeStream(), {
      transform(chunk, controller) {
        controller.enqueue(chunk);
      }
    });
  }
  toAIStream(callbacks = {}) {
    return this.toDataStreamInternal({ callbacks });
  }
  toDataStreamInternal({
    callbacks = {},
    getErrorMessage: getErrorMessage4 = () => "",
    // mask error messages for safety by default
    sendUsage = true
  } = {}) {
    let aggregatedResponse = "";
    const callbackTransformer = new TransformStream({
      async start() {
        if (callbacks.onStart)
          await callbacks.onStart();
      },
      async transform(chunk, controller) {
        controller.enqueue(chunk);
        if (chunk.type === "text-delta") {
          const textDelta = chunk.textDelta;
          aggregatedResponse += textDelta;
          if (callbacks.onToken)
            await callbacks.onToken(textDelta);
          if (callbacks.onText)
            await callbacks.onText(textDelta);
        }
      },
      async flush() {
        if (callbacks.onCompletion)
          await callbacks.onCompletion(aggregatedResponse);
        if (callbacks.onFinal)
          await callbacks.onFinal(aggregatedResponse);
      }
    });
    const streamPartsTransformer = new TransformStream({
      transform: async (chunk, controller) => {
        const chunkType = chunk.type;
        switch (chunkType) {
          case "text-delta":
            controller.enqueue((0, import_ui_utils10.formatStreamPart)("text", chunk.textDelta));
            break;
          case "tool-call-streaming-start":
            controller.enqueue(
              (0, import_ui_utils10.formatStreamPart)("tool_call_streaming_start", {
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName
              })
            );
            break;
          case "tool-call-delta":
            controller.enqueue(
              (0, import_ui_utils10.formatStreamPart)("tool_call_delta", {
                toolCallId: chunk.toolCallId,
                argsTextDelta: chunk.argsTextDelta
              })
            );
            break;
          case "tool-call":
            controller.enqueue(
              (0, import_ui_utils10.formatStreamPart)("tool_call", {
                toolCallId: chunk.toolCallId,
                toolName: chunk.toolName,
                args: chunk.args
              })
            );
            break;
          case "tool-result":
            controller.enqueue(
              (0, import_ui_utils10.formatStreamPart)("tool_result", {
                toolCallId: chunk.toolCallId,
                result: chunk.result
              })
            );
            break;
          case "error":
            controller.enqueue(
              (0, import_ui_utils10.formatStreamPart)("error", getErrorMessage4(chunk.error))
            );
            break;
          case "roundtrip-finish":
            controller.enqueue(
              (0, import_ui_utils10.formatStreamPart)("finish_roundtrip", {
                finishReason: chunk.finishReason,
                usage: sendUsage ? {
                  promptTokens: chunk.usage.promptTokens,
                  completionTokens: chunk.usage.completionTokens
                } : void 0
              })
            );
            break;
          case "finish":
            controller.enqueue(
              (0, import_ui_utils10.formatStreamPart)("finish_message", {
                finishReason: chunk.finishReason,
                usage: sendUsage ? {
                  promptTokens: chunk.usage.promptTokens,
                  completionTokens: chunk.usage.completionTokens
                } : void 0
              })
            );
            break;
          default: {
            const exhaustiveCheck = chunkType;
            throw new Error(`Unknown chunk type: ${exhaustiveCheck}`);
          }
        }
      }
    });
    return this.fullStream.pipeThrough(callbackTransformer).pipeThrough(streamPartsTransformer).pipeThrough(new TextEncoderStream());
  }
  pipeAIStreamToResponse(response, init) {
    return this.pipeDataStreamToResponse(response, init);
  }
  pipeDataStreamToResponse(response, options) {
    const init = options == null ? void 0 : "init" in options ? options.init : {
      headers: "headers" in options ? options.headers : void 0,
      status: "status" in options ? options.status : void 0,
      statusText: "statusText" in options ? options.statusText : void 0
    };
    const data = options == null ? void 0 : "data" in options ? options.data : void 0;
    const getErrorMessage4 = options == null ? void 0 : "getErrorMessage" in options ? options.getErrorMessage : void 0;
    const sendUsage = options == null ? void 0 : "sendUsage" in options ? options.sendUsage : void 0;
    writeToServerResponse({
      response,
      status: init == null ? void 0 : init.status,
      statusText: init == null ? void 0 : init.statusText,
      headers: prepareOutgoingHttpHeaders(init, {
        contentType: "text/plain; charset=utf-8",
        dataStreamVersion: "v1"
      }),
      stream: this.toDataStream({ data, getErrorMessage: getErrorMessage4, sendUsage })
    });
  }
  pipeTextStreamToResponse(response, init) {
    writeToServerResponse({
      response,
      status: init == null ? void 0 : init.status,
      statusText: init == null ? void 0 : init.statusText,
      headers: prepareOutgoingHttpHeaders(init, {
        contentType: "text/plain; charset=utf-8"
      }),
      stream: this.textStream.pipeThrough(new TextEncoderStream())
    });
  }
  toAIStreamResponse(options) {
    return this.toDataStreamResponse(options);
  }
  toDataStream(options) {
    const stream = this.toDataStreamInternal({
      getErrorMessage: options == null ? void 0 : options.getErrorMessage,
      sendUsage: options == null ? void 0 : options.sendUsage
    });
    return (options == null ? void 0 : options.data) ? mergeStreams(options == null ? void 0 : options.data.stream, stream) : stream;
  }
  toDataStreamResponse(options) {
    var _a11;
    const init = options == null ? void 0 : "init" in options ? options.init : {
      headers: "headers" in options ? options.headers : void 0,
      status: "status" in options ? options.status : void 0,
      statusText: "statusText" in options ? options.statusText : void 0
    };
    const data = options == null ? void 0 : "data" in options ? options.data : void 0;
    const getErrorMessage4 = options == null ? void 0 : "getErrorMessage" in options ? options.getErrorMessage : void 0;
    const sendUsage = options == null ? void 0 : "sendUsage" in options ? options.sendUsage : void 0;
    return new Response(
      this.toDataStream({ data, getErrorMessage: getErrorMessage4, sendUsage }),
      {
        status: (_a11 = init == null ? void 0 : init.status) != null ? _a11 : 200,
        statusText: init == null ? void 0 : init.statusText,
        headers: prepareResponseHeaders(init, {
          contentType: "text/plain; charset=utf-8",
          dataStreamVersion: "v1"
        })
      }
    );
  }
  toTextStreamResponse(init) {
    var _a11;
    return new Response(this.textStream.pipeThrough(new TextEncoderStream()), {
      status: (_a11 = init == null ? void 0 : init.status) != null ? _a11 : 200,
      headers: prepareResponseHeaders(init, {
        contentType: "text/plain; charset=utf-8"
      })
    });
  }
};
var experimental_streamText = streamText;

// core/middleware/wrap-language-model.ts
var experimental_wrapLanguageModel = ({
  model,
  middleware: { transformParams, wrapGenerate, wrapStream },
  modelId,
  providerId
}) => {
  async function doTransform({
    params,
    type
  }) {
    return transformParams ? await transformParams({ params, type }) : params;
  }
  return {
    specificationVersion: "v1",
    provider: providerId != null ? providerId : model.provider,
    modelId: modelId != null ? modelId : model.modelId,
    defaultObjectGenerationMode: model.defaultObjectGenerationMode,
    supportsImageUrls: model.supportsImageUrls,
    supportsStructuredOutputs: model.supportsStructuredOutputs,
    async doGenerate(params) {
      const transformedParams = await doTransform({ params, type: "generate" });
      const doGenerate = async () => model.doGenerate(transformedParams);
      return wrapGenerate ? wrapGenerate({ doGenerate, params: transformedParams, model }) : doGenerate();
    },
    async doStream(params) {
      const transformedParams = await doTransform({ params, type: "stream" });
      const doStream = async () => model.doStream(transformedParams);
      return wrapStream ? wrapStream({ doStream, params: transformedParams, model }) : doStream();
    }
  };
};

// core/prompt/attachments-to-parts.ts
function attachmentsToParts(attachments) {
  var _a11, _b, _c;
  const parts = [];
  for (const attachment of attachments) {
    let url;
    try {
      url = new URL(attachment.url);
    } catch (error) {
      throw new Error(`Invalid URL: ${attachment.url}`);
    }
    switch (url.protocol) {
      case "http:":
      case "https:": {
        if ((_a11 = attachment.contentType) == null ? void 0 : _a11.startsWith("image/")) {
          parts.push({ type: "image", image: url });
        }
        break;
      }
      case "data:": {
        let header;
        let base64Content;
        let mimeType;
        try {
          [header, base64Content] = attachment.url.split(",");
          mimeType = header.split(";")[0].split(":")[1];
        } catch (error) {
          throw new Error(`Error processing data URL: ${attachment.url}`);
        }
        if (mimeType == null || base64Content == null) {
          throw new Error(`Invalid data URL format: ${attachment.url}`);
        }
        if ((_b = attachment.contentType) == null ? void 0 : _b.startsWith("image/")) {
          parts.push({
            type: "image",
            image: convertDataContentToUint8Array(base64Content)
          });
        } else if ((_c = attachment.contentType) == null ? void 0 : _c.startsWith("text/")) {
          parts.push({
            type: "text",
            text: convertUint8ArrayToText(
              convertDataContentToUint8Array(base64Content)
            )
          });
        }
        break;
      }
      default: {
        throw new Error(`Unsupported URL protocol: ${url.protocol}`);
      }
    }
  }
  return parts;
}

// core/prompt/message-conversion-error.ts
var import_provider12 = require("@ai-sdk/provider");
var name9 = "AI_MessageConversionError";
var marker9 = `vercel.ai.error.${name9}`;
var symbol9 = Symbol.for(marker9);
var _a9;
var MessageConversionError = class extends import_provider12.AISDKError {
  constructor({
    originalMessage,
    message
  }) {
    super({ name: name9, message });
    this[_a9] = true;
    this.originalMessage = originalMessage;
  }
  static isInstance(error) {
    return import_provider12.AISDKError.hasMarker(error, marker9);
  }
};
_a9 = symbol9;

// core/prompt/convert-to-core-messages.ts
function convertToCoreMessages(messages) {
  const coreMessages = [];
  for (const message of messages) {
    const { role, content, toolInvocations, experimental_attachments } = message;
    switch (role) {
      case "system": {
        coreMessages.push({
          role: "system",
          content
        });
        break;
      }
      case "user": {
        coreMessages.push({
          role: "user",
          content: experimental_attachments ? [
            { type: "text", text: content },
            ...attachmentsToParts(experimental_attachments)
          ] : content
        });
        break;
      }
      case "assistant": {
        if (toolInvocations == null) {
          coreMessages.push({ role: "assistant", content });
          break;
        }
        coreMessages.push({
          role: "assistant",
          content: [
            { type: "text", text: content },
            ...toolInvocations.map(({ toolCallId, toolName, args }) => ({
              type: "tool-call",
              toolCallId,
              toolName,
              args
            }))
          ]
        });
        coreMessages.push({
          role: "tool",
          content: toolInvocations.map((ToolInvocation) => {
            if (!("result" in ToolInvocation)) {
              throw new MessageConversionError({
                originalMessage: message,
                message: "ToolInvocation must have a result: " + JSON.stringify(ToolInvocation)
              });
            }
            const { toolCallId, toolName, args, result } = ToolInvocation;
            return {
              type: "tool-result",
              toolCallId,
              toolName,
              args,
              result
            };
          })
        });
        break;
      }
      case "function":
      case "data":
      case "tool": {
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new MessageConversionError({
          originalMessage: message,
          message: `Unsupported role: ${_exhaustiveCheck}`
        });
      }
    }
  }
  return coreMessages;
}

// core/registry/custom-provider.ts
var import_provider13 = require("@ai-sdk/provider");
function experimental_customProvider({
  languageModels,
  textEmbeddingModels,
  fallbackProvider
}) {
  return {
    languageModel(modelId) {
      if (languageModels != null && modelId in languageModels) {
        return languageModels[modelId];
      }
      if (fallbackProvider) {
        return fallbackProvider.languageModel(modelId);
      }
      throw new import_provider13.NoSuchModelError({ modelId, modelType: "languageModel" });
    },
    textEmbeddingModel(modelId) {
      if (textEmbeddingModels != null && modelId in textEmbeddingModels) {
        return textEmbeddingModels[modelId];
      }
      if (fallbackProvider) {
        return fallbackProvider.textEmbeddingModel(modelId);
      }
      throw new import_provider13.NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
    }
  };
}

// core/registry/no-such-provider-error.ts
var import_provider14 = require("@ai-sdk/provider");
var name10 = "AI_NoSuchProviderError";
var marker10 = `vercel.ai.error.${name10}`;
var symbol10 = Symbol.for(marker10);
var _a10;
var NoSuchProviderError = class extends import_provider14.NoSuchModelError {
  constructor({
    modelId,
    modelType,
    providerId,
    availableProviders,
    message = `No such provider: ${providerId} (available providers: ${availableProviders.join()})`
  }) {
    super({ errorName: name10, modelId, modelType, message });
    this[_a10] = true;
    this.providerId = providerId;
    this.availableProviders = availableProviders;
  }
  static isInstance(error) {
    return import_provider14.AISDKError.hasMarker(error, marker10);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isNoSuchProviderError(error) {
    return error instanceof Error && error.name === name10 && typeof error.providerId === "string" && Array.isArray(error.availableProviders);
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      modelId: this.modelId,
      modelType: this.modelType,
      providerId: this.providerId,
      availableProviders: this.availableProviders
    };
  }
};
_a10 = symbol10;

// core/registry/provider-registry.ts
var import_provider15 = require("@ai-sdk/provider");
function experimental_createProviderRegistry(providers) {
  const registry = new DefaultProviderRegistry();
  for (const [id, provider] of Object.entries(providers)) {
    registry.registerProvider({ id, provider });
  }
  return registry;
}
var experimental_createModelRegistry = experimental_createProviderRegistry;
var DefaultProviderRegistry = class {
  constructor() {
    this.providers = {};
  }
  registerProvider({
    id,
    provider
  }) {
    this.providers[id] = provider;
  }
  getProvider(id) {
    const provider = this.providers[id];
    if (provider == null) {
      throw new NoSuchProviderError({
        modelId: id,
        modelType: "languageModel",
        providerId: id,
        availableProviders: Object.keys(this.providers)
      });
    }
    return provider;
  }
  splitId(id, modelType) {
    const index = id.indexOf(":");
    if (index === -1) {
      throw new import_provider15.NoSuchModelError({
        modelId: id,
        modelType,
        message: `Invalid ${modelType} id for registry: ${id} (must be in the format "providerId:modelId")`
      });
    }
    return [id.slice(0, index), id.slice(index + 1)];
  }
  languageModel(id) {
    var _a11, _b;
    const [providerId, modelId] = this.splitId(id, "languageModel");
    const model = (_b = (_a11 = this.getProvider(providerId)).languageModel) == null ? void 0 : _b.call(_a11, modelId);
    if (model == null) {
      throw new import_provider15.NoSuchModelError({ modelId: id, modelType: "languageModel" });
    }
    return model;
  }
  textEmbeddingModel(id) {
    var _a11, _b, _c;
    const [providerId, modelId] = this.splitId(id, "textEmbeddingModel");
    const provider = this.getProvider(providerId);
    const model = (_c = (_a11 = provider.textEmbeddingModel) == null ? void 0 : _a11.call(provider, modelId)) != null ? _c : "textEmbedding" in provider ? (_b = provider.textEmbedding) == null ? void 0 : _b.call(provider, modelId) : void 0;
    if (model == null) {
      throw new import_provider15.NoSuchModelError({
        modelId: id,
        modelType: "textEmbeddingModel"
      });
    }
    return model;
  }
  /**
   * @deprecated Use `textEmbeddingModel` instead.
   */
  textEmbedding(id) {
    return this.textEmbeddingModel(id);
  }
};

// core/tool/tool.ts
function tool(tool2) {
  return tool2;
}

// core/util/cosine-similarity.ts
function cosineSimilarity(vector1, vector2) {
  if (vector1.length !== vector2.length) {
    throw new Error(
      `Vectors must have the same length (vector1: ${vector1.length} elements, vector2: ${vector2.length} elements)`
    );
  }
  return dotProduct(vector1, vector2) / (magnitude(vector1) * magnitude(vector2));
}
function dotProduct(vector1, vector2) {
  return vector1.reduce(
    (accumulator, value, index) => accumulator + value * vector2[index],
    0
  );
}
function magnitude(vector) {
  return Math.sqrt(dotProduct(vector, vector));
}

// errors/index.ts
var import_provider16 = require("@ai-sdk/provider");

// streams/ai-stream.ts
var import_eventsource_parser = require("eventsource-parser");
function createEventStreamTransformer(customParser) {
  const textDecoder = new TextDecoder();
  let eventSourceParser;
  return new TransformStream({
    async start(controller) {
      eventSourceParser = (0, import_eventsource_parser.createParser)(
        (event) => {
          if ("data" in event && event.type === "event" && event.data === "[DONE]" || // Replicate doesn't send [DONE] but does send a 'done' event
          // @see https://replicate.com/docs/streaming
          event.event === "done") {
            controller.terminate();
            return;
          }
          if ("data" in event) {
            const parsedMessage = customParser ? customParser(event.data, {
              event: event.event
            }) : event.data;
            if (parsedMessage)
              controller.enqueue(parsedMessage);
          }
        }
      );
    },
    transform(chunk) {
      eventSourceParser.feed(textDecoder.decode(chunk));
    }
  });
}
function createCallbacksTransformer(cb) {
  const textEncoder = new TextEncoder();
  let aggregatedResponse = "";
  const callbacks = cb || {};
  return new TransformStream({
    async start() {
      if (callbacks.onStart)
        await callbacks.onStart();
    },
    async transform(message, controller) {
      const content = typeof message === "string" ? message : message.content;
      controller.enqueue(textEncoder.encode(content));
      aggregatedResponse += content;
      if (callbacks.onToken)
        await callbacks.onToken(content);
      if (callbacks.onText && typeof message === "string") {
        await callbacks.onText(message);
      }
    },
    async flush() {
      const isOpenAICallbacks = isOfTypeOpenAIStreamCallbacks(callbacks);
      if (callbacks.onCompletion) {
        await callbacks.onCompletion(aggregatedResponse);
      }
      if (callbacks.onFinal && !isOpenAICallbacks) {
        await callbacks.onFinal(aggregatedResponse);
      }
    }
  });
}
function isOfTypeOpenAIStreamCallbacks(callbacks) {
  return "experimental_onFunctionCall" in callbacks;
}
function trimStartOfStreamHelper() {
  let isStreamStart = true;
  return (text) => {
    if (isStreamStart) {
      text = text.trimStart();
      if (text)
        isStreamStart = false;
    }
    return text;
  };
}
function AIStream(response, customParser, callbacks) {
  if (!response.ok) {
    if (response.body) {
      const reader = response.body.getReader();
      return new ReadableStream({
        async start(controller) {
          const { done, value } = await reader.read();
          if (!done) {
            const errorText = new TextDecoder().decode(value);
            controller.error(new Error(`Response error: ${errorText}`));
          }
        }
      });
    } else {
      return new ReadableStream({
        start(controller) {
          controller.error(new Error("Response error: No response body"));
        }
      });
    }
  }
  const responseBodyStream = response.body || createEmptyReadableStream();
  return responseBodyStream.pipeThrough(createEventStreamTransformer(customParser)).pipeThrough(createCallbacksTransformer(callbacks));
}
function createEmptyReadableStream() {
  return new ReadableStream({
    start(controller) {
      controller.close();
    }
  });
}
function readableFromAsyncIterable(iterable) {
  let it = iterable[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await it.next();
      if (done)
        controller.close();
      else
        controller.enqueue(value);
    },
    async cancel(reason) {
      var _a11;
      await ((_a11 = it.return) == null ? void 0 : _a11.call(it, reason));
    }
  });
}

// streams/stream-data.ts
var import_ui_utils7 = require("@ai-sdk/ui-utils");

// util/constants.ts
var HANGING_STREAM_WARNING_TIME_MS = 15 * 1e3;

// streams/stream-data.ts
var StreamData2 = class {
  constructor() {
    this.encoder = new TextEncoder();
    this.controller = null;
    this.isClosed = false;
    this.warningTimeout = null;
    const self = this;
    this.stream = new ReadableStream({
      start: async (controller) => {
        self.controller = controller;
        if (process.env.NODE_ENV === "development") {
          self.warningTimeout = setTimeout(() => {
            console.warn(
              "The data stream is hanging. Did you forget to close it with `data.close()`?"
            );
          }, HANGING_STREAM_WARNING_TIME_MS);
        }
      },
      pull: (controller) => {
      },
      cancel: (reason) => {
        this.isClosed = true;
      }
    });
  }
  async close() {
    if (this.isClosed) {
      throw new Error("Data Stream has already been closed.");
    }
    if (!this.controller) {
      throw new Error("Stream controller is not initialized.");
    }
    this.controller.close();
    this.isClosed = true;
    if (this.warningTimeout) {
      clearTimeout(this.warningTimeout);
    }
  }
  append(value) {
    if (this.isClosed) {
      throw new Error("Data Stream has already been closed.");
    }
    if (!this.controller) {
      throw new Error("Stream controller is not initialized.");
    }
    this.controller.enqueue(
      this.encoder.encode((0, import_ui_utils7.formatStreamPart)("data", [value]))
    );
  }
  appendMessageAnnotation(value) {
    if (this.isClosed) {
      throw new Error("Data Stream has already been closed.");
    }
    if (!this.controller) {
      throw new Error("Stream controller is not initialized.");
    }
    this.controller.enqueue(
      this.encoder.encode((0, import_ui_utils7.formatStreamPart)("message_annotations", [value]))
    );
  }
};
function createStreamDataTransformer() {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  return new TransformStream({
    transform: async (chunk, controller) => {
      const message = decoder.decode(chunk);
      controller.enqueue(encoder.encode((0, import_ui_utils7.formatStreamPart)("text", message)));
    }
  });
}
var experimental_StreamData = class extends StreamData2 {
};

// streams/anthropic-stream.ts
function parseAnthropicStream() {
  let previous = "";
  return (data) => {
    const json = JSON.parse(data);
    if ("error" in json) {
      throw new Error(`${json.error.type}: ${json.error.message}`);
    }
    if (!("completion" in json)) {
      return;
    }
    const text = json.completion;
    if (!previous || text.length > previous.length && text.startsWith(previous)) {
      const delta = text.slice(previous.length);
      previous = text;
      return delta;
    }
    return text;
  };
}
async function* streamable(stream) {
  for await (const chunk of stream) {
    if ("completion" in chunk) {
      const text = chunk.completion;
      if (text)
        yield text;
    } else if ("delta" in chunk) {
      const { delta } = chunk;
      if ("text" in delta) {
        const text = delta.text;
        if (text)
          yield text;
      }
    }
  }
}
function AnthropicStream(res, cb) {
  if (Symbol.asyncIterator in res) {
    return readableFromAsyncIterable(streamable(res)).pipeThrough(createCallbacksTransformer(cb)).pipeThrough(createStreamDataTransformer());
  } else {
    return AIStream(res, parseAnthropicStream(), cb).pipeThrough(
      createStreamDataTransformer()
    );
  }
}

// streams/assistant-response.ts
var import_ui_utils8 = require("@ai-sdk/ui-utils");
function AssistantResponse({ threadId, messageId }, process2) {
  const stream = new ReadableStream({
    async start(controller) {
      var _a11;
      const textEncoder = new TextEncoder();
      const sendMessage = (message) => {
        controller.enqueue(
          textEncoder.encode((0, import_ui_utils8.formatStreamPart)("assistant_message", message))
        );
      };
      const sendDataMessage = (message) => {
        controller.enqueue(
          textEncoder.encode((0, import_ui_utils8.formatStreamPart)("data_message", message))
        );
      };
      const sendError = (errorMessage) => {
        controller.enqueue(
          textEncoder.encode((0, import_ui_utils8.formatStreamPart)("error", errorMessage))
        );
      };
      const forwardStream = async (stream2) => {
        var _a12, _b;
        let result = void 0;
        for await (const value of stream2) {
          switch (value.event) {
            case "thread.message.created": {
              controller.enqueue(
                textEncoder.encode(
                  (0, import_ui_utils8.formatStreamPart)("assistant_message", {
                    id: value.data.id,
                    role: "assistant",
                    content: [{ type: "text", text: { value: "" } }]
                  })
                )
              );
              break;
            }
            case "thread.message.delta": {
              const content = (_a12 = value.data.delta.content) == null ? void 0 : _a12[0];
              if ((content == null ? void 0 : content.type) === "text" && ((_b = content.text) == null ? void 0 : _b.value) != null) {
                controller.enqueue(
                  textEncoder.encode(
                    (0, import_ui_utils8.formatStreamPart)("text", content.text.value)
                  )
                );
              }
              break;
            }
            case "thread.run.completed":
            case "thread.run.requires_action": {
              result = value.data;
              break;
            }
          }
        }
        return result;
      };
      controller.enqueue(
        textEncoder.encode(
          (0, import_ui_utils8.formatStreamPart)("assistant_control_data", {
            threadId,
            messageId
          })
        )
      );
      try {
        await process2({
          threadId,
          messageId,
          sendMessage,
          sendDataMessage,
          forwardStream
        });
      } catch (error) {
        sendError((_a11 = error.message) != null ? _a11 : `${error}`);
      } finally {
        controller.close();
      }
    },
    pull(controller) {
    },
    cancel() {
    }
  });
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
var experimental_AssistantResponse = AssistantResponse;

// streams/aws-bedrock-stream.ts
async function* asDeltaIterable(response, extractTextDeltaFromChunk) {
  var _a11, _b;
  const decoder = new TextDecoder();
  for await (const chunk of (_a11 = response.body) != null ? _a11 : []) {
    const bytes = (_b = chunk.chunk) == null ? void 0 : _b.bytes;
    if (bytes != null) {
      const chunkText = decoder.decode(bytes);
      const chunkJSON = JSON.parse(chunkText);
      const delta = extractTextDeltaFromChunk(chunkJSON);
      if (delta != null) {
        yield delta;
      }
    }
  }
}
function AWSBedrockAnthropicMessagesStream(response, callbacks) {
  return AWSBedrockStream(response, callbacks, (chunk) => {
    var _a11;
    return (_a11 = chunk.delta) == null ? void 0 : _a11.text;
  });
}
function AWSBedrockAnthropicStream(response, callbacks) {
  return AWSBedrockStream(response, callbacks, (chunk) => chunk.completion);
}
function AWSBedrockCohereStream(response, callbacks) {
  return AWSBedrockStream(response, callbacks, (chunk) => chunk == null ? void 0 : chunk.text);
}
function AWSBedrockLlama2Stream(response, callbacks) {
  return AWSBedrockStream(response, callbacks, (chunk) => chunk.generation);
}
function AWSBedrockStream(response, callbacks, extractTextDeltaFromChunk) {
  return readableFromAsyncIterable(
    asDeltaIterable(response, extractTextDeltaFromChunk)
  ).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
}

// streams/cohere-stream.ts
var utf8Decoder = new TextDecoder("utf-8");
async function processLines(lines, controller) {
  for (const line of lines) {
    const { text, is_finished } = JSON.parse(line);
    if (!is_finished) {
      controller.enqueue(text);
    }
  }
}
async function readAndProcessLines(reader, controller) {
  let segment = "";
  while (true) {
    const { value: chunk, done } = await reader.read();
    if (done) {
      break;
    }
    segment += utf8Decoder.decode(chunk, { stream: true });
    const linesArray = segment.split(/\r\n|\n|\r/g);
    segment = linesArray.pop() || "";
    await processLines(linesArray, controller);
  }
  if (segment) {
    const linesArray = [segment];
    await processLines(linesArray, controller);
  }
  controller.close();
}
function createParser2(res) {
  var _a11;
  const reader = (_a11 = res.body) == null ? void 0 : _a11.getReader();
  return new ReadableStream({
    async start(controller) {
      if (!reader) {
        controller.close();
        return;
      }
      await readAndProcessLines(reader, controller);
    }
  });
}
async function* streamable2(stream) {
  for await (const chunk of stream) {
    if (chunk.eventType === "text-generation") {
      const text = chunk.text;
      if (text)
        yield text;
    }
  }
}
function CohereStream(reader, callbacks) {
  if (Symbol.asyncIterator in reader) {
    return readableFromAsyncIterable(streamable2(reader)).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
  } else {
    return createParser2(reader).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
  }
}

// streams/google-generative-ai-stream.ts
async function* streamable3(response) {
  var _a11, _b, _c;
  for await (const chunk of response.stream) {
    const parts = (_c = (_b = (_a11 = chunk.candidates) == null ? void 0 : _a11[0]) == null ? void 0 : _b.content) == null ? void 0 : _c.parts;
    if (parts === void 0) {
      continue;
    }
    const firstPart = parts[0];
    if (typeof firstPart.text === "string") {
      yield firstPart.text;
    }
  }
}
function GoogleGenerativeAIStream(response, cb) {
  return readableFromAsyncIterable(streamable3(response)).pipeThrough(createCallbacksTransformer(cb)).pipeThrough(createStreamDataTransformer());
}

// streams/huggingface-stream.ts
function createParser3(res) {
  const trimStartOfStream = trimStartOfStreamHelper();
  return new ReadableStream({
    async pull(controller) {
      var _a11, _b;
      const { value, done } = await res.next();
      if (done) {
        controller.close();
        return;
      }
      const text = trimStartOfStream((_b = (_a11 = value.token) == null ? void 0 : _a11.text) != null ? _b : "");
      if (!text)
        return;
      if (value.generated_text != null && value.generated_text.length > 0) {
        return;
      }
      if (text === "</s>" || text === "<|endoftext|>" || text === "<|end|>") {
        return;
      }
      controller.enqueue(text);
    }
  });
}
function HuggingFaceStream(res, callbacks) {
  return createParser3(res).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
}

// streams/inkeep-stream.ts
function InkeepStream(res, callbacks) {
  if (!res.body) {
    throw new Error("Response body is null");
  }
  let chat_session_id = "";
  let records_cited;
  const inkeepEventParser = (data, options) => {
    var _a11, _b;
    const { event } = options;
    if (event === "records_cited") {
      records_cited = JSON.parse(data);
      (_a11 = callbacks == null ? void 0 : callbacks.onRecordsCited) == null ? void 0 : _a11.call(callbacks, records_cited);
    }
    if (event === "message_chunk") {
      const inkeepMessageChunk = JSON.parse(data);
      chat_session_id = (_b = inkeepMessageChunk.chat_session_id) != null ? _b : chat_session_id;
      return inkeepMessageChunk.content_chunk;
    }
    return;
  };
  let { onRecordsCited, ...passThroughCallbacks } = callbacks || {};
  passThroughCallbacks = {
    ...passThroughCallbacks,
    onFinal: (completion) => {
      var _a11;
      const inkeepOnFinalMetadata = {
        chat_session_id,
        records_cited
      };
      (_a11 = callbacks == null ? void 0 : callbacks.onFinal) == null ? void 0 : _a11.call(callbacks, completion, inkeepOnFinalMetadata);
    }
  };
  return AIStream(res, inkeepEventParser, passThroughCallbacks).pipeThrough(
    createStreamDataTransformer()
  );
}

// streams/langchain-adapter.ts
var langchain_adapter_exports = {};
__export(langchain_adapter_exports, {
  toAIStream: () => toAIStream,
  toDataStream: () => toDataStream,
  toDataStreamResponse: () => toDataStreamResponse
});
function toAIStream(stream, callbacks) {
  return toDataStream(stream, callbacks);
}
function toDataStream(stream, callbacks) {
  return stream.pipeThrough(
    new TransformStream({
      transform: async (value, controller) => {
        var _a11;
        if (typeof value === "string") {
          controller.enqueue(value);
          return;
        }
        if ("event" in value) {
          if (value.event === "on_chat_model_stream") {
            forwardAIMessageChunk(
              (_a11 = value.data) == null ? void 0 : _a11.chunk,
              controller
            );
          }
          return;
        }
        forwardAIMessageChunk(value, controller);
      }
    })
  ).pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
}
function toDataStreamResponse(stream, options) {
  var _a11;
  const dataStream = toDataStream(stream, options == null ? void 0 : options.callbacks);
  const data = options == null ? void 0 : options.data;
  const init = options == null ? void 0 : options.init;
  const responseStream = data ? mergeStreams(data.stream, dataStream) : dataStream;
  return new Response(responseStream, {
    status: (_a11 = init == null ? void 0 : init.status) != null ? _a11 : 200,
    statusText: init == null ? void 0 : init.statusText,
    headers: prepareResponseHeaders(init, {
      contentType: "text/plain; charset=utf-8",
      dataStreamVersion: "v1"
    })
  });
}
function forwardAIMessageChunk(chunk, controller) {
  if (typeof chunk.content === "string") {
    controller.enqueue(chunk.content);
  } else {
    const content = chunk.content;
    for (const item of content) {
      if (item.type === "text") {
        controller.enqueue(item.text);
      }
    }
  }
}

// streams/langchain-stream.ts
function LangChainStream(callbacks) {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const runs = /* @__PURE__ */ new Set();
  const handleError = async (e, runId) => {
    runs.delete(runId);
    await writer.ready;
    await writer.abort(e);
  };
  const handleStart = async (runId) => {
    runs.add(runId);
  };
  const handleEnd = async (runId) => {
    runs.delete(runId);
    if (runs.size === 0) {
      await writer.ready;
      await writer.close();
    }
  };
  return {
    stream: stream.readable.pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer()),
    writer,
    handlers: {
      handleLLMNewToken: async (token) => {
        await writer.ready;
        await writer.write(token);
      },
      handleLLMStart: async (_llm, _prompts, runId) => {
        handleStart(runId);
      },
      handleLLMEnd: async (_output, runId) => {
        await handleEnd(runId);
      },
      handleLLMError: async (e, runId) => {
        await handleError(e, runId);
      },
      handleChainStart: async (_chain, _inputs, runId) => {
        handleStart(runId);
      },
      handleChainEnd: async (_outputs, runId) => {
        await handleEnd(runId);
      },
      handleChainError: async (e, runId) => {
        await handleError(e, runId);
      },
      handleToolStart: async (_tool, _input, runId) => {
        handleStart(runId);
      },
      handleToolEnd: async (_output, runId) => {
        await handleEnd(runId);
      },
      handleToolError: async (e, runId) => {
        await handleError(e, runId);
      }
    }
  };
}

// streams/mistral-stream.ts
async function* streamable4(stream) {
  var _a11, _b;
  for await (const chunk of stream) {
    const content = (_b = (_a11 = chunk.choices[0]) == null ? void 0 : _a11.delta) == null ? void 0 : _b.content;
    if (content === void 0 || content === "") {
      continue;
    }
    yield content;
  }
}
function MistralStream(response, callbacks) {
  const stream = readableFromAsyncIterable(streamable4(response));
  return stream.pipeThrough(createCallbacksTransformer(callbacks)).pipeThrough(createStreamDataTransformer());
}

// streams/openai-stream.ts
var import_ui_utils9 = require("@ai-sdk/ui-utils");
function parseOpenAIStream() {
  const extract = chunkToText();
  return (data) => extract(JSON.parse(data));
}
async function* streamable5(stream) {
  const extract = chunkToText();
  for await (let chunk of stream) {
    if ("promptFilterResults" in chunk) {
      chunk = {
        id: chunk.id,
        created: chunk.created.getDate(),
        object: chunk.object,
        // not exposed by Azure API
        model: chunk.model,
        // not exposed by Azure API
        choices: chunk.choices.map((choice) => {
          var _a11, _b, _c, _d, _e, _f, _g;
          return {
            delta: {
              content: (_a11 = choice.delta) == null ? void 0 : _a11.content,
              function_call: (_b = choice.delta) == null ? void 0 : _b.functionCall,
              role: (_c = choice.delta) == null ? void 0 : _c.role,
              tool_calls: ((_e = (_d = choice.delta) == null ? void 0 : _d.toolCalls) == null ? void 0 : _e.length) ? (_g = (_f = choice.delta) == null ? void 0 : _f.toolCalls) == null ? void 0 : _g.map((toolCall, index) => ({
                index,
                id: toolCall.id,
                function: toolCall.function,
                type: toolCall.type
              })) : void 0
            },
            finish_reason: choice.finishReason,
            index: choice.index
          };
        })
      };
    }
    const text = extract(chunk);
    if (text)
      yield text;
  }
}
function chunkToText() {
  const trimStartOfStream = trimStartOfStreamHelper();
  let isFunctionStreamingIn;
  return (json) => {
    var _a11, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
    if (isChatCompletionChunk(json)) {
      const delta = (_a11 = json.choices[0]) == null ? void 0 : _a11.delta;
      if ((_b = delta.function_call) == null ? void 0 : _b.name) {
        isFunctionStreamingIn = true;
        return {
          isText: false,
          content: `{"function_call": {"name": "${delta.function_call.name}", "arguments": "`
        };
      } else if ((_e = (_d = (_c = delta.tool_calls) == null ? void 0 : _c[0]) == null ? void 0 : _d.function) == null ? void 0 : _e.name) {
        isFunctionStreamingIn = true;
        const toolCall = delta.tool_calls[0];
        if (toolCall.index === 0) {
          return {
            isText: false,
            content: `{"tool_calls":[ {"id": "${toolCall.id}", "type": "function", "function": {"name": "${(_f = toolCall.function) == null ? void 0 : _f.name}", "arguments": "`
          };
        } else {
          return {
            isText: false,
            content: `"}}, {"id": "${toolCall.id}", "type": "function", "function": {"name": "${(_g = toolCall.function) == null ? void 0 : _g.name}", "arguments": "`
          };
        }
      } else if ((_h = delta.function_call) == null ? void 0 : _h.arguments) {
        return {
          isText: false,
          content: cleanupArguments((_i = delta.function_call) == null ? void 0 : _i.arguments)
        };
      } else if ((_l = (_k = (_j = delta.tool_calls) == null ? void 0 : _j[0]) == null ? void 0 : _k.function) == null ? void 0 : _l.arguments) {
        return {
          isText: false,
          content: cleanupArguments((_o = (_n = (_m = delta.tool_calls) == null ? void 0 : _m[0]) == null ? void 0 : _n.function) == null ? void 0 : _o.arguments)
        };
      } else if (isFunctionStreamingIn && (((_p = json.choices[0]) == null ? void 0 : _p.finish_reason) === "function_call" || ((_q = json.choices[0]) == null ? void 0 : _q.finish_reason) === "stop")) {
        isFunctionStreamingIn = false;
        return {
          isText: false,
          content: '"}}'
        };
      } else if (isFunctionStreamingIn && ((_r = json.choices[0]) == null ? void 0 : _r.finish_reason) === "tool_calls") {
        isFunctionStreamingIn = false;
        return {
          isText: false,
          content: '"}}]}'
        };
      }
    }
    const text = trimStartOfStream(
      isChatCompletionChunk(json) && json.choices[0].delta.content ? json.choices[0].delta.content : isCompletion(json) ? json.choices[0].text : ""
    );
    return text;
  };
  function cleanupArguments(argumentChunk) {
    let escapedPartialJson = argumentChunk.replace(/\\/g, "\\\\").replace(/\//g, "\\/").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t").replace(/\f/g, "\\f");
    return `${escapedPartialJson}`;
  }
}
var __internal__OpenAIFnMessagesSymbol = Symbol(
  "internal_openai_fn_messages"
);
function isChatCompletionChunk(data) {
  return "choices" in data && data.choices && data.choices[0] && "delta" in data.choices[0];
}
function isCompletion(data) {
  return "choices" in data && data.choices && data.choices[0] && "text" in data.choices[0];
}
function OpenAIStream(res, callbacks) {
  const cb = callbacks;
  let stream;
  if (Symbol.asyncIterator in res) {
    stream = readableFromAsyncIterable(streamable5(res)).pipeThrough(
      createCallbacksTransformer(
        (cb == null ? void 0 : cb.experimental_onFunctionCall) || (cb == null ? void 0 : cb.experimental_onToolCall) ? {
          ...cb,
          onFinal: void 0
        } : {
          ...cb
        }
      )
    );
  } else {
    stream = AIStream(
      res,
      parseOpenAIStream(),
      (cb == null ? void 0 : cb.experimental_onFunctionCall) || (cb == null ? void 0 : cb.experimental_onToolCall) ? {
        ...cb,
        onFinal: void 0
      } : {
        ...cb
      }
    );
  }
  if (cb && (cb.experimental_onFunctionCall || cb.experimental_onToolCall)) {
    const functionCallTransformer = createFunctionCallTransformer(cb);
    return stream.pipeThrough(functionCallTransformer);
  } else {
    return stream.pipeThrough(createStreamDataTransformer());
  }
}
function createFunctionCallTransformer(callbacks) {
  const textEncoder = new TextEncoder();
  let isFirstChunk = true;
  let aggregatedResponse = "";
  let aggregatedFinalCompletionResponse = "";
  let isFunctionStreamingIn = false;
  let functionCallMessages = callbacks[__internal__OpenAIFnMessagesSymbol] || [];
  const decode = (0, import_ui_utils9.createChunkDecoder)();
  return new TransformStream({
    async transform(chunk, controller) {
      const message = decode(chunk);
      aggregatedFinalCompletionResponse += message;
      const shouldHandleAsFunction = isFirstChunk && (message.startsWith('{"function_call":') || message.startsWith('{"tool_calls":'));
      if (shouldHandleAsFunction) {
        isFunctionStreamingIn = true;
        aggregatedResponse += message;
        isFirstChunk = false;
        return;
      }
      if (!isFunctionStreamingIn) {
        controller.enqueue(
          textEncoder.encode((0, import_ui_utils9.formatStreamPart)("text", message))
        );
        return;
      } else {
        aggregatedResponse += message;
      }
    },
    async flush(controller) {
      try {
        if (!isFirstChunk && isFunctionStreamingIn && (callbacks.experimental_onFunctionCall || callbacks.experimental_onToolCall)) {
          isFunctionStreamingIn = false;
          const payload = JSON.parse(aggregatedResponse);
          let newFunctionCallMessages = [
            ...functionCallMessages
          ];
          let functionResponse = void 0;
          if (callbacks.experimental_onFunctionCall) {
            if (payload.function_call === void 0) {
              console.warn(
                "experimental_onFunctionCall should not be defined when using tools"
              );
            }
            const argumentsPayload = JSON.parse(
              payload.function_call.arguments
            );
            functionResponse = await callbacks.experimental_onFunctionCall(
              {
                name: payload.function_call.name,
                arguments: argumentsPayload
              },
              (result) => {
                newFunctionCallMessages = [
                  ...functionCallMessages,
                  {
                    role: "assistant",
                    content: "",
                    function_call: payload.function_call
                  },
                  {
                    role: "function",
                    name: payload.function_call.name,
                    content: JSON.stringify(result)
                  }
                ];
                return newFunctionCallMessages;
              }
            );
          }
          if (callbacks.experimental_onToolCall) {
            const toolCalls = {
              tools: []
            };
            for (const tool2 of payload.tool_calls) {
              toolCalls.tools.push({
                id: tool2.id,
                type: "function",
                func: {
                  name: tool2.function.name,
                  arguments: JSON.parse(tool2.function.arguments)
                }
              });
            }
            let responseIndex = 0;
            try {
              functionResponse = await callbacks.experimental_onToolCall(
                toolCalls,
                (result) => {
                  if (result) {
                    const { tool_call_id, function_name, tool_call_result } = result;
                    newFunctionCallMessages = [
                      ...newFunctionCallMessages,
                      // Only append the assistant message if it's the first response
                      ...responseIndex === 0 ? [
                        {
                          role: "assistant",
                          content: "",
                          tool_calls: payload.tool_calls.map(
                            (tc) => ({
                              id: tc.id,
                              type: "function",
                              function: {
                                name: tc.function.name,
                                // we send the arguments an object to the user, but as the API expects a string, we need to stringify it
                                arguments: JSON.stringify(
                                  tc.function.arguments
                                )
                              }
                            })
                          )
                        }
                      ] : [],
                      // Append the function call result message
                      {
                        role: "tool",
                        tool_call_id,
                        name: function_name,
                        content: JSON.stringify(tool_call_result)
                      }
                    ];
                    responseIndex++;
                  }
                  return newFunctionCallMessages;
                }
              );
            } catch (e) {
              console.error("Error calling experimental_onToolCall:", e);
            }
          }
          if (!functionResponse) {
            controller.enqueue(
              textEncoder.encode(
                (0, import_ui_utils9.formatStreamPart)(
                  payload.function_call ? "function_call" : "tool_calls",
                  // parse to prevent double-encoding:
                  JSON.parse(aggregatedResponse)
                )
              )
            );
            return;
          } else if (typeof functionResponse === "string") {
            controller.enqueue(
              textEncoder.encode((0, import_ui_utils9.formatStreamPart)("text", functionResponse))
            );
            aggregatedFinalCompletionResponse = functionResponse;
            return;
          }
          const filteredCallbacks = {
            ...callbacks,
            onStart: void 0
          };
          callbacks.onFinal = void 0;
          const openAIStream = OpenAIStream(functionResponse, {
            ...filteredCallbacks,
            [__internal__OpenAIFnMessagesSymbol]: newFunctionCallMessages
          });
          const reader = openAIStream.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            controller.enqueue(value);
          }
        }
      } finally {
        if (callbacks.onFinal && aggregatedFinalCompletionResponse) {
          await callbacks.onFinal(aggregatedFinalCompletionResponse);
        }
      }
    }
  });
}

// streams/replicate-stream.ts
async function ReplicateStream(res, cb, options) {
  var _a11;
  const url = (_a11 = res.urls) == null ? void 0 : _a11.stream;
  if (!url) {
    if (res.error)
      throw new Error(res.error);
    else
      throw new Error("Missing stream URL in Replicate response");
  }
  const eventStream = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "text/event-stream",
      ...options == null ? void 0 : options.headers
    }
  });
  return AIStream(eventStream, void 0, cb).pipeThrough(
    createStreamDataTransformer()
  );
}

// streams/stream-to-response.ts
function streamToResponse(res, response, init, data) {
  var _a11;
  response.writeHead((_a11 = init == null ? void 0 : init.status) != null ? _a11 : 200, {
    "Content-Type": "text/plain; charset=utf-8",
    ...init == null ? void 0 : init.headers
  });
  let processedStream = res;
  if (data) {
    processedStream = mergeStreams(data.stream, res);
  }
  const reader = processedStream.getReader();
  function read() {
    reader.read().then(({ done, value }) => {
      if (done) {
        response.end();
        return;
      }
      response.write(value);
      read();
    });
  }
  read();
}

// streams/streaming-text-response.ts
var StreamingTextResponse = class extends Response {
  constructor(res, init, data) {
    let processedStream = res;
    if (data) {
      processedStream = mergeStreams(data.stream, res);
    }
    super(processedStream, {
      ...init,
      status: 200,
      headers: prepareResponseHeaders(init, {
        contentType: "text/plain; charset=utf-8"
      })
    });
  }
};

// streams/index.ts
var generateId2 = import_provider_utils11.generateId;
var nanoid = import_provider_utils11.generateId;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AISDKError,
  AIStream,
  APICallError,
  AWSBedrockAnthropicMessagesStream,
  AWSBedrockAnthropicStream,
  AWSBedrockCohereStream,
  AWSBedrockLlama2Stream,
  AWSBedrockStream,
  AnthropicStream,
  AssistantResponse,
  CohereStream,
  DownloadError,
  EmptyResponseBodyError,
  GoogleGenerativeAIStream,
  HuggingFaceStream,
  InkeepStream,
  InvalidArgumentError,
  InvalidDataContentError,
  InvalidMessageRoleError,
  InvalidPromptError,
  InvalidResponseDataError,
  InvalidToolArgumentsError,
  JSONParseError,
  LangChainAdapter,
  LangChainStream,
  LoadAPIKeyError,
  MessageConversionError,
  MistralStream,
  NoContentGeneratedError,
  NoObjectGeneratedError,
  NoSuchModelError,
  NoSuchProviderError,
  NoSuchToolError,
  OpenAIStream,
  ReplicateStream,
  RetryError,
  StreamData,
  StreamingTextResponse,
  TypeValidationError,
  UnsupportedFunctionalityError,
  convertToCoreMessages,
  cosineSimilarity,
  createCallbacksTransformer,
  createEventStreamTransformer,
  createStreamDataTransformer,
  embed,
  embedMany,
  experimental_AssistantResponse,
  experimental_StreamData,
  experimental_createModelRegistry,
  experimental_createProviderRegistry,
  experimental_customProvider,
  experimental_generateObject,
  experimental_generateText,
  experimental_streamObject,
  experimental_streamText,
  experimental_wrapLanguageModel,
  formatStreamPart,
  generateId,
  generateObject,
  generateText,
  jsonSchema,
  nanoid,
  parseStreamPart,
  processDataProtocolResponse,
  readDataStream,
  readableFromAsyncIterable,
  streamObject,
  streamText,
  streamToResponse,
  tool,
  trimStartOfStreamHelper
});
//# sourceMappingURL=index.js.map