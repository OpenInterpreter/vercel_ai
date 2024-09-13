// src/cohere-provider.ts
import {
  generateId,
  loadApiKey,
  withoutTrailingSlash
} from "@ai-sdk/provider-utils";

// src/cohere-chat-language-model.ts
import {
  UnsupportedFunctionalityError as UnsupportedFunctionalityError2
} from "@ai-sdk/provider";
import {
  combineHeaders,
  createJsonResponseHandler,
  createJsonStreamResponseHandler,
  postJsonToApi
} from "@ai-sdk/provider-utils";
import { z as z2 } from "zod";

// src/cohere-error.ts
import { createJsonErrorResponseHandler } from "@ai-sdk/provider-utils";
import { z } from "zod";
var cohereErrorDataSchema = z.object({
  message: z.string()
});
var cohereFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: cohereErrorDataSchema,
  errorToMessage: (data) => data.message
});

// src/convert-to-cohere-chat-prompt.ts
import {
  UnsupportedFunctionalityError
} from "@ai-sdk/provider";
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
                throw new UnsupportedFunctionalityError({
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
        throw new UnsupportedFunctionalityError2({
          functionality: "object-json mode"
        });
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError2({
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
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
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
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body: {
        ...args,
        stream: true
      },
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: createJsonStreamResponseHandler(
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
var cohereChatResponseSchema = z2.object({
  generation_id: z2.string().nullish(),
  text: z2.string(),
  tool_calls: z2.array(
    z2.object({
      name: z2.string(),
      parameters: z2.unknown({})
    })
  ).nullish(),
  finish_reason: z2.string(),
  meta: z2.object({
    tokens: z2.object({
      input_tokens: z2.number(),
      output_tokens: z2.number()
    })
  })
});
var cohereChatChunkSchema = z2.discriminatedUnion("event_type", [
  z2.object({
    event_type: z2.literal("stream-start"),
    generation_id: z2.string().nullish()
  }),
  z2.object({
    event_type: z2.literal("search-queries-generation")
  }),
  z2.object({
    event_type: z2.literal("search-results")
  }),
  z2.object({
    event_type: z2.literal("text-generation"),
    text: z2.string()
  }),
  z2.object({
    event_type: z2.literal("citation-generation")
  }),
  z2.object({
    event_type: z2.literal("tool-calls-generation"),
    tool_calls: z2.array(
      z2.object({
        name: z2.string(),
        parameters: z2.unknown({})
      })
    )
  }),
  z2.object({
    event_type: z2.literal("tool-calls-chunk"),
    text: z2.string().optional(),
    tool_call_delta: z2.object({
      index: z2.number(),
      name: z2.string().optional(),
      parameters: z2.string().optional()
    }).optional()
  }),
  z2.object({
    event_type: z2.literal("stream-end"),
    finish_reason: z2.string(),
    response: z2.object({
      meta: z2.object({
        tokens: z2.object({
          input_tokens: z2.number(),
          output_tokens: z2.number()
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
                throw new UnsupportedFunctionalityError2({
                  functionality: "tool call parameter of non-primitive type"
                });
            }
          } else {
            throw new UnsupportedFunctionalityError2({
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
      throw new UnsupportedFunctionalityError2({
        functionality: `Unsupported tool choice type: ${_exhaustiveCheck}`
      });
    }
  }
}

// src/cohere-embedding-model.ts
import {
  TooManyEmbeddingValuesForCallError
} from "@ai-sdk/provider";
import {
  combineHeaders as combineHeaders2,
  createJsonResponseHandler as createJsonResponseHandler2,
  postJsonToApi as postJsonToApi2
} from "@ai-sdk/provider-utils";
import { z as z3 } from "zod";
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
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await postJsonToApi2({
      url: `${this.config.baseURL}/embed`,
      headers: combineHeaders2(this.config.headers(), headers),
      body: {
        model: this.modelId,
        texts: values,
        input_type: (_a = this.settings.inputType) != null ? _a : "search_query",
        truncate: this.settings.truncate
      },
      failedResponseHandler: cohereFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler2(
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
var cohereTextEmbeddingResponseSchema = z3.object({
  embeddings: z3.array(z3.array(z3.number())),
  meta: z3.object({
    billed_units: z3.object({
      input_tokens: z3.number()
    })
  })
});

// src/cohere-provider.ts
function createCohere(options = {}) {
  var _a;
  const baseURL = (_a = withoutTrailingSlash(options.baseURL)) != null ? _a : "https://api.cohere.com/v1";
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey({
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
      generateId: (_a2 = options.generateId) != null ? _a2 : generateId,
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
export {
  cohere,
  createCohere
};
//# sourceMappingURL=index.mjs.map