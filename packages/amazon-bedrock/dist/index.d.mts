import { ProviderV1, LanguageModelV1 } from '@ai-sdk/provider';
import { BedrockRuntimeClientConfig } from '@aws-sdk/client-bedrock-runtime';

type BedrockChatModelId = 'amazon.titan-tg1-large' | 'amazon.titan-text-express-v1' | 'anthropic.claude-v2:1' | 'anthropic.claude-3-sonnet-20240229-v1:0' | 'anthropic.claude-3-5-sonnet-20240620-v1:0' | 'anthropic.claude-3-haiku-20240307-v1:0' | 'anthropic.claude-3-opus-20240229-v1:0' | 'cohere.command-r-v1:0' | 'cohere.command-r-plus-v1:0' | 'meta.llama2-13b-chat-v1' | 'meta.llama2-70b-chat-v1' | 'meta.llama3-8b-instruct-v1:0' | 'meta.llama3-70b-instruct-v1:0' | 'mistral.mistral-7b-instruct-v0:2' | 'mistral.mixtral-8x7b-instruct-v0:1' | 'mistral.mistral-large-2402-v1:0' | 'mistral.mistral-small-2402-v1:0' | (string & {});
interface BedrockChatSettings {
    /**
  Additional inference parameters that the model supports,
  beyond the base set of inference parameters that Converse
  supports in the inferenceConfig field
  */
    additionalModelRequestFields?: Record<string, any>;
}

interface AmazonBedrockProviderSettings {
    region?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    sessionToken?: string;
    /**
     * Complete Bedrock configuration for setting advanced authentication and
     * other options. When this is provided, the region, accessKeyId, and
     * secretAccessKey settings are ignored.
     */
    bedrockOptions?: BedrockRuntimeClientConfig;
    generateId?: () => string;
}
interface AmazonBedrockProvider extends ProviderV1 {
    (modelId: BedrockChatModelId, settings?: BedrockChatSettings): LanguageModelV1;
    languageModel(modelId: BedrockChatModelId, settings?: BedrockChatSettings): LanguageModelV1;
}
/**
Create an Amazon Bedrock provider instance.
 */
declare function createAmazonBedrock(options?: AmazonBedrockProviderSettings): AmazonBedrockProvider;
/**
Default Bedrock provider instance.
 */
declare const bedrock: AmazonBedrockProvider;

export { type AmazonBedrockProvider, type AmazonBedrockProviderSettings, bedrock, createAmazonBedrock };
