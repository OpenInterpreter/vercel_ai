export { convertArrayToReadableStream } from '@ai-sdk/provider-utils/test';
import { EmbeddingModelV1, LanguageModelV1 } from '@ai-sdk/provider';

declare class MockEmbeddingModelV1<VALUE> implements EmbeddingModelV1<VALUE> {
    readonly specificationVersion = "v1";
    readonly provider: EmbeddingModelV1<VALUE>['provider'];
    readonly modelId: EmbeddingModelV1<VALUE>['modelId'];
    readonly maxEmbeddingsPerCall: EmbeddingModelV1<VALUE>['maxEmbeddingsPerCall'];
    readonly supportsParallelCalls: EmbeddingModelV1<VALUE>['supportsParallelCalls'];
    doEmbed: EmbeddingModelV1<VALUE>['doEmbed'];
    constructor({ provider, modelId, maxEmbeddingsPerCall, supportsParallelCalls, doEmbed, }?: {
        provider?: EmbeddingModelV1<VALUE>['provider'];
        modelId?: EmbeddingModelV1<VALUE>['modelId'];
        maxEmbeddingsPerCall?: EmbeddingModelV1<VALUE>['maxEmbeddingsPerCall'] | null;
        supportsParallelCalls?: EmbeddingModelV1<VALUE>['supportsParallelCalls'];
        doEmbed?: EmbeddingModelV1<VALUE>['doEmbed'];
    });
}

declare function mockId(): () => string;

declare class MockLanguageModelV1 implements LanguageModelV1 {
    readonly specificationVersion = "v1";
    readonly provider: LanguageModelV1['provider'];
    readonly modelId: LanguageModelV1['modelId'];
    doGenerate: LanguageModelV1['doGenerate'];
    doStream: LanguageModelV1['doStream'];
    readonly defaultObjectGenerationMode: LanguageModelV1['defaultObjectGenerationMode'];
    readonly supportsStructuredOutputs: LanguageModelV1['supportsStructuredOutputs'];
    constructor({ provider, modelId, doGenerate, doStream, defaultObjectGenerationMode, supportsStructuredOutputs, }?: {
        provider?: LanguageModelV1['provider'];
        modelId?: LanguageModelV1['modelId'];
        doGenerate?: LanguageModelV1['doGenerate'];
        doStream?: LanguageModelV1['doStream'];
        defaultObjectGenerationMode?: LanguageModelV1['defaultObjectGenerationMode'];
        supportsStructuredOutputs?: LanguageModelV1['supportsStructuredOutputs'];
    });
}

declare function mockValues<T>(...values: T[]): () => T;

export { MockEmbeddingModelV1, MockLanguageModelV1, mockId, mockValues };
