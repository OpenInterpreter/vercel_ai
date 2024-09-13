import { LanguageModelV1, ProviderV1, EmbeddingModelV1 } from '@ai-sdk/provider';
import { FetchFunction } from '@ai-sdk/provider-utils';

type MistralChatModelId = 'open-mistral-7b' | 'open-mixtral-8x7b' | 'open-mixtral-8x22b' | 'open-mistral-nemo' | 'mistral-small-latest' | 'mistral-medium-latest' | 'mistral-large-latest' | (string & {});
interface MistralChatSettings {
    /**
  Whether to inject a safety prompt before all conversations.
  
  Defaults to `false`.
     */
    safePrompt?: boolean;
}

type MistralChatConfig = {
    provider: string;
    baseURL: string;
    headers: () => Record<string, string | undefined>;
    fetch?: FetchFunction;
};
declare class MistralChatLanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode = "json";
    readonly modelId: MistralChatModelId;
    readonly settings: MistralChatSettings;
    private readonly config;
    constructor(modelId: MistralChatModelId, settings: MistralChatSettings, config: MistralChatConfig);
    get provider(): string;
    private getArgs;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

type MistralEmbeddingModelId = 'mistral-embed' | (string & {});
interface MistralEmbeddingSettings {
    /**
  Override the maximum number of embeddings per call.
     */
    maxEmbeddingsPerCall?: number;
    /**
  Override the parallelism of embedding calls.
      */
    supportsParallelCalls?: boolean;
}

interface MistralProvider extends ProviderV1 {
    (modelId: MistralChatModelId, settings?: MistralChatSettings): LanguageModelV1;
    /**
  Creates a model for text generation.
  */
    languageModel(modelId: MistralChatModelId, settings?: MistralChatSettings): LanguageModelV1;
    /**
  Creates a model for text generation.
  */
    chat(modelId: MistralChatModelId, settings?: MistralChatSettings): LanguageModelV1;
    /**
  @deprecated Use `textEmbeddingModel()` instead.
     */
    embedding(modelId: MistralEmbeddingModelId, settings?: MistralEmbeddingSettings): EmbeddingModelV1<string>;
    /**
  @deprecated Use `textEmbeddingModel()` instead.
     */
    textEmbedding(modelId: MistralEmbeddingModelId, settings?: MistralEmbeddingSettings): EmbeddingModelV1<string>;
    textEmbeddingModel: (modelId: MistralEmbeddingModelId, settings?: MistralEmbeddingSettings) => EmbeddingModelV1<string>;
}
interface MistralProviderSettings {
    /**
  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://api.mistral.ai/v1`.
     */
    baseURL?: string;
    /**
  @deprecated Use `baseURL` instead.
     */
    baseUrl?: string;
    /**
  API key that is being send using the `Authorization` header.
  It defaults to the `MISTRAL_API_KEY` environment variable.
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
}
/**
Create a Mistral AI provider instance.
 */
declare function createMistral(options?: MistralProviderSettings): MistralProvider;
/**
Default Mistral provider instance.
 */
declare const mistral: MistralProvider;

/**
 * @deprecated Use `createMistral` instead.
 */
declare class Mistral {
    /**
     * Base URL for the Mistral API calls.
     */
    readonly baseURL: string;
    readonly apiKey?: string;
    readonly headers?: Record<string, string>;
    /**
     * Creates a new Mistral provider instance.
     */
    constructor(options?: MistralProviderSettings);
    private get baseConfig();
    chat(modelId: MistralChatModelId, settings?: MistralChatSettings): MistralChatLanguageModel;
}

export { Mistral, type MistralProvider, type MistralProviderSettings, createMistral, mistral };
