import { OpenAIChatSettings, OpenAICompletionSettings, OpenAIEmbeddingSettings } from '@ai-sdk/openai/internal';
import { ProviderV1, LanguageModelV1, EmbeddingModelV1 } from '@ai-sdk/provider';
import { FetchFunction } from '@ai-sdk/provider-utils';

interface AzureOpenAIProvider extends ProviderV1 {
    (deploymentId: string, settings?: OpenAIChatSettings): LanguageModelV1;
    /**
  Creates an Azure OpenAI chat model for text generation.
     */
    languageModel(deploymentId: string, settings?: OpenAIChatSettings): LanguageModelV1;
    /**
  Creates an Azure OpenAI chat model for text generation.
     */
    chat(deploymentId: string, settings?: OpenAIChatSettings): LanguageModelV1;
    /**
  Creates an Azure OpenAI completion model for text generation.
     */
    completion(deploymentId: string, settings?: OpenAICompletionSettings): LanguageModelV1;
    /**
  @deprecated Use `textEmbeddingModel` instead.
     */
    embedding(deploymentId: string, settings?: OpenAIEmbeddingSettings): EmbeddingModelV1<string>;
    /**
  @deprecated Use `textEmbeddingModel` instead.
     */
    textEmbedding(deploymentId: string, settings?: OpenAIEmbeddingSettings): EmbeddingModelV1<string>;
    /**
  Creates an Azure OpenAI model for text embeddings.
     */
    textEmbeddingModel(deploymentId: string, settings?: OpenAIEmbeddingSettings): EmbeddingModelV1<string>;
}
interface AzureOpenAIProviderSettings {
    /**
  Name of the Azure OpenAI resource. Either this or `baseURL` can be used.
  
  The resource name is used in the assembled URL: `https://{resourceName}.openai.azure.com/openai/deployments/{modelId}{path}`.
       */
    resourceName?: string;
    /**
  Use a different URL prefix for API calls, e.g. to use proxy servers. Either this or `resourceName` can be used.
  When a baseURL is provided, the resourceName is ignored.
  
  With a baseURL, the resolved URL is `{baseURL}/{modelId}{path}`.
     */
    baseURL?: string;
    /**
  API key for authenticating requests.
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
Create an Azure OpenAI provider instance.
 */
declare function createAzure(options?: AzureOpenAIProviderSettings): AzureOpenAIProvider;
/**
Default Azure OpenAI provider instance.
 */
declare const azure: AzureOpenAIProvider;

export { type AzureOpenAIProvider, type AzureOpenAIProviderSettings, azure, createAzure };
