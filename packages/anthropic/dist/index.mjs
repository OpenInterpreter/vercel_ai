// src/anthropic-facade.ts
import { loadApiKey, withoutTrailingSlash } from "@ai-sdk/provider-utils";

// src/anthropic-messages-language-model.ts
import {
  UnsupportedFunctionalityError as UnsupportedFunctionalityError2
} from "@ai-sdk/provider";
import {
  combineHeaders,
  createEventSourceResponseHandler,
  createJsonResponseHandler,
  postJsonToApi
} from "@ai-sdk/provider-utils";
import { z as z2 } from "zod";

// src/anthropic-error.ts
import { createJsonErrorResponseHandler } from "@ai-sdk/provider-utils";
import { z } from "zod";
var anthropicErrorDataSchema = z.object({
  type: z.literal("error"),
  error: z.object({
    type: z.string(),
    message: z.string()
  })
});
var anthropicFailedResponseHandler = createJsonErrorResponseHandler({
  errorSchema: anthropicErrorDataSchema,
  errorToMessage: (data) => data.error.message
});

// src/convert-to-anthropic-messages-prompt.ts
import {
  UnsupportedFunctionalityError
} from "@ai-sdk/provider";
import { convertUint8ArrayToBase64 } from "@ai-sdk/provider-utils";
function convertToAnthropicMessagesPrompt({
  prompt,
  cacheControl: isCacheControlEnabled
}) {
  var _a, _b, _c, _d;
  const blocks = groupIntoBlocks(prompt);
  let system = void 0;
  const messages = [];
  function getCacheControl(providerMetadata) {
    var _a2;
    if (isCacheControlEnabled === false) {
      return void 0;
    }
    const anthropic2 = providerMetadata == null ? void 0 : providerMetadata.anthropic;
    const cacheControlValue = (_a2 = anthropic2 == null ? void 0 : anthropic2.cacheControl) != null ? _a2 : anthropic2 == null ? void 0 : anthropic2.cache_control;
    return cacheControlValue;
  }
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const type = block.type;
    switch (type) {
      case "system": {
        if (system != null) {
          throw new UnsupportedFunctionalityError({
            functionality: "Multiple system messages that are separated by user/assistant messages"
          });
        }
        system = block.messages.map(({ content, providerMetadata }) => ({
          type: "text",
          text: content,
          cache_control: getCacheControl(providerMetadata)
        }));
        break;
      }
      case "user": {
        const anthropicContent = [];
        for (const message of block.messages) {
          const { role, content } = message;
          switch (role) {
            case "user": {
              for (let j = 0; j < content.length; j++) {
                const part = content[j];
                const isLastPart = j === content.length - 1;
                const cacheControl = (_a = getCacheControl(part.providerMetadata)) != null ? _a : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
                switch (part.type) {
                  case "text": {
                    anthropicContent.push({
                      type: "text",
                      text: part.text,
                      cache_control: cacheControl
                    });
                    break;
                  }
                  case "image": {
                    if (part.image instanceof URL) {
                      throw new UnsupportedFunctionalityError({
                        functionality: "Image URLs in user messages"
                      });
                    }
                    anthropicContent.push({
                      type: "image",
                      source: {
                        type: "base64",
                        media_type: (_b = part.mimeType) != null ? _b : "image/jpeg",
                        data: convertUint8ArrayToBase64(part.image)
                      },
                      cache_control: cacheControl
                    });
                    break;
                  }
                }
              }
              break;
            }
            case "tool": {
              for (let i2 = 0; i2 < content.length; i2++) {
                const part = content[i2];
                const isLastPart = i2 === content.length - 1;
                const cacheControl = (_c = getCacheControl(part.providerMetadata)) != null ? _c : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
                anthropicContent.push({
                  type: "tool_result",
                  tool_use_id: part.toolCallId,
                  content: JSON.stringify(part.result),
                  is_error: part.isError,
                  cache_control: cacheControl
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
        messages.push({ role: "user", content: anthropicContent });
        break;
      }
      case "assistant": {
        const anthropicContent = [];
        for (const message of block.messages) {
          const { content } = message;
          for (let j = 0; j < content.length; j++) {
            const part = content[j];
            const isLastPart = j === content.length - 1;
            const cacheControl = (_d = getCacheControl(part.providerMetadata)) != null ? _d : isLastPart ? getCacheControl(message.providerMetadata) : void 0;
            switch (part.type) {
              case "text": {
                anthropicContent.push({
                  type: "text",
                  text: (
                    // trim the last text part if it's the last message in the block
                    // because Anthropic does not allow trailing whitespace
                    // in pre-filled assistant responses
                    i === blocks.length - 1 && j === block.messages.length - 1 ? part.text.trim() : part.text
                  ),
                  cache_control: cacheControl
                });
                break;
              }
              case "tool-call": {
                anthropicContent.push({
                  type: "tool_use",
                  id: part.toolCallId,
                  name: part.toolName,
                  input: part.args,
                  cache_control: cacheControl
                });
                break;
              }
            }
          }
        }
        messages.push({ role: "assistant", content: anthropicContent });
        break;
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  return {
    system,
    messages
  };
}
function groupIntoBlocks(prompt) {
  const blocks = [];
  let currentBlock = void 0;
  for (const message of prompt) {
    const { role } = message;
    switch (role) {
      case "system": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "system") {
          currentBlock = { type: "system", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "assistant": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "assistant") {
          currentBlock = { type: "assistant", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "user": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      case "tool": {
        if ((currentBlock == null ? void 0 : currentBlock.type) !== "user") {
          currentBlock = { type: "user", messages: [] };
          blocks.push(currentBlock);
        }
        currentBlock.messages.push(message);
        break;
      }
      default: {
        const _exhaustiveCheck = role;
        throw new Error(`Unsupported role: ${_exhaustiveCheck}`);
      }
    }
  }
  return blocks;
}

// src/map-anthropic-stop-reason.ts
function mapAnthropicStopReason(finishReason) {
  switch (finishReason) {
    case "end_turn":
    case "stop_sequence":
      return "stop";
    case "tool_use":
      return "tool-calls";
    case "max_tokens":
      return "length";
    default:
      return "unknown";
  }
}

// src/anthropic-messages-language-model.ts
var AnthropicMessagesLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.defaultObjectGenerationMode = "tool";
    this.supportsImageUrls = false;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
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
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const messagesPrompt = convertToAnthropicMessagesPrompt({
      prompt,
      cacheControl: (_a = this.settings.cacheControl) != null ? _a : false
    });
    const baseArgs = {
      // model id:
      model: this.modelId,
      // model specific settings:
      top_k: topK != null ? topK : this.settings.topK,
      // standardized settings:
      max_tokens: maxTokens != null ? maxTokens : 4096,
      // 4096: max model output tokens
      temperature,
      top_p: topP,
      stop_sequences: stopSequences,
      // prompt:
      system: messagesPrompt.system,
      messages: messagesPrompt.messages
    };
    switch (type) {
      case "regular": {
        return {
          args: { ...baseArgs, ...prepareToolsAndToolChoice(mode) },
          warnings
        };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError2({
          functionality: "json-mode object generation"
        });
      }
      case "object-tool": {
        const { name, description, parameters } = mode.tool;
        return {
          args: {
            ...baseArgs,
            tools: [{ name, description, input_schema: parameters }],
            tool_choice: { type: "tool", name }
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
  getHeaders(optionHeaders) {
    return combineHeaders(
      this.config.headers(),
      this.settings.cacheControl ? { "anthropic-beta": "prompt-caching-2024-07-31" } : {},
      optionHeaders
    );
  }
  async doGenerate(options) {
    var _a, _b, _c, _d;
    const { args, warnings } = await this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/messages`,
      headers: this.getHeaders(options.headers),
      body: args,
      failedResponseHandler: anthropicFailedResponseHandler,
      successfulResponseHandler: createJsonResponseHandler(
        anthropicMessagesResponseSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    let text = "";
    for (const content of response.content) {
      if (content.type === "text") {
        text += content.text;
      }
    }
    let toolCalls = void 0;
    if (response.content.some((content) => content.type === "tool_use")) {
      toolCalls = [];
      for (const content of response.content) {
        if (content.type === "tool_use") {
          toolCalls.push({
            toolCallType: "function",
            toolCallId: content.id,
            toolName: content.name,
            args: JSON.stringify(content.input)
          });
        }
      }
    }
    return {
      text,
      toolCalls,
      finishReason: mapAnthropicStopReason(response.stop_reason),
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens
      },
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      response: {
        id: (_a = response.id) != null ? _a : void 0,
        modelId: (_b = response.model) != null ? _b : void 0
      },
      warnings,
      providerMetadata: this.settings.cacheControl === true ? {
        anthropic: {
          cacheCreationInputTokens: (_c = response.usage.cache_creation_input_tokens) != null ? _c : null,
          cacheReadInputTokens: (_d = response.usage.cache_read_input_tokens) != null ? _d : null
        }
      } : void 0
    };
  }
  async doStream(options) {
    const { args, warnings } = await this.getArgs(options);
    const { responseHeaders, value: response } = await postJsonToApi({
      url: `${this.config.baseURL}/messages`,
      headers: this.getHeaders(options.headers),
      body: { ...args, stream: true },
      failedResponseHandler: anthropicFailedResponseHandler,
      successfulResponseHandler: createEventSourceResponseHandler(
        anthropicMessagesChunkSchema
      ),
      abortSignal: options.abortSignal,
      fetch: this.config.fetch
    });
    const { messages: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    const usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    const toolCallContentBlocks = {};
    let providerMetadata = void 0;
    const self = this;
    return {
      stream: response.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a, _b, _c, _d;
            if (!chunk.success) {
              controller.enqueue({ type: "error", error: chunk.error });
              return;
            }
            const value = chunk.value;
            switch (value.type) {
              case "ping": {
                return;
              }
              case "content_block_start": {
                const contentBlockType = value.content_block.type;
                switch (contentBlockType) {
                  case "text": {
                    return;
                  }
                  case "tool_use": {
                    toolCallContentBlocks[value.index] = {
                      toolCallId: value.content_block.id,
                      toolName: value.content_block.name,
                      jsonText: ""
                    };
                    return;
                  }
                  default: {
                    const _exhaustiveCheck = contentBlockType;
                    throw new Error(
                      `Unsupported content block type: ${_exhaustiveCheck}`
                    );
                  }
                }
              }
              case "content_block_stop": {
                if (toolCallContentBlocks[value.index] != null) {
                  const contentBlock = toolCallContentBlocks[value.index];
                  controller.enqueue({
                    type: "tool-call",
                    toolCallType: "function",
                    toolCallId: contentBlock.toolCallId,
                    toolName: contentBlock.toolName,
                    args: contentBlock.jsonText
                  });
                  delete toolCallContentBlocks[value.index];
                }
                return;
              }
              case "content_block_delta": {
                const deltaType = value.delta.type;
                switch (deltaType) {
                  case "text_delta": {
                    controller.enqueue({
                      type: "text-delta",
                      textDelta: value.delta.text
                    });
                    return;
                  }
                  case "input_json_delta": {
                    const contentBlock = toolCallContentBlocks[value.index];
                    controller.enqueue({
                      type: "tool-call-delta",
                      toolCallType: "function",
                      toolCallId: contentBlock.toolCallId,
                      toolName: contentBlock.toolName,
                      argsTextDelta: value.delta.partial_json
                    });
                    contentBlock.jsonText += value.delta.partial_json;
                    return;
                  }
                  default: {
                    const _exhaustiveCheck = deltaType;
                    throw new Error(
                      `Unsupported delta type: ${_exhaustiveCheck}`
                    );
                  }
                }
              }
              case "message_start": {
                usage.promptTokens = value.message.usage.input_tokens;
                usage.completionTokens = value.message.usage.output_tokens;
                if (self.settings.cacheControl === true) {
                  providerMetadata = {
                    anthropic: {
                      cacheCreationInputTokens: (_a = value.message.usage.cache_creation_input_tokens) != null ? _a : null,
                      cacheReadInputTokens: (_b = value.message.usage.cache_read_input_tokens) != null ? _b : null
                    }
                  };
                }
                controller.enqueue({
                  type: "response-metadata",
                  id: (_c = value.message.id) != null ? _c : void 0,
                  modelId: (_d = value.message.model) != null ? _d : void 0
                });
                return;
              }
              case "message_delta": {
                usage.completionTokens = value.usage.output_tokens;
                finishReason = mapAnthropicStopReason(value.delta.stop_reason);
                return;
              }
              case "message_stop": {
                controller.enqueue({
                  type: "finish",
                  finishReason,
                  usage,
                  providerMetadata
                });
                return;
              }
              case "error": {
                controller.enqueue({ type: "error", error: value.error });
                return;
              }
              default: {
                const _exhaustiveCheck = value;
                throw new Error(`Unsupported chunk type: ${_exhaustiveCheck}`);
              }
            }
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      rawResponse: { headers: responseHeaders },
      warnings
    };
  }
};
var anthropicMessagesResponseSchema = z2.object({
  type: z2.literal("message"),
  id: z2.string().nullish(),
  model: z2.string().nullish(),
  content: z2.array(
    z2.discriminatedUnion("type", [
      z2.object({
        type: z2.literal("text"),
        text: z2.string()
      }),
      z2.object({
        type: z2.literal("tool_use"),
        id: z2.string(),
        name: z2.string(),
        input: z2.unknown()
      })
    ])
  ),
  stop_reason: z2.string().nullish(),
  usage: z2.object({
    input_tokens: z2.number(),
    output_tokens: z2.number(),
    cache_creation_input_tokens: z2.number().nullish(),
    cache_read_input_tokens: z2.number().nullish()
  })
});
var anthropicMessagesChunkSchema = z2.discriminatedUnion("type", [
  z2.object({
    type: z2.literal("message_start"),
    message: z2.object({
      id: z2.string().nullish(),
      model: z2.string().nullish(),
      usage: z2.object({
        input_tokens: z2.number(),
        output_tokens: z2.number(),
        cache_creation_input_tokens: z2.number().nullish(),
        cache_read_input_tokens: z2.number().nullish()
      })
    })
  }),
  z2.object({
    type: z2.literal("content_block_start"),
    index: z2.number(),
    content_block: z2.discriminatedUnion("type", [
      z2.object({
        type: z2.literal("text"),
        text: z2.string()
      }),
      z2.object({
        type: z2.literal("tool_use"),
        id: z2.string(),
        name: z2.string()
      })
    ])
  }),
  z2.object({
    type: z2.literal("content_block_delta"),
    index: z2.number(),
    delta: z2.discriminatedUnion("type", [
      z2.object({
        type: z2.literal("input_json_delta"),
        partial_json: z2.string()
      }),
      z2.object({
        type: z2.literal("text_delta"),
        text: z2.string()
      })
    ])
  }),
  z2.object({
    type: z2.literal("content_block_stop"),
    index: z2.number()
  }),
  z2.object({
    type: z2.literal("error"),
    error: z2.object({
      type: z2.string(),
      message: z2.string()
    })
  }),
  z2.object({
    type: z2.literal("message_delta"),
    delta: z2.object({ stop_reason: z2.string().nullish() }),
    usage: z2.object({ output_tokens: z2.number() })
  }),
  z2.object({
    type: z2.literal("message_stop")
  }),
  z2.object({
    type: z2.literal("ping")
  })
]);
function prepareToolsAndToolChoice(mode) {
  var _a;
  const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
  if (tools == null) {
    return { tools: void 0, tool_choice: void 0 };
  }
  const mappedTools = tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters
  }));
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return { tools: mappedTools, tool_choice: void 0 };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return { tools: mappedTools, tool_choice: { type: "auto" } };
    case "required":
      return { tools: mappedTools, tool_choice: { type: "any" } };
    case "none":
      return { tools: void 0, tool_choice: void 0 };
    case "tool":
      return {
        tools: mappedTools,
        tool_choice: { type: "tool", name: toolChoice.toolName }
      };
    default: {
      const _exhaustiveCheck = type;
      throw new Error(`Unsupported tool choice type: ${_exhaustiveCheck}`);
    }
  }
}

// src/anthropic-facade.ts
var Anthropic = class {
  /**
   * Creates a new Anthropic provider instance.
   */
  constructor(options = {}) {
    var _a, _b;
    this.baseURL = (_b = withoutTrailingSlash((_a = options.baseURL) != null ? _a : options.baseUrl)) != null ? _b : "https://api.anthropic.com/v1";
    this.apiKey = options.apiKey;
    this.headers = options.headers;
  }
  get baseConfig() {
    return {
      baseURL: this.baseURL,
      headers: () => ({
        "anthropic-version": "2023-06-01",
        "x-api-key": loadApiKey({
          apiKey: this.apiKey,
          environmentVariableName: "ANTHROPIC_API_KEY",
          description: "Anthropic"
        }),
        ...this.headers
      })
    };
  }
  /**
   * @deprecated Use `chat()` instead.
   */
  messages(modelId, settings = {}) {
    return this.chat(modelId, settings);
  }
  chat(modelId, settings = {}) {
    return new AnthropicMessagesLanguageModel(modelId, settings, {
      provider: "anthropic.messages",
      ...this.baseConfig
    });
  }
};

// src/anthropic-provider.ts
import {
  NoSuchModelError
} from "@ai-sdk/provider";
import {
  loadApiKey as loadApiKey2,
  withoutTrailingSlash as withoutTrailingSlash2
} from "@ai-sdk/provider-utils";
function createAnthropic(options = {}) {
  var _a, _b;
  const baseURL = (_b = withoutTrailingSlash2((_a = options.baseURL) != null ? _a : options.baseUrl)) != null ? _b : "https://api.anthropic.com/v1";
  const getHeaders = () => ({
    "anthropic-version": "2023-06-01",
    "x-api-key": loadApiKey2({
      apiKey: options.apiKey,
      environmentVariableName: "ANTHROPIC_API_KEY",
      description: "Anthropic"
    }),
    ...options.headers
  });
  const createChatModel = (modelId, settings = {}) => new AnthropicMessagesLanguageModel(modelId, settings, {
    provider: "anthropic.messages",
    baseURL,
    headers: getHeaders,
    fetch: options.fetch
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Anthropic model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.messages = createChatModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  return provider;
}
var anthropic = createAnthropic();
export {
  Anthropic,
  anthropic,
  createAnthropic
};
//# sourceMappingURL=index.mjs.map