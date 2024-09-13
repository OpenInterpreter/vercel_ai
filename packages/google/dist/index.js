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
  Google: () => Google,
  createGoogleGenerativeAI: () => createGoogleGenerativeAI,
  google: () => google
});
module.exports = __toCommonJS(src_exports);

// src/google-facade.ts
var import_provider_utils4 = require("@ai-sdk/provider-utils");

// src/google-generative-ai-language-model.ts
var import_provider_utils3 = require("@ai-sdk/provider-utils");
var import_zod2 = require("zod");

// src/convert-json-schema-to-openapi-schema.ts
function convertJSONSchemaToOpenAPISchema(jsonSchema) {
  if (typeof jsonSchema === "boolean") {
    return { type: "boolean", properties: {} };
  }
  const {
    type,
    description,
    required,
    properties,
    items,
    allOf,
    anyOf,
    oneOf,
    format,
    const: constValue,
    minLength
  } = jsonSchema;
  const result = {};
  if (description)
    result.description = description;
  if (required)
    result.required = required;
  if (format)
    result.format = format;
  if (constValue !== void 0) {
    result.enum = [constValue];
  }
  if (type) {
    if (Array.isArray(type)) {
      if (type.includes("null")) {
        result.type = type.filter((t) => t !== "null")[0];
        result.nullable = true;
      } else {
        result.type = type;
      }
    } else if (type === "null") {
      result.type = "null";
    } else {
      result.type = type;
    }
  }
  if (properties) {
    result.properties = Object.entries(properties).reduce(
      (acc, [key, value]) => {
        acc[key] = convertJSONSchemaToOpenAPISchema(value);
        return acc;
      },
      {}
    );
  }
  if (items) {
    result.items = Array.isArray(items) ? items.map(convertJSONSchemaToOpenAPISchema) : convertJSONSchemaToOpenAPISchema(items);
  }
  if (allOf) {
    result.allOf = allOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (anyOf) {
    result.anyOf = anyOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (oneOf) {
    result.oneOf = oneOf.map(convertJSONSchemaToOpenAPISchema);
  }
  if (minLength !== void 0)
    result.minLength = minLength;
  return result;
}

// src/convert-to-google-generative-ai-messages.ts
var import_provider = require("@ai-sdk/provider");
var import_provider_utils = require("@ai-sdk/provider-utils");
function convertToGoogleGenerativeAIMessages(prompt) {
  var _a;
  const systemInstructionParts = [];
  const contents = [];
  let systemMessagesAllowed = true;
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        if (!systemMessagesAllowed) {
          throw new import_provider.UnsupportedFunctionalityError({
            functionality: "system messages are only supported at the beginning of the conversation"
          });
        }
        systemInstructionParts.push({ text: content });
        break;
      }
      case "user": {
        systemMessagesAllowed = false;
        const parts = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              parts.push({ text: part.text });
              break;
            }
            case "image": {
              if (part.image instanceof URL) {
                throw new import_provider.UnsupportedFunctionalityError({
                  functionality: "Image URLs in user messages"
                });
              }
              parts.push({
                inlineData: {
                  mimeType: (_a = part.mimeType) != null ? _a : "image/jpeg",
                  data: (0, import_provider_utils.convertUint8ArrayToBase64)(part.image)
                }
              });
              break;
            }
          }
        }
        contents.push({ role: "user", parts });
        break;
      }
      case "assistant": {
        systemMessagesAllowed = false;
        contents.push({
          role: "model",
          parts: content.map((part) => {
            switch (part.type) {
              case "text": {
                return part.text.length === 0 ? void 0 : { text: part.text };
              }
              case "tool-call": {
                return {
                  functionCall: {
                    name: part.toolName,
                    args: part.args
                  }
                };
              }
            }
          }).filter(
            (part) => part !== void 0
          )
        });
        break;
      }
      case "tool": {
        systemMessagesAllowed = false;
        contents.push({
          role: "user",
          parts: content.map((part) => ({
            functionResponse: {
              name: part.toolName,
              response: part.result
            }
          }))
        });
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return {
    systemInstruction: systemInstructionParts.length > 0 ? { parts: systemInstructionParts } : void 0,
    contents
  };
}

// src/google-error.ts
var import_provider_utils2 = require("@ai-sdk/provider-utils");
var import_zod = require("zod");
var googleErrorDataSchema = import_zod.z.object({
  error: import_zod.z.object({
    code: import_zod.z.number().nullable(),
    message: import_zod.z.string(),
    status: import_zod.z.string()
  })
});
var googleFailedResponseHandler = (0, import_provider_utils2.createJsonErrorResponseHandler)({
  errorSchema: googleErrorDataSchema,
  errorToMessage: (data) => data.error.message
});

// src/map-google-generative-ai-finish-reason.ts
function mapGoogleGenerativeAIFinishReason({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case "STOP":
      return hasToolCalls ? "tool-calls" : "stop";
    case "MAX_TOKENS":
      return "length";
    case "RECITATION":
    case "SAFETY":
      return "content-filter";
    case "FINISH_REASON_UNSPECIFIED":
    case "OTHER":
      return "other";
    default:
      return "unknown";
  }
}

// src/google-generative-ai-language-model.ts
var GoogleGenerativeAILanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
    this.supportsImageUrls = false;
    this.modelId = modelId.startsWith("models/") ? modelId.substring(7) : modelId;
    this.settings = settings;
    this.config = config;
  }
  get supportsObjectGeneration() {
    return this.settings.structuredOutputs !== false;
  }
  get provider() {
    return this.config.provider;
  }
  async getArgs({
    mode,
    prompt,
    maxTokens,
    temperature,
    topP,
    topK,
    frequencyPenalty,
    presencePenalty,
    stopSequences,
    responseFormat,
    seed
  }) {
    var _a;
    const type = mode.type;
    const warnings = [];
    if (frequencyPenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "frequencyPenalty"
      });
    }
    if (presencePenalty != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "presencePenalty"
      });
    }
    if (seed != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "seed"
      });
    }
    const generationConfig = {
      // model specific settings:
      topK: topK != null ? topK : this.settings.topK,
      // standardized settings:
      maxOutputTokens: maxTokens,
      temperature,
      topP,
      stopSequences,
      // response format:
      responseMimeType: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? "application/json" : void 0,
      responseSchema: (responseFormat == null ? void 0 : responseFormat.type) === "json" && responseFormat.schema != null && // Google GenAI does not support all OpenAPI Schema features,
      // so this is needed as an escape hatch:
      this.supportsObjectGeneration ? convertJSONSchemaToOpenAPISchema(responseFormat.schema) : void 0
    };
    const { contents, systemInstruction } = convertToGoogleGenerativeAIMessages(prompt);
    switch (type) {
      case "regular": {
        return {
          args: {
            generationConfig,
            contents,
            systemInstruction,
            safetySettings: this.settings.safetySettings,
            ...prepareToolsAndToolConfig(mode),
            cachedContent: this.settings.cachedContent
          },
          warnings
        };
      }
      case "object-json": {
        return {
          args: {
            generationConfig: {
              ...generationConfig,
              responseMimeType: "application/json",
              responseSchema: mode.schema != null && // Google GenAI does not support all OpenAPI Schema features,
              // so this is needed as an escape hatch:
              this.supportsObjectGeneration ? convertJSONSchemaToOpenAPISchema(mode.schema) : void 0
            },
            contents,
            systemInstruction,
            safetySettings: this.settings.safetySettings,
            cachedContent: this.settings.cachedContent
          },
          warnings
        };
      }
      case "object-tool": {
        return {
          args: {
            generationConfig,
            contents,
            tools: {
              functionDeclarations: [
                {
                  name: mode.tool.name,
                  description: (_a = mode.tool.description) != null ? _a : "",
                  parameters: convertJSONSchemaToOpenAPISchema(
                    mode.tool.parameters
                  )
                }
              ]
            },
            toolConfig: { functionCallingConfig: { mode: "ANY" } },
            safetySettings: this.settings.safetySettings,
            cachedContent: this.settings.cachedContent
          },
          warnings
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a, _b;
    const { args, warnings } = await this.getArgs(options);
    const { responseHeaders, value: response } = await (0, import_provider_utils3.postJsonToApi)({
      url: `${this.config.baseURL}/models/${this.modelId}:generateContent`,
      headers: (0, import_provider_utils3.combineHeaders)(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils3.createJsonResponseHandler)(responseSchema),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { contents: rawPrompt, ...rawSettings } = args;
    const candidate = response.candidates[0];
    const toolCalls = getToolCallsFromParts({
      parts: candidate.content.parts,
      generateId: this.config.generateId
    });
    const usageMetadata = response.usageMetadata;
    return {
      text: getTextFromParts(candidate.content.parts),
      toolCalls,
      finishReason: mapGoogleGenerativeAIFinishReason({
        finishReason: candidate.finishReason,
        hasToolCalls: toolCalls != null && toolCalls.length > 0
      }),
      usage: {
        promptTokens: (_a = usageMetadata == null ? void 0 : usageMetadata.promptTokenCount) != null ? _a : NaN,
        completionTokens: (_b = usageMetadata == null ? void 0 : usageMetadata.candidatesTokenCount) != null ? _b : NaN
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings
    };
  }
  async doStream(options) {
    const { args, warnings } = await this.getArgs(options);
    const { responseHeaders, value: response } = await (0, import_provider_utils3.postJsonToApi)({
      url: `${this.config.baseURL}/models/${this.modelId}:streamGenerateContent?alt=sse`,
      headers: (0, import_provider_utils3.combineHeaders)(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils3.createEventSourceResponseHandler)(chunkSchema),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { contents: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    const generateId3 = this.config.generateId;
    let hasToolCalls = false;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a, _b;
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            const candidate = value.candidates[0];
            if ((candidate == null ? void 0 : candidate.finishReason) != null) {
              finishReason = mapGoogleGenerativeAIFinishReason({
                finishReason: candidate.finishReason,
                hasToolCalls
              });
            }
            const usageMetadata = value.usageMetadata;
            if (usageMetadata != null) {
              usage = {
                promptTokens: (_a = usageMetadata.promptTokenCount) != null ? _a : NaN,
                completionTokens: (_b = usageMetadata.candidatesTokenCount) != null ? _b : NaN
              };
            }
            const content = candidate.content;
            if (content == null) {
              return;
            }
            const deltaText = getTextFromParts(content.parts);
            if (deltaText != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: deltaText
              });
            }
            const toolCallDeltas = getToolCallsFromParts({
              parts: content.parts,
              generateId: generateId3
            });
            if (toolCallDeltas != null) {
              for (const toolCall of toolCallDeltas) {
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  argsTextDelta: toolCall.args
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: toolCall.toolCallId,
                  toolName: toolCall.toolName,
                  args: toolCall.args
                });
                hasToolCalls = true;
              }
            }
          },
          flush(controller) {
            controller.enqueue({ type: "finish", finishReason, usage });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings
    };
  }
};
function getToolCallsFromParts({
  parts,
  generateId: generateId3
}) {
  const functionCallParts = parts.filter(
    (part) => "functionCall" in part
  );
  return functionCallParts.length === 0 ? void 0 : functionCallParts.map((part) => ({
    toolCallType: "function",
    toolCallId: generateId3(),
    toolName: part.functionCall.name,
    args: JSON.stringify(part.functionCall.args)
  }));
}
function getTextFromParts(parts) {
  const textParts = parts.filter((part) => "text" in part);
  return textParts.length === 0 ? void 0 : textParts.map((part) => part.text).join("");
}
var contentSchema = import_zod2.z.object({
  role: import_zod2.z.string(),
  parts: import_zod2.z.array(
    import_zod2.z.union([
      import_zod2.z.object({
        text: import_zod2.z.string()
      }),
      import_zod2.z.object({
        functionCall: import_zod2.z.object({
          name: import_zod2.z.string(),
          args: import_zod2.z.unknown()
        })
      })
    ])
  )
});
var responseSchema = import_zod2.z.object({
  candidates: import_zod2.z.array(
    import_zod2.z.object({
      content: contentSchema,
      finishReason: import_zod2.z.string().optional()
    })
  ),
  usageMetadata: import_zod2.z.object({
    promptTokenCount: import_zod2.z.number(),
    candidatesTokenCount: import_zod2.z.number(),
    totalTokenCount: import_zod2.z.number()
  }).optional()
});
var chunkSchema = import_zod2.z.object({
  candidates: import_zod2.z.array(
    import_zod2.z.object({
      content: contentSchema.optional(),
      finishReason: import_zod2.z.string().optional()
    })
  ),
  usageMetadata: import_zod2.z.object({
    promptTokenCount: import_zod2.z.number(),
    candidatesTokenCount: import_zod2.z.number(),
    totalTokenCount: import_zod2.z.number()
  }).optional()
});
function prepareToolsAndToolConfig(mode) {
  var _a;
  const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
  if (tools == null) {
    return { tools: void 0, toolConfig: void 0 };
  }
  const mappedTools = {
    functionDeclarations: tools.map((tool) => {
      var _a2;
      return {
        name: tool.name,
        description: (_a2 = tool.description) != null ? _a2 : "",
        parameters: convertJSONSchemaToOpenAPISchema(tool.parameters)
      };
    })
  };
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return { tools: mappedTools, toolConfig: void 0 };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return {
        tools: mappedTools,
        toolConfig: { functionCallingConfig: { mode: "AUTO" } }
      };
    case "none":
      return {
        tools: mappedTools,
        toolConfig: { functionCallingConfig: { mode: "NONE" } }
      };
    case "required":
      return {
        tools: mappedTools,
        toolConfig: { functionCallingConfig: { mode: "ANY" } }
      };
    case "tool":
      return {
        tools: mappedTools,
        toolConfig: {
          functionCallingConfig: {
            mode: "ANY",
            allowedFunctionNames: [toolChoice.toolName]
          }
        }
      };
    default: {
      const _exhaustiveCheck = type;
      throw new Error(`Unsupported tool choice type: ${_exhaustiveCheck}`);
    }
  }
}

// src/google-facade.ts
var Google = class {
  /**
   * Creates a new Google provider instance.
   */
  constructor(options = {}) {
    var _a, _b, _c;
    this.baseURL = (_b = (0, import_provider_utils4.withoutTrailingSlash)((_a = options.baseURL) != null ? _a : options.baseUrl)) != null ? _b : "https://generativelanguage.googleapis.com/v1beta";
    this.apiKey = options.apiKey;
    this.headers = options.headers;
    this.generateId = (_c = options.generateId) != null ? _c : import_provider_utils4.generateId;
  }
  get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: () => ({
        "x-goog-api-key": (0, import_provider_utils4.loadApiKey)({
          apiKey: this.apiKey,
          environmentVariableName: "GOOGLE_GENERATIVE_AI_API_KEY",
          description: "Google Generative AI"
        }),
        ...this.headers
      })
    };
  }
  /**
   * @deprecated Use `chat()` instead.
   */
  generativeAI(modelId, settings = {}) {
    return this.chat(modelId, settings);
  }
  chat(modelId, settings = {}) {
    return new GoogleGenerativeAILanguageModel(modelId, settings, {
      provider: "google.generative-ai",
      ...this.baseConfig,
      generateId: this.generateId
    });
  }
};

// src/google-provider.ts
var import_provider_utils6 = require("@ai-sdk/provider-utils");

// src/google-generative-ai-embedding-model.ts
var import_provider2 = require("@ai-sdk/provider");
var import_provider_utils5 = require("@ai-sdk/provider-utils");
var import_zod3 = require("zod");
var GoogleGenerativeAIEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  get maxEmbeddingsPerCall() {
    return 2048;
  }
  get supportsParallelCalls() {
    return true;
  }
  async doEmbed({
    values,
    headers,
    abortSignal
  }) {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new import_provider2.TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await (0, import_provider_utils5.postJsonToApi)({
      url: `${this.config.baseURL}/models/${this.modelId}:batchEmbedContents`,
      headers: (0, import_provider_utils5.combineHeaders)(this.config.headers(), headers),
      body: {
        requests: values.map((value) => ({
          model: `models/${this.modelId}`,
          content: { role: "user", parts: [{ text: value }] },
          outputDimensionality: this.settings.outputDimensionality
        }))
      },
      failedResponseHandler: googleFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils5.createJsonResponseHandler)(
        googleGenerativeAITextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.embeddings.map((item) => item.values),
      usage: void 0,
      rawResponse: { headers: responseHeaders }
    };
  }
};
var googleGenerativeAITextEmbeddingResponseSchema = import_zod3.z.object({
  embeddings: import_zod3.z.array(import_zod3.z.object({ values: import_zod3.z.array(import_zod3.z.number()) }))
});

// src/google-provider.ts
function createGoogleGenerativeAI(options = {}) {
  var _a, _b;
  const baseURL = (_b = (0, import_provider_utils6.withoutTrailingSlash)((_a = options.baseURL) != null ? _a : options.baseUrl)) != null ? _b : "https://generativelanguage.googleapis.com/v1beta";
  const getHeaders = () => ({
    "x-goog-api-key": (0, import_provider_utils6.loadApiKey)({
      apiKey: options.apiKey,
      environmentVariableName: "GOOGLE_GENERATIVE_AI_API_KEY",
      description: "Google Generative AI"
    }),
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => {
    var _a2;
    return new GoogleGenerativeAILanguageModel(modelId, settings, {
      provider: "google.generative-ai",
      baseURL,
      headers: getHeaders,
      generateId: (_a2 = options.generateId) != null ? _a2 : import_provider_utils6.generateId,
      fetch: options.fetch
    });
  };
  const createEmbeddingModel = (modelId, settings = {}) => new GoogleGenerativeAIEmbeddingModel(modelId, settings, {
    provider: "google.generative-ai",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Google Generative AI model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.generativeAI = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
var google = createGoogleGenerativeAI();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Google,
  createGoogleGenerativeAI,
  google
});
//# sourceMappingURL=index.js.map