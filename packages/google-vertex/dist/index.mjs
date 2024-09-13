// src/google-vertex-provider.ts
import {
  NoSuchModelError
} from "@ai-sdk/provider";
import { generateId, loadSetting } from "@ai-sdk/provider-utils";
import { VertexAI } from "@google-cloud/vertexai";

// src/google-vertex-language-model.ts
import {
  NoContentGeneratedError,
  UnsupportedFunctionalityError as UnsupportedFunctionalityError3
} from "@ai-sdk/provider";
import { convertAsyncGeneratorToReadableStream } from "@ai-sdk/provider-utils";

// src/convert-to-google-vertex-content-request.ts
import {
  UnsupportedFunctionalityError
} from "@ai-sdk/provider";
import { convertUint8ArrayToBase64 } from "@ai-sdk/provider-utils";
function convertToGoogleVertexContentRequest(prompt) {
  var _a;
  const systemInstructionParts = [];
  const contents = [];
  let systemMessagesAllowed = true;
  for (const { role, content } of prompt) {
    switch (role) {
      case "system": {
        if (!systemMessagesAllowed) {
          throw new UnsupportedFunctionalityError({
            functionality: "system messages after first user message"
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
                throw new UnsupportedFunctionalityError({
                  functionality: "Image URLs in user messages"
                });
              }
              parts.push({
                inlineData: {
                  mimeType: (_a = part.mimeType) != null ? _a : "image/jpeg",
                  data: convertUint8ArrayToBase64(part.image)
                }
              });
              break;
            }
            default: {
              const _exhaustiveCheck = part;
              throw new UnsupportedFunctionalityError({
                functionality: `prompt part: ${_exhaustiveCheck}`
              });
            }
          }
        }
        contents.push({ role: "user", parts });
        break;
      }
      case "assistant": {
        systemMessagesAllowed = false;
        contents.push({
          role: "assistant",
          parts: content.filter((part) => part.type !== "text" || part.text.length > 0).map((part) => {
            switch (part.type) {
              case "text": {
                return { text: part.text };
              }
              case "tool-call": {
                return {
                  functionCall: {
                    name: part.toolName,
                    args: part.args
                  }
                };
              }
              default: {
                const _exhaustiveCheck = part;
                throw new UnsupportedFunctionalityError({
                  functionality: `prompt part: ${_exhaustiveCheck}`
                });
              }
            }
          })
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
        throw new UnsupportedFunctionalityError({
          functionality: `role: ${_exhaustiveCheck}`
        });
      }
    }
  }
  return {
    systemInstruction: systemInstructionParts.length > 0 ? { role: "system", parts: systemInstructionParts } : void 0,
    contents
  };
}

// src/map-google-vertex-finish-reason.ts
function mapGoogleVertexFinishReason({
  finishReason,
  hasToolCalls
}) {
  switch (finishReason) {
    case "STOP":
      return hasToolCalls ? "tool-calls" : "stop";
    case "MAX_TOKENS":
      return "length";
    case "BLOCKLIST":
    case "PROHIBITED_CONTENT":
    case "SPII":
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

// src/prepare-function-declaration-schema.ts
import { UnsupportedFunctionalityError as UnsupportedFunctionalityError2 } from "@ai-sdk/provider";
import {
  FunctionDeclarationSchemaType
} from "@google-cloud/vertexai";
var primitiveTypes = {
  string: FunctionDeclarationSchemaType.STRING,
  number: FunctionDeclarationSchemaType.NUMBER,
  integer: FunctionDeclarationSchemaType.INTEGER,
  boolean: FunctionDeclarationSchemaType.BOOLEAN
};
function prepareFunctionDeclarationSchema(jsonSchema) {
  var _a;
  if (typeof jsonSchema === "boolean") {
    return {
      type: FunctionDeclarationSchemaType.BOOLEAN,
      properties: {}
    };
  }
  const type = jsonSchema.type;
  switch (type) {
    case "number":
    case "integer":
    case "boolean":
    case "string":
      return {
        type: primitiveTypes[type],
        description: jsonSchema.description,
        required: jsonSchema.required,
        properties: {}
      };
    case "object":
      return {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: Object.entries((_a = jsonSchema.properties) != null ? _a : {}).reduce(
          (acc, [key, value]) => {
            acc[key] = prepareFunctionDeclarationSchemaProperty(value);
            return acc;
          },
          {}
        ),
        description: jsonSchema.description,
        required: jsonSchema.required
      };
    case "array":
      throw new UnsupportedFunctionalityError2({
        functionality: "arrays are not supported as root or as array parameters"
      });
    default: {
      throw new UnsupportedFunctionalityError2({
        functionality: `json schema type: ${type}`
      });
    }
  }
}
function prepareFunctionDeclarationSchemaProperty(jsonSchema) {
  var _a;
  if (typeof jsonSchema === "boolean") {
    return {
      type: FunctionDeclarationSchemaType.BOOLEAN
    };
  }
  const type = jsonSchema.type;
  switch (type) {
    case "number":
    case "integer":
    case "boolean":
    case "string": {
      return {
        type: primitiveTypes[type],
        description: jsonSchema.description,
        required: jsonSchema.required
      };
    }
    case "array": {
      const items = jsonSchema.items;
      if (items == null) {
        throw new UnsupportedFunctionalityError2({
          functionality: "Array without items is not supported in tool parameters"
        });
      }
      if (Array.isArray(items)) {
        throw new UnsupportedFunctionalityError2({
          functionality: "Tuple arrays are not supported in tool parameters"
        });
      }
      return {
        type: FunctionDeclarationSchemaType.ARRAY,
        description: jsonSchema.description,
        required: jsonSchema.required,
        items: prepareFunctionDeclarationSchema(items)
      };
    }
    case "object":
      return {
        type: FunctionDeclarationSchemaType.OBJECT,
        properties: Object.entries((_a = jsonSchema.properties) != null ? _a : {}).reduce(
          (acc, [key, value]) => {
            acc[key] = prepareFunctionDeclarationSchema(value);
            return acc;
          },
          {}
        ),
        description: jsonSchema.description,
        required: jsonSchema.required
      };
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}

// src/google-vertex-language-model.ts
var GoogleVertexLanguageModel = class {
  constructor(modelId, settings, config) {
    this.specificationVersion = "v1";
    this.provider = "google-vertex";
    this.defaultObjectGenerationMode = "json";
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
    headers
  }) {
    var _a;
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
    const generationConfig = {
      // model specific settings:
      topK: topK != null ? topK : this.settings.topK,
      // standardized settings:
      maxOutputTokens: maxTokens,
      temperature,
      topP,
      stopSequences,
      responseMimeType: (responseFormat == null ? void 0 : responseFormat.type) === "json" ? "application/json" : void 0
    };
    const type = mode.type;
    switch (type) {
      case "regular": {
        const conf = {
          model: this.modelId,
          generationConfig,
          tools: prepareTools({
            mode,
            useSearchGrounding: (_a = this.settings.useSearchGrounding) != null ? _a : false
          }),
          safetySettings: this.settings.safetySettings
        };
        return {
          model: this.config.vertexAI.getGenerativeModel(conf),
          contentRequest: convertToGoogleVertexContentRequest(prompt),
          warnings
        };
      }
      case "object-json": {
        return {
          model: this.config.vertexAI.getGenerativeModel({
            model: this.modelId,
            generationConfig: {
              ...generationConfig,
              responseMimeType: "application/json"
            },
            safetySettings: this.settings.safetySettings
          }),
          contentRequest: convertToGoogleVertexContentRequest(prompt),
          warnings
        };
      }
      case "object-tool": {
        throw new UnsupportedFunctionalityError3({
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
    var _a, _b, _c;
    const { model, contentRequest, warnings } = await this.getArgs(options);
    const { response } = await model.generateContent(contentRequest);
    const firstCandidate = (_a = response.candidates) == null ? void 0 : _a[0];
    if (firstCandidate == null) {
      throw new NoContentGeneratedError({ message: "No candidates returned" });
    }
    const parts = firstCandidate.content.parts;
    const usageMetadata = response.usageMetadata;
    const toolCalls = getToolCallsFromParts({
      parts,
      generateId: this.config.generateId
    });
    return {
      text: getTextFromParts(parts),
      toolCalls,
      finishReason: mapGoogleVertexFinishReason({
        finishReason: firstCandidate.finishReason,
        hasToolCalls: toolCalls != null && toolCalls.length > 0
      }),
      usage: {
        promptTokens: (_b = usageMetadata == null ? void 0 : usageMetadata.promptTokenCount) != null ? _b : NaN,
        completionTokens: (_c = usageMetadata == null ? void 0 : usageMetadata.candidatesTokenCount) != null ? _c : NaN
      },
      rawCall: {
        rawPrompt: contentRequest,
        rawSettings: {}
      },
      warnings
    };
  }
  async doStream(options) {
    const { model, contentRequest, warnings } = await this.getArgs(options);
    const { stream } = await model.generateContentStream(contentRequest);
    let finishReason = "unknown";
    let usage = {
      promptTokens: Number.NaN,
      completionTokens: Number.NaN
    };
    const generateId2 = this.config.generateId;
    let hasToolCalls = false;
    return {
      stream: convertAsyncGeneratorToReadableStream(stream).pipeThrough(
        new TransformStream(
          {
            transform(chunk, controller) {
              var _a, _b, _c;
              const usageMetadata = chunk.usageMetadata;
              if (usageMetadata != null) {
                usage = {
                  promptTokens: (_a = usageMetadata.promptTokenCount) != null ? _a : NaN,
                  completionTokens: (_b = usageMetadata.candidatesTokenCount) != null ? _b : NaN
                };
              }
              const candidate = (_c = chunk.candidates) == null ? void 0 : _c[0];
              if (candidate == null) {
                return;
              }
              if (candidate.finishReason != null) {
                finishReason = mapGoogleVertexFinishReason({
                  finishReason: candidate.finishReason,
                  hasToolCalls
                });
              }
              const content = candidate.content;
              const deltaText = getTextFromParts(content.parts);
              if (deltaText != null) {
                controller.enqueue({
                  type: "text-delta",
                  textDelta: deltaText
                });
              }
              const toolCallDeltas = getToolCallsFromParts({
                parts: content.parts,
                generateId: generateId2
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
              controller.enqueue({
                type: "finish",
                finishReason,
                usage
              });
            }
          }
        )
      ),
      rawCall: {
        rawPrompt: contentRequest,
        rawSettings: {}
      },
      warnings
    };
  }
};
function prepareTools({
  useSearchGrounding,
  mode
}) {
  var _a;
  const tools = ((_a = mode.tools) == null ? void 0 : _a.length) ? mode.tools : void 0;
  const toolChoice = mode.toolChoice;
  if ((toolChoice == null ? void 0 : toolChoice.type) === "none") {
    return void 0;
  }
  if (toolChoice == null || toolChoice.type === "auto") {
    const mappedTools = tools != null ? [
      {
        functionDeclarations: tools.map((tool) => {
          var _a2;
          return {
            name: tool.name,
            description: (_a2 = tool.description) != null ? _a2 : "",
            parameters: prepareFunctionDeclarationSchema(tool.parameters)
          };
        })
      }
    ] : [];
    if (useSearchGrounding) {
      mappedTools.push({ googleSearchRetrieval: {} });
    }
    return mappedTools.length > 0 ? mappedTools : void 0;
  }
  throw new UnsupportedFunctionalityError3({
    functionality: `toolChoice: ${toolChoice.type}`
  });
}
function getToolCallsFromParts({
  parts,
  generateId: generateId2
}) {
  if (parts == null) {
    return void 0;
  }
  return parts.flatMap(
    (part) => part.functionCall == null ? [] : {
      toolCallType: "function",
      toolCallId: generateId2(),
      toolName: part.functionCall.name,
      args: JSON.stringify(part.functionCall.args)
    }
  );
}
function getTextFromParts(parts) {
  if (parts == null) {
    return void 0;
  }
  const textParts = parts.filter((part) => "text" in part);
  return textParts.length === 0 ? void 0 : textParts.map((part) => part.text).join("");
}

// src/google-vertex-provider.ts
function createVertex(options = {}) {
  const createVertexAI = () => {
    var _a, _b;
    const config = {
      project: loadSetting({
        settingValue: options.project,
        settingName: "project",
        environmentVariableName: "GOOGLE_VERTEX_PROJECT",
        description: "Google Vertex project"
      }),
      location: loadSetting({
        settingValue: options.location,
        settingName: "location",
        environmentVariableName: "GOOGLE_VERTEX_LOCATION",
        description: "Google Vertex location"
      }),
      googleAuthOptions: options.googleAuthOptions
    };
    return (_b = (_a = options.createVertexAI) == null ? void 0 : _a.call(options, config)) != null ? _b : new VertexAI(config);
  };
  const createChatModel = (modelId, settings = {}) => {
    var _a;
    return new GoogleVertexLanguageModel(modelId, settings, {
      vertexAI: createVertexAI(),
      generateId: (_a = options.generateId) != null ? _a : generateId
    });
  };
  const provider = function(modelId, settings) {
    if (new.target) {
      throw new Error(
        "The Google Vertex AI model function cannot be called with the new keyword."
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
var vertex = createVertex();
export {
  createVertex,
  vertex
};
//# sourceMappingURL=index.mjs.map