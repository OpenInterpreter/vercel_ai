import { Schema, DeepPartial, ToolInvocation, Attachment, JSONValue as JSONValue$1, CreateMessage, FunctionCall as FunctionCall$1, AssistantMessage, DataMessage } from '@ai-sdk/ui-utils';
export { AssistantMessage, AssistantStatus, Attachment, ChatRequest, ChatRequestOptions, CreateMessage, DataMessage, DeepPartial, Function, FunctionCall, FunctionCallHandler, IdGenerator, JSONValue, Message, RequestOptions, Schema, StreamPart, Tool, ToolCall, ToolCallHandler, ToolChoice, ToolInvocation, UseAssistantOptions, formatStreamPart, jsonSchema, parseStreamPart, processDataProtocolResponse, readDataStream } from '@ai-sdk/ui-utils';
import { AttributeValue } from '@opentelemetry/api';
import { EmbeddingModelV1, EmbeddingModelV1Embedding, LanguageModelV1, LanguageModelV1FinishReason, LanguageModelV1LogProbs, LanguageModelV1CallWarning, LanguageModelV1ProviderMetadata, JSONValue, LanguageModelV1CallOptions, NoSuchModelError, AISDKError } from '@ai-sdk/provider';
export { AISDKError, APICallError, EmptyResponseBodyError, InvalidPromptError, InvalidResponseDataError, JSONParseError, LanguageModelV1, LanguageModelV1CallOptions, LanguageModelV1Prompt, LanguageModelV1StreamPart, LoadAPIKeyError, NoContentGeneratedError, NoSuchModelError, TypeValidationError, UnsupportedFunctionalityError } from '@ai-sdk/provider';
import { z } from 'zod';
import { ServerResponse } from 'http';
import { ServerResponse as ServerResponse$1 } from 'node:http';
import { AssistantStream } from 'openai/lib/AssistantStream';
import { Run } from 'openai/resources/beta/threads/runs/runs';

/**
 * Telemetry configuration.
 */
type TelemetrySettings = {
    /**
     * Enable or disable telemetry. Disabled by default while experimental.
     */
    isEnabled?: boolean;
    /**
     * Enable or disable input recording. Enabled by default.
     *
     * You might want to disable input recording to avoid recording sensitive
     * information, to reduce data transfers, or to increase performance.
     */
    recordInputs?: boolean;
    /**
     * Enable or disable output recording. Enabled by default.
     *
     * You might want to disable output recording to avoid recording sensitive
     * information, to reduce data transfers, or to increase performance.
     */
    recordOutputs?: boolean;
    /**
     * Identifier for this function. Used to group telemetry data by function.
     */
    functionId?: string;
    /**
     * Additional information to include in the telemetry data.
     */
    metadata?: Record<string, AttributeValue>;
};

/**
Represents the number of tokens used in a prompt and completion.
 */
type LanguageModelUsage$1 = {
    /**
  The number of tokens used in the prompt.
     */
    promptTokens: number;
    /**
  The number of tokens used in the completion.
   */
    completionTokens: number;
    /**
  The total number of tokens used (promptTokens + completionTokens).
     */
    totalTokens: number;
};
/**
Represents the number of tokens used in an embedding.
 */
type EmbeddingModelUsage$1 = {
    /**
  The number of tokens used in the embedding.
     */
    tokens: number;
};

/**
Embedding model that is used by the AI SDK Core functions.
*/
type EmbeddingModel<VALUE> = EmbeddingModelV1<VALUE>;
/**
Embedding.
 */
type Embedding = EmbeddingModelV1Embedding;

/**
Language model that is used by the AI SDK Core functions.
*/
type LanguageModel = LanguageModelV1;
/**
Reason why a language model finished generating a response.

Can be one of the following:
- `stop`: model generated stop sequence
- `length`: model generated maximum number of tokens
- `content-filter`: content filter violation stopped the model
- `tool-calls`: model triggered tool calls
- `error`: model stopped because of an error
- `other`: model stopped for other reasons
*/
type FinishReason = LanguageModelV1FinishReason;
/**
Log probabilities for each token and its top log probabilities.

@deprecated Will become a provider extension in the future.
 */
type LogProbs = LanguageModelV1LogProbs;
/**
Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.
*/
type CallWarning = LanguageModelV1CallWarning;
/**
Tool choice for the generation. It supports the following settings:

- `auto` (default): the model can choose whether and which tools to call.
- `required`: the model must call a tool. It can choose which tool to call.
- `none`: the model must not call tools
- `{ type: 'tool', toolName: string (typed) }`: the model must call the specified tool
 */
type CoreToolChoice<TOOLS extends Record<string, unknown>> = 'auto' | 'none' | 'required' | {
    type: 'tool';
    toolName: keyof TOOLS;
};
type LanguageModelResponseMetadata = {
    /**
  ID for the generated response.
       */
    id: string;
    /**
  Timestamp for the start of the generated response.
  */
    timestamp: Date;
    /**
  The ID of the response model that was used to generate the response.
  */
    modelId: string;
};
type LanguageModelResponseMetadataWithHeaders = LanguageModelResponseMetadata & {
    headers?: Record<string, string>;
};

/**
 * Provider for language and text embedding models.
 */
type Provider = {
    /**
    Returns the language model with the given id.
    The model id is then passed to the provider function to get the model.
  
    @param {string} id - The id of the model to return.
  
    @returns {LanguageModel} The language model associated with the id
  
    @throws {NoSuchModelError} If no such model exists.
       */
    languageModel(modelId: string): LanguageModel;
    /**
    Returns the text embedding model with the given id.
    The model id is then passed to the provider function to get the model.
  
    @param {string} id - The id of the model to return.
  
    @returns {LanguageModel} The language model associated with the id
  
    @throws {NoSuchModelError} If no such model exists.
       */
    textEmbeddingModel(modelId: string): EmbeddingModel<string>;
};

/**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
 */
type ProviderMetadata = LanguageModelV1ProviderMetadata;

/**
 * @deprecated Use LanguageModelUsage instead.
 */
type TokenUsage = LanguageModelUsage$1;
/**
 * @deprecated Use LanguageModelUsage instead.
 */
type CompletionTokenUsage = LanguageModelUsage$1;
type LanguageModelUsage = LanguageModelUsage$1;
/**
 * @deprecated Use EmbeddingModelUsage instead.
 */
type EmbeddingTokenUsage = EmbeddingModelUsage$1;
type EmbeddingModelUsage = EmbeddingModelUsage$1;

/**
The result of a `embed` call.
It contains the embedding, the value, and additional information.
 */
interface EmbedResult<VALUE> {
    /**
    The value that was embedded.
       */
    readonly value: VALUE;
    /**
    The embedding of the value.
      */
    readonly embedding: Embedding;
    /**
    The embedding token usage.
      */
    readonly usage: EmbeddingModelUsage$1;
    /**
    Optional raw response data.
       */
    readonly rawResponse?: {
        /**
      Response headers.
           */
        headers?: Record<string, string>;
    };
}

/**
Embed a value using an embedding model. The type of the value is defined by the embedding model.

@param model - The embedding model to use.
@param value - The value that should be embedded.

@param maxRetries - Maximum number of retries. Set to 0 to disable retries. Default: 2.
@param abortSignal - An optional abort signal that can be used to cancel the call.
@param headers - Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

@returns A result object that contains the embedding, the value, and additional information.
 */
declare function embed<VALUE>({ model, value, maxRetries, abortSignal, headers, experimental_telemetry: telemetry, }: {
    /**
  The embedding model to use.
       */
    model: EmbeddingModel<VALUE>;
    /**
  The value that should be embedded.
     */
    value: VALUE;
    /**
  Maximum number of retries per embedding model call. Set to 0 to disable retries.
  
  @default 2
     */
    maxRetries?: number;
    /**
  Abort signal.
   */
    abortSignal?: AbortSignal;
    /**
  Additional headers to include in the request.
  Only applicable for HTTP-based providers.
   */
    headers?: Record<string, string>;
    /**
     * Optional telemetry configuration (experimental).
     */
    experimental_telemetry?: TelemetrySettings;
}): Promise<EmbedResult<VALUE>>;

/**
The result of a `embedMany` call.
It contains the embeddings, the values, and additional information.
 */
interface EmbedManyResult<VALUE> {
    /**
    The values that were embedded.
       */
    readonly values: Array<VALUE>;
    /**
    The embeddings. They are in the same order as the values.
      */
    readonly embeddings: Array<Embedding>;
    /**
    The embedding token usage.
      */
    readonly usage: EmbeddingModelUsage$1;
}

/**
Embed several values using an embedding model. The type of the value is defined
by the embedding model.

`embedMany` automatically splits large requests into smaller chunks if the model
has a limit on how many embeddings can be generated in a single call.

@param model - The embedding model to use.
@param values - The values that should be embedded.

@param maxRetries - Maximum number of retries. Set to 0 to disable retries. Default: 2.
@param abortSignal - An optional abort signal that can be used to cancel the call.
@param headers - Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

@returns A result object that contains the embeddings, the value, and additional information.
 */
declare function embedMany<VALUE>({ model, values, maxRetries, abortSignal, headers, experimental_telemetry: telemetry, }: {
    /**
  The embedding model to use.
       */
    model: EmbeddingModel<VALUE>;
    /**
  The values that should be embedded.
     */
    values: Array<VALUE>;
    /**
  Maximum number of retries per embedding model call. Set to 0 to disable retries.
  
  @default 2
     */
    maxRetries?: number;
    /**
  Abort signal.
   */
    abortSignal?: AbortSignal;
    /**
  Additional headers to include in the request.
  Only applicable for HTTP-based providers.
   */
    headers?: Record<string, string>;
    /**
     * Optional telemetry configuration (experimental).
     */
    experimental_telemetry?: TelemetrySettings;
}): Promise<EmbedManyResult<VALUE>>;

type CallSettings = {
    /**
  Maximum number of tokens to generate.
     */
    maxTokens?: number;
    /**
  Temperature setting. This is a number between 0 (almost no randomness) and
  1 (very random).
  
  It is recommended to set either `temperature` or `topP`, but not both.
  
  @default 0
     */
    temperature?: number;
    /**
  Nucleus sampling. This is a number between 0 and 1.
  
  E.g. 0.1 would mean that only tokens with the top 10% probability mass
  are considered.
  
  It is recommended to set either `temperature` or `topP`, but not both.
     */
    topP?: number;
    /**
  Only sample from the top K options for each subsequent token.
  
  Used to remove "long tail" low probability responses.
  Recommended for advanced use cases only. You usually only need to use temperature.
     */
    topK?: number;
    /**
  Presence penalty setting. It affects the likelihood of the model to
  repeat information that is already in the prompt.
  
  The presence penalty is a number between -1 (increase repetition)
  and 1 (maximum penalty, decrease repetition). 0 means no penalty.
  
  @default 0
     */
    presencePenalty?: number;
    /**
  Frequency penalty setting. It affects the likelihood of the model
  to repeatedly use the same words or phrases.
  
  The frequency penalty is a number between -1 (increase repetition)
  and 1 (maximum penalty, decrease repetition). 0 means no penalty.
  
  @default 0
     */
    frequencyPenalty?: number;
    /**
  Stop sequences.
  If set, the model will stop generating text when one of the stop sequences is generated.
  Providers may have limits on the number of stop sequences.
     */
    stopSequences?: string[];
    /**
  The seed (integer) to use for random sampling. If set and supported
  by the model, calls will generate deterministic results.
     */
    seed?: number;
    /**
  Maximum number of retries. Set to 0 to disable retries.
  
  @default 2
     */
    maxRetries?: number;
    /**
  Abort signal.
     */
    abortSignal?: AbortSignal;
    /**
  Additional HTTP headers to be sent with the request.
  Only applicable for HTTP-based providers.
     */
    headers?: Record<string, string | undefined>;
};

/**
Data content. Can either be a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer.
 */
type DataContent = string | Uint8Array | ArrayBuffer | Buffer;

/**
Text content part of a prompt. It contains a string of text.
 */
interface TextPart$1 {
    type: 'text';
    /**
  The text content.
     */
    text: string;
    /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
   */
    experimental_providerMetadata?: ProviderMetadata;
}
/**
Image content part of a prompt. It contains an image.
 */
interface ImagePart {
    type: 'image';
    /**
  Image data. Can either be:
  
  - data: a base64-encoded string, a Uint8Array, an ArrayBuffer, or a Buffer
  - URL: a URL that points to the image
     */
    image: DataContent | URL;
    /**
  Optional mime type of the image.
     */
    mimeType?: string;
    /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
   */
    experimental_providerMetadata?: ProviderMetadata;
}
/**
Tool call content part of a prompt. It contains a tool call (usually generated by the AI model).
 */
interface ToolCallPart {
    type: 'tool-call';
    /**
  ID of the tool call. This ID is used to match the tool call with the tool result.
   */
    toolCallId: string;
    /**
  Name of the tool that is being called.
   */
    toolName: string;
    /**
  Arguments of the tool call. This is a JSON-serializable object that matches the tool's input schema.
     */
    args: unknown;
    /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
   */
    experimental_providerMetadata?: ProviderMetadata;
}
/**
Tool result content part of a prompt. It contains the result of the tool call with the matching ID.
 */
interface ToolResultPart {
    type: 'tool-result';
    /**
  ID of the tool call that this result is associated with.
   */
    toolCallId: string;
    /**
  Name of the tool that generated this result.
    */
    toolName: string;
    /**
  Result of the tool call. This is a JSON-serializable object.
     */
    result: unknown;
    /**
  Optional flag if the result is an error or an error message.
     */
    isError?: boolean;
    /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
   */
    experimental_providerMetadata?: ProviderMetadata;
}

/**
 A system message. It can contain system information.

 Note: using the "system" part of the prompt is strongly preferred
 to increase the resilience against prompt injection attacks,
 and because not all providers support several system messages.
 */
type CoreSystemMessage = {
    role: 'system';
    content: string;
    /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
   */
    experimental_providerMetadata?: ProviderMetadata;
};
/**
 * @deprecated Use `CoreMessage` instead.
 */
type ExperimentalMessage = CoreMessage;
/**
A user message. It can contain text or a combination of text and images.
 */
type CoreUserMessage = {
    role: 'user';
    content: UserContent;
    /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
   */
    experimental_providerMetadata?: ProviderMetadata;
};
/**
 * @deprecated Use `CoreUserMessage` instead.
 */
type ExperimentalUserMessage = CoreUserMessage;
/**
Content of a user message. It can be a string or an array of text and image parts.
 */
type UserContent = string | Array<TextPart$1 | ImagePart>;
/**
An assistant message. It can contain text, tool calls, or a combination of text and tool calls.
 */
type CoreAssistantMessage = {
    role: 'assistant';
    content: AssistantContent;
    /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
   */
    experimental_providerMetadata?: ProviderMetadata;
};
/**
 * @deprecated Use `CoreAssistantMessage` instead.
 */
type ExperimentalAssistantMessage = CoreAssistantMessage;
/**
Content of an assistant message. It can be a string or an array of text and tool call parts.
 */
type AssistantContent = string | Array<TextPart$1 | ToolCallPart>;
/**
A tool message. It contains the result of one or more tool calls.
 */
type CoreToolMessage = {
    role: 'tool';
    content: ToolContent;
    /**
  Additional provider-specific metadata. They are passed through
  to the provider from the AI SDK and enable provider-specific
  functionality that can be fully encapsulated in the provider.
   */
    experimental_providerMetadata?: ProviderMetadata;
};
/**
 * @deprecated Use `CoreToolMessage` instead.
 */
type ExperimentalToolMessage = CoreToolMessage;
/**
Content of a tool message. It is an array of tool result parts.
 */
type ToolContent = Array<ToolResultPart>;
/**
A message that can be used in the `messages` field of a prompt.
It can be a user message, an assistant message, or a tool message.
 */
type CoreMessage = CoreSystemMessage | CoreUserMessage | CoreAssistantMessage | CoreToolMessage;

/**
Prompt part of the AI function options. It contains a system message, a simple text prompt, or a list of messages.
 */
type Prompt = {
    /**
  System message to include in the prompt. Can be used with `prompt` or `messages`.
     */
    system?: string;
    /**
  A simple text prompt. You can either use `prompt` or `messages` but not both.
   */
    prompt?: string;
    /**
  A list of messsages. You can either use `prompt` or `messages` but not both.
     */
    messages?: Array<CoreMessage>;
};

/**
The result of a `generateObject` call.
 */
interface GenerateObjectResult<T> {
    /**
    The generated object (typed according to the schema).
       */
    readonly object: T;
    /**
    The reason why the generation finished.
       */
    readonly finishReason: FinishReason;
    /**
    The token usage of the generated text.
       */
    readonly usage: LanguageModelUsage$1;
    /**
    Warnings from the model provider (e.g. unsupported settings)
       */
    readonly warnings: CallWarning[] | undefined;
    /**
   Optional raw response data.
  
  @deprecated Use `response.headers` instead.
       */
    readonly rawResponse?: {
        /**
      Response headers.
       */
        headers?: Record<string, string>;
    };
    /**
  Additional response information.
     */
    readonly response: LanguageModelResponseMetadataWithHeaders;
    /**
   Logprobs for the completion.
  `undefined` if the mode does not support logprobs or if was not enabled.
  
  @deprecated Will become a provider extension in the future.
       */
    readonly logprobs: LogProbs | undefined;
    /**
  Additional provider-specific metadata. They are passed through
  from the provider to the AI SDK and enable provider-specific
  results that can be fully encapsulated in the provider.
     */
    readonly experimental_providerMetadata: ProviderMetadata | undefined;
    /**
    Converts the object to a JSON response.
    The response will have a status code of 200 and a content type of `application/json; charset=utf-8`.
       */
    toJsonResponse(init?: ResponseInit): Response;
}

/**
Generate a structured, typed object for a given prompt and schema using a language model.

This function does not stream the output. If you want to stream the output, use `streamObject` instead.

@returns
A result object that contains the generated object, the finish reason, the token usage, and additional information.
 */
declare function generateObject<OBJECT>(options: Omit<CallSettings, 'stopSequences'> & Prompt & {
    output?: 'object' | undefined;
    /**
The language model to use.
   */
    model: LanguageModel;
    /**
The schema of the object that the model should generate.
   */
    schema: z.Schema<OBJECT, z.ZodTypeDef, any> | Schema<OBJECT>;
    /**
Optional name of the output that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema name.
   */
    schemaName?: string;
    /**
Optional description of the output that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema description.
   */
    schemaDescription?: string;
    /**
The mode to use for object generation.

The schema is converted in a JSON schema and used in one of the following ways

- 'auto': The provider will choose the best mode for the model.
- 'tool': A tool with the JSON schema as parameters is is provided and the provider is instructed to use it.
- 'json': The JSON schema and an instruction is injected into the prompt. If the provider supports JSON mode, it is enabled. If the provider supports JSON grammars, the grammar is used.

Please note that most providers do not support all modes.

Default and recommended: 'auto' (best mode for the model).
   */
    mode?: 'auto' | 'json' | 'tool';
    /**
Optional telemetry configuration (experimental).
     */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
*/
    experimental_providerMetadata?: ProviderMetadata;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        generateId?: () => string;
        currentDate?: () => Date;
    };
}): Promise<GenerateObjectResult<OBJECT>>;
/**
Generate an array with structured, typed elements for a given prompt and element schema using a language model.

This function does not stream the output. If you want to stream the output, use `streamObject` instead.

@return
A result object that contains the generated object, the finish reason, the token usage, and additional information.
 */
declare function generateObject<ELEMENT>(options: Omit<CallSettings, 'stopSequences'> & Prompt & {
    output: 'array';
    /**
The language model to use.
   */
    model: LanguageModel;
    /**
The element schema of the array that the model should generate.
*/
    schema: z.Schema<ELEMENT, z.ZodTypeDef, any> | Schema<ELEMENT>;
    /**
Optional name of the array that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema name.
   */
    schemaName?: string;
    /**
Optional description of the array that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema description.
*/
    schemaDescription?: string;
    /**
The mode to use for object generation.

The schema is converted in a JSON schema and used in one of the following ways

- 'auto': The provider will choose the best mode for the model.
- 'tool': A tool with the JSON schema as parameters is is provided and the provider is instructed to use it.
- 'json': The JSON schema and an instruction is injected into the prompt. If the provider supports JSON mode, it is enabled. If the provider supports JSON grammars, the grammar is used.

Please note that most providers do not support all modes.

Default and recommended: 'auto' (best mode for the model).
   */
    mode?: 'auto' | 'json' | 'tool';
    /**
Optional telemetry configuration (experimental).
   */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
*/
    experimental_providerMetadata?: ProviderMetadata;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        generateId?: () => string;
        currentDate?: () => Date;
    };
}): Promise<GenerateObjectResult<Array<ELEMENT>>>;
/**
Generate a value from an enum (limited list of string values) using a language model.

This function does not stream the output.

@return
A result object that contains the generated value, the finish reason, the token usage, and additional information.
 */
declare function generateObject<ENUM extends string>(options: Omit<CallSettings, 'stopSequences'> & Prompt & {
    output: 'enum';
    /**
The language model to use.
   */
    model: LanguageModel;
    /**
The enum values that the model should use.
   */
    enum: Array<ENUM>;
    /**
The mode to use for object generation.

The schema is converted in a JSON schema and used in one of the following ways

- 'auto': The provider will choose the best mode for the model.
- 'tool': A tool with the JSON schema as parameters is is provided and the provider is instructed to use it.
- 'json': The JSON schema and an instruction is injected into the prompt. If the provider supports JSON mode, it is enabled. If the provider supports JSON grammars, the grammar is used.

Please note that most providers do not support all modes.

Default and recommended: 'auto' (best mode for the model).
   */
    mode?: 'auto' | 'json' | 'tool';
    /**
Optional telemetry configuration (experimental).
   */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
*/
    experimental_providerMetadata?: ProviderMetadata;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        generateId?: () => string;
        currentDate?: () => Date;
    };
}): Promise<GenerateObjectResult<ENUM>>;
/**
Generate JSON with any schema for a given prompt using a language model.

This function does not stream the output. If you want to stream the output, use `streamObject` instead.

@returns
A result object that contains the generated object, the finish reason, the token usage, and additional information.
 */
declare function generateObject(options: Omit<CallSettings, 'stopSequences'> & Prompt & {
    output: 'no-schema';
    /**
The language model to use.
   */
    model: LanguageModel;
    /**
The mode to use for object generation. Must be "json" for no-schema output.
   */
    mode?: 'json';
    /**
Optional telemetry configuration (experimental).
     */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
*/
    experimental_providerMetadata?: ProviderMetadata;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        generateId?: () => string;
        currentDate?: () => Date;
    };
}): Promise<GenerateObjectResult<JSONValue>>;
/**
 * @deprecated Use `generateObject` instead.
 */
declare const experimental_generateObject: typeof generateObject;

type AsyncIterableStream<T> = AsyncIterable<T> & ReadableStream<T>;

/**
The result of a `streamObject` call that contains the partial object stream and additional information.
 */
interface StreamObjectResult<PARTIAL, RESULT, ELEMENT_STREAM> {
    /**
    Warnings from the model provider (e.g. unsupported settings)
       */
    readonly warnings: CallWarning[] | undefined;
    /**
    The token usage of the generated response. Resolved when the response is finished.
       */
    readonly usage: Promise<LanguageModelUsage$1>;
    /**
  Additional provider-specific metadata. They are passed through
  from the provider to the AI SDK and enable provider-specific
  results that can be fully encapsulated in the provider.
     */
    readonly experimental_providerMetadata: Promise<ProviderMetadata | undefined>;
    /**
  Optional raw response data.
  
  @deprecated Use `response` instead.
       */
    readonly rawResponse?: {
        /**
      Response headers.
       */
        headers?: Record<string, string>;
    };
    /**
  Additional response information.
   */
    readonly response: Promise<LanguageModelResponseMetadataWithHeaders>;
    /**
    The generated object (typed according to the schema). Resolved when the response is finished.
       */
    readonly object: Promise<RESULT>;
    /**
    Stream of partial objects. It gets more complete as the stream progresses.
  
    Note that the partial object is not validated.
    If you want to be certain that the actual content matches your schema, you need to implement your own validation for partial results.
       */
    readonly partialObjectStream: AsyncIterableStream<PARTIAL>;
    /**
     * Stream over complete array elements. Only available if the output strategy is set to `array`.
     */
    readonly elementStream: ELEMENT_STREAM;
    /**
    Text stream of the JSON representation of the generated object. It contains text chunks.
    When the stream is finished, the object is valid JSON that can be parsed.
       */
    readonly textStream: AsyncIterableStream<string>;
    /**
    Stream of different types of events, including partial objects, errors, and finish events.
    Only errors that stop the stream, such as network errors, are thrown.
       */
    readonly fullStream: AsyncIterableStream<ObjectStreamPart<PARTIAL>>;
    /**
    Writes text delta output to a Node.js response-like object.
    It sets a `Content-Type` header to `text/plain; charset=utf-8` and
    writes each text delta as a separate chunk.
  
    @param response A Node.js response-like object (ServerResponse).
    @param init Optional headers, status code, and status text.
       */
    pipeTextStreamToResponse(response: ServerResponse, init?: ResponseInit): void;
    /**
    Creates a simple text stream response.
    The response has a `Content-Type` header set to `text/plain; charset=utf-8`.
    Each text delta is encoded as UTF-8 and sent as a separate chunk.
    Non-text-delta events are ignored.
  
    @param init Optional headers, status code, and status text.
       */
    toTextStreamResponse(init?: ResponseInit): Response;
}
type ObjectStreamPart<PARTIAL> = {
    type: 'object';
    object: PARTIAL;
} | {
    type: 'text-delta';
    textDelta: string;
} | {
    type: 'error';
    error: unknown;
} | {
    type: 'finish';
    finishReason: FinishReason;
    logprobs?: LogProbs;
    usage: LanguageModelUsage$1;
    response: LanguageModelResponseMetadata;
    providerMetadata?: ProviderMetadata;
};

type OnFinishCallback<RESULT> = (event: {
    /**
  The token usage of the generated response.
  */
    usage: LanguageModelUsage$1;
    /**
  The generated object. Can be undefined if the final object does not match the schema.
  */
    object: RESULT | undefined;
    /**
  Optional error object. This is e.g. a TypeValidationError when the final object does not match the schema.
  */
    error: unknown | undefined;
    /**
  Optional raw response data.
  
  @deprecated Use `response` instead.
         */
    rawResponse?: {
        /**
    Response headers.
       */
        headers?: Record<string, string>;
    };
    /**
  Response metadata.
   */
    response: LanguageModelResponseMetadataWithHeaders;
    /**
  Warnings from the model provider (e.g. unsupported settings).
  */
    warnings?: CallWarning[];
    /**
  Additional provider-specific metadata. They are passed through
  from the provider to the AI SDK and enable provider-specific
  results that can be fully encapsulated in the provider.
  */
    experimental_providerMetadata: ProviderMetadata | undefined;
}) => Promise<void> | void;
/**
Generate a structured, typed object for a given prompt and schema using a language model.

This function streams the output. If you do not want to stream the output, use `generateObject` instead.

@return
A result object for accessing the partial object stream and additional information.
 */
declare function streamObject<OBJECT>(options: Omit<CallSettings, 'stopSequences'> & Prompt & {
    output?: 'object' | undefined;
    /**
The language model to use.
   */
    model: LanguageModel;
    /**
The schema of the object that the model should generate.
*/
    schema: z.Schema<OBJECT, z.ZodTypeDef, any> | Schema<OBJECT>;
    /**
Optional name of the output that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema name.
   */
    schemaName?: string;
    /**
Optional description of the output that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema description.
*/
    schemaDescription?: string;
    /**
The mode to use for object generation.

The schema is converted in a JSON schema and used in one of the following ways

- 'auto': The provider will choose the best mode for the model.
- 'tool': A tool with the JSON schema as parameters is is provided and the provider is instructed to use it.
- 'json': The JSON schema and an instruction is injected into the prompt. If the provider supports JSON mode, it is enabled. If the provider supports JSON grammars, the grammar is used.

Please note that most providers do not support all modes.

Default and recommended: 'auto' (best mode for the model).
   */
    mode?: 'auto' | 'json' | 'tool';
    /**
Optional telemetry configuration (experimental).
   */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
*/
    experimental_providerMetadata?: ProviderMetadata;
    /**
Callback that is called when the LLM response and the final object validation are finished.
   */
    onFinish?: OnFinishCallback<OBJECT>;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        generateId?: () => string;
        currentDate?: () => Date;
        now?: () => number;
    };
}): Promise<StreamObjectResult<DeepPartial<OBJECT>, OBJECT, never>>;
/**
Generate an array with structured, typed elements for a given prompt and element schema using a language model.

This function streams the output. If you do not want to stream the output, use `generateObject` instead.

@return
A result object for accessing the partial object stream and additional information.
 */
declare function streamObject<ELEMENT>(options: Omit<CallSettings, 'stopSequences'> & Prompt & {
    output: 'array';
    /**
The language model to use.
   */
    model: LanguageModel;
    /**
The element schema of the array that the model should generate.
*/
    schema: z.Schema<ELEMENT, z.ZodTypeDef, any> | Schema<ELEMENT>;
    /**
Optional name of the array that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema name.
   */
    schemaName?: string;
    /**
Optional description of the array that should be generated.
Used by some providers for additional LLM guidance, e.g.
via tool or schema description.
*/
    schemaDescription?: string;
    /**
The mode to use for object generation.

The schema is converted in a JSON schema and used in one of the following ways

- 'auto': The provider will choose the best mode for the model.
- 'tool': A tool with the JSON schema as parameters is is provided and the provider is instructed to use it.
- 'json': The JSON schema and an instruction is injected into the prompt. If the provider supports JSON mode, it is enabled. If the provider supports JSON grammars, the grammar is used.

Please note that most providers do not support all modes.

Default and recommended: 'auto' (best mode for the model).
   */
    mode?: 'auto' | 'json' | 'tool';
    /**
Optional telemetry configuration (experimental).
   */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
*/
    experimental_providerMetadata?: ProviderMetadata;
    /**
Callback that is called when the LLM response and the final object validation are finished.
   */
    onFinish?: OnFinishCallback<Array<ELEMENT>>;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        generateId?: () => string;
        currentDate?: () => Date;
        now?: () => number;
    };
}): Promise<StreamObjectResult<Array<ELEMENT>, Array<ELEMENT>, AsyncIterableStream<ELEMENT>>>;
/**
Generate JSON with any schema for a given prompt using a language model.

This function streams the output. If you do not want to stream the output, use `generateObject` instead.

@return
A result object for accessing the partial object stream and additional information.
 */
declare function streamObject(options: Omit<CallSettings, 'stopSequences'> & Prompt & {
    output: 'no-schema';
    /**
The language model to use.
   */
    model: LanguageModel;
    /**
The mode to use for object generation. Must be "json" for no-schema output.
   */
    mode?: 'json';
    /**
Optional telemetry configuration (experimental).
   */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
*/
    experimental_providerMetadata?: ProviderMetadata;
    /**
Callback that is called when the LLM response and the final object validation are finished.
   */
    onFinish?: OnFinishCallback<JSONValue>;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        generateId?: () => string;
        currentDate?: () => Date;
        now?: () => number;
    };
}): Promise<StreamObjectResult<JSONValue, JSONValue, never>>;
/**
 * @deprecated Use `streamObject` instead.
 */
declare const experimental_streamObject: typeof streamObject;

type Parameters = z.ZodTypeAny | Schema<any>;
type inferParameters<PARAMETERS extends Parameters> = PARAMETERS extends Schema<any> ? PARAMETERS['_type'] : PARAMETERS extends z.ZodTypeAny ? z.infer<PARAMETERS> : never;
/**
A tool contains the description and the schema of the input that the tool expects.
This enables the language model to generate the input.

The tool can also contain an optional execute function for the actual execution function of the tool.
 */
interface CoreTool<PARAMETERS extends Parameters = any, RESULT = any> {
    /**
  An optional description of what the tool does. Will be used by the language model to decide whether to use the tool.
     */
    description?: string;
    /**
  The schema of the input that the tool expects. The language model will use this to generate the input.
  It is also used to validate the output of the language model.
  Use descriptions to make the input understandable for the language model.
     */
    parameters: PARAMETERS;
    /**
  An async function that is called with the arguments from the tool call and produces a result.
  If not provided, the tool will not be executed automatically.
     */
    execute?: (args: inferParameters<PARAMETERS>) => PromiseLike<RESULT>;
}
/**
Helper function for inferring the execute args of a tool.
 */
declare function tool<PARAMETERS extends Parameters, RESULT>(tool: CoreTool<PARAMETERS, RESULT> & {
    execute: (args: inferParameters<PARAMETERS>) => PromiseLike<RESULT>;
}): CoreTool<PARAMETERS, RESULT> & {
    execute: (args: inferParameters<PARAMETERS>) => PromiseLike<RESULT>;
};
declare function tool<PARAMETERS extends Parameters, RESULT>(tool: CoreTool<PARAMETERS, RESULT> & {
    execute?: undefined;
}): CoreTool<PARAMETERS, RESULT> & {
    execute: undefined;
};
/**
 * @deprecated Use `CoreTool` instead.
 */
type ExperimentalTool = CoreTool;

type ConvertibleMessage = {
    role: 'system' | 'user' | 'assistant' | 'function' | 'data' | 'tool';
    content: string;
    toolInvocations?: ToolInvocation[];
    experimental_attachments?: Attachment[];
};
/**
Converts an array of messages from useChat into an array of CoreMessages that can be used
with the AI core functions (e.g. `streamText`).
 */
declare function convertToCoreMessages(messages: Array<ConvertibleMessage>): CoreMessage[];

/**
Create a union of the given object's values, and optionally specify which keys to get the values from.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31438) if you want to have this type as a built-in in TypeScript.

@example
```
// data.json
{
    'foo': 1,
    'bar': 2,
    'biz': 3
}

// main.ts
import type {ValueOf} from 'type-fest';
import data = require('./data.json');

export function getData(name: string): ValueOf<typeof data> {
    return data[name];
}

export function onlyBar(name: string): ValueOf<typeof data, 'bar'> {
    return data[name];
}

// file.ts
import {getData, onlyBar} from './main';

getData('foo');
//=> 1

onlyBar('foo');
//=> TypeError ...

onlyBar('bar');
//=> 2
```
* @see https://github.com/sindresorhus/type-fest/blob/main/source/value-of.d.ts
*/
type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];

type ToToolCall<TOOLS extends Record<string, CoreTool>> = ValueOf<{
    [NAME in keyof TOOLS]: {
        type: 'tool-call';
        toolCallId: string;
        toolName: NAME & string;
        args: inferParameters<TOOLS[NAME]['parameters']>;
    };
}>;
type ToToolCallArray<TOOLS extends Record<string, CoreTool>> = Array<ToToolCall<TOOLS>>;

type ToToolsWithExecute<TOOLS extends Record<string, CoreTool>> = {
    [K in keyof TOOLS as TOOLS[K] extends {
        execute: any;
    } ? K : never]: TOOLS[K];
};
type ToToolsWithDefinedExecute<TOOLS extends Record<string, CoreTool>> = {
    [K in keyof TOOLS as TOOLS[K]['execute'] extends undefined ? never : K]: TOOLS[K];
};
type ToToolResultObject<TOOLS extends Record<string, CoreTool>> = ValueOf<{
    [NAME in keyof TOOLS]: {
        type: 'tool-result';
        toolCallId: string;
        toolName: NAME & string;
        args: inferParameters<TOOLS[NAME]['parameters']>;
        result: Awaited<ReturnType<Exclude<TOOLS[NAME]['execute'], undefined>>>;
    };
}>;
type ToToolResult<TOOLS extends Record<string, CoreTool>> = ToToolResultObject<ToToolsWithDefinedExecute<ToToolsWithExecute<TOOLS>>>;
type ToToolResultArray<TOOLS extends Record<string, CoreTool>> = Array<ToToolResult<TOOLS>>;

/**
The result of a `generateText` call.
It contains the generated text, the tool calls that were made during the generation, and the results of the tool calls.
 */
interface GenerateTextResult<TOOLS extends Record<string, CoreTool>> {
    /**
    The generated text.
       */
    readonly text: string;
    /**
    The tool calls that were made during the generation.
     */
    readonly toolCalls: ToToolCallArray<TOOLS>;
    /**
    The results of the tool calls.
     */
    readonly toolResults: ToToolResultArray<TOOLS>;
    /**
    The reason why the generation finished.
     */
    readonly finishReason: FinishReason;
    /**
    The token usage of the generated text.
     */
    readonly usage: LanguageModelUsage$1;
    /**
    Warnings from the model provider (e.g. unsupported settings)
     */
    readonly warnings: CallWarning[] | undefined;
    /**
    The response messages that were generated during the call. It consists of an assistant message,
    potentially containing tool calls.
    When there are tool results, there is an additional tool message with the tool results that are available.
    If there are tools that do not have execute functions, they are not included in the tool results and
    need to be added separately.
       */
    readonly responseMessages: Array<CoreAssistantMessage | CoreToolMessage>;
    /**
    Response information for every roundtrip.
    You can use this to get information about intermediate steps, such as the tool calls or the response headers.
     */
    readonly roundtrips: Array<{
        /**
      The generated text.
       */
        readonly text: string;
        /**
      The tool calls that were made during the generation.
      */
        readonly toolCalls: ToToolCallArray<TOOLS>;
        /**
      The results of the tool calls.
      */
        readonly toolResults: ToToolResultArray<TOOLS>;
        /**
      The reason why the generation finished.
       */
        readonly finishReason: FinishReason;
        /**
      The token usage of the generated text.
      */
        readonly usage: LanguageModelUsage$1;
        /**
      Warnings from the model provider (e.g. unsupported settings)
       */
        readonly warnings: CallWarning[] | undefined;
        /**
      Logprobs for the completion.
      `undefined` if the mode does not support logprobs or if was not enabled.
       */
        readonly logprobs: LogProbs | undefined;
        /**
    Optional raw response data.
    
    @deprecated Use `response.headers` instead.
       */
        readonly rawResponse?: {
            /**
      Response headers.
       */
            readonly headers?: Record<string, string>;
        };
        /**
    Additional response information.
     */
        readonly response: LanguageModelResponseMetadataWithHeaders;
    }>;
    /**
  Optional raw response data.
  
  @deprecated Use `response.headers` instead.
     */
    readonly rawResponse?: {
        /**
      Response headers.
       */
        readonly headers?: Record<string, string>;
    };
    /**
  Additional response information.
     */
    readonly response: LanguageModelResponseMetadataWithHeaders;
    /**
  Logprobs for the completion.
  `undefined` if the mode does not support logprobs or if was not enabled.
  
  @deprecated Will become a provider extension in the future.
       */
    readonly logprobs: LogProbs | undefined;
    /**
  Additional provider-specific metadata. They are passed through
  from the provider to the AI SDK and enable provider-specific
  results that can be fully encapsulated in the provider.
     */
    readonly experimental_providerMetadata: ProviderMetadata | undefined;
}

/**
Generate a text and call tools for a given prompt using a language model.

This function does not stream the output. If you want to stream the output, use `streamText` instead.

@param model - The language model to use.

@param tools - Tools that are accessible to and can be called by the model. The model needs to support calling tools.
@param toolChoice - The tool choice strategy. Default: 'auto'.

@param system - A system message that will be part of the prompt.
@param prompt - A simple text prompt. You can either use `prompt` or `messages` but not both.
@param messages - A list of messages. You can either use `prompt` or `messages` but not both.

@param maxTokens - Maximum number of tokens to generate.
@param temperature - Temperature setting.
The value is passed through to the provider. The range depends on the provider and model.
It is recommended to set either `temperature` or `topP`, but not both.
@param topP - Nucleus sampling.
The value is passed through to the provider. The range depends on the provider and model.
It is recommended to set either `temperature` or `topP`, but not both.
@param topK - Only sample from the top K options for each subsequent token.
Used to remove "long tail" low probability responses.
Recommended for advanced use cases only. You usually only need to use temperature.
@param presencePenalty - Presence penalty setting.
It affects the likelihood of the model to repeat information that is already in the prompt.
The value is passed through to the provider. The range depends on the provider and model.
@param frequencyPenalty - Frequency penalty setting.
It affects the likelihood of the model to repeatedly use the same words or phrases.
The value is passed through to the provider. The range depends on the provider and model.
@param stopSequences - Stop sequences.
If set, the model will stop generating text when one of the stop sequences is generated.
@param seed - The seed (integer) to use for random sampling.
If set and supported by the model, calls will generate deterministic results.

@param maxRetries - Maximum number of retries. Set to 0 to disable retries. Default: 2.
@param abortSignal - An optional abort signal that can be used to cancel the call.
@param headers - Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

@param maxToolRoundtrips - Maximal number of automatic roundtrips for tool calls.

@returns
A result object that contains the generated text, the results of the tool calls, and additional information.
 */
declare function generateText<TOOLS extends Record<string, CoreTool>>({ model, tools, toolChoice, system, prompt, messages, maxRetries, abortSignal, headers, maxAutomaticRoundtrips, maxToolRoundtrips, experimental_telemetry: telemetry, experimental_providerMetadata: providerMetadata, _internal: { generateId, currentDate, }, ...settings }: CallSettings & Prompt & {
    /**
The language model to use.
     */
    model: LanguageModel;
    /**
The tools that the model can call. The model needs to support calling tools.
*/
    tools?: TOOLS;
    /**
The tool choice strategy. Default: 'auto'.
     */
    toolChoice?: CoreToolChoice<TOOLS>;
    /**
@deprecated Use `maxToolRoundtrips` instead.
     */
    maxAutomaticRoundtrips?: number;
    /**
Maximal number of automatic roundtrips for tool calls.

An automatic tool call roundtrip is another LLM call with the
tool call results when all tool calls of the last assistant
message have results.

A maximum number is required to prevent infinite loops in the
case of misconfigured tools.

By default, it's set to 0, which will disable the feature.
     */
    maxToolRoundtrips?: number;
    /**
     * Optional telemetry configuration (experimental).
     */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
 */
    experimental_providerMetadata?: ProviderMetadata;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        generateId?: () => string;
        currentDate?: () => Date;
    };
}): Promise<GenerateTextResult<TOOLS>>;
/**
 * @deprecated Use `generateText` instead.
 */
declare const experimental_generateText: typeof generateText;

/**
A result object for accessing different stream types and additional information.
 */
interface StreamTextResult<TOOLS extends Record<string, CoreTool>> {
    /**
  Warnings from the model provider (e.g. unsupported settings) for the first roundtrip.
       */
    readonly warnings: CallWarning[] | undefined;
    /**
  The total token usage of the generated response.
  When there are multiple roundtrips, the usage is the sum of all roundtrip usages.
  
  Resolved when the response is finished.
       */
    readonly usage: Promise<LanguageModelUsage$1>;
    /**
  The reason why the generation finished. Taken from the last roundtrip.
  
  Resolved when the response is finished.
       */
    readonly finishReason: Promise<FinishReason>;
    /**
  Additional provider-specific metadata from the last roundtrip.
  Metadata is passed through from the provider to the AI SDK and
  enables provider-specific results that can be fully encapsulated in the provider.
     */
    readonly experimental_providerMetadata: Promise<ProviderMetadata | undefined>;
    /**
  The full text that has been generated by the last roundtrip.
  
  Resolved when the response is finished.
       */
    readonly text: Promise<string>;
    /**
  The tool calls that have been executed in the last roundtrip.
  
  Resolved when the response is finished.
       */
    readonly toolCalls: Promise<ToToolCall<TOOLS>[]>;
    /**
  The tool results that have been generated in the last roundtrip.
  
  Resolved when the all tool executions are finished.
       */
    readonly toolResults: Promise<ToToolResult<TOOLS>[]>;
    /**
  Optional raw response data.
  
  @deprecated Use `response` instead.
       */
    readonly rawResponse?: {
        /**
      Response headers.
           */
        headers?: Record<string, string>;
    };
    /**
  Additional response information.
   */
    readonly response: Promise<LanguageModelResponseMetadataWithHeaders>;
    /**
    A text stream that returns only the generated text deltas. You can use it
    as either an AsyncIterable or a ReadableStream. When an error occurs, the
    stream will throw the error.
       */
    readonly textStream: AsyncIterableStream<string>;
    /**
    A stream with all events, including text deltas, tool calls, tool results, and
    errors.
    You can use it as either an AsyncIterable or a ReadableStream.
    Only errors that stop the stream, such as network errors, are thrown.
       */
    readonly fullStream: AsyncIterableStream<TextStreamPart<TOOLS>>;
    /**
    Converts the result to an `AIStream` object that is compatible with `StreamingTextResponse`.
    It can be used with the `useChat` and `useCompletion` hooks.
  
    @param callbacks
    Stream callbacks that will be called when the stream emits events.
  
    @returns A data stream.
  
    @deprecated Use `toDataStream` instead.
       */
    toAIStream(callbacks?: AIStreamCallbacksAndOptions): ReadableStream<Uint8Array>;
    /**
    Converts the result to a data stream.
  
    @param data an optional StreamData object that will be merged into the stream.
    @param getErrorMessage an optional function that converts an error to an error message.
    @param sendUsage whether to send the usage information to the client. Defaults to true.
  
    @return A data stream.
       */
    toDataStream(options?: {
        data?: StreamData;
        getErrorMessage?: (error: unknown) => string;
        sendUsage?: boolean;
    }): ReadableStream<Uint8Array>;
    /**
    Writes stream data output to a Node.js response-like object.
    It sets a `Content-Type` header to `text/plain; charset=utf-8` and
    writes each stream data part as a separate chunk.
  
    @param response A Node.js response-like object (ServerResponse).
    @param init Optional headers and status code.
  
    @deprecated Use `pipeDataStreamToResponse` instead.
       */
    pipeAIStreamToResponse(response: ServerResponse$1, init?: {
        headers?: Record<string, string>;
        status?: number;
    }): void;
    /**
    Writes data stream output to a Node.js response-like object.
  
    @param response A Node.js response-like object (ServerResponse).
    @param options An object with an init property (ResponseInit) and a data property.
    You can also pass in a ResponseInit directly (deprecated).
       */
    pipeDataStreamToResponse(response: ServerResponse$1, options?: ResponseInit | {
        init?: ResponseInit;
        data?: StreamData;
        getErrorMessage?: (error: unknown) => string;
        sendUsage?: boolean;
    }): void;
    /**
    Writes text delta output to a Node.js response-like object.
    It sets a `Content-Type` header to `text/plain; charset=utf-8` and
    writes each text delta as a separate chunk.
  
    @param response A Node.js response-like object (ServerResponse).
    @param init Optional headers, status code, and status text.
       */
    pipeTextStreamToResponse(response: ServerResponse$1, init?: ResponseInit): void;
    /**
    Converts the result to a streamed response object with a stream data part stream.
    It can be used with the `useChat` and `useCompletion` hooks.
  
    @param options An object with an init property (ResponseInit) and a data property.
    You can also pass in a ResponseInit directly (deprecated).
  
    @return A response object.
  
    @deprecated Use `toDataStreamResponse` instead.
       */
    toAIStreamResponse(options?: ResponseInit | {
        init?: ResponseInit;
        data?: StreamData;
    }): Response;
    /**
    Converts the result to a streamed response object with a stream data part stream.
    It can be used with the `useChat` and `useCompletion` hooks.
  
    @param options An object with an init property (ResponseInit) and a data property.
    You can also pass in a ResponseInit directly (deprecated).
  
    @return A response object.
       */
    toDataStreamResponse(options?: ResponseInit | {
        init?: ResponseInit;
        data?: StreamData;
        getErrorMessage?: (error: unknown) => string;
        sendUsage?: boolean;
    }): Response;
    /**
    Creates a simple text stream response.
    Each text delta is encoded as UTF-8 and sent as a separate chunk.
    Non-text-delta events are ignored.
  
    @param init Optional headers, status code, and status text.
       */
    toTextStreamResponse(init?: ResponseInit): Response;
}
type TextStreamPart<TOOLS extends Record<string, CoreTool>> = {
    type: 'text-delta';
    textDelta: string;
} | ({
    type: 'tool-call';
} & ToToolCall<TOOLS>) | {
    type: 'tool-call-streaming-start';
    toolCallId: string;
    toolName: string;
} | {
    type: 'tool-call-delta';
    toolCallId: string;
    toolName: string;
    argsTextDelta: string;
} | ({
    type: 'tool-result';
} & ToToolResult<TOOLS>) | {
    type: 'roundtrip-finish';
    finishReason: FinishReason;
    logprobs?: LogProbs;
    usage: LanguageModelUsage$1;
    response: LanguageModelResponseMetadata;
    experimental_providerMetadata?: ProviderMetadata;
} | {
    type: 'finish';
    finishReason: FinishReason;
    logprobs?: LogProbs;
    usage: LanguageModelUsage$1;
    response: LanguageModelResponseMetadata;
    experimental_providerMetadata?: ProviderMetadata;
} | {
    type: 'error';
    error: unknown;
};

/**
Generate a text and call tools for a given prompt using a language model.

This function streams the output. If you do not want to stream the output, use `generateText` instead.

@param model - The language model to use.
@param tools - Tools that are accessible to and can be called by the model. The model needs to support calling tools.

@param system - A system message that will be part of the prompt.
@param prompt - A simple text prompt. You can either use `prompt` or `messages` but not both.
@param messages - A list of messages. You can either use `prompt` or `messages` but not both.

@param maxTokens - Maximum number of tokens to generate.
@param temperature - Temperature setting.
The value is passed through to the provider. The range depends on the provider and model.
It is recommended to set either `temperature` or `topP`, but not both.
@param topP - Nucleus sampling.
The value is passed through to the provider. The range depends on the provider and model.
It is recommended to set either `temperature` or `topP`, but not both.
@param topK - Only sample from the top K options for each subsequent token.
Used to remove "long tail" low probability responses.
Recommended for advanced use cases only. You usually only need to use temperature.
@param presencePenalty - Presence penalty setting.
It affects the likelihood of the model to repeat information that is already in the prompt.
The value is passed through to the provider. The range depends on the provider and model.
@param frequencyPenalty - Frequency penalty setting.
It affects the likelihood of the model to repeatedly use the same words or phrases.
The value is passed through to the provider. The range depends on the provider and model.
@param stopSequences - Stop sequences.
If set, the model will stop generating text when one of the stop sequences is generated.
@param seed - The seed (integer) to use for random sampling.
If set and supported by the model, calls will generate deterministic results.

@param maxRetries - Maximum number of retries. Set to 0 to disable retries. Default: 2.
@param abortSignal - An optional abort signal that can be used to cancel the call.
@param headers - Additional HTTP headers to be sent with the request. Only applicable for HTTP-based providers.

@param maxToolRoundtrips - Maximal number of automatic roundtrips for tool calls.

@param onChunk - Callback that is called for each chunk of the stream. The stream processing will pause until the callback promise is resolved.
@param onFinish - Callback that is called when the LLM response and all request tool executions
(for tools that have an `execute` function) are finished.

@return
A result object for accessing different stream types and additional information.
 */
declare function streamText<TOOLS extends Record<string, CoreTool>>({ model, tools, toolChoice, system, prompt, messages, maxRetries, abortSignal, headers, maxToolRoundtrips, experimental_telemetry: telemetry, experimental_providerMetadata: providerMetadata, experimental_toolCallStreaming: toolCallStreaming, onChunk, onFinish, _internal: { now, generateId, currentDate, }, ...settings }: CallSettings & Prompt & {
    /**
The language model to use.
     */
    model: LanguageModel;
    /**
The tools that the model can call. The model needs to support calling tools.
    */
    tools?: TOOLS;
    /**
The tool choice strategy. Default: 'auto'.
     */
    toolChoice?: CoreToolChoice<TOOLS>;
    /**
Maximal number of automatic roundtrips for tool calls.

An automatic tool call roundtrip is another LLM call with the
tool call results when all tool calls of the last assistant
message have results.

A maximum number is required to prevent infinite loops in the
case of misconfigured tools.

By default, it's set to 0, which will disable the feature.
     */
    maxToolRoundtrips?: number;
    /**
Optional telemetry configuration (experimental).
     */
    experimental_telemetry?: TelemetrySettings;
    /**
Additional provider-specific metadata. They are passed through
to the provider from the AI SDK and enable provider-specific
functionality that can be fully encapsulated in the provider.
 */
    experimental_providerMetadata?: ProviderMetadata;
    /**
Enable streaming of tool call deltas as they are generated. Disabled by default.
     */
    experimental_toolCallStreaming?: boolean;
    /**
Callback that is called for each chunk of the stream. The stream processing will pause until the callback promise is resolved.
     */
    onChunk?: (event: {
        chunk: Extract<TextStreamPart<TOOLS>, {
            type: 'text-delta' | 'tool-call' | 'tool-call-streaming-start' | 'tool-call-delta' | 'tool-result';
        }>;
    }) => Promise<void> | void;
    /**
Callback that is called when the LLM response and all request tool executions
(for tools that have an `execute` function) are finished.
     */
    onFinish?: (event: {
        /**
  The reason why the generation finished.
         */
        finishReason: FinishReason;
        /**
  The token usage of the generated response.
   */
        usage: LanguageModelUsage$1;
        /**
  The full text that has been generated.
         */
        text: string;
        /**
  The tool calls that have been executed.
         */
        toolCalls?: ToToolCall<TOOLS>[];
        /**
  The tool results that have been generated.
         */
        toolResults?: ToToolResult<TOOLS>[];
        /**
  Optional raw response data.
  
  @deprecated Use `response` instead.
         */
        rawResponse?: {
            /**
    Response headers.
             */
            headers?: Record<string, string>;
        };
        /**
  Response metadata.
         */
        response: LanguageModelResponseMetadataWithHeaders;
        /**
  Warnings from the model provider (e.g. unsupported settings).
         */
        warnings?: CallWarning[];
        /**
  Additional provider-specific metadata. They are passed through
  from the provider to the AI SDK and enable provider-specific
  results that can be fully encapsulated in the provider.
     */
        readonly experimental_providerMetadata: ProviderMetadata | undefined;
    }) => Promise<void> | void;
    /**
     * Internal. For test use only. May change without notice.
     */
    _internal?: {
        now?: () => number;
        generateId?: () => string;
        currentDate?: () => Date;
    };
}): Promise<StreamTextResult<TOOLS>>;
/**
 * @deprecated Use `streamText` instead.
 */
declare const experimental_streamText: typeof streamText;

/**
 * Experimental middleware for LanguageModelV1.
 * This type defines the structure for middleware that can be used to modify
 * the behavior of LanguageModelV1 operations.
 */
type Experimental_LanguageModelV1Middleware = {
    /**
     * Transforms the parameters before they are passed to the language model.
     * @param options - Object containing the type of operation and the parameters.
     * @param options.type - The type of operation ('generate' or 'stream').
     * @param options.params - The original parameters for the language model call.
     * @returns A promise that resolves to the transformed parameters.
     */
    transformParams?: (options: {
        type: 'generate' | 'stream';
        params: LanguageModelV1CallOptions;
    }) => PromiseLike<LanguageModelV1CallOptions>;
    /**
     * Wraps the generate operation of the language model.
     * @param options - Object containing the generate function, parameters, and model.
     * @param options.doGenerate - The original generate function.
     * @param options.params - The parameters for the generate call. If the
     * `transformParams` middleware is used, this will be the transformed parameters.
     * @param options.model - The language model instance.
     * @returns A promise that resolves to the result of the generate operation.
     */
    wrapGenerate?: (options: {
        doGenerate: () => ReturnType<LanguageModelV1['doGenerate']>;
        params: LanguageModelV1CallOptions;
        model: LanguageModelV1;
    }) => Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    /**
     * Wraps the stream operation of the language model.
     * @param options - Object containing the stream function, parameters, and model.
     * @param options.doStream - The original stream function.
     * @param options.params - The parameters for the stream call. If the
     * `transformParams` middleware is used, this will be the transformed parameters.
     * @param options.model - The language model instance.
     * @returns A promise that resolves to the result of the stream operation.
     */
    wrapStream?: (options: {
        doStream: () => ReturnType<LanguageModelV1['doStream']>;
        params: LanguageModelV1CallOptions;
        model: LanguageModelV1;
    }) => PromiseLike<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
};

/**
 * Wraps a LanguageModelV1 instance with middleware functionality.
 * This function allows you to apply middleware to transform parameters,
 * wrap generate operations, and wrap stream operations of a language model.
 *
 * @param options - Configuration options for wrapping the language model.
 * @param options.model - The original LanguageModelV1 instance to be wrapped.
 * @param options.middleware - The middleware to be applied to the language model.
 * @param options.modelId - Optional custom model ID to override the original model's ID.
 * @param options.providerId - Optional custom provider ID to override the original model's provider.
 * @returns A new LanguageModelV1 instance with middleware applied.
 */
declare const experimental_wrapLanguageModel: ({ model, middleware: { transformParams, wrapGenerate, wrapStream }, modelId, providerId, }: {
    model: LanguageModelV1;
    middleware: Experimental_LanguageModelV1Middleware;
    modelId?: string;
    providerId?: string;
}) => LanguageModelV1;

/**
 * Creates a custom provider with specified language models, text embedding models, and an optional fallback provider.
 *
 * @param {Object} options - The options for creating the custom provider.
 * @param {Record<string, LanguageModelV1>} [options.languageModels] - A record of language models, where keys are model IDs and values are LanguageModelV1 instances.
 * @param {Record<string, EmbeddingModelV1<string>>} [options.textEmbeddingModels] - A record of text embedding models, where keys are model IDs and values are EmbeddingModelV1<string> instances.
 * @param {Provider} [options.fallbackProvider] - An optional fallback provider to use when a requested model is not found in the custom provider.
 * @returns {Provider} A Provider object with languageModel and textEmbeddingModel methods.
 *
 * @throws {NoSuchModelError} Throws when a requested model is not found and no fallback provider is available.
 */
declare function experimental_customProvider({ languageModels, textEmbeddingModels, fallbackProvider, }: {
    languageModels?: Record<string, LanguageModelV1>;
    textEmbeddingModels?: Record<string, EmbeddingModelV1<string>>;
    fallbackProvider?: Provider;
}): Provider;

declare const symbol$9: unique symbol;
declare class NoSuchProviderError extends NoSuchModelError {
    private readonly [symbol$9];
    readonly providerId: string;
    readonly availableProviders: string[];
    constructor({ modelId, modelType, providerId, availableProviders, message, }: {
        modelId: string;
        modelType: 'languageModel' | 'textEmbeddingModel';
        providerId: string;
        availableProviders: string[];
        message?: string;
    });
    static isInstance(error: unknown): error is NoSuchProviderError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isNoSuchProviderError(error: unknown): error is NoSuchProviderError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        modelId: string;
        modelType: "languageModel" | "textEmbeddingModel";
        providerId: string;
        availableProviders: string[];
    };
}

/**
 * Provides for language and text embedding models.
 *
 * @deprecated Use `ProviderV1` instead.
 */
interface experimental_Provider {
    /**
  Returns the language model with the given id in the format `providerId:modelId`.
  The model id is then passed to the provider function to get the model.
  
  @param {string} id - The id of the model to return.
  
  @throws {NoSuchModelError} If no model with the given id exists.
  @throws {NoSuchProviderError} If no provider with the given id exists.
  
  @returns {LanguageModel} The language model associated with the id.
     */
    languageModel?: (modelId: string) => LanguageModel;
    /**
  Returns the text embedding model with the given id in the format `providerId:modelId`.
  The model id is then passed to the provider function to get the model.
  
  @param {string} id - The id of the model to return.
  
  @throws {NoSuchModelError} If no model with the given id exists.
  @throws {NoSuchProviderError} If no provider with the given id exists.
  
  @returns {LanguageModel} The language model associated with the id.
     */
    textEmbeddingModel?: (modelId: string) => EmbeddingModel<string>;
    /**
  Returns the text embedding model with the given id in the format `providerId:modelId`.
  The model id is then passed to the provider function to get the model.
  
  @param {string} id - The id of the model to return.
  
  @throws {NoSuchModelError} If no model with the given id exists.
  @throws {NoSuchProviderError} If no provider with the given id exists.
  
  @returns {LanguageModel} The language model associated with the id.
  
  @deprecated use `textEmbeddingModel` instead.
     */
    textEmbedding?: (modelId: string) => EmbeddingModel<string>;
}

/**
Registry for managing models. It enables getting a model with a string id.

@deprecated Use `experimental_Provider` instead.
 */
type experimental_ProviderRegistry = Provider;
/**
 * @deprecated Use `experimental_ProviderRegistry` instead.
 */
type experimental_ModelRegistry = experimental_ProviderRegistry;
/**
 * Creates a registry for the given providers.
 */
declare function experimental_createProviderRegistry(providers: Record<string, experimental_Provider | Provider>): Provider;
/**
 * @deprecated Use `experimental_createProviderRegistry` instead.
 */
declare const experimental_createModelRegistry: typeof experimental_createProviderRegistry;

/**
 * Calculates the cosine similarity between two vectors. This is a useful metric for
 * comparing the similarity of two vectors such as embeddings.
 *
 * @param vector1 - The first vector.
 * @param vector2 - The second vector.
 *
 * @returns The cosine similarity between vector1 and vector2.
 * @throws {Error} If the vectors do not have the same length.
 */
declare function cosineSimilarity(vector1: number[], vector2: number[]): number;

declare const symbol$8: unique symbol;
declare class InvalidArgumentError extends AISDKError {
    private readonly [symbol$8];
    readonly parameter: string;
    readonly value: unknown;
    constructor({ parameter, value, message, }: {
        parameter: string;
        value: unknown;
        message: string;
    });
    static isInstance(error: unknown): error is InvalidArgumentError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isInvalidArgumentError(error: unknown): error is InvalidArgumentError;
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        parameter: string;
        value: unknown;
    };
}

declare const symbol$7: unique symbol;
declare class InvalidToolArgumentsError extends AISDKError {
    private readonly [symbol$7];
    readonly toolName: string;
    readonly toolArgs: string;
    constructor({ toolArgs, toolName, cause, message, }: {
        message?: string;
        toolArgs: string;
        toolName: string;
        cause: unknown;
    });
    static isInstance(error: unknown): error is InvalidToolArgumentsError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isInvalidToolArgumentsError(error: unknown): error is InvalidToolArgumentsError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        toolName: string;
        toolArgs: string;
    };
}

declare const symbol$6: unique symbol;
declare class NoSuchToolError extends AISDKError {
    private readonly [symbol$6];
    readonly toolName: string;
    readonly availableTools: string[] | undefined;
    constructor({ toolName, availableTools, message, }: {
        toolName: string;
        availableTools?: string[] | undefined;
        message?: string;
    });
    static isInstance(error: unknown): error is NoSuchToolError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isNoSuchToolError(error: unknown): error is NoSuchToolError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        toolName: string;
        availableTools: string[] | undefined;
    };
}

declare const symbol$5: unique symbol;
/**
Thrown when the AI provider fails to generate a parsable object.
 */
declare class NoObjectGeneratedError extends AISDKError {
    private readonly [symbol$5];
    constructor({ message }?: {
        message?: string;
    });
    static isInstance(error: unknown): error is NoObjectGeneratedError;
    /**
     * @deprecated Use isInstance instead.
     */
    static isNoObjectGeneratedError(error: unknown): error is NoObjectGeneratedError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        cause: unknown;
        message: string;
        stack: string | undefined;
    };
}

declare const symbol$4: unique symbol;
declare class InvalidDataContentError extends AISDKError {
    private readonly [symbol$4];
    readonly content: unknown;
    constructor({ content, cause, message, }: {
        content: unknown;
        cause?: unknown;
        message?: string;
    });
    static isInstance(error: unknown): error is InvalidDataContentError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isInvalidDataContentError(error: unknown): error is InvalidDataContentError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        cause: unknown;
        content: unknown;
    };
}

declare const symbol$3: unique symbol;
declare class InvalidMessageRoleError extends AISDKError {
    private readonly [symbol$3];
    readonly role: string;
    constructor({ role, message, }: {
        role: string;
        message?: string;
    });
    static isInstance(error: unknown): error is InvalidMessageRoleError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isInvalidMessageRoleError(error: unknown): error is InvalidMessageRoleError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        role: string;
    };
}

declare const symbol$2: unique symbol;
declare class MessageConversionError extends AISDKError {
    private readonly [symbol$2];
    readonly originalMessage: ConvertibleMessage;
    constructor({ originalMessage, message, }: {
        originalMessage: ConvertibleMessage;
        message: string;
    });
    static isInstance(error: unknown): error is MessageConversionError;
}

declare const symbol$1: unique symbol;
declare class DownloadError extends AISDKError {
    private readonly [symbol$1];
    readonly url: string;
    readonly statusCode?: number;
    readonly statusText?: string;
    constructor({ url, statusCode, statusText, cause, message, }: {
        url: string;
        statusCode?: number;
        statusText?: string;
        message?: string;
        cause?: unknown;
    });
    static isInstance(error: unknown): error is DownloadError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isDownloadError(error: unknown): error is DownloadError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        url: string;
        statusCode: number | undefined;
        statusText: string | undefined;
        cause: unknown;
    };
}

declare const symbol: unique symbol;
type RetryErrorReason = 'maxRetriesExceeded' | 'errorNotRetryable' | 'abort';
declare class RetryError extends AISDKError {
    private readonly [symbol];
    readonly reason: RetryErrorReason;
    readonly lastError: unknown;
    readonly errors: Array<unknown>;
    constructor({ message, reason, errors, }: {
        message: string;
        reason: RetryErrorReason;
        errors: Array<unknown>;
    });
    static isInstance(error: unknown): error is RetryError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isRetryError(error: unknown): error is RetryError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        reason: RetryErrorReason;
        lastError: unknown;
        errors: unknown[];
    };
}

declare interface AzureChatCompletions {
    id: string;
    created: Date;
    choices: AzureChatChoice[];
    systemFingerprint?: string;
    usage?: AzureCompletionsUsage;
    promptFilterResults: any[];
}
declare interface AzureChatChoice {
    message?: AzureChatResponseMessage;
    index: number;
    finishReason: string | null;
    delta?: AzureChatResponseMessage;
}
declare interface AzureChatResponseMessage {
    role: string;
    content: string | null;
    toolCalls: AzureChatCompletionsFunctionToolCall[];
    functionCall?: AzureFunctionCall;
}
declare interface AzureCompletionsUsage {
    completionTokens: number;
    promptTokens: number;
    totalTokens: number;
}
declare interface AzureFunctionCall {
    name: string;
    arguments: string;
}
declare interface AzureChatCompletionsFunctionToolCall {
    type: 'function';
    function: AzureFunctionCall;
    id: string;
}

type OpenAIStreamCallbacks = AIStreamCallbacksAndOptions & {
    /**
     * @example
     * ```js
     * const response = await openai.chat.completions.create({
     *   model: 'gpt-3.5-turbo-0613',
     *   stream: true,
     *   messages,
     *   functions,
     * })
     *
     * const stream = OpenAIStream(response, {
     *   experimental_onFunctionCall: async (functionCallPayload, createFunctionCallMessages) => {
     *     // ... run your custom logic here
     *     const result = await myFunction(functionCallPayload)
     *
     *     // Ask for another completion, or return a string to send to the client as an assistant message.
     *     return await openai.chat.completions.create({
     *       model: 'gpt-3.5-turbo-0613',
     *       stream: true,
     *       // Append the relevant "assistant" and "function" call messages
     *       messages: [...messages, ...createFunctionCallMessages(result)],
     *       functions,
     *     })
     *   }
     * })
     * ```
     */
    experimental_onFunctionCall?: (functionCallPayload: FunctionCallPayload, createFunctionCallMessages: (functionCallResult: JSONValue$1) => CreateMessage[]) => Promise<Response | undefined | void | string | AsyncIterableOpenAIStreamReturnTypes>;
    /**
     * @example
     * ```js
     * const response = await openai.chat.completions.create({
     *   model: 'gpt-3.5-turbo-1106', // or gpt-4-1106-preview
     *   stream: true,
     *   messages,
     *   tools,
     *   tool_choice: "auto", // auto is default, but we'll be explicit
     * })
     *
     * const stream = OpenAIStream(response, {
     *   experimental_onToolCall: async (toolCallPayload, appendToolCallMessages) => {
     *    let messages: CreateMessage[] = []
     *    //   There might be multiple tool calls, so we need to iterate through them
     *    for (const tool of toolCallPayload.tools) {
     *     // ... run your custom logic here
     *     const result = await myFunction(tool.function)
     *    // Append the relevant "assistant" and "tool" call messages
     *     appendToolCallMessage({tool_call_id:tool.id, function_name:tool.function.name, tool_call_result:result})
     *    }
     *     // Ask for another completion, or return a string to send to the client as an assistant message.
     *     return await openai.chat.completions.create({
     *       model: 'gpt-3.5-turbo-1106', // or gpt-4-1106-preview
     *       stream: true,
     *       // Append the results messages, calling appendToolCallMessage without
     *       // any arguments will jsut return the accumulated messages
     *       messages: [...messages, ...appendToolCallMessage()],
     *       tools,
     *        tool_choice: "auto", // auto is default, but we'll be explicit
     *     })
     *   }
     * })
     * ```
     */
    experimental_onToolCall?: (toolCallPayload: ToolCallPayload, appendToolCallMessage: (result?: {
        tool_call_id: string;
        function_name: string;
        tool_call_result: JSONValue$1;
    }) => CreateMessage[]) => Promise<Response | undefined | void | string | AsyncIterableOpenAIStreamReturnTypes>;
};
interface ChatCompletionChunk {
    id: string;
    choices: Array<ChatCompletionChunkChoice>;
    created: number;
    model: string;
    object: string;
}
interface ChatCompletionChunkChoice {
    delta: ChoiceDelta;
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call' | null;
    index: number;
}
interface ChoiceDelta {
    /**
     * The contents of the chunk message.
     */
    content?: string | null;
    /**
     * The name and arguments of a function that should be called, as generated by the
     * model.
     */
    function_call?: FunctionCall$1;
    /**
     * The role of the author of this message.
     */
    role?: 'system' | 'user' | 'assistant' | 'tool';
    tool_calls?: Array<DeltaToolCall>;
}
interface DeltaToolCall {
    index: number;
    /**
     * The ID of the tool call.
     */
    id?: string;
    /**
     * The function that the model called.
     */
    function?: ToolCallFunction;
    /**
     * The type of the tool. Currently, only `function` is supported.
     */
    type?: 'function';
}
interface ToolCallFunction {
    /**
     * The arguments to call the function with, as generated by the model in JSON
     * format. Note that the model does not always generate valid JSON, and may
     * hallucinate parameters not defined by your function schema. Validate the
     * arguments in your code before calling your function.
     */
    arguments?: string;
    /**
     * The name of the function to call.
     */
    name?: string;
}
/**
 * https://github.com/openai/openai-node/blob/3ec43ee790a2eb6a0ccdd5f25faa23251b0f9b8e/src/resources/completions.ts#L28C1-L64C1
 * Completions API. Streamed and non-streamed responses are the same.
 */
interface Completion {
    /**
     * A unique identifier for the completion.
     */
    id: string;
    /**
     * The list of completion choices the model generated for the input prompt.
     */
    choices: Array<CompletionChoice>;
    /**
     * The Unix timestamp of when the completion was created.
     */
    created: number;
    /**
     * The model used for completion.
     */
    model: string;
    /**
     * The object type, which is always "text_completion"
     */
    object: string;
    /**
     * Usage statistics for the completion request.
     */
    usage?: CompletionUsage;
}
interface CompletionChoice {
    /**
     * The reason the model stopped generating tokens. This will be `stop` if the model
     * hit a natural stop point or a provided stop sequence, or `length` if the maximum
     * number of tokens specified in the request was reached.
     */
    finish_reason: 'stop' | 'length' | 'content_filter';
    index: number;
    logprobs: any | null;
    text: string;
}
interface CompletionUsage {
    /**
     * Usage statistics for the completion request.
     */
    /**
     * Number of tokens in the generated completion.
     */
    completion_tokens: number;
    /**
     * Number of tokens in the prompt.
     */
    prompt_tokens: number;
    /**
     * Total number of tokens used in the request (prompt + completion).
     */
    total_tokens: number;
}
type AsyncIterableOpenAIStreamReturnTypes = AsyncIterable<ChatCompletionChunk> | AsyncIterable<Completion> | AsyncIterable<AzureChatCompletions>;
/**
 * @deprecated Use the [OpenAI provider](https://sdk.vercel.ai/providers/ai-sdk-providers/openai) instead.
 */
declare function OpenAIStream(res: Response | AsyncIterableOpenAIStreamReturnTypes, callbacks?: OpenAIStreamCallbacks): ReadableStream;

interface FunctionCallPayload {
    name: string;
    arguments: Record<string, unknown>;
}
interface ToolCallPayload {
    tools: {
        id: string;
        type: 'function';
        func: {
            name: string;
            arguments: Record<string, unknown>;
        };
    }[];
}
/**
 * Configuration options and helper callback methods for AIStream stream lifecycle events.
 * @interface
 */
interface AIStreamCallbacksAndOptions {
    /** `onStart`: Called once when the stream is initialized. */
    onStart?: () => Promise<void> | void;
    /** `onCompletion`: Called for each tokenized message. */
    onCompletion?: (completion: string) => Promise<void> | void;
    /** `onFinal`: Called once when the stream is closed with the final completion message. */
    onFinal?: (completion: string) => Promise<void> | void;
    /** `onToken`: Called for each tokenized message. */
    onToken?: (token: string) => Promise<void> | void;
    /** `onText`: Called for each text chunk. */
    onText?: (text: string) => Promise<void> | void;
    /**
     * @deprecated This flag is no longer used and only retained for backwards compatibility.
     * You can remove it from your code.
     */
    experimental_streamData?: boolean;
}
/**
 * Options for the AIStreamParser.
 * @interface
 * @property {string} event - The event (type) from the server side event stream.
 */
interface AIStreamParserOptions {
    event?: string;
}
/**
 * Custom parser for AIStream data.
 * @interface
 * @param {string} data - The data to be parsed.
 * @param {AIStreamParserOptions} options - The options for the parser.
 * @returns {string | void} The parsed data or void.
 */
interface AIStreamParser {
    (data: string, options: AIStreamParserOptions): string | void | {
        isText: false;
        content: string;
    };
}
/**
 * Creates a TransformStream that parses events from an EventSource stream using a custom parser.
 * @param {AIStreamParser} customParser - Function to handle event data.
 * @returns {TransformStream<Uint8Array, string>} TransformStream parsing events.
 */
declare function createEventStreamTransformer(customParser?: AIStreamParser): TransformStream<Uint8Array, string | {
    isText: false;
    content: string;
}>;
/**
 * Creates a transform stream that encodes input messages and invokes optional callback functions.
 * The transform stream uses the provided callbacks to execute custom logic at different stages of the stream's lifecycle.
 * - `onStart`: Called once when the stream is initialized.
 * - `onToken`: Called for each tokenized message.
 * - `onCompletion`: Called every time an AIStream completion message is received. This can occur multiple times when using e.g. OpenAI functions
 * - `onFinal`: Called once when the stream is closed with the final completion message.
 *
 * This function is useful when you want to process a stream of messages and perform specific actions during the stream's lifecycle.
 *
 * @param {AIStreamCallbacksAndOptions} [callbacks] - An object containing the callback functions.
 * @return {TransformStream<string, Uint8Array>} A transform stream that encodes input messages as Uint8Array and allows the execution of custom logic through callbacks.
 *
 * @example
 * const callbacks = {
 *   onStart: async () => console.log('Stream started'),
 *   onToken: async (token) => console.log(`Token: ${token}`),
 *   onCompletion: async (completion) => console.log(`Completion: ${completion}`)
 *   onFinal: async () => data.close()
 * };
 * const transformer = createCallbacksTransformer(callbacks);
 */
declare function createCallbacksTransformer(cb: AIStreamCallbacksAndOptions | OpenAIStreamCallbacks | undefined): TransformStream<string | {
    isText: false;
    content: string;
}, Uint8Array>;
/**
 * Returns a stateful function that, when invoked, trims leading whitespace
 * from the input text. The trimming only occurs on the first invocation, ensuring that
 * subsequent calls do not alter the input text. This is particularly useful in scenarios
 * where a text stream is being processed and only the initial whitespace should be removed.
 *
 * @return {function(string): string} A function that takes a string as input and returns a string
 * with leading whitespace removed if it is the first invocation; otherwise, it returns the input unchanged.
 *
 * @example
 * const trimStart = trimStartOfStreamHelper();
 * const output1 = trimStart("   text"); // "text"
 * const output2 = trimStart("   text"); // "   text"
 *
 */
declare function trimStartOfStreamHelper(): (text: string) => string;
/**
 * Returns a ReadableStream created from the response, parsed and handled with custom logic.
 * The stream goes through two transformation stages, first parsing the events and then
 * invoking the provided callbacks.
 *
 * For 2xx HTTP responses:
 * - The function continues with standard stream processing.
 *
 * For non-2xx HTTP responses:
 * - If the response body is defined, it asynchronously extracts and decodes the response body.
 * - It then creates a custom ReadableStream to propagate a detailed error message.
 *
 * @param {Response} response - The response.
 * @param {AIStreamParser} customParser - The custom parser function.
 * @param {AIStreamCallbacksAndOptions} callbacks - The callbacks.
 * @return {ReadableStream} The AIStream.
 * @throws Will throw an error if the response is not OK.
 */
declare function AIStream(response: Response, customParser?: AIStreamParser, callbacks?: AIStreamCallbacksAndOptions): ReadableStream<Uint8Array>;
/**
 * Implements ReadableStream.from(asyncIterable), which isn't documented in MDN and isn't implemented in node.
 * https://github.com/whatwg/streams/commit/8d7a0bf26eb2cc23e884ddbaac7c1da4b91cf2bc
 */
declare function readableFromAsyncIterable<T>(iterable: AsyncIterable<T>): ReadableStream<T>;

interface CompletionChunk {
    /**
     * Unique object identifier.
     *
     * The format and length of IDs may change over time.
     */
    id: string;
    /**
     * The resulting completion up to and excluding the stop sequences.
     */
    completion: string;
    /**
     * The model that handled the request.
     */
    model: string;
    /**
     * The reason that we stopped.
     *
     * This may be one the following values:
     *
     * - `"stop_sequence"`: we reached a stop sequence — either provided by you via the
     *   `stop_sequences` parameter, or a stop sequence built into the model
     * - `"max_tokens"`: we exceeded `max_tokens_to_sample` or the model's maximum
     */
    stop_reason: string | null;
    /**
     * Object type.
     *
     * For Text Completions, this is always `"completion"`.
     */
    type: 'completion';
}
interface Message {
    id: string;
    content: Array<ContentBlock>;
    model: string;
    role: 'assistant';
    stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | null;
    stop_sequence: string | null;
    type: 'message';
}
interface ContentBlock {
    text: string;
    type: 'text';
}
interface TextDelta {
    text: string;
    type: 'text_delta';
}
interface ContentBlockDeltaEvent {
    delta: TextDelta;
    index: number;
    type: 'content_block_delta';
}
interface ContentBlockStartEvent {
    content_block: ContentBlock;
    index: number;
    type: 'content_block_start';
}
interface ContentBlockStopEvent {
    index: number;
    type: 'content_block_stop';
}
interface MessageDeltaEventDelta {
    stop_reason: 'end_turn' | 'max_tokens' | 'stop_sequence' | null;
    stop_sequence: string | null;
}
interface MessageDeltaEvent {
    delta: MessageDeltaEventDelta;
    type: 'message_delta';
}
type MessageStreamEvent = MessageStartEvent | MessageDeltaEvent | MessageStopEvent | ContentBlockStartEvent | ContentBlockDeltaEvent | ContentBlockStopEvent;
interface MessageStartEvent {
    message: Message;
    type: 'message_start';
}
interface MessageStopEvent {
    type: 'message_stop';
}
/**
 * Accepts either a fetch Response from the Anthropic `POST /v1/complete` endpoint,
 * or the return value of `await client.completions.create({ stream: true })`
 * from the `@anthropic-ai/sdk` package.
 *
 * @deprecated Use the [Anthropic provider](https://sdk.vercel.ai/providers/ai-sdk-providers/anthropic) instead.
 */
declare function AnthropicStream(res: Response | AsyncIterable<CompletionChunk> | AsyncIterable<MessageStreamEvent>, cb?: AIStreamCallbacksAndOptions): ReadableStream;

/**
You can pass the thread and the latest message into the `AssistantResponse`. This establishes the context for the response.
 */
type AssistantResponseSettings = {
    /**
  The thread ID that the response is associated with.
     */
    threadId: string;
    /**
  The ID of the latest message that the response is associated with.
   */
    messageId: string;
};
/**
The process parameter is a callback in which you can run the assistant on threads, and send messages and data messages to the client.
 */
type AssistantResponseCallback = (options: {
    /**
  @deprecated use variable from outer scope instead.
     */
    threadId: string;
    /**
  @deprecated use variable from outer scope instead.
     */
    messageId: string;
    /**
  Forwards an assistant message (non-streaming) to the client.
     */
    sendMessage: (message: AssistantMessage) => void;
    /**
  Send a data message to the client. You can use this to provide information for rendering custom UIs while the assistant is processing the thread.
   */
    sendDataMessage: (message: DataMessage) => void;
    /**
  Forwards the assistant response stream to the client. Returns the `Run` object after it completes, or when it requires an action.
     */
    forwardStream: (stream: AssistantStream) => Promise<Run | undefined>;
}) => Promise<void>;
/**
The `AssistantResponse` allows you to send a stream of assistant update to `useAssistant`.
It is designed to facilitate streaming assistant responses to the `useAssistant` hook.
It receives an assistant thread and a current message, and can send messages and data messages to the client.
 */
declare function AssistantResponse({ threadId, messageId }: AssistantResponseSettings, process: AssistantResponseCallback): Response;
/**
@deprecated Use `AssistantResponse` instead.
 */
declare const experimental_AssistantResponse: typeof AssistantResponse;

interface AWSBedrockResponse {
    body?: AsyncIterable<{
        chunk?: {
            bytes?: Uint8Array;
        };
    }>;
}
declare function AWSBedrockAnthropicMessagesStream(response: AWSBedrockResponse, callbacks?: AIStreamCallbacksAndOptions): ReadableStream;
declare function AWSBedrockAnthropicStream(response: AWSBedrockResponse, callbacks?: AIStreamCallbacksAndOptions): ReadableStream;
declare function AWSBedrockCohereStream(response: AWSBedrockResponse, callbacks?: AIStreamCallbacksAndOptions): ReadableStream;
declare function AWSBedrockLlama2Stream(response: AWSBedrockResponse, callbacks?: AIStreamCallbacksAndOptions): ReadableStream;
declare function AWSBedrockStream(response: AWSBedrockResponse, callbacks: AIStreamCallbacksAndOptions | undefined, extractTextDeltaFromChunk: (chunk: any) => string): ReadableStream<any>;

interface StreamChunk {
    text?: string;
    eventType: 'stream-start' | 'search-queries-generation' | 'search-results' | 'text-generation' | 'citation-generation' | 'stream-end';
}
declare function CohereStream(reader: Response | AsyncIterable<StreamChunk>, callbacks?: AIStreamCallbacksAndOptions): ReadableStream;

interface GenerateContentResponse {
    candidates?: GenerateContentCandidate[];
}
interface GenerateContentCandidate {
    index: number;
    content: Content;
}
interface Content {
    role: string;
    parts: Part[];
}
type Part = TextPart | InlineDataPart;
interface InlineDataPart {
    text?: never;
}
interface TextPart {
    text: string;
    inlineData?: never;
}
/**
 * @deprecated Use the [Google Generative AI provider](https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai) instead.
 */
declare function GoogleGenerativeAIStream(response: {
    stream: AsyncIterable<GenerateContentResponse>;
}, cb?: AIStreamCallbacksAndOptions): ReadableStream;

declare function HuggingFaceStream(res: AsyncGenerator<any>, callbacks?: AIStreamCallbacksAndOptions): ReadableStream;

type InkeepOnFinalMetadata = {
    chat_session_id: string;
    records_cited: any;
};
type InkeepChatResultCallbacks = {
    onFinal?: (completion: string, metadata?: InkeepOnFinalMetadata) => Promise<void> | void;
    onRecordsCited?: (records_cited: InkeepOnFinalMetadata['records_cited']) => void;
};
type InkeepAIStreamCallbacksAndOptions = AIStreamCallbacksAndOptions & InkeepChatResultCallbacks;
declare function InkeepStream(res: Response, callbacks?: InkeepAIStreamCallbacksAndOptions): ReadableStream;

/**
 * A stream wrapper to send custom JSON-encoded data back to the client.
 */
declare class StreamData {
    private encoder;
    private controller;
    stream: ReadableStream<Uint8Array>;
    private isClosed;
    private warningTimeout;
    constructor();
    close(): Promise<void>;
    append(value: JSONValue$1): void;
    appendMessageAnnotation(value: JSONValue$1): void;
}
/**
 * A TransformStream for LLMs that do not have their own transform stream handlers managing encoding (e.g. OpenAIStream has one for function call handling).
 * This assumes every chunk is a 'text' chunk.
 */
declare function createStreamDataTransformer(): TransformStream<any, any>;
/**
@deprecated Use `StreamData` instead.
 */
declare class experimental_StreamData extends StreamData {
}

type LangChainImageDetail = 'auto' | 'low' | 'high';
type LangChainMessageContentText = {
    type: 'text';
    text: string;
};
type LangChainMessageContentImageUrl = {
    type: 'image_url';
    image_url: string | {
        url: string;
        detail?: LangChainImageDetail;
    };
};
type LangChainMessageContentComplex = LangChainMessageContentText | LangChainMessageContentImageUrl | (Record<string, any> & {
    type?: 'text' | 'image_url' | string;
}) | (Record<string, any> & {
    type?: never;
});
type LangChainMessageContent = string | LangChainMessageContentComplex[];
type LangChainAIMessageChunk = {
    content: LangChainMessageContent;
};
type LangChainStreamEvent = {
    event: string;
    data: any;
};
/**
Converts LangChain output streams to AIStream.

The following streams are supported:
- `LangChainAIMessageChunk` streams (LangChain `model.stream` output)
- `string` streams (LangChain `StringOutputParser` output)

@deprecated Use `toDataStream` instead.
 */
declare function toAIStream(stream: ReadableStream<LangChainStreamEvent> | ReadableStream<LangChainAIMessageChunk> | ReadableStream<string>, callbacks?: AIStreamCallbacksAndOptions): ReadableStream<any>;
/**
Converts LangChain output streams to AIStream.

The following streams are supported:
- `LangChainAIMessageChunk` streams (LangChain `model.stream` output)
- `string` streams (LangChain `StringOutputParser` output)
 */
declare function toDataStream(stream: ReadableStream<LangChainStreamEvent> | ReadableStream<LangChainAIMessageChunk> | ReadableStream<string>, callbacks?: AIStreamCallbacksAndOptions): ReadableStream<any>;
declare function toDataStreamResponse(stream: ReadableStream<LangChainStreamEvent> | ReadableStream<LangChainAIMessageChunk> | ReadableStream<string>, options?: {
    init?: ResponseInit;
    data?: StreamData;
    callbacks?: AIStreamCallbacksAndOptions;
}): Response;

declare const langchainAdapter_toAIStream: typeof toAIStream;
declare const langchainAdapter_toDataStream: typeof toDataStream;
declare const langchainAdapter_toDataStreamResponse: typeof toDataStreamResponse;
declare namespace langchainAdapter {
  export {
    langchainAdapter_toAIStream as toAIStream,
    langchainAdapter_toDataStream as toDataStream,
    langchainAdapter_toDataStreamResponse as toDataStreamResponse,
  };
}

/**
 * @deprecated Use [LangChainAdapter](https://sdk.vercel.ai/providers/adapters/langchain) instead.
 */
declare function LangChainStream(callbacks?: AIStreamCallbacksAndOptions): {
    stream: ReadableStream<any>;
    writer: WritableStreamDefaultWriter<any>;
    handlers: {
        handleLLMNewToken: (token: string) => Promise<void>;
        handleLLMStart: (_llm: any, _prompts: string[], runId: string) => Promise<void>;
        handleLLMEnd: (_output: any, runId: string) => Promise<void>;
        handleLLMError: (e: Error, runId: string) => Promise<void>;
        handleChainStart: (_chain: any, _inputs: any, runId: string) => Promise<void>;
        handleChainEnd: (_outputs: any, runId: string) => Promise<void>;
        handleChainError: (e: Error, runId: string) => Promise<void>;
        handleToolStart: (_tool: any, _input: string, runId: string) => Promise<void>;
        handleToolEnd: (_output: string, runId: string) => Promise<void>;
        handleToolError: (e: Error, runId: string) => Promise<void>;
    };
};

interface ChatCompletionResponseChunk {
    id: string;
    object: 'chat.completion.chunk';
    created: number;
    model: string;
    choices: ChatCompletionResponseChunkChoice[];
}
interface ChatCompletionResponseChunkChoice {
    index: number;
    delta: {
        role?: string;
        content?: string;
        tool_calls?: ToolCalls[];
    };
    finish_reason: string;
}
interface FunctionCall {
    name: string;
    arguments: string;
}
interface ToolCalls {
    id: 'null';
    type: 'function';
    function: FunctionCall;
}
declare function MistralStream(response: AsyncGenerator<ChatCompletionResponseChunk, void, unknown>, callbacks?: AIStreamCallbacksAndOptions): ReadableStream;

interface Prediction {
    id: string;
    status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    version: string;
    input: object;
    output?: any;
    source: 'api' | 'web';
    error?: any;
    logs?: string;
    metrics?: {
        predict_time?: number;
    };
    webhook?: string;
    webhook_events_filter?: ('start' | 'output' | 'logs' | 'completed')[];
    created_at: string;
    updated_at?: string;
    completed_at?: string;
    urls: {
        get: string;
        cancel: string;
        stream?: string;
    };
}
/**
 * Stream predictions from Replicate.
 * Only certain models are supported and you must pass `stream: true` to
 * replicate.predictions.create().
 * @see https://github.com/replicate/replicate-javascript#streaming
 *
 * @example
 * const response = await replicate.predictions.create({
 *  stream: true,
 *  input: {
 *    prompt: messages.join('\n')
 *  },
 *  version: '2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1'
 * })
 *
 * const stream = await ReplicateStream(response)
 * return new StreamingTextResponse(stream)
 *
 */
declare function ReplicateStream(res: Prediction, cb?: AIStreamCallbacksAndOptions, options?: {
    headers?: Record<string, string>;
}): Promise<ReadableStream>;

/**
 * A utility function to stream a ReadableStream to a Node.js response-like object.
 *
 * @deprecated Use `pipeDataStreamToResponse` (part of `StreamTextResult`) instead.
 */
declare function streamToResponse(res: ReadableStream, response: ServerResponse$1, init?: {
    headers?: Record<string, string>;
    status?: number;
}, data?: StreamData): void;

/**
 * A utility class for streaming text responses.
 *
 * @deprecated Use `streamText.toDataStreamResponse()` (if you did send StreamData)
 * or a regular `Response` instead (if you did not send any StreamData):
 *
 * ```ts
 * return new Response(stream, {
 *   status: 200,
 *   contentType: 'text/plain; charset=utf-8',
 * })
 * ```
 */
declare class StreamingTextResponse extends Response {
    constructor(res: ReadableStream, init?: ResponseInit, data?: StreamData);
}

declare const generateId: () => string;
/**
@deprecated Use `generateId` instead.
 */
declare const nanoid: () => string;

export { AIStream, AIStreamCallbacksAndOptions, AIStreamParser, AIStreamParserOptions, AWSBedrockAnthropicMessagesStream, AWSBedrockAnthropicStream, AWSBedrockCohereStream, AWSBedrockLlama2Stream, AWSBedrockStream, AnthropicStream, AssistantContent, AssistantResponse, CallWarning, CohereStream, CompletionTokenUsage, CompletionUsage, CoreAssistantMessage, CoreMessage, CoreSystemMessage, CoreTool, CoreToolChoice, CoreToolMessage, CoreUserMessage, DataContent, DownloadError, EmbedManyResult, EmbedResult, Embedding, EmbeddingModel, EmbeddingModelUsage, EmbeddingTokenUsage, ExperimentalAssistantMessage, ExperimentalMessage, ExperimentalTool, ExperimentalToolMessage, ExperimentalUserMessage, Experimental_LanguageModelV1Middleware, FinishReason, FunctionCallPayload, GenerateObjectResult, GenerateTextResult, GoogleGenerativeAIStream, HuggingFaceStream, ImagePart, InkeepAIStreamCallbacksAndOptions, InkeepChatResultCallbacks, InkeepOnFinalMetadata, InkeepStream, InvalidArgumentError, InvalidDataContentError, InvalidMessageRoleError, InvalidToolArgumentsError, langchainAdapter as LangChainAdapter, LangChainStream, LanguageModel, LanguageModelResponseMetadata, LanguageModelResponseMetadataWithHeaders, LanguageModelUsage, LogProbs, MessageConversionError, MistralStream, NoObjectGeneratedError, NoSuchProviderError, NoSuchToolError, ObjectStreamPart, OpenAIStream, OpenAIStreamCallbacks, Provider, ProviderMetadata, ReplicateStream, RetryError, StreamData, StreamObjectResult, StreamTextResult, StreamingTextResponse, TextPart$1 as TextPart, TextStreamPart, TokenUsage, ToolCallPart, ToolCallPayload, ToolContent, ToolResultPart, UserContent, convertToCoreMessages, cosineSimilarity, createCallbacksTransformer, createEventStreamTransformer, createStreamDataTransformer, embed, embedMany, experimental_AssistantResponse, experimental_ModelRegistry, experimental_Provider, experimental_ProviderRegistry, experimental_StreamData, experimental_createModelRegistry, experimental_createProviderRegistry, experimental_customProvider, experimental_generateObject, experimental_generateText, experimental_streamObject, experimental_streamText, experimental_wrapLanguageModel, generateId, generateObject, generateText, nanoid, readableFromAsyncIterable, streamObject, streamText, streamToResponse, tool, trimStartOfStreamHelper };
