"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name13 in all)
    __defProp(target, name13, { get: all[name13], enumerable: true });
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

// src/index.ts
var src_exports = {};
__export(src_exports, {
  AISDKError: () => AISDKError,
  APICallError: () => APICallError,
  EmptyResponseBodyError: () => EmptyResponseBodyError,
  InvalidPromptError: () => InvalidPromptError,
  InvalidResponseDataError: () => InvalidResponseDataError,
  JSONParseError: () => JSONParseError,
  LoadAPIKeyError: () => LoadAPIKeyError,
  LoadSettingError: () => LoadSettingError,
  NoContentGeneratedError: () => NoContentGeneratedError,
  NoSuchModelError: () => NoSuchModelError,
  TooManyEmbeddingValuesForCallError: () => TooManyEmbeddingValuesForCallError,
  TypeValidationError: () => TypeValidationError,
  UnsupportedFunctionalityError: () => UnsupportedFunctionalityError,
  getErrorMessage: () => getErrorMessage,
  isJSONArray: () => isJSONArray,
  isJSONObject: () => isJSONObject,
  isJSONValue: () => isJSONValue
});
module.exports = __toCommonJS(src_exports);

// src/errors/ai-sdk-error.ts
var marker = "vercel.ai.error";
var symbol = Symbol.for(marker);
var _a;
var _AISDKError = class _AISDKError extends Error {
  /**
   * Creates an AI SDK Error.
   *
   * @param {Object} params - The parameters for creating the error.
   * @param {string} params.name - The name of the error.
   * @param {string} params.message - The error message.
   * @param {unknown} [params.cause] - The underlying cause of the error.
   */
  constructor({
    name: name13,
    message,
    cause
  }) {
    super(message);
    this[_a] = true;
    this.name = name13;
    this.cause = cause;
  }
  /**
   * Checks if the given error is an AI SDK Error.
   * @param {unknown} error - The error to check.
   * @returns {boolean} True if the error is an AI SDK Error, false otherwise.
   */
  static isInstance(error) {
    return _AISDKError.hasMarker(error, marker);
  }
  static hasMarker(error, marker14) {
    const markerSymbol = Symbol.for(marker14);
    return error != null && typeof error === "object" && markerSymbol in error && typeof error[markerSymbol] === "boolean" && error[markerSymbol] === true;
  }
  /**
   * Returns a JSON representation of the error.
   * @returns {Object} An object containing the error's name, message, and cause.
   *
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message
    };
  }
};
_a = symbol;
var AISDKError = _AISDKError;

// src/errors/api-call-error.ts
var name = "AI_APICallError";
var marker2 = `vercel.ai.error.${name}`;
var symbol2 = Symbol.for(marker2);
var _a2;
var APICallError = class extends AISDKError {
  constructor({
    message,
    url,
    requestBodyValues,
    statusCode,
    responseHeaders,
    responseBody,
    cause,
    isRetryable = statusCode != null && (statusCode === 408 || // request timeout
    statusCode === 409 || // conflict
    statusCode === 429 || // too many requests
    statusCode >= 500),
    // server error
    data
  }) {
    super({ name, message, cause });
    this[_a2] = true;
    this.url = url;
    this.requestBodyValues = requestBodyValues;
    this.statusCode = statusCode;
    this.responseHeaders = responseHeaders;
    this.responseBody = responseBody;
    this.isRetryable = isRetryable;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker2);
  }
  /**
   * @deprecated Use isInstance instead.
   */
  static isAPICallError(error) {
    return error instanceof Error && error.name === name && typeof error.url === "string" && typeof error.requestBodyValues === "object" && (error.statusCode == null || typeof error.statusCode === "number") && (error.responseHeaders == null || typeof error.responseHeaders === "object") && (error.responseBody == null || typeof error.responseBody === "string") && (error.cause == null || typeof error.cause === "object") && typeof error.isRetryable === "boolean" && (error.data == null || typeof error.data === "object");
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      url: this.url,
      requestBodyValues: this.requestBodyValues,
      statusCode: this.statusCode,
      responseHeaders: this.responseHeaders,
      responseBody: this.responseBody,
      cause: this.cause,
      isRetryable: this.isRetryable,
      data: this.data
    };
  }
};
_a2 = symbol2;

// src/errors/empty-response-body-error.ts
var name2 = "AI_EmptyResponseBodyError";
var marker3 = `vercel.ai.error.${name2}`;
var symbol3 = Symbol.for(marker3);
var _a3;
var EmptyResponseBodyError = class extends AISDKError {
  // used in isInstance
  constructor({ message = "Empty response body" } = {}) {
    super({ name: name2, message });
    this[_a3] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker3);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isEmptyResponseBodyError(error) {
    return error instanceof Error && error.name === name2;
  }
};
_a3 = symbol3;

// src/errors/get-error-message.ts
function getErrorMessage(error) {
  if (error == null) {
    return "unknown error";
  }
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return JSON.stringify(error);
}

// src/errors/invalid-prompt-error.ts
var name3 = "AI_InvalidPromptError";
var marker4 = `vercel.ai.error.${name3}`;
var symbol4 = Symbol.for(marker4);
var _a4;
var InvalidPromptError = class extends AISDKError {
  constructor({
    prompt: prompt2,
    message,
    cause
  }) {
    super({ name: name3, message: `Invalid prompt: ${message}`, cause });
    this[_a4] = true;
    this.prompt = prompt2;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker4);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isInvalidPromptError(error) {
    return error instanceof Error && error.name === name3 && prompt != null;
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      prompt: this.prompt
    };
  }
};
_a4 = symbol4;

// src/errors/invalid-response-data-error.ts
var name4 = "AI_InvalidResponseDataError";
var marker5 = `vercel.ai.error.${name4}`;
var symbol5 = Symbol.for(marker5);
var _a5;
var InvalidResponseDataError = class extends AISDKError {
  constructor({
    data,
    message = `Invalid response data: ${JSON.stringify(data)}.`
  }) {
    super({ name: name4, message });
    this[_a5] = true;
    this.data = data;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker5);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isInvalidResponseDataError(error) {
    return error instanceof Error && error.name === name4 && error.data != null;
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      data: this.data
    };
  }
};
_a5 = symbol5;

// src/errors/json-parse-error.ts
var name5 = "AI_JSONParseError";
var marker6 = `vercel.ai.error.${name5}`;
var symbol6 = Symbol.for(marker6);
var _a6;
var JSONParseError = class extends AISDKError {
  constructor({ text, cause }) {
    super({
      name: name5,
      message: `JSON parsing failed: Text: ${text}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a6] = true;
    this.text = text;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker6);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isJSONParseError(error) {
    return error instanceof Error && error.name === name5 && "text" in error && typeof error.text === "string";
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      valueText: this.text
    };
  }
};
_a6 = symbol6;

// src/errors/load-api-key-error.ts
var name6 = "AI_LoadAPIKeyError";
var marker7 = `vercel.ai.error.${name6}`;
var symbol7 = Symbol.for(marker7);
var _a7;
var LoadAPIKeyError = class extends AISDKError {
  // used in isInstance
  constructor({ message }) {
    super({ name: name6, message });
    this[_a7] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker7);
  }
  /**
   * @deprecated Use isInstance instead.
   */
  static isLoadAPIKeyError(error) {
    return error instanceof Error && error.name === name6;
  }
};
_a7 = symbol7;

// src/errors/load-setting-error.ts
var name7 = "AI_LoadSettingError";
var marker8 = `vercel.ai.error.${name7}`;
var symbol8 = Symbol.for(marker8);
var _a8;
var LoadSettingError = class extends AISDKError {
  // used in isInstance
  constructor({ message }) {
    super({ name: name7, message });
    this[_a8] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker8);
  }
  /**
   * @deprecated Use isInstance instead.
   */
  static isLoadSettingError(error) {
    return error instanceof Error && error.name === name7;
  }
};
_a8 = symbol8;

// src/errors/no-content-generated-error.ts
var name8 = "AI_NoContentGeneratedError";
var marker9 = `vercel.ai.error.${name8}`;
var symbol9 = Symbol.for(marker9);
var _a9;
var NoContentGeneratedError = class extends AISDKError {
  // used in isInstance
  constructor({
    message = "No content generated."
  } = {}) {
    super({ name: name8, message });
    this[_a9] = true;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker9);
  }
  /**
   * @deprecated Use isInstance instead.
   */
  static isNoContentGeneratedError(error) {
    return error instanceof Error && error.name === name8;
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      cause: this.cause,
      message: this.message,
      stack: this.stack
    };
  }
};
_a9 = symbol9;

// src/errors/no-such-model-error.ts
var name9 = "AI_NoSuchModelError";
var marker10 = `vercel.ai.error.${name9}`;
var symbol10 = Symbol.for(marker10);
var _a10;
var NoSuchModelError = class extends AISDKError {
  constructor({
    errorName = name9,
    modelId,
    modelType,
    message = `No such ${modelType}: ${modelId}`
  }) {
    super({ name: errorName, message });
    this[_a10] = true;
    this.modelId = modelId;
    this.modelType = modelType;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker10);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isNoSuchModelError(error) {
    return error instanceof Error && error.name === name9 && typeof error.modelId === "string" && typeof error.modelType === "string";
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      modelId: this.modelId,
      modelType: this.modelType
    };
  }
};
_a10 = symbol10;

// src/errors/too-many-embedding-values-for-call-error.ts
var name10 = "AI_TooManyEmbeddingValuesForCallError";
var marker11 = `vercel.ai.error.${name10}`;
var symbol11 = Symbol.for(marker11);
var _a11;
var TooManyEmbeddingValuesForCallError = class extends AISDKError {
  constructor(options) {
    super({
      name: name10,
      message: `Too many values for a single embedding call. The ${options.provider} model "${options.modelId}" can only embed up to ${options.maxEmbeddingsPerCall} values per call, but ${options.values.length} values were provided.`
    });
    this[_a11] = true;
    this.provider = options.provider;
    this.modelId = options.modelId;
    this.maxEmbeddingsPerCall = options.maxEmbeddingsPerCall;
    this.values = options.values;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker11);
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isTooManyEmbeddingValuesForCallError(error) {
    return error instanceof Error && error.name === name10 && "provider" in error && typeof error.provider === "string" && "modelId" in error && typeof error.modelId === "string" && "maxEmbeddingsPerCall" in error && typeof error.maxEmbeddingsPerCall === "number" && "values" in error && Array.isArray(error.values);
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      provider: this.provider,
      modelId: this.modelId,
      maxEmbeddingsPerCall: this.maxEmbeddingsPerCall,
      values: this.values
    };
  }
};
_a11 = symbol11;

// src/errors/type-validation-error.ts
var name11 = "AI_TypeValidationError";
var marker12 = `vercel.ai.error.${name11}`;
var symbol12 = Symbol.for(marker12);
var _a12;
var _TypeValidationError = class _TypeValidationError extends AISDKError {
  constructor({ value, cause }) {
    super({
      name: name11,
      message: `Type validation failed: Value: ${JSON.stringify(value)}.
Error message: ${getErrorMessage(cause)}`,
      cause
    });
    this[_a12] = true;
    this.value = value;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker12);
  }
  /**
   * Wraps an error into a TypeValidationError.
   * If the cause is already a TypeValidationError with the same value, it returns the cause.
   * Otherwise, it creates a new TypeValidationError.
   *
   * @param {Object} params - The parameters for wrapping the error.
   * @param {unknown} params.value - The value that failed validation.
   * @param {unknown} params.cause - The original error or cause of the validation failure.
   * @returns {TypeValidationError} A TypeValidationError instance.
   */
  static wrap({
    value,
    cause
  }) {
    return _TypeValidationError.isInstance(cause) && cause.value === value ? cause : new _TypeValidationError({ value, cause });
  }
  /**
   * @deprecated use `isInstance` instead
   */
  static isTypeValidationError(error) {
    return error instanceof Error && error.name === name11;
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: this.cause,
      stack: this.stack,
      value: this.value
    };
  }
};
_a12 = symbol12;
var TypeValidationError = _TypeValidationError;

// src/errors/unsupported-functionality-error.ts
var name12 = "AI_UnsupportedFunctionalityError";
var marker13 = `vercel.ai.error.${name12}`;
var symbol13 = Symbol.for(marker13);
var _a13;
var UnsupportedFunctionalityError = class extends AISDKError {
  constructor({ functionality }) {
    super({
      name: name12,
      message: `'${functionality}' functionality not supported.`
    });
    this[_a13] = true;
    this.functionality = functionality;
  }
  static isInstance(error) {
    return AISDKError.hasMarker(error, marker13);
  }
  /**
   * @deprecated Use isInstance instead.
   */
  static isUnsupportedFunctionalityError(error) {
    return error instanceof Error && error.name === name12 && typeof error.functionality === "string";
  }
  /**
   * @deprecated Do not use this method. It will be removed in the next major version.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
      functionality: this.functionality
    };
  }
};
_a13 = symbol13;

// src/json-value/is-json.ts
function isJSONValue(value) {
  if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isJSONValue);
  }
  if (typeof value === "object") {
    return Object.entries(value).every(
      ([key, val]) => typeof key === "string" && isJSONValue(val)
    );
  }
  return false;
}
function isJSONArray(value) {
  return Array.isArray(value) && value.every(isJSONValue);
}
function isJSONObject(value) {
  return value != null && typeof value === "object" && Object.entries(value).every(
    ([key, val]) => typeof key === "string" && isJSONValue(val)
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AISDKError,
  APICallError,
  EmptyResponseBodyError,
  InvalidPromptError,
  InvalidResponseDataError,
  JSONParseError,
  LoadAPIKeyError,
  LoadSettingError,
  NoContentGeneratedError,
  NoSuchModelError,
  TooManyEmbeddingValuesForCallError,
  TypeValidationError,
  UnsupportedFunctionalityError,
  getErrorMessage,
  isJSONArray,
  isJSONObject,
  isJSONValue
});
//# sourceMappingURL=index.js.map