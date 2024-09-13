// src/mistral-facade.ts
import { loadApiKey, withoutTrailingSlash } from "@ai-sdk/provider-utils";

// src/mistral-chat-language-model.ts
import {
  combineHeaders,
  createEventSourceResponseHandler,
  createJsonResponseHandler,
  postJsonToApi
} from "@ai-sdk/provider-utils";
import { z as z2 } from "zod";

// src/convert-to-mistral-chat-messages.ts
import {
  UnsupportedFunctionalityError
} from "@ai-sdk/provider";
function convertToMistralChatMessages(prompt) {
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        messages.push({ role: "system", content });
        break;
      }
      case "user": {
        messages.push({
          role: "user",
          content: content.map((part) => {
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
                id: part.toolCallId,
                type: "function",
                function: {
                  name: part.toolName,
                  arguments: JSON.stringify(part.args)
                }
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
          role: "assistant",
          content: text,
          tool_calls: toolCalls.length > 0 ? toolCalls : void 0
        });
        break;
      }
      case "tool": {
        for (const toolResponse of content) {
          messages.push({
            role: "tool",
            name: toolResponse.toolName,
            content: JSON.stringify(toolResponse.result),
            tool_call_id: toolResponse.toolCallId
          });
        }
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

// src/map-mistral-finish-reason.ts
function mapMistralFinishReason(finishReason) {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
    case "model_length":
      return "length";
    case "tool_calls":
      return "tool-calls";
    default:
      return "unknown";
  }
}

// src/mistral-error.ts
import { createJsonErrorResponseHandler } from "@ai-sdk/provider-utils";
import { z } from "zod";
var mistralErrorDataSchema = z.object({
  object: z.literal("error"),
  message: z.string(),
  type: z.string(),
  param: z.string().nullable(),
  code: z.string().nullable()
});
var mistralFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: mistralErrorDataSchema,
  errorToMessage: (data) => data.message
});

// src/get-response-metadata.ts
function getResponseMetadata({
  id,
  model,
  created
}) {
  return {
    id: id != null ? id : void 0,
    modelId: model != null ? model : void 0,
    timestamp: created != null ? new Date(created * 1e3) : void 0
  };
}

// src/mistral-chat-language-model.ts
var MistralChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "json";
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
    const warnings = [];
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
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
    if (stopSequences != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "stopSequences"
      });
    }
    if (responseFormat != null && responseFormat.type === "json" && responseFormat.schema != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format schema is not supported"
      });
    }
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      safe_prompt: this.settings.safePrompt,
      // standardized settings:
      max_tokens: maxTokens,
      temperature,
      top_p: topP,
      random_seed: seed,
      // response format:
      response_format: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? { type: "json_object" } : void 0,
      // messages:
      messages: convertToMistralChatMessages(prompt)
    };
    switch (type) {
      case "regular": {
        return {
          args: { ...baseArgs, ...prepareToolsAndToolChoice(mode) },
          warnings
        };
      }
      case "object-json": {
        return {
          args: {
            ...baseArgs,
            response_format: { type: "json_object" }
          },
          warnings
        };
      }
      case "object-tool": {
        return {
          args: {
            ...baseArgs,
            tool_choice: "any",
            tools: [{ type: "function", function: mode.tool }]
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
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: mistralFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        mistralChatResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    const choice = response.choices[0];
    return {
      text: (_a = choice.message.content) != null ? _a : void 0,
      toolCalls: (_b = choice.message.tool_calls) == null ? void 0 : _b.map((toolCall) => ({
        toolCallType: "function",
        toolCallId: toolCall.id,
        toolName: toolCall.function.name,
        args: toolCall.function.arguments
      })),
      finishReason: mapMistralFinishReason(choice.finish_reason),
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      response: getResponseMetadata(response),
      warnings
    };
  }
  async doStream(options) {
    const { args, warnings } = this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body: { ...args, stream: true },
      failedResponseHandler: mistralFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        mistralChatChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    let isFirstChunk = true;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            if (isFirstChunk) {
              isFirstChunk = false;
              controller.enqueue({
                type: "response-metadata",
                ...getResponseMetadata(value)
              });
            }
            if (value.usage != null) {
              usage = {
                promptTokens: value.usage.prompt_tokens,
                completionTokens: value.usage.completion_tokens
              };
            }
            const choice = value.choices[0];
            if ((choice == null ? void 0 : choice.finish_reason) != null) {
              finishReason = mapMistralFinishReason(choice.finish_reason);
            }
            if ((choice == null ? void 0 : choice.delta) == null) {
              return;
            }
            const delta = choice.delta;
            if (delta.content != null) {
              controller.enqueue({
                type: "text-delta",
                textDelta: delta.content
              });
            }
            if (delta.tool_calls != null) {
              for (const toolCall of delta.tool_calls) {
                controller.enqueue({
                  type: "tool-call-delta",
                  toolCallType: "function",
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  argsTextDelta: toolCall.function.arguments
                });
                controller.enqueue({
                  type: "tool-call",
                  toolCallType: "function",
                  toolCallId: toolCall.id,
                  toolName: toolCall.function.name,
                  args: toolCall.function.arguments
                });
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
var mistralChatResponseSchema = z2.object({
  id: z2.string().nullish(),
  created: z2.number().nullish(),
  model: z2.string().nullish(),
  choices: z2.array(
    z2.object({
      message: z2.object({
        role: z2.literal("assistant"),
        content: z2.string().nullable(),
        tool_calls: z2.array(
          z2.object({
            id: z2.string(),
            function: z2.object({ name: z2.string(), arguments: z2.string() })
          })
        ).nullish()
      }),
      index: z2.number(),
      finish_reason: z2.string().nullish()
    })
  ),
  object: z2.literal("chat.completion"),
  usage: z2.object({
    prompt_tokens: z2.number(),
    completion_tokens: z2.number()
  })
});
var mistralChatChunkSchema = z2.object({
  id: z2.string().nullish(),
  created: z2.number().nullish(),
  model: z2.string().nullish(),
  choices: z2.array(
    z2.object({
      delta: z2.object({
        role: z2.enum(["assistant"]).optional(),
        content: z2.string().nullish(),
        tool_calls: z2.array(
          z2.object({
            id: z2.string(),
            function: z2.object({ name: z2.string(), arguments: z2.string() })
          })
        ).nullish()
      }),
      finish_reason: z2.string().nullish(),
      index: z2.number()
    })
  ),
  usage: z2.object({
    prompt_tokens: z2.number(),
    completion_tokens: z2.number()
  }).nullish()
});
function prepareToolsAndToolChoice(mode) {
  var _a;
  const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0 };
  }
  const mappedTools = tools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return { tools: mappedTools, tool_choice: void 0 };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
    case "none":
      return { tools: mappedTools, tool_choice: type };
    case "required":
      return { tools: mappedTools, tool_choice: "any" };
    case "tool":
      return {
        tools: mappedTools.filter(
          (tool) => tool.function.name === toolChoice.toolName
        ),
        tool_choice: "any"
      };
    default: {
      const _exhaustiveCheck = type;
      throw new Error(`Unsupported tool choice type: ${_exhaustiveCheck}`);
    }
  }
}

// src/mistral-facade.ts
var Mistral = class {
  /**
   * Creates a new Mistral provider instance.
   */
  constructor(options = {}) {
    var _a, _b;
    this.baseURL = (_b = withoutTrailingSlash((_a = options.baseURL) != null ? _a : options.baseUrl)) != null ? _b : "https://api.mistral.ai/v1";
    this.apiKey = options.apiKey;
    this.headers = options.headers;
  }
  get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: () => ({
        Authorization: `Bearer ${loadApiKey({
          apiKey: this.apiKey,
          environmentVariableName: "MISTRAL_API_KEY",
          description: "Mistral"
        })}`,
        ...this.headers
      })
    };
  }
  chat(modelId, settings = {}) {
    return new MistralChatLanguageModel(modelId, settings, {
      provider: "mistral.chat",
      ...this.baseConfig
    });
  }
};

// src/mistral-provider.ts
import {
  loadApiKey as loadApiKey2,
  withoutTrailingSlash as withoutTrailingSlash2
} from "@ai-sdk/provider-utils";

// src/mistral-embedding-model.ts
import {
  TooManyEmbeddingValuesForCallError
} from "@ai-sdk/provider";
import {
  combineHeaders as combineHeaders2,
  createJsonResponseHandler as createJsonResponseHandler2,
  postJsonToApi as postJsonToApi2
} from "@ai-sdk/provider-utils";
import { z as z3 } from "zod";
var MistralEmbeddingModel = class {
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
    var _a;
    return (_a = this.settings.maxEmbeddingsPerCall) != null ? _a : 32;
  }
  get supportsParallelCalls() {
    var _a;
    return (_a = this.settings.supportsParallelCalls) != null ? _a : false;
  }
  async doEmbed({
    values,
    abortSignal,
    headers
  }) {
    if (values.length > this.maxEmbeddingsPerCall) {
      throw new TooManyEmbeddingValuesForCallError({
        provider: this.provider,
        modelId: this.modelId,
        maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
        values
      });
    }
    const { responseHeaders, value: response } = await postJsonToApi2({
      url: `${this.config.baseURL}/embeddings`,
      headers: combineHeaders2(this.config.headers(), headers),
      body: {
        model: this.modelId,
        input: values,
        encoding_format: "float"
      },
      failedResponseHandler: mistralFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler2(
        MistralTextEmbeddingResponseSchema
      ),
      abortSignal,
      fetch: this.config.fetch
    });
    return {
      embeddings: response.data.map((item) => item.embedding),
      usage: response.usage ? { tokens: response.usage.prompt_tokens } : void 0,
      rawResponse: { headers: responseHeaders }
    };
  }
};
var MistralTextEmbeddingResponseSchema = z3.object({
  data: z3.array(z3.object({ embedding: z3.array(z3.number()) })),
  usage: z3.object({ prompt_tokens: z3.number() }).nullish()
});

// src/mistral-provider.ts
function createMistral(options = {}) {
  var _a, _b;
  const baseURL = (_b = withoutTrailingSlash2((_a = options.baseURL) != null ? _a : options.baseUrl)) != null ? _b : "https://api.mistral.ai/v1";
  const getHeaders = () => ({
    Authorization: `Bearer ${loadApiKey2({
      apiKey: options.apiKey,
      environmentVariableName: "MISTRAL_API_KEY",
      description: "Mistral"
    })}`,
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => new MistralChatLanguageModel(modelId, settings, {
    provider: "mistral.chat",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId, settings = {}) => new MistralEmbeddingModel(modelId, settings, {
    provider: "mistral.embedding",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Mistral model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
var mistral = createMistral();
export {
  Mistral,
  createMistral,
  mistral
};
//# sourceMappingURL=index.mjs.map