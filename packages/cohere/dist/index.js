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
  cohere: () => cohere,
  createCohere: () => createCohere
});
module.exports = __toCommonJS(src_exports);

// src/cohere-provider.ts
var import_provider_utils4 = require("@ai-sdk/provider-utils");

// src/cohere-chat-language-model.ts
var import_provider2 = require("@ai-sdk/provider");
var import_provider_utils2 = require("@ai-sdk/provider-utils");
var import_zod2 = require("zod");

// src/cohere-error.ts
var import_provider_utils = require("@ai-sdk/provider-utils");
var import_zod = require("zod");
var cohereErrorDataSchema = import_zod.z.object({
  message: import_zod.z.string()
});
var cohereFailedResponseHandler = (0, import_provider_utils.createJsonErrorResponseHandler)({
  errorSchema: cohereErrorDataSchema,
  errorToMessage: (data) => data.message
});

// src/convert-to-cohere-chat-prompt.ts
var import_provider = require("@ai-sdk/provider");
function convertToCohereChatPrompt(prompt) {
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        messages.push({ role: "SYSTEM", message: content });
        break;
      }
      case "user": {
        messages.push({
          role: "USER",
          message: content.map((part) => {
            switch (part.type) {
              case "text": {
                return part.text;
              }
              case "image": {
                throw new import_provider.UnsupportedFunctionalityError({
                  functionality: "image-part"
                });
              }
            }
          }).join("")
        });
        break;
      }
      case "assistant": {
        let text = "";
        const toolCalls = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolCalls.push({
                name: part.toolName,
                parameters: part.args
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new Error(`Unsupported part: ${_exhaustiveCheck}`);
            }
          }
        }
        messages.push({
          role: "CHATBOT",
          message: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        messages.push({
          role: "TOOL",
          tool_results: content.map((toolResult) => ({
            call: {
              name: toolResult.toolName,
              /* 
                            Note: Currently the tool_results field requires we pass the parameters of the tool results again. It it is blank for two reasons:
              
                            1. The parameters are already present in chat_history as a tool message
                            2. The tool core message of the ai sdk does not include parameters
                            
                            It is possible to traverse through the chat history and get the parameters by id but it's currently empty since there wasn't any degradation in the output when left blank.
                            */
              parameters: {}
            },
            outputs: [toolResult.result]
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
  return messages;
}

// src/map-cohere-finish-reason.ts
function mapCohereFinishReason(finishReason) {
  switch (finishReason) {
    case "COMPLETE":
    case "STOP_SEQUENCE":
      return "stop";
    case "MAX_TOKENS":
      return "length";
    case "ERROR":
    case "ERROR_LIMIT":
      return "error";
    case "ERROR_TOXIC":
      return "content-filter";
    case "USER_CANCEL":
      return "other";
    default:
      return "unknown";
  }
}

// src/cohere-chat-language-model.ts
var CohereChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = void 0;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  getArgs({
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
    const type = mode.type;
    const chatPrompt = convertToCohereChatPrompt(prompt);
    const lastMessage = chatPrompt.at(-1);
    const history = chatPrompt.slice(0, -1);
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      // none
      // standardized settings:
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
      max_tokens: maxTokens,
      temperature,
      p: topP,
      k: topK,
      seed,
      stop_sequences: stopSequences,
      // response format:
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? { type: "json_object", schema: responseFormat.schema } : void 0,
      // messages:
      chat_history: history,
      ...(lastMessage == null ? void 0 : lastMessage.role) === "TOOL" ? { tool_results: lastMessage.tool_results } : {},
      message: lastMessage ? lastMessage.role === "USER" ? lastMessage.message : void 0 : void 0
    };
    switch (type) {
      case "regular": {
        return { ...baseArgs, ...prepareToolsAndToolChoice(mode) };
      }
      case "object-json": {
        throw new import_provider2.UnsupportedFunctionalityError({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new import_provider2.UnsupportedFunctionalityError({
          functionality: "object-tool mode"
        });
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a;
    const args = this.getArgs(options);
    const { responseHeaders, value: response } = await (0, import_provider_utils2.postJsonToApi)({
      url: `${this.config.baseURL}/chat`,
      headers: (0, import_provider_utils2.combineHeaders)(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils2.createJsonResponseHandler)(
        cohereChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { chat_history, message, ...rawSettings } = args;
    const generateId2 = this.config.generateId;
    return {
      text: response.text,
      toolCalls: response.tool_calls ? response.tool_calls.map((toolCall) => ({
        toolCallId: generateId2(),
        toolName: toolCall.name,
        args: JSON.stringify(toolCall.parameters),
        toolCallType: "function"
      })) : [],
      finishReason: mapCohereFinishReason(response.finish_reason),
      usage: {
        promptTokens: response.meta.tokens.input_tokens,
        completionTokens: response.meta.tokens.output_tokens
      },
      rawCall: {
        rawPrompt: {
          chat_history,
          message
        },
        rawSettings
      },
      response: {
        id: (_a = response.generation_id) != null ? _a : void 0
      },
      rawResponse: { headers: responseHeaders },
      warnings: void 0
    };
  }
  async doStream(options) {
    const args = this.getArgs(options);
    const { responseHeaders, value: response } = await (0, import_provider_utils2.postJsonToApi)({
      url: `${this.config.baseURL}/chat`,
      headers: (0, import_provider_utils2.combineHeaders)(this.config.headers(), options.headers),
      body: {
        ...args,
        stream: true
      },
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils2.createJsonStreamResponseHandler)(
        cohereChatChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { chat_history, message, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    const generateId2 = this.config.generateId;
    const toolCalls = [];
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a;
            if (!chunk.success) {
              finishReason = "error";
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            const type = value.event_type;
            switch (type) {
              case "text-generation": {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: value.text
                });
                return;
              }
              case "tool-calls-chunk": {
                if (value.tool_call_delta) {
                  const { index } = value.tool_call_delta;
                  if (toolCalls[index] === void 0) {
                    const toolCallId = generateId2();
                    toolCalls[index] = {
                      toolCallId,
                      toolName: ""
                    };
                  }
                  if (value.tool_call_delta.name) {
                    toolCalls[index].toolName = value.tool_call_delta.name;
                    controller.enqueue({
                      type: "tool-call-delta",
                      toolCallType: "function",
                      toolCallId: toolCalls[index].toolCallId,
                      toolName: toolCalls[index].toolName,
                      argsTextDelta: ""
                    });
                  } else if (value.tool_call_delta.parameters) {
                    controller.enqueue({
                      type: "tool-call-delta",
                      toolCallType: "function",
                      toolCallId: toolCalls[index].toolCallId,
                      toolName: toolCalls[index].toolName,
                      argsTextDelta: value.tool_call_delta.parameters
                    });
                  }
                }
                return;
              }
              case "tool-calls-generation": {
                for (let index = 0; index < value.tool_calls.length; index++) {
                  const toolCall = value.tool_calls[index];
                  controller.enqueue({
                    type: "tool-call",
                    toolCallId: toolCalls[index].toolCallId,
                    toolName: toolCalls[index].toolName,
                    toolCallType: "function",
                    args: JSON.stringify(toolCall.parameters)
                  });
                }
                return;
              }
              case "stream-start": {
                controller.enqueue({
                  type: "response-metadata",
                  id: (_a = value.generation_id) != null ? _a : void 0
                });
                return;
              }
              case "stream-end": {
                finishReason = mapCohereFinishReason(value.finish_reason);
                const tokens = value.response.meta.tokens;
                usage = {
                  promptTokens: tokens.input_tokens,
                  completionTokens: tokens.output_tokens
                };
              }
              default: {
                return;
              }
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              usage
            });
          }
        })
      ),
      rawCall: {
        rawPrompt: {
          chat_history,
          message
        },
        rawSettings
      },
      rawResponse: { headers: responseHeaders },
      warnings: []
    };
  }
};
var cohereChatResponseSchema = import_zod2.z.object({
  generation_id: import_zod2.z.string().nullish(),
  text: import_zod2.z.string(),
  tool_calls: import_zod2.z.array(
    import_zod2.z.object({
      name: import_zod2.z.string(),
      parameters: import_zod2.z.unknown({})
    })
  ).nullish(),
  finish_reason: import_zod2.z.string(),
  meta: import_zod2.z.object({
    tokens: import_zod2.z.object({
      input_tokens: import_zod2.z.number(),
      output_tokens: import_zod2.z.number()
    })
  })
});
var cohereChatChunkSchema = import_zod2.z.discriminatedUnion("event_type", [
  import_zod2.z.object({
    event_type: import_zod2.z.literal("stream-start"),
    generation_id: import_zod2.z.string().nullish()
  }),
  import_zod2.z.object({
    event_type: import_zod2.z.literal("search-queries-generation")
  }),
  import_zod2.z.object({
    event_type: import_zod2.z.literal("search-results")
  }),
  import_zod2.z.object({
    event_type: import_zod2.z.literal("text-generation"),
    text: import_zod2.z.string()
  }),
  import_zod2.z.object({
    event_type: import_zod2.z.literal("citation-generation")
  }),
  import_zod2.z.object({
    event_type: import_zod2.z.literal("tool-calls-generation"),
    tool_calls: import_zod2.z.array(
      import_zod2.z.object({
        name: import_zod2.z.string(),
        parameters: import_zod2.z.unknown({})
      })
    )
  }),
  import_zod2.z.object({
    event_type: import_zod2.z.literal("tool-calls-chunk"),
    text: import_zod2.z.string().optional(),
    tool_call_delta: import_zod2.z.object({
      index: import_zod2.z.number(),
      name: import_zod2.z.string().optional(),
      parameters: import_zod2.z.string().optional()
    }).optional()
  }),
  import_zod2.z.object({
    event_type: import_zod2.z.literal("stream-end"),
    finish_reason: import_zod2.z.string(),
    response: import_zod2.z.object({
      meta: import_zod2.z.object({
        tokens: import_zod2.z.object({
          input_tokens: import_zod2.z.number(),
          output_tokens: import_zod2.z.number()
        })
      })
    })
  })
]);
function prepareToolsAndToolChoice(mode) {
  var _a;
  const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
  if (tools == null) {
    return { tools: void 0 };
  }
  const mappedTools = tools.map((tool) => {
    const { properties, required } = tool.parameters;
    const parameterDefinitions = {};
    if (properties) {
      for (const [key, value] of Object.entries(properties)) {
        if (typeof value === "object" && value !== null) {
          const { type: JSONType, description } = value;
          let type2;
          if (typeof JSONType === "string") {
            switch (JSONType) {
              case "string":
                type2 = "str";
                break;
              case "number":
                type2 = "float";
                break;
              case "integer":
                type2 = "int";
                break;
              case "boolean":
                type2 = "bool";
                break;
              default:
                throw new import_provider2.UnsupportedFunctionalityError({
                  functionality: "tool call parameter of non-primitive type"
                });
            }
          } else {
            throw new import_provider2.UnsupportedFunctionalityError({
              functionality: "tool call parameter of non-primitive type"
            });
          }
          parameterDefinitions[key] = {
            required: required ? required.includes(key) : false,
            type: type2,
            description
          };
        }
      }
    }
    return {
      name: tool.name,
      description: tool.description,
      parameterDefinitions
    };
  });
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return { tools: mappedTools, force_single_step: false };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return { tools: mappedTools, force_single_step: false };
    case "required":
      return { tools: mappedTools, force_single_step: true };
    case "none":
      return { tools: void 0, force_single_step: false };
    case "tool":
      return {
        tools: mappedTools.filter((tool) => tool.name === toolChoice.toolName),
        force_single_step: true
      };
    default: {
      const _exhaustiveCheck = type;
      throw new import_provider2.UnsupportedFunctionalityError({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}

// src/cohere-embedding-model.ts
var import_provider3 = require("@ai-sdk/provider");
var import_provider_utils3 = require("@ai-sdk/provider-utils");
var import_zod3 = require("zod");
var CohereEmbeddingModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.maxEmbeddingsPerCall = 96;
    this.supportsParallelCalls = true;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
  }
  get provider() {
    return this.config.provider;
  }
  async doEmbed({
    values,
    headers,
    abortSignal
  }) {
    var _a;
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new import_provider3.TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await (0, import_provider_utils3.postJsonToApi)({
      url: `${this.config.baseURL}/embed`,
      headers: (0, import_provider_utils3.combineHeaders)(this.config.headers(), headers),
      body: {
        model: this.modelId,
        texts: values,
        input_type: (_a = this.settings.inputType) != null ? _a : "search_query",
        truncate: this.settings.truncate
      },
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: (0, import_provider_utils3.createJsonResponseHandler)(
        cohereTextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.embeddings,
      usage: { tokens: response.meta.billed_units.input_tokens },
      rawResponse: { headers: responseHeaders }
    };
  }
};
var cohereTextEmbeddingResponseSchema = import_zod3.z.object({
  embeddings: import_zod3.z.array(import_zod3.z.array(import_zod3.z.number())),
  meta: import_zod3.z.object({
    billed_units: import_zod3.z.object({
      input_tokens: import_zod3.z.number()
    })
  })
});

// src/cohere-provider.ts
function createCohere(options = {}) {
  var _a;
  const baseURL = (_a = (0, import_provider_utils4.withoutTrailingSlash)(options.baseURL)) != null ? _a : "https://api.cohere.com/v1";
  const getHeaders = () => ({
    Authorization: `Bearer ${(0, import_provider_utils4.loadApiKey)({
      apiKey: options.apiKey,
      environmentVariableName: "COHERE_API_KEY",
      description: "Cohere"
    })}`,
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => {
    var _a2;
    return new CohereChatLanguageModel(modelId, settings, {
      provider: "cohere.chat",
      baseURL,
      headers: getHeaders,
      generateId: (_a2 = options.generateId) != null ? _a2 : import_provider_utils4.generateId,
      fetch: options.fetch
    });
  };
  const createTextEmbeddingModel = (modelId, settings = {}) => new CohereEmbeddingModel(modelId, settings, {
    provider: "cohere.textEmbedding",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Cohere model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.embedding = createTextEmbeddingModel;
  provider.textEmbeddingModel = createTextEmbeddingModel;
  return provider;
}
var cohere = createCohere();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cohere,
  createCohere
});
//# sourceMappingURL=index.js.map