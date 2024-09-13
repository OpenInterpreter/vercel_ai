import { JSONSchema7 } from 'json-schema';

/**
An embedding is a vector, i.e. an array of numbers.
It is e.g. used to represent a text as a vector of word embeddings.
 */
type EmbeddingModelV1Embedding = Array<number>;

/**
Experimental: Specification for an embedding model that implements the embedding model
interface version 1.

VALUE is the type of the values that the model can embed.
This will allow us to go beyond text embeddings in the future,
e.g. to support image embeddings
 */
type EmbeddingModelV1<VALUE> = {
    /**
  The embedding model must specify which embedding model interface
  version it implements. This will allow us to evolve the embedding
  model interface and retain backwards compatibility. The different
  implementation versions can be handled as a discriminated union
  on our side.
     */
    readonly specificationVersion: 'v1';
    /**
  Name of the provider for logging purposes.
     */
    readonly provider: string;
    /**
  Provider-specific model ID for logging purposes.
     */
    readonly modelId: string;
    /**
  Limit of how many embeddings can be generated in a single API call.
     */
    readonly maxEmbeddingsPerCall: number | undefined;
    /**
  True if the model can handle multiple embedding calls in parallel.
     */
    readonly supportsParallelCalls: boolean;
    /**
  Generates a list of embeddings for the given input text.
  
  Naming: "do" prefix to prevent accidental direct usage of the method
  by the user.
     */
    doEmbed(options: {
        /**
    List of values to embed.
         */
        values: Array<VALUE>;
        /**
    Abort signal for cancelling the operation.
         */
        abortSignal?: AbortSignal;
        /**
      Additional HTTP headers to be sent with the request.
      Only applicable for HTTP-based providers.
         */
        headers?: Record<string, string | undefined>;
    }): PromiseLike<{
        /**
    Generated embeddings. They are in the same order as the input values.
         */
        embeddings: Array<EmbeddingModelV1Embedding>;
        /**
    Token usage. We only have input tokens for embeddings.
        */
        usage?: {
            tokens: number;
        };
        /**
    Optional raw response information for debugging purposes.
         */
        rawResponse?: {
            /**
      Response headers.
             */
            headers?: Record<string, string>;
        };
    }>;
};

declare const symbol$c: unique symbol;
/**
 * Custom error class for AI SDK related errors.
 * @extends Error
 */
declare class AISDKError extends Error {
    private readonly [symbol$c];
    /**
     * The underlying cause of the error, if any.
     */
    readonly cause?: unknown;
    /**
     * Creates an AI SDK Error.
     *
     * @param {Object} params - The parameters for creating the error.
     * @param {string} params.name - The name of the error.
     * @param {string} params.message - The error message.
     * @param {unknown} [params.cause] - The underlying cause of the error.
     */
    constructor({ name, message, cause, }: {
        name: string;
        message: string;
        cause?: unknown;
    });
    /**
     * Checks if the given error is an AI SDK Error.
     * @param {unknown} error - The error to check.
     * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
     */
    static isInstance(error: unknown): error is AISDKError;
    protected static hasMarker(error: unknown, marker: string): boolean;
    /**
     * Returns a JSON representation of the error.
     * @returns {Object} An object containing the error's name, message, and cause.
     *
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
    };
}

declare const symbol$b: unique symbol;
declare class APICallError extends AISDKError {
    private readonly [symbol$b];
    readonly url: string;
    readonly requestBodyValues: unknown;
    readonly statusCode?: number;
    readonly responseHeaders?: Record<string, string>;
    readonly responseBody?: string;
    readonly isRetryable: boolean;
    readonly data?: unknown;
    constructor({ message, url, requestBodyValues, statusCode, responseHeaders, responseBody, cause, isRetryable, // server error
    data, }: {
        message: string;
        url: string;
        requestBodyValues: unknown;
        statusCode?: number;
        responseHeaders?: Record<string, string>;
        responseBody?: string;
        cause?: unknown;
        isRetryable?: boolean;
        data?: unknown;
    });
    static isInstance(error: unknown): error is APICallError;
    /**
     * @deprecated Use isInstance instead.
     */
    static isAPICallError(error: unknown): error is APICallError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        url: string;
        requestBodyValues: unknown;
        statusCode: number | undefined;
        responseHeaders: Record<string, string> | undefined;
        responseBody: string | undefined;
        cause: unknown;
        isRetryable: boolean;
        data: unknown;
    };
}

declare const symbol$a: unique symbol;
declare class EmptyResponseBodyError extends AISDKError {
    private readonly [symbol$a];
    constructor({ message }?: {
        message?: string;
    });
    static isInstance(error: unknown): error is EmptyResponseBodyError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isEmptyResponseBodyError(error: unknown): error is EmptyResponseBodyError;
}

declare function getErrorMessage(error: unknown | undefined): string;

declare const symbol$9: unique symbol;
/**
 * A prompt is invalid. This error should be thrown by providers when they cannot
 * process a prompt.
 */
declare class InvalidPromptError extends AISDKError {
    private readonly [symbol$9];
    readonly prompt: unknown;
    constructor({ prompt, message, cause, }: {
        prompt: unknown;
        message: string;
        cause?: unknown;
    });
    static isInstance(error: unknown): error is InvalidPromptError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isInvalidPromptError(error: unknown): error is InvalidPromptError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        prompt: unknown;
    };
}

declare const symbol$8: unique symbol;
/**
 * Server returned a response with invalid data content.
 * This should be thrown by providers when they cannot parse the response from the API.
 */
declare class InvalidResponseDataError extends AISDKError {
    private readonly [symbol$8];
    readonly data: unknown;
    constructor({ data, message, }: {
        data: unknown;
        message?: string;
    });
    static isInstance(error: unknown): error is InvalidResponseDataError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isInvalidResponseDataError(error: unknown): error is InvalidResponseDataError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        data: unknown;
    };
}

declare const symbol$7: unique symbol;
declare class JSONParseError extends AISDKError {
    private readonly [symbol$7];
    readonly text: string;
    constructor({ text, cause }: {
        text: string;
        cause: unknown;
    });
    static isInstance(error: unknown): error is JSONParseError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isJSONParseError(error: unknown): error is JSONParseError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        valueText: string;
    };
}

declare const symbol$6: unique symbol;
declare class LoadAPIKeyError extends AISDKError {
    private readonly [symbol$6];
    constructor({ message }: {
        message: string;
    });
    static isInstance(error: unknown): error is LoadAPIKeyError;
    /**
     * @deprecated Use isInstance instead.
     */
    static isLoadAPIKeyError(error: unknown): error is LoadAPIKeyError;
}

declare const symbol$5: unique symbol;
declare class LoadSettingError extends AISDKError {
    private readonly [symbol$5];
    constructor({ message }: {
        message: string;
    });
    static isInstance(error: unknown): error is LoadSettingError;
    /**
     * @deprecated Use isInstance instead.
     */
    static isLoadSettingError(error: unknown): error is LoadSettingError;
}

declare const symbol$4: unique symbol;
/**
Thrown when the AI provider fails to generate any content.
 */
declare class NoContentGeneratedError extends AISDKError {
    private readonly [symbol$4];
    constructor({ message, }?: {
        message?: string;
    });
    static isInstance(error: unknown): error is NoContentGeneratedError;
    /**
     * @deprecated Use isInstance instead.
     */
    static isNoContentGeneratedError(error: unknown): error is NoContentGeneratedError;
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

declare const symbol$3: unique symbol;
declare class NoSuchModelError extends AISDKError {
    private readonly [symbol$3];
    readonly modelId: string;
    readonly modelType: 'languageModel' | 'textEmbeddingModel';
    constructor({ errorName, modelId, modelType, message, }: {
        errorName?: string;
        modelId: string;
        modelType: 'languageModel' | 'textEmbeddingModel';
        message?: string;
    });
    static isInstance(error: unknown): error is NoSuchModelError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isNoSuchModelError(error: unknown): error is NoSuchModelError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        modelId: string;
        modelType: "languageModel" | "textEmbeddingModel";
    };
}

declare const symbol$2: unique symbol;
declare class TooManyEmbeddingValuesForCallError extends AISDKError {
    private readonly [symbol$2];
    readonly provider: string;
    readonly modelId: string;
    readonly maxEmbeddingsPerCall: number;
    readonly values: Array<unknown>;
    constructor(options: {
        provider: string;
        modelId: string;
        maxEmbeddingsPerCall: number;
        values: Array<unknown>;
    });
    static isInstance(error: unknown): error is TooManyEmbeddingValuesForCallError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isTooManyEmbeddingValuesForCallError(error: unknown): error is TooManyEmbeddingValuesForCallError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        provider: string;
        modelId: string;
        maxEmbeddingsPerCall: number;
        values: unknown[];
    };
}

declare const symbol$1: unique symbol;
declare class TypeValidationError extends AISDKError {
    private readonly [symbol$1];
    readonly value: unknown;
    constructor({ value, cause }: {
        value: unknown;
        cause: unknown;
    });
    static isInstance(error: unknown): error is TypeValidationError;
    /**
     * Wraps an error into a TypeValidationError.
     * If the cause is already a TypeValidationError with the same value, it returns the cause.
     * Otherwise, it creates a new TypeValidationError.
     *
     * @param {Object} params - The parameters for wrapping the error.
     * @param {unknown} params.value - The value that failed validation.
     * @param {unknown} params.cause - The original error or cause of the validation failure.
     * @returns {TypeValidationError} A TypeValidationError instance.
     */
    static wrap({ value, cause, }: {
        value: unknown;
        cause: unknown;
    }): TypeValidationError;
    /**
     * @deprecated use `isInstance` instead
     */
    static isTypeValidationError(error: unknown): error is TypeValidationError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        cause: unknown;
        stack: string | undefined;
        value: unknown;
    };
}

declare const symbol: unique symbol;
declare class UnsupportedFunctionalityError extends AISDKError {
    private readonly [symbol];
    readonly functionality: string;
    constructor({ functionality }: {
        functionality: string;
    });
    static isInstance(error: unknown): error is UnsupportedFunctionalityError;
    /**
     * @deprecated Use isInstance instead.
     */
    static isUnsupportedFunctionalityError(error: unknown): error is UnsupportedFunctionalityError;
    /**
     * @deprecated Do not use this method. It will be removed in the next major version.
     */
    toJSON(): {
        name: string;
        message: string;
        stack: string | undefined;
        functionality: string;
    };
}

type JSONValue = null | string | number | boolean | JSONObject | JSONArray;
type JSONObject = {
    [key: string]: JSONValue;
};
type JSONArray = JSONValue[];

declare function isJSONValue(value: unknown): value is JSONValue;
declare function isJSONArray(value: unknown): value is JSONArray;
declare function isJSONObject(value: unknown): value is JSONObject;

type LanguageModelV1CallSettings = {
    /**
  Maximum number of tokens to generate.
     */
    maxTokens?: number;
    /**
  Temperature setting.
  
  It is recommended to set either `temperature` or `topP`, but not both.
     */
    temperature?: number;
    /**
  Stop sequences.
  If set, the model will stop generating text when one of the stop sequences is generated.
  Providers may have limits on the number of stop sequences.
     */
    stopSequences?: string[];
    /**
  Nucleus sampling.
  
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
     */
    presencePenalty?: number;
    /**
  Frequency penalty setting. It affects the likelihood of the model
  to repeatedly use the same words or phrases.
     */
    frequencyPenalty?: number;
    /**
  Response format. The output can either be text or JSON. Default is text.
  
  If JSON is selected, a schema can optionally be provided to guide the LLM.
     */
    responseFormat?: {
        type: 'text';
    } | {
        type: 'json';
        /**
         * JSON schema that the generated output should conform to.
         */
        schema?: JSONSchema7;
        /**
         * Name of output that should be generated. Used by some providers for additional LLM guidance.
         */
        name?: string;
        /**
         * Description of the output that should be generated. Used by some providers for additional LLM guidance.
         */
        description?: string;
    };
    /**
  The seed (integer) to use for random sampling. If set and supported
  by the model, calls will generate deterministic results.
     */
    seed?: number;
    /**
  Abort signal for cancelling the operation.
     */
    abortSignal?: AbortSignal;
    /**
  Additional HTTP headers to be sent with the request.
  Only applicable for HTTP-based providers.
     */
    headers?: Record<string, string | undefined>;
};

/**
A tool has a name, a description, and a set of parameters.

Note: this is **not** the user-facing tool definition. The AI SDK methods will
map the user-facing tool definitions to this format.
 */
type LanguageModelV1FunctionTool = {
    /**
  The type of the tool. Only functions for now, but this gives us room to
  add more specific tool types in the future and use a discriminated union.
     */
    type: 'function';
    /**
  The name of the tool. Unique within this model call.
     */
    name: string;
    /**
  A description of the tool. The language model uses this to understand the
  tool's purpose and to provide better completion suggestions.
     */
    description?: string;
    /**
  The parameters that the tool expects. The language model uses this to
  understand the tool's input requirements and to provide matching suggestions.
     */
    parameters: JSONSchema7;
};

/**
 * Additional provider-specific metadata. They are passed through
 * to the provider from the AI SDK and enable provider-specific
 * functionality that can be fully encapsulated in the provider.
 *
 * This enables us to quickly ship provider-specific functionality
 * without affecting the core AI SDK.
 *
 * The outer record is keyed by the provider name, and the inner
 * record is keyed by the provider-specific metadata key.
 *
 * ```ts
 * {
 *   "anthropic": {
 *     "cacheControl": { "type": "ephemeral" }
 *   }
 * }
 * ```
 */
type LanguageModelV1ProviderMetadata = Record<string, Record<string, JSONValue>>;

/**
A prompt is a list of messages.

Note: Not all models and prompt formats support multi-modal inputs and
tool calls. The validation happens at runtime.

Note: This is not a user-facing prompt. The AI SDK methods will map the
user-facing prompt types such as chat or instruction prompts to this format.
 */
type LanguageModelV1Prompt = Array<LanguageModelV1Message>;
type LanguageModelV1Message = ({
    role: 'system';
    content: string;
} | {
    role: 'user';
    content: Array<LanguageModelV1TextPart | LanguageModelV1ImagePart>;
} | {
    role: 'assistant';
    content: Array<LanguageModelV1TextPart | LanguageModelV1ToolCallPart>;
} | {
    role: 'tool';
    content: Array<LanguageModelV1ToolResultPart>;
}) & {
    /**
     * Additional provider-specific metadata. They are passed through
     * to the provider from the AI SDK and enable provider-specific
     * functionality that can be fully encapsulated in the provider.
     */
    providerMetadata?: LanguageModelV1ProviderMetadata;
};
/**
Text content part of a prompt. It contains a string of text.
 */
interface LanguageModelV1TextPart {
    type: 'text';
    /**
  The text content.
     */
    text: string;
    /**
     * Additional provider-specific metadata. They are passed through
     * to the provider from the AI SDK and enable provider-specific
     * functionality that can be fully encapsulated in the provider.
     */
    providerMetadata?: LanguageModelV1ProviderMetadata;
}
/**
Image content part of a prompt. It contains an image.
 */
interface LanguageModelV1ImagePart {
    type: 'image';
    /**
  Image data as a Uint8Array (e.g. from a Blob or Buffer) or a URL.
     */
    image: Uint8Array | URL;
    /**
  Optional mime type of the image.
     */
    mimeType?: string;
    /**
     * Additional provider-specific metadata. They are passed through
     * to the provider from the AI SDK and enable provider-specific
     * functionality that can be fully encapsulated in the provider.
     */
    providerMetadata?: LanguageModelV1ProviderMetadata;
}
/**
Tool call content part of a prompt. It contains a tool call (usually generated by the AI model).
 */
interface LanguageModelV1ToolCallPart {
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
     * Additional provider-specific metadata. They are passed through
     * to the provider from the AI SDK and enable provider-specific
     * functionality that can be fully encapsulated in the provider.
     */
    providerMetadata?: LanguageModelV1ProviderMetadata;
}
/**
Tool result content part of a prompt. It contains the result of the tool call with the matching ID.
 */
interface LanguageModelV1ToolResultPart {
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
     * Additional provider-specific metadata. They are passed through
     * to the provider from the AI SDK and enable provider-specific
     * functionality that can be fully encapsulated in the provider.
     */
    providerMetadata?: LanguageModelV1ProviderMetadata;
}

type LanguageModelV1ToolChoice = {
    type: 'auto';
} | {
    type: 'none';
} | {
    type: 'required';
} | {
    type: 'tool';
    toolName: string;
};

type LanguageModelV1CallOptions = LanguageModelV1CallSettings & {
    /**
  Whether the user provided the input as messages or as
  a prompt. This can help guide non-chat models in the
  expansion, bc different expansions can be needed for
  chat/non-chat use cases.
     */
    inputFormat: 'messages' | 'prompt';
    /**
  The mode affects the behavior of the language model. It is required to
  support provider-independent streaming and generation of structured objects.
  The model can take this information and e.g. configure json mode, the correct
  low level grammar, etc. It can also be used to optimize the efficiency of the
  streaming, e.g. tool-delta stream parts are only needed in the
  object-tool mode.
  
  @deprecated mode will be removed in v2.
  All necessary settings will be directly supported through the call settings,
  in particular responseFormat, toolChoice, and tools.
     */
    mode: {
        type: 'regular';
        /**
The tools that are available for the model.
         */
        tools?: Array<LanguageModelV1FunctionTool>;
        /**
Specifies how the tool should be selected. Defaults to 'auto'.
         */
        toolChoice?: LanguageModelV1ToolChoice;
    } | {
        type: 'object-json';
        /**
         * JSON schema that the generated output should conform to.
         */
        schema?: JSONSchema7;
        /**
         * Name of output that should be generated. Used by some providers for additional LLM guidance.
         */
        name?: string;
        /**
         * Description of the output that should be generated. Used by some providers for additional LLM guidance.
         */
        description?: string;
    } | {
        type: 'object-tool';
        tool: LanguageModelV1FunctionTool;
    };
    /**
  A language mode prompt is a standardized prompt type.
  
  Note: This is **not** the user-facing prompt. The AI SDK methods will map the
  user-facing prompt types such as chat or instruction prompts to this format.
  That approach allows us to evolve the user  facing prompts without breaking
  the language model interface.
     */
    prompt: LanguageModelV1Prompt;
    /**
  Additional provider-specific metadata.
  The metadata is passed through to the provider from the AI SDK and enables
  provider-specific functionality that can be fully encapsulated in the provider.
     */
    providerMetadata?: LanguageModelV1ProviderMetadata;
};

/**
Warning from the model provider for this call. The call will proceed, but e.g.
some settings might not be supported, which can lead to suboptimal results.
 */
type LanguageModelV1CallWarning = {
    type: 'unsupported-setting';
    setting: keyof LanguageModelV1CallSettings;
    details?: string;
} | {
    type: 'other';
    message: string;
};

/**
Reason why a language model finished generating a response.

Can be one of the following:
- `stop`: model generated stop sequence
- `length`: model generated maximum number of tokens
- `content-filter`: content filter violation stopped the model
- `tool-calls`: model triggered tool calls
- `error`: model stopped because of an error
- `other`: model stopped for other reasons
- `unknown`: the model has not transmitted a finish reason
 */
type LanguageModelV1FinishReason = 'stop' | 'length' | 'content-filter' | 'tool-calls' | 'error' | 'other' | 'unknown';

type LanguageModelV1FunctionToolCall = {
    toolCallType: 'function';
    toolCallId: string;
    toolName: string;
    /**
  Stringified JSON object with the tool call arguments. Must match the
  parameters schema of the tool.
     */
    args: string;
};

/**
Log probabilities for each token and its top log probabilities.
 */
type LanguageModelV1LogProbs = Array<{
    token: string;
    logprob: number;
    topLogprobs: Array<{
        token: string;
        logprob: number;
    }>;
}>;

/**
Specification for a language model that implements the language model interface version 1.
 */
type LanguageModelV1 = {
    /**
  The language model must specify which language model interface
  version it implements. This will allow us to evolve the language
  model interface and retain backwards compatibility. The different
  implementation versions can be handled as a discriminated union
  on our side.
     */
    readonly specificationVersion: 'v1';
    /**
  Name of the provider for logging purposes.
     */
    readonly provider: string;
    /**
  Provider-specific model ID for logging purposes.
     */
    readonly modelId: string;
    /**
  Default object generation mode that should be used with this model when
  no mode is specified. Should be the mode with the best results for this
  model. `undefined` can be returned if object generation is not supported.
  
  This is needed to generate the best objects possible w/o requiring the
  user to explicitly specify the object generation mode.
     */
    readonly defaultObjectGenerationMode: 'json' | 'tool' | undefined;
    /**
  Flag whether this model supports image URLs. Default is `true`.
  
  When the flag is set to `false`, the AI SDK will download the image and
  pass the image data to the model.
     */
    readonly supportsImageUrls?: boolean;
    /**
  Flag whether this model supports grammar-guided generation,
  i.e. follows JSON schemas for object generation
  when the response format is set to 'json' or
  when the `object-json` mode is used.
  
  This means that the model guarantees that the generated JSON
  will be a valid JSON object AND that the object will match the
  JSON schema.
  
  Please note that `generateObject` and `streamObject` will work
  regardless of this flag, but might send different prompts and
  use further optimizations if this flag is set to `true`.
  
  Defaults to `false`.
  */
    readonly supportsStructuredOutputs?: boolean;
    /**
  Generates a language model output (non-streaming).
  
  Naming: "do" prefix to prevent accidental direct usage of the method
  by the user.
     */
    doGenerate(options: LanguageModelV1CallOptions): PromiseLike<{
        /**
    Text that the model has generated. Can be undefined if the model
    has only generated tool calls.
         */
        text?: string;
        /**
    Tool calls that the model has generated. Can be undefined if the
    model has only generated text.
         */
        toolCalls?: Array<LanguageModelV1FunctionToolCall>;
        /**
    Finish reason.
         */
        finishReason: LanguageModelV1FinishReason;
        /**
      Usage information.
         */
        usage: {
            promptTokens: number;
            completionTokens: number;
        };
        /**
    Raw prompt and setting information for observability provider integration.
         */
        rawCall: {
            /**
      Raw prompt after expansion and conversion to the format that the
      provider uses to send the information to their API.
             */
            rawPrompt: unknown;
            /**
      Raw settings that are used for the API call. Includes provider-specific
      settings.
             */
            rawSettings: Record<string, unknown>;
        };
        /**
    Optional response information for telemetry and debugging purposes.
         */
        rawResponse?: {
            /**
      Response headers.
            */
            headers?: Record<string, string>;
        };
        response?: {
            /**
      ID for the generated response, if the provider sends one.
           */
            id?: string;
            /**
      Timestamp for the start of the generated response, if the provider sends one.
           */
            timestamp?: Date;
            /**
      The ID of the response model that was used to generate the response, if the provider sends one.
           */
            modelId?: string;
        };
        warnings?: LanguageModelV1CallWarning[];
        /**
    Additional provider-specific metadata. They are passed through
    from the provider to the AI SDK and enable provider-specific
    results that can be fully encapsulated in the provider.
         */
        providerMetadata?: LanguageModelV1ProviderMetadata;
        /**
    Logprobs for the completion.
    `undefined` if the mode does not support logprobs or if was not enabled
    
    @deprecated will be changed into a provider-specific extension in v2
         */
        logprobs?: LanguageModelV1LogProbs;
    }>;
    /**
  Generates a language model output (streaming).
  
  Naming: "do" prefix to prevent accidental direct usage of the method
  by the user.
     *
  @return A stream of higher-level language model output parts.
     */
    doStream(options: LanguageModelV1CallOptions): PromiseLike<{
        stream: ReadableStream<LanguageModelV1StreamPart>;
        /**
    Raw prompt and setting information for observability provider integration.
         */
        rawCall: {
            /**
      Raw prompt after expansion and conversion to the format that the
      provider uses to send the information to their API.
             */
            rawPrompt: unknown;
            /**
      Raw settings that are used for the API call. Includes provider-specific
      settings.
             */
            rawSettings: Record<string, unknown>;
        };
        /**
    Optional raw response data.
         */
        rawResponse?: {
            /**
      Response headers.
             */
            headers?: Record<string, string>;
        };
        warnings?: LanguageModelV1CallWarning[];
    }>;
};
type LanguageModelV1StreamPart = {
    type: 'text-delta';
    textDelta: string;
} | ({
    type: 'tool-call';
} & LanguageModelV1FunctionToolCall) | {
    type: 'tool-call-delta';
    toolCallType: 'function';
    toolCallId: string;
    toolName: string;
    argsTextDelta: string;
} | {
    type: 'response-metadata';
    id?: string;
    timestamp?: Date;
    modelId?: string;
} | {
    type: 'finish';
    finishReason: LanguageModelV1FinishReason;
    providerMetadata?: LanguageModelV1ProviderMetadata;
    usage: {
        promptTokens: number;
        completionTokens: number;
    };
    logprobs?: LanguageModelV1LogProbs;
} | {
    type: 'error';
    error: unknown;
};

/**
 * Provider for language and text embedding models.
 */
interface ProviderV1 {
    /**
  Returns the language model with the given id.
  The model id is then passed to the provider function to get the model.
  
  @param {string} id - The id of the model to return.
  
  @returns {LanguageModel} The language model associated with the id
  
  @throws {NoSuchModelError} If no such model exists.
     */
    languageModel(modelId: string): LanguageModelV1;
    /**
  Returns the text embedding model with the given id.
  The model id is then passed to the provider function to get the model.
  
  @param {string} id - The id of the model to return.
  
  @returns {LanguageModel} The language model associated with the id
  
  @throws {NoSuchModelError} If no such model exists.
     */
    textEmbeddingModel(modelId: string): EmbeddingModelV1<string>;
}

export { AISDKError, APICallError, type EmbeddingModelV1, type EmbeddingModelV1Embedding, EmptyResponseBodyError, InvalidPromptError, InvalidResponseDataError, type JSONArray, type JSONObject, JSONParseError, type JSONValue, type LanguageModelV1, type LanguageModelV1CallOptions, type LanguageModelV1CallWarning, type LanguageModelV1FinishReason, type LanguageModelV1FunctionTool, type LanguageModelV1FunctionToolCall, type LanguageModelV1ImagePart, type LanguageModelV1LogProbs, type LanguageModelV1Message, type LanguageModelV1Prompt, type LanguageModelV1ProviderMetadata, type LanguageModelV1StreamPart, type LanguageModelV1TextPart, type LanguageModelV1ToolCallPart, type LanguageModelV1ToolChoice, type LanguageModelV1ToolResultPart, LoadAPIKeyError, LoadSettingError, NoContentGeneratedError, NoSuchModelError, type ProviderV1, TooManyEmbeddingValuesForCallError, TypeValidationError, UnsupportedFunctionalityError, getErrorMessage, isJSONArray, isJSONObject, isJSONValue };
