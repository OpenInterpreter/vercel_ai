// test/index.ts
import { convertArrayToReadableStream } from "@ai-sdk/provider-utils/test";

// core/test/mock-embedding-model-v1.ts
var MockEmbeddingModelV1 = class {
  constructor({
    provider = "mock-provider",
    modelId = "mock-model-id",
    maxEmbeddingsPerCall = 1,
    supportsParallelCalls = false,
    doEmbed = notImplemented
  } = {}) {
    this.specificationVersion = "v1";
    this.provider = provider;
    this.modelId = modelId;
    this.maxEmbeddingsPerCall = maxEmbeddingsPerCall != null ? maxEmbeddingsPerCall : void 0;
    this.supportsParallelCalls = supportsParallelCalls;
    this.doEmbed = doEmbed;
  }
};
function notImplemented() {
  throw new Error("Not implemented");
}

// core/test/mock-id.ts
function mockId() {
  let counter = 0;
  return () => `id-${counter++}`;
}

// core/test/mock-language-model-v1.ts
var MockLanguageModelV1 = class {
  constructor({
    provider = "mock-provider",
    modelId = "mock-model-id",
    doGenerate = notImplemented2,
    doStream = notImplemented2,
    defaultObjectGenerationMode = void 0,
    supportsStructuredOutputs = void 0
  } = {}) {
    this.specificationVersion = "v1";
    this.provider = provider;
    this.modelId = modelId;
    this.doGenerate = doGenerate;
    this.doStream = doStream;
    this.defaultObjectGenerationMode = defaultObjectGenerationMode;
    this.supportsStructuredOutputs = supportsStructuredOutputs;
  }
};
function notImplemented2() {
  throw new Error("Not implemented");
}

// core/test/mock-values.ts
function mockValues(...values) {
  let counter = 0;
  return () => {
    var _a;
    return (_a = values[counter++]) != null ? _a : values[values.length - 1];
  };
}
export {
  MockEmbeddingModelV1,
  MockLanguageModelV1,
  convertArrayToReadableStream,
  mockId,
  mockValues
};
//# sourceMappingURL=index.mjs.map