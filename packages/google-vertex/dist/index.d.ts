import { ProviderV1, LanguageModelV1 } from '@ai-sdk/provider';
import { VertexInit, VertexAI } from '@google-cloud/vertexai';

type GoogleVertexModelId = 'gemini-1.5-flash' | 'gemini-1.5-pro' | 'gemini-1.0-pro' | 'gemini-1.0-pro-vision' | (string & {});
interface GoogleVertexSettings {
    /**
  Optional. The maximum number of tokens to consider when sampling.
  
  Models use nucleus sampling or combined Top-k and nucleus sampling.
  Top-k sampling considers the set of topK most probable tokens.
  Models running with nucleus sampling don't allow topK setting.
  
  @deprecated use the topK setting on the request instead.
     */
    topK?: number;
    /**
  Optional. A list of unique safety settings for blocking unsafe content.
     */
    safetySettings?: Array<{
        category: 'HARM_CATEGORY_UNSPECIFIED' | 'HARM_CATEGORY_HATE_SPEECH' | 'HARM_CATEGORY_DANGEROUS_CONTENT' | 'HARM_CATEGORY_HARASSMENT' | 'HARM_CATEGORY_SEXUALLY_EXPLICIT';
        threshold: 'HARM_BLOCK_THRESHOLD_UNSPECIFIED' | 'BLOCK_LOW_AND_ABOVE' | 'BLOCK_MEDIUM_AND_ABOVE' | 'BLOCK_ONLY_HIGH' | 'BLOCK_NONE';
    }>;
    /**
  Optional. When enabled, the model will use Google search to ground the response.
  
  @see https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview
     */
    useSearchGrounding?: boolean;
}

interface GoogleVertexProvider extends ProviderV1 {
    /**
  Creates a model for text generation.
     */
    (modelId: GoogleVertexModelId, settings?: GoogleVertexSettings): LanguageModelV1;
    languageModel: (modelId: GoogleVertexModelId, settings?: GoogleVertexSettings) => LanguageModelV1;
}
interface GoogleVertexProviderSettings {
    /**
  Your Google Vertex location. Defaults to the environment variable `GOOGLE_VERTEX_LOCATION`.
     */
    location?: string;
    /**
  Your Google Vertex project. Defaults to the environment variable `GOOGLE_VERTEX_PROJECT`.
    */
    project?: string;
    /**
   Optional. The Authentication options provided by google-auth-library.
  Complete list of authentication options is documented in the
  GoogleAuthOptions interface:
  https://github.com/googleapis/google-auth-library-nodejs/blob/main/src/auth/googleauth.ts.
     */
    googleAuthOptions?: VertexInit['googleAuthOptions'];
    generateId?: () => string;
    createVertexAI?: ({ project, location, }: {
        project: string;
        location: string;
    }) => VertexAI;
}
/**
Create a Google Vertex AI provider instance.
 */
declare function createVertex(options?: GoogleVertexProviderSettings): GoogleVertexProvider;
/**
Default Google Vertex AI provider instance.
 */
declare const vertex: GoogleVertexProvider;

export { type GoogleVertexProvider, type GoogleVertexProviderSettings, createVertex, vertex };
