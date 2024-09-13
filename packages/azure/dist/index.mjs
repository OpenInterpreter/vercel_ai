// src/azure-openai-provider.ts
import {
  OpenAIChatLanguageModel,
  OpenAICompletionLanguageModel,
  OpenAIEmbeddingModel
} from "@ai-sdk/openai/internal";
import { loadApiKey, loadSetting } from "@ai-sdk/provider-utils";
function createAzure(options = {}) {
  const getHeaders = () => ({
    "api-key": loadApiKey({
      apiKey: options.apiKey,
      environmentVariableName: "AZURE_API_KEY",
      description: "Azure OpenAI"
    }),
    ...options.headers
  });
  const getResourceName = () => loadSetting({
    settingValue: options.resourceName,
    settingName: "resourceName",
    environmentVariableName: "AZURE_RESOURCE_NAME",
    description: "Azure OpenAI resource name"
  });
  const url = ({ path, modelId }) => options.baseURL ? `${options.baseURL}/${modelId}${path}?api-version=2024-06-01` : `https://${getResourceName()}.openai.azure.com/openai/deployments/${modelId}${path}?api-version=2024-06-01`;
  const createChatModel = (deploymentName, settings = {}) => new OpenAIChatLanguageModel(deploymentName, settings, {
    provider: "azure-openai.chat",
    url,
    headers: getHeaders,
    compatibility: "compatible",
    fetch: options.fetch
  });
  const createCompletionModel = (modelId, settings = {}) => new OpenAICompletionLanguageModel(modelId, settings, {
    provider: "azure-openai.completion",
    url,
    compatibility: "compatible",
    headers: getHeaders,
    fetch: options.fetch
  });
  const createEmbeddingModel = (modelId, settings = {}) => new OpenAIEmbeddingModel(modelId, settings, {
    provider: "azure-openai.embeddings",
    headers: getHeaders,
    url,
    fetch: options.fetch
  });
  const provider = function(deploymentId, settings) {
    if (new.target) {
      throw new Error(
        "The Azure OpenAI model function cannot be called with the new keyword."
      );
    }
    return createChatModel(deploymentId, settings);
  };
  provider.languageModel = createChatModel;
  provider.chat = createChatModel;
  provider.completion = createCompletionModel;
  provider.embedding = createEmbeddingModel;
  provider.textEmbedding = createEmbeddingModel;
  provider.textEmbeddingModel = createEmbeddingModel;
  return provider;
}
var azure = createAzure();
export {
  azure,
  createAzure
};
//# sourceMappingURL=index.mjs.map