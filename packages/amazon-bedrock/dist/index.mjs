// src/bedrock-provider.ts
import {
  NoSuchModelError
} from "@ai-sdk/provider";
import {
  generateId,
  loadOptionalSetting,
  loadSetting
} from "@ai-sdk/provider-utils";
import {
  BedrockRuntimeClient as BedrockRuntimeClient2
} from "@aws-sdk/client-bedrock-runtime";

// src/bedrock-chat-language-model.ts
import {
  UnsupportedFunctionalityError as UnsupportedFunctionalityError2
} from "@ai-sdk/provider";
import {
  ConverseCommand,
  ConverseStreamCommand
} from "@aws-sdk/client-bedrock-runtime";

// src/convert-to-bedrock-chat-messages.ts
import {
  UnsupportedFunctionalityError
} from "@ai-sdk/provider";
function convertToBedrockChatMessages(prompt) {
  var _a, _b, _c;
  let system = void 0;
  const messages = [];
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        if (messages.length > 0) {
          throw new UnsupportedFunctionalityError({
            functionality: "System message after non-system message"
          });
        }
        system = system === void 0 ? content : `${system}
${content}`;
        break;
      }
      case "user": {
        const bedrockMessageContent = [];
        for (const part of content) {
          switch (part.type) {
            case "text": {
              bedrockMessageContent.push({ text: part.text });
              break;
            }
            case "image": {
              if (part.image instanceof URL) {
                throw new UnsupportedFunctionalityError({
                  functionality: "Image URLs in user messages"
                });
              }
              bedrockMessageContent.push({
                image: {
                  format: (_b = (_a = part.mimeType) == null ? void 0 : _a.split("/")) == null ? void 0 : _b[1],
                  source: {
                    bytes: (_c = part.image) != null ? _c : part.image
                  }
                }
              });
              break;
            }
          }
        }
        messages.push({
          role: "user",
          content: bedrockMessageContent
        });
        break;
      }
      case "assistant": {
        const toolUse = [];
        let text = "";
        for (const part of content) {
          switch (part.type) {
            case "text": {
              text += part.text;
              break;
            }
            case "tool-call": {
              toolUse.push({
                toolUseId: part.toolCallId,
                name: part.toolName,
                input: part.args
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
          content: [
            ...text ? [{ text }] : [],
            ...toolUse.map((toolUse2) => ({ toolUse: toolUse2 }))
          ]
        });
        break;
      }
      case "tool":
        messages.push({
          role: "user",
          content: content.map((part) => ({
            toolResult: {
              toolUseId: part.toolCallId,
              status: part.isError ? "error" : "success",
              content: [{ text: JSON.stringify(part.result) }]
            }
          }))
        });
        break;
      default: {
        throw new Error(`Unsupported role: ${role}`);
      }
    }
  }
  return { system, messages };
}

// src/map-bedrock-finish-reason.ts
function mapBedrockFinishReason(finishReason) {
  switch (finishReason) {
    case "stop_sequence":
    case "end_turn":
      return "stop";
    case "max_tokens":
      return "length";
    case "content_filtered":
    case "guardrail_intervened":
      return "content-filter";
    case "tool_use":
      return "tool-calls";
    default:
      return "unknown";
  }
}

// src/bedrock-chat-language-model.ts
var BedrockChatLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.provider = "amazon-bedrock";
    this.defaultObjectGenerationMode = "tool";
    this.supportsImageUrls = false;
    this.modelId = modelId;
    this.settings = settings;
    this.config = config;
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
    seed,
    providerMetadata,
    headers
  }) {
    var _a, _b;
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
    if (headers != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "headers"
      });
    }
    if (topK != null) {
      warnings.push({
        type: "unsupported-setting",
        setting: "topK"
      });
    }
    if (responseFormat != null && responseFormat.type !== "text") {
      warnings.push({
        type: "unsupported-setting",
        setting: "responseFormat",
        details: "JSON response format is not supported."
      });
    }
    const { system, messages } = convertToBedrockChatMessages(prompt);
    const baseArgs = {
      modelId: this.modelId,
      system: system ? [{ text: system }] : void 0,
      additionalModelRequestFields: this.settings.additionalModelRequestFields,
      inferenceConfig: {
        maxTokens,
        temperature,
        topP,
        stopSequences
      },
      messages,
      guardrailConfig: (_a = providerMetadata == null ? void 0 : providerMetadata.bedrock) == null ? void 0 : _a.guardrailConfig
    };
    switch (type) {
      case "regular": {
        const toolConfig = prepareToolsAndToolChoice(mode);
        return {
          ...baseArgs,
          ...((_b = toolConfig.tools) == null ? void 0 : _b.length) ? { toolConfig } : {}
        };
      }
      case "object-json": {
        throw new UnsupportedFunctionalityError2({
          functionality: "json-mode object generation"
        });
      }
      case "object-tool": {
        return {
          ...baseArgs,
          toolConfig: {
            tools: [
              {
                toolSpec: {
                  name: mode.tool.name,
                  description: mode.tool.description,
                  inputSchema: {
                    json: mode.tool.parameters
                  }
                }
              }
            ],
            toolChoice: { tool: { name: mode.tool.name } }
          }
        };
      }
      default: {
        const _exhaustiveCheck = type;
        throw new Error(`Unsupported type: ${_exhaustiveCheck}`);
      }
    }
  }
  async doGenerate(options) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const args = await this.getArgs(options);
    const response = await this.config.client.send(new ConverseCommand(args));
    const { messages: rawPrompt, ...rawSettings } = args;
    const providerMetadata = response.trace ? { bedrock: { trace: response.trace } } : void 0;
    return {
      text: (_d = (_c = (_b = (_a = response.output) == null ? void 0 : _a.message) == null ? void 0 : _b.content) == null ? void 0 : _c.map((part) => {
        var _a2;
        return (_a2 = part.text) != null ? _a2 : "";
      }).join("")) != null ? _d : void 0,
      toolCalls: (_h = (_g = (_f = (_e = response.output) == null ? void 0 : _e.message) == null ? void 0 : _f.content) == null ? void 0 : _g.filter((part) => !!part.toolUse)) == null ? void 0 : _h.map((part) => {
        var _a2, _b2, _c2, _d2, _e2, _f2;
        return {
          toolCallType: "function",
          toolCallId: (_b2 = (_a2 = part.toolUse) == null ? void 0 : _a2.toolUseId) != null ? _b2 : this.config.generateId(),
          toolName: (_d2 = (_c2 = part.toolUse) == null ? void 0 : _c2.name) != null ? _d2 : `tool-${this.config.generateId()}`,
          args: JSON.stringify((_f2 = (_e2 = part.toolUse) == null ? void 0 : _e2.input) != null ? _f2 : "")
        };
      }),
      finishReason: mapBedrockFinishReason(response.stopReason),
      usage: {
        promptTokens: (_j = (_i = response.usage) == null ? void 0 : _i.inputTokens) != null ? _j : Number.NaN,
        completionTokens: (_l = (_k = response.usage) == null ? void 0 : _k.outputTokens) != null ? _l : Number.NaN
      },
      rawCall: { rawPrompt, rawSettings },
      warnings: [],
      providerMetadata
    };
  }
  async doStream(options) {
    const args = await this.getArgs(options);
    const response = await this.config.client.send(
      new ConverseStreamCommand({ ...args })
    );
    const { messages: rawPrompt, ...rawSettings } = args;
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    let providerMetadata = void 0;
    if (!response.stream) {
      throw new Error("No stream found");
    }
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response.stream) {
          controller.enqueue({ success: true, value: chunk });
        }
        controller.close();
      }
    });
    let toolName = "";
    let toolCallId = "";
    let toolCallArgs = "";
    return {
      stream: stream.pipeThrough(
        new TransformStream({
          transform(chunk, controller) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
            function enqueueError(error) {
              finishReason = "error";
              controller.enqueue({ type: "error", error });
            }
            if (!chunk.success) {
              enqueueError(chunk.error);
              return;
            }
            const value = chunk.value;
            if (value.internalServerException) {
              enqueueError(value.internalServerException);
              return;
            }
            if (value.modelStreamErrorException) {
              enqueueError(value.modelStreamErrorException);
              return;
            }
            if (value.throttlingException) {
              enqueueError(value.throttlingException);
              return;
            }
            if (value.validationException) {
              enqueueError(value.validationException);
              return;
            }
            if (value.messageStop) {
              finishReason = mapBedrockFinishReason(
                value.messageStop.stopReason
              );
            }
            if (value.metadata) {
              usage = {
                promptTokens: (_b = (_a = value.metadata.usage) == null ? void 0 : _a.inputTokens) != null ? _b : Number.NaN,
                completionTokens: (_d = (_c = value.metadata.usage) == null ? void 0 : _c.outputTokens) != null ? _d : Number.NaN
              };
              if (value.metadata.trace) {
                providerMetadata = {
                  bedrock: {
                    trace: value.metadata.trace
                  }
                };
              }
            }
            if ((_f = (_e = value.contentBlockDelta) == null ? void 0 : _e.delta) == null ? void 0 : _f.text) {
              controller.enqueue({
                type: "text-delta",
                textDelta: value.contentBlockDelta.delta.text
              });
            }
            if ((_h = (_g = value.contentBlockStart) == null ? void 0 : _g.start) == null ? void 0 : _h.toolUse) {
              const toolUse = value.contentBlockStart.start.toolUse;
              toolName = (_i = toolUse.name) != null ? _i : "";
              toolCallId = (_j = toolUse.toolUseId) != null ? _j : "";
            }
            if ((_l = (_k = value.contentBlockDelta) == null ? void 0 : _k.delta) == null ? void 0 : _l.toolUse) {
              toolCallArgs += (_m = value.contentBlockDelta.delta.toolUse.input) != null ? _m : "";
              controller.enqueue({
                type: "tool-call-delta",
                toolCallType: "function",
                toolCallId,
                toolName,
                argsTextDelta: (_n = value.contentBlockDelta.delta.toolUse.input) != null ? _n : ""
              });
            }
            if (value.contentBlockStop && toolCallArgs.length > 0) {
              controller.enqueue({
                type: "tool-call",
                toolCallType: "function",
                toolCallId,
                toolName,
                args: toolCallArgs
              });
            }
          },
          flush(controller) {
            controller.enqueue({
              type: "finish",
              finishReason,
              usage,
              providerMetadata
            });
          }
        })
      ),
      rawCall: { rawPrompt, rawSettings },
      warnings: []
    };
  }
};
function prepareToolsAndToolChoice(mode) {
  var _a;
  const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
  if (tools == null) {
    return { tools: void 0, toolChoice: void 0 };
  }
  const mappedTools = tools.map((tool) => ({
    toolSpec: {
      name: tool.name,
      description: tool.description,
      inputSchema: {
        json: tool.parameters
      }
    }
  }));
  const toolChoice = mode.toolChoice;
  if (toolChoice == null) {
    return { tools: mappedTools, toolChoice: void 0 };
  }
  const type = toolChoice.type;
  switch (type) {
    case "auto":
      return { tools: mappedTools, toolChoice: { auto: {} } };
    case "required":
      return { tools: mappedTools, toolChoice: { any: {} } };
    case "none":
      return { tools: void 0, toolChoice: void 0 };
    case "tool":
      return {
        tools: mappedTools,
        toolChoice: { tool: { name: toolChoice.toolName } }
      };
    default: {
      const _exhaustiveCheck = type;
      throw new Error(`Unsupported tool choice type: ${_exhaustiveCheck}`);
    }
  }
}

// src/bedrock-provider.ts
function createAmazonBedrock(options = {}) {
  const createBedrockRuntimeClient = () => {
    var _a;
    return new BedrockRuntimeClient2(
      (_a = options.bedrockOptions) != null ? _a : {
        region: loadSetting({
          settingValue: options.region,
          settingName: "region",
          environmentVariableName: "AWS_REGION",
          description: "AWS region"
        }),
        credentials: {
          accessKeyId: loadSetting({
            settingValue: options.accessKeyId,
            settingName: "accessKeyId",
            environmentVariableName: "AWS_ACCESS_KEY_ID",
            description: "AWS access key ID"
          }),
          secretAccessKey: loadSetting({
            settingValue: options.secretAccessKey,
            settingName: "secretAccessKey",
            environmentVariableName: "AWS_SECRET_ACCESS_KEY",
            description: "AWS secret access key"
          }),
          sessionToken: loadOptionalSetting({
            settingValue: options.sessionToken,
            environmentVariableName: "AWS_SESSION_TOKEN"
          })
        }
      }
    );
  };
  const createChatModel = (modelId, settings = {}) => new BedrockChatLanguageModel(modelId, settings, {
    client: createBedrockRuntimeClient(),
    generateId
  });
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Amazon Bedrock model function cannot be called with the new keyword."
      );
    }
    return createChatModel(modelId, settings);
  };
  provider.languageModel = createChatModel;
  provider.textEmbeddingModel = (modelId) => {
    throw new NoSuchModelError({ modelId, modelType: "textEmbeddingModel" });
  };
  return provider;
}
var bedrock = createAmazonBedrock();
export {
  bedrock,
  createAmazonBedrock
};
//# sourceMappingURL=index.mjs.map