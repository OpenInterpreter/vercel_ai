import { LanguageModelV1, ProviderV1 } from '@ai-sdk/provider';
import { FetchFunction } from '@ai-sdk/provider-utils';

type AnthropicMessagesModelId = 'claude-3-5-sonnet-20240620' | 'claude-3-opus-20240229' | 'claude-3-sonnet-20240229' | 'claude-3-haiku-20240307' | (string & {});
interface AnthropicMessagesSettings {
    /**
  Only sample from the top K options for each subsequent token.
  
  Used to remove "long tail" low probability responses.
  Recommended for advanced use cases only. You usually only need to use temperature.
  
  @deprecated use the topK setting on the request instead.
     */
    topK?: number;
    /**
  Enable Anthropic cache control (beta feature). This will add the beta header and
  allow you to use provider-specific cacheControl metadata.
     */
    cacheControl?: boolean;
}

type AnthropicMessagesConfig = {
    provider: string;
    baseURL: string;
    headers: () => Record<string, string | undefined>;
    fetch?: FetchFunction;
};
declare class AnthropicMessagesLanguageModel implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly defaultObjectGenerationMode = "tool";
    readonly supportsImageUrls = false;
    readonly modelId: AnthropicMessagesModelId;
    readonly settings: AnthropicMessagesSettings;
    private readonly config;
    constructor(modelId: AnthropicMessagesModelId, settings: AnthropicMessagesSettings, config: AnthropicMessagesConfig);
    get provider(): string;
    private getArgs;
    private getHeaders;
    doGenerate(options: Parameters<LanguageModelV1['doGenerate']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doGenerate']>>>;
    doStream(options: Parameters<LanguageModelV1['doStream']>[0]): Promise<Awaited<ReturnType<LanguageModelV1['doStream']>>>;
}

interface AnthropicProvider extends ProviderV1 {
    /**
  Creates a model for text generation.
  */
    (modelId: AnthropicMessagesModelId, settings?: AnthropicMessagesSettings): LanguageModelV1;
    /**
  Creates a model for text generation.
  */
    languageModel(modelId: AnthropicMessagesModelId, settings?: AnthropicMessagesSettings): LanguageModelV1;
    /**
  @deprecated Use `.languageModel()` instead.
  */
    chat(modelId: AnthropicMessagesModelId, settings?: AnthropicMessagesSettings): LanguageModelV1;
    /**
  @deprecated Use `.languageModel()` instead.
     */
    messages(modelId: AnthropicMessagesModelId, settings?: AnthropicMessagesSettings): LanguageModelV1;
}
interface AnthropicProviderSettings {
    /**
  Use a different URL prefix for API calls, e.g. to use proxy servers.
  The default prefix is `https://api.anthropic.com/v1`.
     */
    baseURL?: string;
    /**
  @deprecated Use `baseURL` instead.
     */
    baseUrl?: string;
    /**
  API key that is being send using the `x-api-key` header.
  It defaults to the `ANTHROPIC_API_KEY` environment variable.
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
Create an Anthropic provider instance.
 */
declare function createAnthropic(options?: AnthropicProviderSettings): AnthropicProvider;
/**
Default Anthropic provider instance.
 */
declare const anthropic: AnthropicProvider;

/**
 * @deprecated Use `createAnthropic` instead.
 */
declare class Anthropic {
    /**
     * Base URL for Anthropic API calls.
     */
    readonly baseURL: string;
    readonly apiKey?: string;
    readonly headers?: Record<string, string>;
    /**
     * Creates a new Anthropic provider instance.
     */
    constructor(options?: AnthropicProviderSettings);
    private get baseConfig();
    /**
     * @deprecated Use `chat()` instead.
     */
    messages(modelId: AnthropicMessagesModelId, settings?: AnthropicMessagesSettings): AnthropicMessagesLanguageModel;
    chat(modelId: AnthropicMessagesModelId, settings?: AnthropicMessagesSettings): AnthropicMessagesLanguageModel;
}

export { Anthropic, type AnthropicProvider, type AnthropicProviderSettings, anthropic, createAnthropic };
