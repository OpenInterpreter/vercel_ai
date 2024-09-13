import { LanguageModelV1, ProviderV1, EmbeddingModelV1 } from '@ai-sdk/provider';
import { FetchFunction } from '@ai-sdk/provider-utils';

type GoogleGenerativeAIModelId = 'gemini-1.5-flash-latest' | 'gemini-1.5-flash' | 'gemini-1.5-pro-latest' | 'gemini-1.5-pro' | 'gemini-1.0-pro' | 'gemini-pro' | (string & {});
interface GoogleGenerativeAISettings {
    /**
  Optional. The maximum number of tokens to consider when sampling.
  
  Models use nucleus sampling or combined Top-k and nucleus sampling.
  Top-k sampling considers the set of topK most probable tokens.
  Models running with nucleus sampling don't allow topK setting.
  
  @deprecated use the topK setting on the request instead.
     */
    topK?: number;
    /**
  Optional.
  The name of the cached content used as context to serve the prediction.
  Format: cachedContents/{cachedContent}
     */
    cachedContent?: string;
    /**
     * Optional. Enable structured output. Default is true.
     *
     * This is useful when the JSON Schema contains elements that are
     * not supported by the OpenAPI schema version that
     * Google Generative AI uses. You can use this to disable
     * structured outputs if you need to.
     */
    structuredOutputs?: boolean;
    /**
  Optional. A list of unique safety settings for blocking unsafe content.
     */
    safetySettings?: Array<{
        category: 'HARM_CATEGORY_HATE_SPEECH' | 'HARM_CATEGORY_DANGEROUS_CONTENT' | 'HARM_CATEGORY_HARASSMENT' | 'HARM_CATEGORY_SEXUALLY_EXPLICIT';
        threshold: 'HARM_BLOCK_THRESHOLD_UNSPECIFIED' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_NONE';
    }>;
}

type GoogleGenerativeAIConfig = {
    provider: string;
    baseURL: string;
    headers: () => Record<string, string | undefined>;
    generateId: () => string;
    fetch?: FetchFunction;
};
declare class GoogleGenerativeAILanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode = "json";
    readonly supportsImageUrls = false;
    get supportsObjectGeneration(): boolean;
    readonly modelId: GoogleGenerativeAIModelId;
    readonly settings: GoogleGenerativeAISettings;
    private readonly config;
    constructor(modelId: GoogleGenerativeAIModelId, settings: GoogleGenerativeAISettings, config: GoogleGenerativeAIConfig);
    get provider(): string;
    private getArgs;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

type GoogleGenerativeAIEmbeddingModelId = 'text-embedding-004' | (string & {});
interface GoogleGenerativeAIEmbeddingSettings {
    /**
     * Optional. Optional reduced dimension for the output embedding.
     * If set, excessive values in the output embedding are truncated from the end.
     */
    outputDimensionality?: number;
}

interface GoogleGenerativeAIProvider extends ProviderV1 {
    (modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): LanguageModelV1;
    languageModel(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): LanguageModelV1;
    chat(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): LanguageModelV1;
    /**
     * @deprecated Use `chat()` instead.
     */
    generativeAI(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): LanguageModelV1;
    /**
  @deprecated Use `textEmbeddingModel()` instead.
     */
    embedding(modelId: GoogleGenerativeAIEmbeddingModelId, settings?: GoogleGenerativeAIEmbeddingSettings): EmbeddingModelV1<string>;
    /**
  @deprecated Use `textEmbeddingModel()` instead.
   */
    textEmbedding(modelId: GoogleGenerativeAIEmbeddingModelId, settings?: GoogleGenerativeAIEmbeddingSettings): EmbeddingModelV1<string>;
    /**
  @deprecated Use `textEmbeddingModel()` instead.
   */
    textEmbeddingModel(modelId: GoogleGenerativeAIEmbeddingModelId, settings?: GoogleGenerativeAIEmbeddingSettings): EmbeddingModelV1<string>;
}
interface GoogleGenerativeAIProviderSettings {
    /**
  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://generativelanguage.googleapis.com/v1beta`.
     */
    baseURL?: string;
    /**
  @deprecated Use `baseURL` instead.
     */
    baseUrl?: string;
    /**
  API key that is being send using the `x-goog-api-key` header.
  It defaults to the `GOOGLE_GENERATIVE_AI_API_KEY` environment variable.
     */
    apiKey?: string;
    /**
  Custom headers to include in the requests.
       */
    headers?: Record<string, string>;
    /**
  Custom fetch implementation. You can use it as a middleware to intercept requests,
  or to provide a custom fetch implementation for e.g. testing.
      */
    fetch?: FetchFunction;
    generateId?: () => string;
}
/**
Create a Google Generative AI provider instance.
 */
declare function createGoogleGenerativeAI(options?: GoogleGenerativeAIProviderSettings): GoogleGenerativeAIProvider;
/**
Default Google Generative AI provider instance.
 */
declare const google: GoogleGenerativeAIProvider;

/**
 * @deprecated Use `createGoogleGenerativeAI` instead.
 */
declare class Google {
    /**
     * Base URL for the Google API calls.
     */
    readonly baseURL: string;
    readonly apiKey?: string;
    readonly headers?: Record<string, string>;
    private readonly generateId;
    /**
     * Creates a new Google provider instance.
     */
    constructor(options?: GoogleGenerativeAIProviderSettings);
    private get baseConfig();
    /**
     * @deprecated Use `chat()` instead.
     */
    generativeAI(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): GoogleGenerativeAILanguageModel;
    chat(modelId: GoogleGenerativeAIModelId, settings?: GoogleGenerativeAISettings): GoogleGenerativeAILanguageModel;
}

export { Google, type GoogleGenerativeAIProvider, type GoogleGenerativeAIProviderSettings, createGoogleGenerativeAI, google };
