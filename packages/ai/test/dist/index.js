"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// test/index.ts
var test_exports = {};
__export(test_exports, {
  MockEmbeddingModelV1: () => MockEmbeddingModelV1,
  MockLanguageModelV1: () => MockLanguageModelV1,
  convertArrayToReadableStream: () => import_test.convertArrayToReadableStream,
  mockId: () => mockId,
  mockValues: () => mockValues
});
module.exports = __toCommonJS(test_exports);
var import_test = require("@ai-sdk/provider-utils/test");

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MockEmbeddingModelV1,
  MockLanguageModelV1,
  convertArrayToReadableStream,
  mockId,
  mockValues
});
//# sourceMappingURL=index.js.map