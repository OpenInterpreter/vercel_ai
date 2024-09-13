var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// src/test/convert-array-to-async-iterable.ts
function convertArrayToAsyncIterable(values) {
  return {
    async *[Symbol.asyncIterator]() {
      for (const value of values) {
        yield value;
      }
    }
  };
}

// src/test/convert-array-to-readable-stream.ts
function convertArrayToReadableStream(values) {
  return new ReadableStream({
    start(controller) {
      try {
        for (const value of values) {
          controller.enqueue(value);
        }
      } finally {
        controller.close();
      }
    }
  });
}

// src/test/convert-async-iterable-to-array.ts
async function convertAsyncIterableToArray(iterable) {
  const result = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}

// src/test/convert-readable-stream-to-array.ts
async function convertReadableStreamToArray(stream) {
  const reader = stream.getReader();
  const result = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done)
      break;
    result.push(value);
  }
  return result;
}

// src/test/convert-response-stream-to-array.ts
async function convertResponseStreamToArray(response) {
  return convertReadableStreamToArray(
    response.body.pipeThrough(new TextDecoderStream())
  );
}

// ../../node_modules/.pnpm/outvariant@1.4.3/node_modules/outvariant/lib/index.mjs
var POSITIONALS_EXP = /(%?)(%([sdijo]))/g;
function serializePositional(positional, flag) {
  switch (flag) {
    case "s":
      return positional;
    case "d":
    case "i":
      return Number(positional);
    case "j":
      return JSON.stringify(positional);
    case "o": {
      if (typeof positional === "string") {
        return positional;
      }
      const json = JSON.stringify(positional);
      if (json === "{}" || json === "[]" || /^\[object .+?\]$/.test(json)) {
        return positional;
      }
      return json;
    }
  }
}
function format(message3, ...positionals) {
  if (positionals.length === 0) {
    return message3;
  }
  let positionalIndex = 0;
  let formattedMessage = message3.replace(
    POSITIONALS_EXP,
    (match2, isEscaped, _, flag) => {
      const positional = positionals[positionalIndex];
      const value = serializePositional(positional, flag);
      if (!isEscaped) {
        positionalIndex++;
        return value;
      }
      return match2;
    }
  );
  if (positionalIndex < positionals.length) {
    formattedMessage += ` ${positionals.slice(positionalIndex).join(" ")}`;
  }
  formattedMessage = formattedMessage.replace(/%{2,2}/g, "%");
  return formattedMessage;
}
var STACK_FRAMES_TO_IGNORE = 2;
function cleanErrorStack(error3) {
  if (!error3.stack) {
    return;
  }
  const nextStack = error3.stack.split("\n");
  nextStack.splice(1, STACK_FRAMES_TO_IGNORE);
  error3.stack = nextStack.join("\n");
}
var InvariantError = class extends Error {
  constructor(message3, ...positionals) {
    super(message3);
    this.message = message3;
    this.name = "Invariant Violation";
    this.message = format(message3, ...positionals);
    cleanErrorStack(this);
  }
};
var invariant = (predicate, message3, ...positionals) => {
  if (!predicate) {
    throw new InvariantError(message3, ...positionals);
  }
};
invariant.as = (ErrorConstructor, predicate, message3, ...positionals) => {
  if (!predicate) {
    const formatMessage2 = positionals.length === 0 ? message3 : format(message3, ...positionals);
    let error3;
    try {
      error3 = Reflect.construct(ErrorConstructor, [
        formatMessage2
      ]);
    } catch (err) {
      error3 = ErrorConstructor(formatMessage2);
    }
    throw error3;
  }
};

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/devUtils.mjs
var LIBRARY_PREFIX = "[MSW]";
function formatMessage(message3, ...positionals) {
  const interpolatedMessage = format(message3, ...positionals);
  return `${LIBRARY_PREFIX} ${interpolatedMessage}`;
}
function warn(message3, ...positionals) {
  console.warn(formatMessage(message3, ...positionals));
}
function error(message3, ...positionals) {
  console.error(formatMessage(message3, ...positionals));
}
var devUtils = {
  formatMessage,
  warn,
  error
};
var InternalError = class extends Error {
  constructor(message3) {
    super(message3);
    this.name = "InternalError";
  }
};

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/checkGlobals.mjs
function checkGlobals() {
  invariant(
    typeof URL !== "undefined",
    devUtils.formatMessage(
      `Global "URL" class is not defined. This likely means that you're running MSW in an environment that doesn't support all Node.js standard API (e.g. React Native). If that's the case, please use an appropriate polyfill for the "URL" class, like "react-native-url-polyfill".`
    )
  );
}

// ../../node_modules/.pnpm/strict-event-emitter@0.5.1/node_modules/strict-event-emitter/lib/index.mjs
var MemoryLeakError = class extends Error {
  constructor(emitter, type, count) {
    super(
      `Possible EventEmitter memory leak detected. ${count} ${type.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`
    );
    this.emitter = emitter;
    this.type = type;
    this.count = count;
    this.name = "MaxListenersExceededWarning";
  }
};
var _Emitter = class {
  static listenerCount(emitter, eventName) {
    return emitter.listenerCount(eventName);
  }
  constructor() {
    this.events = /* @__PURE__ */ new Map();
    this.maxListeners = _Emitter.defaultMaxListeners;
    this.hasWarnedAboutPotentialMemoryLeak = false;
  }
  _emitInternalEvent(internalEventName, eventName, listener) {
    this.emit(
      internalEventName,
      ...[eventName, listener]
    );
  }
  _getListeners(eventName) {
    return Array.prototype.concat.apply([], this.events.get(eventName)) || [];
  }
  _removeListener(listeners, listener) {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
    return [];
  }
  _wrapOnceListener(eventName, listener) {
    const onceListener = (...data) => {
      this.removeListener(eventName, onceListener);
      return listener.apply(this, data);
    };
    Object.defineProperty(onceListener, "name", { value: listener.name });
    return onceListener;
  }
  setMaxListeners(maxListeners) {
    this.maxListeners = maxListeners;
    return this;
  }
  /**
   * Returns the current max listener value for the `Emitter` which is
   * either set by `emitter.setMaxListeners(n)` or defaults to
   * `Emitter.defaultMaxListeners`.
   */
  getMaxListeners() {
    return this.maxListeners;
  }
  /**
   * Returns an array listing the events for which the emitter has registered listeners.
   * The values in the array will be strings or Symbols.
   */
  eventNames() {
    return Array.from(this.events.keys());
  }
  /**
   * Synchronously calls each of the listeners registered for the event named `eventName`,
   * in the order they were registered, passing the supplied arguments to each.
   * Returns `true` if the event has listeners, `false` otherwise.
   *
   * @example
   * const emitter = new Emitter<{ hello: [string] }>()
   * emitter.emit('hello', 'John')
   */
  emit(eventName, ...data) {
    const listeners = this._getListeners(eventName);
    listeners.forEach((listener) => {
      listener.apply(this, data);
    });
    return listeners.length > 0;
  }
  addListener(eventName, listener) {
    this._emitInternalEvent("newListener", eventName, listener);
    const nextListeners = this._getListeners(eventName).concat(listener);
    this.events.set(eventName, nextListeners);
    if (this.maxListeners > 0 && this.listenerCount(eventName) > this.maxListeners && !this.hasWarnedAboutPotentialMemoryLeak) {
      this.hasWarnedAboutPotentialMemoryLeak = true;
      const memoryLeakWarning = new MemoryLeakError(
        this,
        eventName,
        this.listenerCount(eventName)
      );
      console.warn(memoryLeakWarning);
    }
    return this;
  }
  on(eventName, listener) {
    return this.addListener(eventName, listener);
  }
  once(eventName, listener) {
    return this.addListener(
      eventName,
      this._wrapOnceListener(eventName, listener)
    );
  }
  prependListener(eventName, listener) {
    const listeners = this._getListeners(eventName);
    if (listeners.length > 0) {
      const nextListeners = [listener].concat(listeners);
      this.events.set(eventName, nextListeners);
    } else {
      this.events.set(eventName, listeners.concat(listener));
    }
    return this;
  }
  prependOnceListener(eventName, listener) {
    return this.prependListener(
      eventName,
      this._wrapOnceListener(eventName, listener)
    );
  }
  removeListener(eventName, listener) {
    const listeners = this._getListeners(eventName);
    if (listeners.length > 0) {
      this._removeListener(listeners, listener);
      this.events.set(eventName, listeners);
      this._emitInternalEvent("removeListener", eventName, listener);
    }
    return this;
  }
  /**
   * Alias for `emitter.removeListener()`.
   *
   * @example
   * emitter.off('hello', listener)
   */
  off(eventName, listener) {
    return this.removeListener(eventName, listener);
  }
  removeAllListeners(eventName) {
    if (eventName) {
      this.events.delete(eventName);
    } else {
      this.events.clear();
    }
    return this;
  }
  /**
   * Returns a copy of the array of listeners for the event named `eventName`.
   */
  listeners(eventName) {
    return Array.from(this._getListeners(eventName));
  }
  /**
   * Returns the number of listeners listening to the event named `eventName`.
   */
  listenerCount(eventName) {
    return this._getListeners(eventName).length;
  }
  rawListeners(eventName) {
    return this.listeners(eventName);
  }
};
var Emitter = _Emitter;
Emitter.defaultMaxListeners = 10;

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/pipeEvents.mjs
function pipeEvents(source, destination) {
  const rawEmit = source.emit;
  if (rawEmit._isPiped) {
    return;
  }
  const sourceEmit = function sourceEmit2(event, ...data) {
    destination.emit(event, ...data);
    return rawEmit.call(this, event, ...data);
  };
  sourceEmit._isPiped = true;
  source.emit = sourceEmit;
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/toReadonlyArray.mjs
function toReadonlyArray(source) {
  const clone = [...source];
  Object.freeze(clone);
  return clone;
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/Disposable.mjs
var Disposable = class {
  constructor() {
    __publicField(this, "subscriptions", []);
  }
  dispose() {
    let subscription;
    while (subscription = this.subscriptions.shift()) {
      subscription();
    }
  }
};

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/SetupApi.mjs
var InMemoryHandlersController = class {
  constructor(initialHandlers) {
    __publicField(this, "handlers");
    this.initialHandlers = initialHandlers;
    this.handlers = [...initialHandlers];
  }
  prepend(runtimeHandles) {
    this.handlers.unshift(...runtimeHandles);
  }
  reset(nextHandlers) {
    this.handlers = nextHandlers.length > 0 ? [...nextHandlers] : [...this.initialHandlers];
  }
  currentHandlers() {
    return this.handlers;
  }
};
var SetupApi = class extends Disposable {
  constructor(...initialHandlers) {
    super();
    __publicField(this, "handlersController");
    __publicField(this, "emitter");
    __publicField(this, "publicEmitter");
    __publicField(this, "events");
    invariant(
      this.validateHandlers(initialHandlers),
      devUtils.formatMessage(
        `Failed to apply given request handlers: invalid input. Did you forget to spread the request handlers Array?`
      )
    );
    this.handlersController = new InMemoryHandlersController(initialHandlers);
    this.emitter = new Emitter();
    this.publicEmitter = new Emitter();
    pipeEvents(this.emitter, this.publicEmitter);
    this.events = this.createLifeCycleEvents();
    this.subscriptions.push(() => {
      this.emitter.removeAllListeners();
      this.publicEmitter.removeAllListeners();
    });
  }
  validateHandlers(handlers) {
    return handlers.every((handler) => !Array.isArray(handler));
  }
  use(...runtimeHandlers) {
    invariant(
      this.validateHandlers(runtimeHandlers),
      devUtils.formatMessage(
        `Failed to call "use()" with the given request handlers: invalid input. Did you forget to spread the array of request handlers?`
      )
    );
    this.handlersController.prepend(runtimeHandlers);
  }
  restoreHandlers() {
    this.handlersController.currentHandlers().forEach((handler) => {
      handler.isUsed = false;
    });
  }
  resetHandlers(...nextHandlers) {
    this.handlersController.reset(nextHandlers);
  }
  listHandlers() {
    return toReadonlyArray(this.handlersController.currentHandlers());
  }
  createLifeCycleEvents() {
    return {
      on: (...args) => {
        return this.publicEmitter.on(...args);
      },
      removeListener: (...args) => {
        return this.publicEmitter.removeListener(...args);
      },
      removeAllListeners: (...args) => {
        return this.publicEmitter.removeAllListeners(...args);
      }
    };
  }
};

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/getCallFrame.mjs
var SOURCE_FRAME = /[\/\\]msw[\/\\]src[\/\\](.+)/;
var BUILD_FRAME = /(node_modules)?[\/\\]lib[\/\\](core|browser|node|native|iife)[\/\\]|^[^\/\\]*$/;
function getCallFrame(error3) {
  const stack = error3.stack;
  if (!stack) {
    return;
  }
  const frames = stack.split("\n").slice(1);
  const declarationFrame = frames.find((frame) => {
    return !(SOURCE_FRAME.test(frame) || BUILD_FRAME.test(frame));
  });
  if (!declarationFrame) {
    return;
  }
  const declarationPath = declarationFrame.replace(/\s*at [^()]*\(([^)]+)\)/, "$1").replace(/^@/, "");
  return declarationPath;
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/isIterable.mjs
function isIterable(fn) {
  if (!fn) {
    return false;
  }
  return typeof fn[Symbol.iterator] == "function";
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/handlers/RequestHandler.mjs
var _RequestHandler = class _RequestHandler {
  constructor(args) {
    __publicField(this, "info");
    /**
     * Indicates whether this request handler has been used
     * (its resolver has successfully executed).
     */
    __publicField(this, "isUsed");
    __publicField(this, "resolver");
    __publicField(this, "resolverGenerator");
    __publicField(this, "resolverGeneratorResult");
    __publicField(this, "options");
    this.resolver = args.resolver;
    this.options = args.options;
    const callFrame = getCallFrame(new Error());
    this.info = {
      ...args.info,
      callFrame
    };
    this.isUsed = false;
  }
  /**
   * Parse the intercepted request to extract additional information from it.
   * Parsed result is then exposed to other methods of this request handler.
   */
  async parse(_args) {
    return {};
  }
  /**
   * Test if this handler matches the given request.
   *
   * This method is not used internally but is exposed
   * as a convenience method for consumers writing custom
   * handlers.
   */
  async test(args) {
    const parsedResult = await this.parse({
      request: args.request,
      resolutionContext: args.resolutionContext
    });
    return this.predicate({
      request: args.request,
      parsedResult,
      resolutionContext: args.resolutionContext
    });
  }
  extendResolverArgs(_args) {
    return {};
  }
  // Clone the request instance before it's passed to the handler phases
  // and the response resolver so we can always read it for logging.
  // We only clone it once per request to avoid unnecessary overhead.
  cloneRequestOrGetFromCache(request2) {
    const existingClone = _RequestHandler.cache.get(request2);
    if (typeof existingClone !== "undefined") {
      return existingClone;
    }
    const clonedRequest = request2.clone();
    _RequestHandler.cache.set(request2, clonedRequest);
    return clonedRequest;
  }
  /**
   * Execute this request handler and produce a mocked response
   * using the given resolver function.
   */
  async run(args) {
    var _a3, _b2;
    if (this.isUsed && ((_a3 = this.options) == null ? void 0 : _a3.once)) {
      return null;
    }
    const requestClone = this.cloneRequestOrGetFromCache(args.request);
    const parsedResult = await this.parse({
      request: args.request,
      resolutionContext: args.resolutionContext
    });
    const shouldInterceptRequest = this.predicate({
      request: args.request,
      parsedResult,
      resolutionContext: args.resolutionContext
    });
    if (!shouldInterceptRequest) {
      return null;
    }
    if (this.isUsed && ((_b2 = this.options) == null ? void 0 : _b2.once)) {
      return null;
    }
    this.isUsed = true;
    const executeResolver = this.wrapResolver(this.resolver);
    const resolverExtras = this.extendResolverArgs({
      request: args.request,
      parsedResult
    });
    const mockedResponsePromise = executeResolver({
      ...resolverExtras,
      requestId: args.requestId,
      request: args.request
    }).catch((errorOrResponse) => {
      if (errorOrResponse instanceof Response) {
        return errorOrResponse;
      }
      throw errorOrResponse;
    });
    const mockedResponse = await mockedResponsePromise;
    const executionResult = this.createExecutionResult({
      // Pass the cloned request to the result so that logging
      // and other consumers could read its body once more.
      request: requestClone,
      requestId: args.requestId,
      response: mockedResponse,
      parsedResult
    });
    return executionResult;
  }
  wrapResolver(resolver) {
    return async (info) => {
      const result = this.resolverGenerator || await resolver(info);
      if (isIterable(result)) {
        this.isUsed = false;
        const { value, done } = result[Symbol.iterator]().next();
        const nextResponse = await value;
        if (done) {
          this.isUsed = true;
        }
        if (!nextResponse && done) {
          invariant(
            this.resolverGeneratorResult,
            "Failed to returned a previously stored generator response: the value is not a valid Response."
          );
          return this.resolverGeneratorResult.clone();
        }
        if (!this.resolverGenerator) {
          this.resolverGenerator = result;
        }
        if (nextResponse) {
          this.resolverGeneratorResult = nextResponse == null ? void 0 : nextResponse.clone();
        }
        return nextResponse;
      }
      return result;
    };
  }
  createExecutionResult(args) {
    return {
      handler: this,
      request: args.request,
      requestId: args.requestId,
      response: args.response,
      parsedResult: args.parsedResult
    };
  }
};
__publicField(_RequestHandler, "cache", /* @__PURE__ */ new WeakMap());
var RequestHandler = _RequestHandler;

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/isStringEqual.mjs
function isStringEqual(actual, expected) {
  return actual.toLowerCase() === expected.toLowerCase();
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/logging/getStatusCodeColor.mjs
function getStatusCodeColor(status) {
  if (status < 300) {
    return "#69AB32";
  }
  if (status < 400) {
    return "#F0BB4B";
  }
  return "#E95F5D";
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/logging/getTimestamp.mjs
function getTimestamp() {
  const now = /* @__PURE__ */ new Date();
  return [now.getHours(), now.getMinutes(), now.getSeconds()].map(String).map((chunk) => chunk.slice(0, 2)).map((chunk) => chunk.padStart(2, "0")).join(":");
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/logging/serializeRequest.mjs
async function serializeRequest(request2) {
  const requestClone = request2.clone();
  const requestText = await requestClone.text();
  return {
    url: new URL(request2.url),
    method: request2.method,
    headers: Object.fromEntries(request2.headers.entries()),
    body: requestText
  };
}

// ../../node_modules/.pnpm/@bundled-es-modules+statuses@1.0.1/node_modules/@bundled-es-modules/statuses/index-esm.js
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp2(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_codes = __commonJS({
  "node_modules/statuses/codes.json"(exports, module) {
    module.exports = {
      "100": "Continue",
      "101": "Switching Protocols",
      "102": "Processing",
      "103": "Early Hints",
      "200": "OK",
      "201": "Created",
      "202": "Accepted",
      "203": "Non-Authoritative Information",
      "204": "No Content",
      "205": "Reset Content",
      "206": "Partial Content",
      "207": "Multi-Status",
      "208": "Already Reported",
      "226": "IM Used",
      "300": "Multiple Choices",
      "301": "Moved Permanently",
      "302": "Found",
      "303": "See Other",
      "304": "Not Modified",
      "305": "Use Proxy",
      "307": "Temporary Redirect",
      "308": "Permanent Redirect",
      "400": "Bad Request",
      "401": "Unauthorized",
      "402": "Payment Required",
      "403": "Forbidden",
      "404": "Not Found",
      "405": "Method Not Allowed",
      "406": "Not Acceptable",
      "407": "Proxy Authentication Required",
      "408": "Request Timeout",
      "409": "Conflict",
      "410": "Gone",
      "411": "Length Required",
      "412": "Precondition Failed",
      "413": "Payload Too Large",
      "414": "URI Too Long",
      "415": "Unsupported Media Type",
      "416": "Range Not Satisfiable",
      "417": "Expectation Failed",
      "418": "I'm a Teapot",
      "421": "Misdirected Request",
      "422": "Unprocessable Entity",
      "423": "Locked",
      "424": "Failed Dependency",
      "425": "Too Early",
      "426": "Upgrade Required",
      "428": "Precondition Required",
      "429": "Too Many Requests",
      "431": "Request Header Fields Too Large",
      "451": "Unavailable For Legal Reasons",
      "500": "Internal Server Error",
      "501": "Not Implemented",
      "502": "Bad Gateway",
      "503": "Service Unavailable",
      "504": "Gateway Timeout",
      "505": "HTTP Version Not Supported",
      "506": "Variant Also Negotiates",
      "507": "Insufficient Storage",
      "508": "Loop Detected",
      "509": "Bandwidth Limit Exceeded",
      "510": "Not Extended",
      "511": "Network Authentication Required"
    };
  }
});
var require_statuses = __commonJS({
  "node_modules/statuses/index.js"(exports, module) {
    "use strict";
    var codes = require_codes();
    module.exports = status2;
    status2.message = codes;
    status2.code = createMessageToStatusCodeMap(codes);
    status2.codes = createStatusCodeList(codes);
    status2.redirect = {
      300: true,
      301: true,
      302: true,
      303: true,
      305: true,
      307: true,
      308: true
    };
    status2.empty = {
      204: true,
      205: true,
      304: true
    };
    status2.retry = {
      502: true,
      503: true,
      504: true
    };
    function createMessageToStatusCodeMap(codes2) {
      var map = {};
      Object.keys(codes2).forEach(function forEachCode(code) {
        var message3 = codes2[code];
        var status3 = Number(code);
        map[message3.toLowerCase()] = status3;
      });
      return map;
    }
    function createStatusCodeList(codes2) {
      return Object.keys(codes2).map(function mapCode(code) {
        return Number(code);
      });
    }
    function getStatusCode(message3) {
      var msg = message3.toLowerCase();
      if (!Object.prototype.hasOwnProperty.call(status2.code, msg)) {
        throw new Error('invalid status message: "' + message3 + '"');
      }
      return status2.code[msg];
    }
    function getStatusMessage(code) {
      if (!Object.prototype.hasOwnProperty.call(status2.message, code)) {
        throw new Error("invalid status code: " + code);
      }
      return status2.message[code];
    }
    function status2(code) {
      if (typeof code === "number") {
        return getStatusMessage(code);
      }
      if (typeof code !== "string") {
        throw new TypeError("code must be a number or string");
      }
      var n = parseInt(code, 10);
      if (!isNaN(n)) {
        return getStatusMessage(n);
      }
      return getStatusCode(code);
    }
  }
});
var import_statuses = __toESM(require_statuses(), 1);
var source_default = import_statuses.default;

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/logging/serializeResponse.mjs
var { message } = source_default;
async function serializeResponse(response) {
  const responseClone = response.clone();
  const responseText = await responseClone.text();
  const responseStatus = responseClone.status || 200;
  const responseStatusText = responseClone.statusText || message[responseStatus] || "OK";
  return {
    status: responseStatus,
    statusText: responseStatusText,
    headers: Object.fromEntries(responseClone.headers.entries()),
    body: responseText
  };
}

// ../../node_modules/.pnpm/path-to-regexp@6.2.2/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a3 = options.prefixes, prefixes = _a3 === void 0 ? "./" : _a3;
  var defaultPattern = "[^".concat(escapeString(options.delimiter || "/#?"), "]+?");
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a4 = tokens[i], nextType = _a4.type, index = _a4.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || defaultPattern,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? defaultPattern : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a3 = options.decode, decode = _a3 === void 0 ? function(x) {
    return x;
  } : _a3;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a3 = options.strict, strict = _a3 === void 0 ? false : _a3, _b2 = options.start, start = _b2 === void 0 ? true : _b2, _c2 = options.end, end = _c2 === void 0 ? true : _c2, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            route += "((?:".concat(token.pattern, ")").concat(token.modifier, ")");
          } else {
            route += "(".concat(token.pattern, ")").concat(token.modifier);
          }
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}

// ../../node_modules/.pnpm/is-node-process@1.2.0/node_modules/is-node-process/lib/index.mjs
function isNodeProcess() {
  if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
    return true;
  }
  if (typeof process !== "undefined") {
    const type = process.type;
    if (type === "renderer" || type === "worker") {
      return false;
    }
    return !!(process.versions && process.versions.node);
  }
  return false;
}

// ../../node_modules/.pnpm/outvariant@1.4.2/node_modules/outvariant/lib/index.mjs
var POSITIONALS_EXP2 = /(%?)(%([sdijo]))/g;
function serializePositional2(positional, flag) {
  switch (flag) {
    case "s":
      return positional;
    case "d":
    case "i":
      return Number(positional);
    case "j":
      return JSON.stringify(positional);
    case "o": {
      if (typeof positional === "string") {
        return positional;
      }
      const json = JSON.stringify(positional);
      if (json === "{}" || json === "[]" || /^\[object .+?\]$/.test(json)) {
        return positional;
      }
      return json;
    }
  }
}
function format2(message3, ...positionals) {
  if (positionals.length === 0) {
    return message3;
  }
  let positionalIndex = 0;
  let formattedMessage = message3.replace(
    POSITIONALS_EXP2,
    (match2, isEscaped, _, flag) => {
      const positional = positionals[positionalIndex];
      const value = serializePositional2(positional, flag);
      if (!isEscaped) {
        positionalIndex++;
        return value;
      }
      return match2;
    }
  );
  if (positionalIndex < positionals.length) {
    formattedMessage += ` ${positionals.slice(positionalIndex).join(" ")}`;
  }
  formattedMessage = formattedMessage.replace(/%{2,2}/g, "%");
  return formattedMessage;
}
var STACK_FRAMES_TO_IGNORE2 = 2;
function cleanErrorStack2(error3) {
  if (!error3.stack) {
    return;
  }
  const nextStack = error3.stack.split("\n");
  nextStack.splice(1, STACK_FRAMES_TO_IGNORE2);
  error3.stack = nextStack.join("\n");
}
var InvariantError2 = class extends Error {
  constructor(message3, ...positionals) {
    super(message3);
    this.message = message3;
    this.name = "Invariant Violation";
    this.message = format2(message3, ...positionals);
    cleanErrorStack2(this);
  }
};
var invariant2 = (predicate, message3, ...positionals) => {
  if (!predicate) {
    throw new InvariantError2(message3, ...positionals);
  }
};
invariant2.as = (ErrorConstructor, predicate, message3, ...positionals) => {
  if (!predicate) {
    const formatMessage2 = positionals.length === 0 ? message3 : format2(message3, positionals);
    let error3;
    try {
      error3 = Reflect.construct(ErrorConstructor, [formatMessage2]);
    } catch (err) {
      error3 = ErrorConstructor(formatMessage2);
    }
    throw error3;
  }
};

// ../../node_modules/.pnpm/@open-draft+logger@0.3.0/node_modules/@open-draft/logger/lib/index.mjs
var __defProp3 = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp3(target, name, { get: all[name], enumerable: true });
};
var colors_exports = {};
__export(colors_exports, {
  blue: () => blue,
  gray: () => gray,
  green: () => green,
  red: () => red,
  yellow: () => yellow
});
function yellow(text) {
  return `\x1B[33m${text}\x1B[0m`;
}
function blue(text) {
  return `\x1B[34m${text}\x1B[0m`;
}
function gray(text) {
  return `\x1B[90m${text}\x1B[0m`;
}
function red(text) {
  return `\x1B[31m${text}\x1B[0m`;
}
function green(text) {
  return `\x1B[32m${text}\x1B[0m`;
}
var IS_NODE = isNodeProcess();
var Logger = class {
  constructor(name) {
    __publicField(this, "prefix");
    this.name = name;
    this.prefix = `[${this.name}]`;
    const LOGGER_NAME = getVariable("DEBUG");
    const LOGGER_LEVEL = getVariable("LOG_LEVEL");
    const isLoggingEnabled = LOGGER_NAME === "1" || LOGGER_NAME === "true" || typeof LOGGER_NAME !== "undefined" && this.name.startsWith(LOGGER_NAME);
    if (isLoggingEnabled) {
      this.debug = isDefinedAndNotEquals(LOGGER_LEVEL, "debug") ? noop : this.debug;
      this.info = isDefinedAndNotEquals(LOGGER_LEVEL, "info") ? noop : this.info;
      this.success = isDefinedAndNotEquals(LOGGER_LEVEL, "success") ? noop : this.success;
      this.warning = isDefinedAndNotEquals(LOGGER_LEVEL, "warning") ? noop : this.warning;
      this.error = isDefinedAndNotEquals(LOGGER_LEVEL, "error") ? noop : this.error;
    } else {
      this.info = noop;
      this.success = noop;
      this.warning = noop;
      this.error = noop;
      this.only = noop;
    }
  }
  extend(domain) {
    return new Logger(`${this.name}:${domain}`);
  }
  /**
   * Print a debug message.
   * @example
   * logger.debug('no duplicates found, creating a document...')
   */
  debug(message3, ...positionals) {
    this.logEntry({
      level: "debug",
      message: gray(message3),
      positionals,
      prefix: this.prefix,
      colors: {
        prefix: "gray"
      }
    });
  }
  /**
   * Print an info message.
   * @example
   * logger.info('start parsing...')
   */
  info(message3, ...positionals) {
    this.logEntry({
      level: "info",
      message: message3,
      positionals,
      prefix: this.prefix,
      colors: {
        prefix: "blue"
      }
    });
    const performance2 = new PerformanceEntry();
    return (message22, ...positionals2) => {
      performance2.measure();
      this.logEntry({
        level: "info",
        message: `${message22} ${gray(`${performance2.deltaTime}ms`)}`,
        positionals: positionals2,
        prefix: this.prefix,
        colors: {
          prefix: "blue"
        }
      });
    };
  }
  /**
   * Print a success message.
   * @example
   * logger.success('successfully created document')
   */
  success(message3, ...positionals) {
    this.logEntry({
      level: "info",
      message: message3,
      positionals,
      prefix: `\u2714 ${this.prefix}`,
      colors: {
        timestamp: "green",
        prefix: "green"
      }
    });
  }
  /**
   * Print a warning.
   * @example
   * logger.warning('found legacy document format')
   */
  warning(message3, ...positionals) {
    this.logEntry({
      level: "warning",
      message: message3,
      positionals,
      prefix: `\u26A0 ${this.prefix}`,
      colors: {
        timestamp: "yellow",
        prefix: "yellow"
      }
    });
  }
  /**
   * Print an error message.
   * @example
   * logger.error('something went wrong')
   */
  error(message3, ...positionals) {
    this.logEntry({
      level: "error",
      message: message3,
      positionals,
      prefix: `\u2716 ${this.prefix}`,
      colors: {
        timestamp: "red",
        prefix: "red"
      }
    });
  }
  /**
   * Execute the given callback only when the logging is enabled.
   * This is skipped in its entirety and has no runtime cost otherwise.
   * This executes regardless of the log level.
   * @example
   * logger.only(() => {
   *   logger.info('additional info')
   * })
   */
  only(callback) {
    callback();
  }
  createEntry(level, message3) {
    return {
      timestamp: /* @__PURE__ */ new Date(),
      level,
      message: message3
    };
  }
  logEntry(args) {
    const {
      level,
      message: message3,
      prefix,
      colors: customColors,
      positionals = []
    } = args;
    const entry = this.createEntry(level, message3);
    const timestampColor = (customColors == null ? void 0 : customColors.timestamp) || "gray";
    const prefixColor = (customColors == null ? void 0 : customColors.prefix) || "gray";
    const colorize = {
      timestamp: colors_exports[timestampColor],
      prefix: colors_exports[prefixColor]
    };
    const write = this.getWriter(level);
    write(
      [colorize.timestamp(this.formatTimestamp(entry.timestamp))].concat(prefix != null ? colorize.prefix(prefix) : []).concat(serializeInput(message3)).join(" "),
      ...positionals.map(serializeInput)
    );
  }
  formatTimestamp(timestamp) {
    return `${timestamp.toLocaleTimeString(
      "en-GB"
    )}:${timestamp.getMilliseconds()}`;
  }
  getWriter(level) {
    switch (level) {
      case "debug":
      case "success":
      case "info": {
        return log;
      }
      case "warning": {
        return warn2;
      }
      case "error": {
        return error2;
      }
    }
  }
};
var PerformanceEntry = class {
  constructor() {
    __publicField(this, "startTime");
    __publicField(this, "endTime");
    __publicField(this, "deltaTime");
    this.startTime = performance.now();
  }
  measure() {
    this.endTime = performance.now();
    const deltaTime = this.endTime - this.startTime;
    this.deltaTime = deltaTime.toFixed(2);
  }
};
var noop = () => void 0;
function log(message3, ...positionals) {
  if (IS_NODE) {
    process.stdout.write(format2(message3, ...positionals) + "\n");
    return;
  }
  console.log(message3, ...positionals);
}
function warn2(message3, ...positionals) {
  if (IS_NODE) {
    process.stderr.write(format2(message3, ...positionals) + "\n");
    return;
  }
  console.warn(message3, ...positionals);
}
function error2(message3, ...positionals) {
  if (IS_NODE) {
    process.stderr.write(format2(message3, ...positionals) + "\n");
    return;
  }
  console.error(message3, ...positionals);
}
function getVariable(variableName) {
  var _a3;
  if (IS_NODE) {
    return process.env[variableName];
  }
  return (_a3 = globalThis[variableName]) == null ? void 0 : _a3.toString();
}
function isDefinedAndNotEquals(value, expected) {
  return value !== void 0 && value !== expected;
}
function serializeInput(message3) {
  if (typeof message3 === "undefined") {
    return "undefined";
  }
  if (message3 === null) {
    return "null";
  }
  if (typeof message3 === "string") {
    return message3;
  }
  if (typeof message3 === "object") {
    return JSON.stringify(message3);
  }
  return message3.toString();
}

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/chunk-Q7POAM5N.mjs
var INTERNAL_REQUEST_ID_HEADER_NAME = "x-interceptors-internal-request-id";
function getGlobalSymbol(symbol) {
  return (
    // @ts-ignore https://github.com/Microsoft/TypeScript/issues/24587
    globalThis[symbol] || void 0
  );
}
function setGlobalSymbol(symbol, value) {
  globalThis[symbol] = value;
}
function deleteGlobalSymbol(symbol) {
  delete globalThis[symbol];
}
var InterceptorReadyState = /* @__PURE__ */ ((InterceptorReadyState2) => {
  InterceptorReadyState2["INACTIVE"] = "INACTIVE";
  InterceptorReadyState2["APPLYING"] = "APPLYING";
  InterceptorReadyState2["APPLIED"] = "APPLIED";
  InterceptorReadyState2["DISPOSING"] = "DISPOSING";
  InterceptorReadyState2["DISPOSED"] = "DISPOSED";
  return InterceptorReadyState2;
})(InterceptorReadyState || {});
var Interceptor = class {
  constructor(symbol) {
    this.symbol = symbol;
    this.readyState = "INACTIVE";
    this.emitter = new Emitter();
    this.subscriptions = [];
    this.logger = new Logger(symbol.description);
    this.emitter.setMaxListeners(0);
    this.logger.info("constructing the interceptor...");
  }
  /**
   * Determine if this interceptor can be applied
   * in the current environment.
   */
  checkEnvironment() {
    return true;
  }
  /**
   * Apply this interceptor to the current process.
   * Returns an already running interceptor instance if it's present.
   */
  apply() {
    const logger7 = this.logger.extend("apply");
    logger7.info("applying the interceptor...");
    if (this.readyState === "APPLIED") {
      logger7.info("intercepted already applied!");
      return;
    }
    const shouldApply = this.checkEnvironment();
    if (!shouldApply) {
      logger7.info("the interceptor cannot be applied in this environment!");
      return;
    }
    this.readyState = "APPLYING";
    const runningInstance = this.getInstance();
    if (runningInstance) {
      logger7.info("found a running instance, reusing...");
      this.on = (event, listener) => {
        logger7.info('proxying the "%s" listener', event);
        runningInstance.emitter.addListener(event, listener);
        this.subscriptions.push(() => {
          runningInstance.emitter.removeListener(event, listener);
          logger7.info('removed proxied "%s" listener!', event);
        });
        return this;
      };
      this.readyState = "APPLIED";
      return;
    }
    logger7.info("no running instance found, setting up a new instance...");
    this.setup();
    this.setInstance();
    this.readyState = "APPLIED";
  }
  /**
   * Setup the module augments and stubs necessary for this interceptor.
   * This method is not run if there's a running interceptor instance
   * to prevent instantiating an interceptor multiple times.
   */
  setup() {
  }
  /**
   * Listen to the interceptor's public events.
   */
  on(event, listener) {
    const logger7 = this.logger.extend("on");
    if (this.readyState === "DISPOSING" || this.readyState === "DISPOSED") {
      logger7.info("cannot listen to events, already disposed!");
      return this;
    }
    logger7.info('adding "%s" event listener:', event, listener);
    this.emitter.on(event, listener);
    return this;
  }
  once(event, listener) {
    this.emitter.once(event, listener);
    return this;
  }
  off(event, listener) {
    this.emitter.off(event, listener);
    return this;
  }
  removeAllListeners(event) {
    this.emitter.removeAllListeners(event);
    return this;
  }
  /**
   * Disposes of any side-effects this interceptor has introduced.
   */
  dispose() {
    const logger7 = this.logger.extend("dispose");
    if (this.readyState === "DISPOSED") {
      logger7.info("cannot dispose, already disposed!");
      return;
    }
    logger7.info("disposing the interceptor...");
    this.readyState = "DISPOSING";
    if (!this.getInstance()) {
      logger7.info("no interceptors running, skipping dispose...");
      return;
    }
    this.clearInstance();
    logger7.info("global symbol deleted:", getGlobalSymbol(this.symbol));
    if (this.subscriptions.length > 0) {
      logger7.info("disposing of %d subscriptions...", this.subscriptions.length);
      for (const dispose of this.subscriptions) {
        dispose();
      }
      this.subscriptions = [];
      logger7.info("disposed of all subscriptions!", this.subscriptions.length);
    }
    this.emitter.removeAllListeners();
    logger7.info("destroyed the listener!");
    this.readyState = "DISPOSED";
  }
  getInstance() {
    var _a3;
    const instance = getGlobalSymbol(this.symbol);
    this.logger.info("retrieved global instance:", (_a3 = instance == null ? void 0 : instance.constructor) == null ? void 0 : _a3.name);
    return instance;
  }
  setInstance() {
    setGlobalSymbol(this.symbol, this);
    this.logger.info("set global instance!", this.symbol.description);
  }
  clearInstance() {
    deleteGlobalSymbol(this.symbol);
    this.logger.info("cleared global instance!", this.symbol.description);
  }
};
function createRequestId() {
  return Math.random().toString(16).slice(2);
}
function isPropertyAccessible(obj, key) {
  try {
    obj[key];
    return true;
  } catch (e) {
    return false;
  }
}
var RESPONSE_STATUS_CODES_WITHOUT_BODY = /* @__PURE__ */ new Set([
  101,
  103,
  204,
  205,
  304
]);
function isResponseWithoutBody(status) {
  return RESPONSE_STATUS_CODES_WITHOUT_BODY.has(status);
}
function createServerErrorResponse(body) {
  return new Response(
    JSON.stringify(
      body instanceof Error ? {
        name: body.name,
        message: body.message,
        stack: body.stack
      } : body
    ),
    {
      status: 500,
      statusText: "Unhandled Exception",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
function isResponseError(response) {
  return isPropertyAccessible(response, "type") && response.type === "error";
}

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/chunk-6FRASLM3.mjs
var BatchInterceptor = class extends Interceptor {
  constructor(options) {
    BatchInterceptor.symbol = Symbol(options.name);
    super(BatchInterceptor.symbol);
    this.interceptors = options.interceptors;
  }
  setup() {
    const logger7 = this.logger.extend("setup");
    logger7.info("applying all %d interceptors...", this.interceptors.length);
    for (const interceptor of this.interceptors) {
      logger7.info('applying "%s" interceptor...', interceptor.constructor.name);
      interceptor.apply();
      logger7.info("adding interceptor dispose subscription");
      this.subscriptions.push(() => interceptor.dispose());
    }
  }
  on(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.on(event, listener);
    }
    return this;
  }
  once(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.once(event, listener);
    }
    return this;
  }
  off(event, listener) {
    for (const interceptor of this.interceptors) {
      interceptor.off(event, listener);
    }
    return this;
  }
  removeAllListeners(event) {
    for (const interceptors of this.interceptors) {
      interceptors.removeAllListeners(event);
    }
    return this;
  }
};

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/chunk-6HYIRFX2.mjs
var encoder = new TextEncoder();
function encodeBuffer(text) {
  return encoder.encode(text);
}
function decodeBuffer(buffer, encoding) {
  const decoder = new TextDecoder(encoding);
  return decoder.decode(buffer);
}
function toArrayBuffer(array) {
  return array.buffer.slice(
    array.byteOffset,
    array.byteOffset + array.byteLength
  );
}

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/chunk-OJ6O4LSC.mjs
var IS_PATCHED_MODULE = Symbol("isPatchedModule");

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/index.mjs
function getCleanUrl(url, isAbsolute = true) {
  return [isAbsolute && url.origin, url.pathname].filter(Boolean).join("");
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/url/cleanUrl.mjs
var REDUNDANT_CHARACTERS_EXP = /[\?|#].*$/g;
function getSearchParams(path) {
  return new URL(`/${path}`, "http://localhost").searchParams;
}
function cleanUrl(path) {
  if (path.endsWith("?")) {
    return path;
  }
  return path.replace(REDUNDANT_CHARACTERS_EXP, "");
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/url/isAbsoluteUrl.mjs
function isAbsoluteUrl(url) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/url/getAbsoluteUrl.mjs
function getAbsoluteUrl(path, baseUrl) {
  if (isAbsoluteUrl(path)) {
    return path;
  }
  if (path.startsWith("*")) {
    return path;
  }
  const origin = baseUrl || typeof document !== "undefined" && document.baseURI;
  return origin ? (
    // Encode and decode the path to preserve escaped characters.
    decodeURI(new URL(encodeURI(path), origin).href)
  ) : path;
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/matching/normalizePath.mjs
function normalizePath(path, baseUrl) {
  if (path instanceof RegExp) {
    return path;
  }
  const maybeAbsoluteUrl = getAbsoluteUrl(path, baseUrl);
  return cleanUrl(maybeAbsoluteUrl);
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/matching/matchRequestUrl.mjs
function coercePath(path) {
  return path.replace(
    /([:a-zA-Z_-]*)(\*{1,2})+/g,
    (_, parameterName, wildcard) => {
      const expression = "(.*)";
      if (!parameterName) {
        return expression;
      }
      return parameterName.startsWith(":") ? `${parameterName}${wildcard}` : `${parameterName}${expression}`;
    }
  ).replace(/([^\/])(:)(?=\d+)/, "$1\\$2").replace(/^([^\/]+)(:)(?=\/\/)/, "$1\\$2");
}
function matchRequestUrl(url, path, baseUrl) {
  const normalizedPath = normalizePath(path, baseUrl);
  const cleanPath = typeof normalizedPath === "string" ? coercePath(normalizedPath) : normalizedPath;
  const cleanUrl2 = getCleanUrl(url);
  const result = match(cleanPath, { decode: decodeURIComponent })(cleanUrl2);
  const params = result && result.params || {};
  return {
    matches: result !== false,
    params
  };
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/request/toPublicUrl.mjs
function toPublicUrl(url) {
  if (typeof location === "undefined") {
    return url.toString();
  }
  const urlInstance = url instanceof URL ? url : new URL(url);
  return urlInstance.origin === location.origin ? urlInstance.pathname : urlInstance.origin + urlInstance.pathname;
}

// ../../node_modules/.pnpm/@bundled-es-modules+cookie@2.0.0/node_modules/@bundled-es-modules/cookie/index-esm.js
var __create2 = Object.create;
var __defProp4 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames2 = Object.getOwnPropertyNames;
var __getProtoOf2 = Object.getPrototypeOf;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __commonJS2 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames2(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps2 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames2(from))
      if (!__hasOwnProp2.call(to, key) && key !== except)
        __defProp4(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM2 = (mod, isNodeMode, target) => (target = mod != null ? __create2(__getProtoOf2(mod)) : {}, __copyProps2(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp4(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_cookie = __commonJS2({
  "node_modules/cookie/index.js"(exports) {
    "use strict";
    exports.parse = parse2;
    exports.serialize = serialize;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse2(str, options) {
      if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options || {};
      var dec = opt.decode || decode;
      var index = 0;
      while (index < str.length) {
        var eqIdx = str.indexOf("=", index);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
          endIdx = str.length;
        } else if (endIdx < eqIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key = str.slice(index, eqIdx).trim();
        if (void 0 === obj[key]) {
          var val = str.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
      }
      return obj;
    }
    function serialize(name, val, options) {
      var opt = options || {};
      var enc = opt.encode || encode;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str += "; HttpOnly";
      }
      if (opt.secure) {
        str += "; Secure";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str;
    }
    function decode(str) {
      return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
    }
    function encode(val) {
      return encodeURIComponent(val);
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    function tryDecode(str, decode2) {
      try {
        return decode2(str);
      } catch (e) {
        return str;
      }
    }
  }
});
var import_cookie = __toESM2(require_cookie(), 1);
var source_default2 = import_cookie.default;

// ../../node_modules/.pnpm/@mswjs+cookies@1.1.1/node_modules/@mswjs/cookies/lib/index.mjs
var __create3 = Object.create;
var __defProp5 = Object.defineProperty;
var __getOwnPropDesc3 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames3 = Object.getOwnPropertyNames;
var __getProtoOf3 = Object.getPrototypeOf;
var __hasOwnProp3 = Object.prototype.hasOwnProperty;
var __commonJS3 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames3(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps3 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames3(from))
      if (!__hasOwnProp3.call(to, key) && key !== except)
        __defProp5(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc3(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM3 = (mod, isNodeMode, target) => (target = mod != null ? __create3(__getProtoOf3(mod)) : {}, __copyProps3(
  isNodeMode || !mod || !mod.__esModule ? __defProp5(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_set_cookie = __commonJS3({
  "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
    "use strict";
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str) {
      return typeof str === "string" && !!str.trim();
    }
    function parseString(setCookieValue, options) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValuePairStr = parts.shift();
      var parsed = parseNameValuePair(nameValuePairStr);
      var name = parsed.name;
      var value = parsed.value;
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      try {
        value = options.decodeValues ? decodeURIComponent(value) : value;
      } catch (e) {
        console.error(
          "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
          e
        );
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key === "expires") {
          cookie.expires = new Date(value2);
        } else if (key === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key === "secure") {
          cookie.secure = true;
        } else if (key === "httponly") {
          cookie.httpOnly = true;
        } else if (key === "samesite") {
          cookie.sameSite = value2;
        } else {
          cookie[key] = value2;
        }
      });
      return cookie;
    }
    function parseNameValuePair(nameValuePairStr) {
      var name = "";
      var value = "";
      var nameValueArr = nameValuePairStr.split("=");
      if (nameValueArr.length > 1) {
        name = nameValueArr.shift();
        value = nameValueArr.join("=");
      } else {
        value = nameValuePairStr;
      }
      return { name, value };
    }
    function parse2(input, options) {
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!input) {
        if (!options.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers) {
        if (typeof input.headers.getSetCookie === "function") {
          input = input.headers.getSetCookie();
        } else if (input.headers["set-cookie"]) {
          input = input.headers["set-cookie"];
        } else {
          var sch = input.headers[Object.keys(input.headers).find(function(key) {
            return key.toLowerCase() === "set-cookie";
          })];
          if (!sch && input.headers.cookie && !options.silent) {
            console.warn(
              "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
            );
          }
          input = sch;
        }
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!options.map) {
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString(str, options);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString(str, options);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    function splitCookiesString(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    module.exports = parse2;
    module.exports.parse = parse2;
    module.exports.parseString = parseString;
    module.exports.splitCookiesString = splitCookiesString;
  }
});
var import_set_cookie_parser = __toESM3(require_set_cookie());
var PERSISTENCY_KEY = "MSW_COOKIE_STORE";
function supportsLocalStorage() {
  try {
    if (localStorage == null) {
      return false;
    }
    const testKey = PERSISTENCY_KEY + "_test";
    localStorage.setItem(testKey, "test");
    localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error3) {
    return false;
  }
}
var hasLocalStorageSupport = supportsLocalStorage();
function isPropertyAccessible2(object, method) {
  try {
    object[method];
    return true;
  } catch (e) {
    return false;
  }
}
var CookieStore = class {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  add(request2, response) {
    if (isPropertyAccessible2(request2, "credentials") && request2.credentials === "omit") {
      return;
    }
    const requestUrl = new URL(request2.url);
    const responseCookies = response.headers.get("set-cookie");
    if (!responseCookies) {
      return;
    }
    const now = Date.now();
    const parsedResponseCookies = (0, import_set_cookie_parser.parse)(responseCookies).map(
      ({ maxAge, ...cookie }) => ({
        ...cookie,
        expires: maxAge === void 0 ? cookie.expires : new Date(now + maxAge * 1e3),
        maxAge
      })
    );
    const prevCookies = this.store.get(requestUrl.origin) || /* @__PURE__ */ new Map();
    parsedResponseCookies.forEach((cookie) => {
      this.store.set(requestUrl.origin, prevCookies.set(cookie.name, cookie));
    });
  }
  get(request2) {
    this.deleteExpiredCookies();
    const requestUrl = new URL(request2.url);
    const originCookies = this.store.get(requestUrl.origin) || /* @__PURE__ */ new Map();
    if (!isPropertyAccessible2(request2, "credentials")) {
      return originCookies;
    }
    switch (request2.credentials) {
      case "include": {
        if (typeof document === "undefined") {
          return originCookies;
        }
        const documentCookies = (0, import_set_cookie_parser.parse)(document.cookie);
        documentCookies.forEach((cookie) => {
          originCookies.set(cookie.name, cookie);
        });
        return originCookies;
      }
      case "same-origin": {
        return originCookies;
      }
      default:
        return /* @__PURE__ */ new Map();
    }
  }
  getAll() {
    this.deleteExpiredCookies();
    return this.store;
  }
  deleteAll(request2) {
    const requestUrl = new URL(request2.url);
    this.store.delete(requestUrl.origin);
  }
  clear() {
    this.store.clear();
  }
  hydrate() {
    if (!hasLocalStorageSupport) {
      return;
    }
    const persistedCookies = localStorage.getItem(PERSISTENCY_KEY);
    if (!persistedCookies) {
      return;
    }
    try {
      const parsedCookies = JSON.parse(persistedCookies);
      parsedCookies.forEach(([origin, cookies]) => {
        this.store.set(
          origin,
          new Map(
            cookies.map(([token, { expires, ...cookie }]) => [
              token,
              expires === void 0 ? cookie : { ...cookie, expires: new Date(expires) }
            ])
          )
        );
      });
    } catch (error3) {
      console.warn(`
[virtual-cookie] Failed to parse a stored cookie from the localStorage (key "${PERSISTENCY_KEY}").

Stored value:
${localStorage.getItem(PERSISTENCY_KEY)}

Thrown exception:
${error3}

Invalid value has been removed from localStorage to prevent subsequent failed parsing attempts.`);
      localStorage.removeItem(PERSISTENCY_KEY);
    }
  }
  persist() {
    if (!hasLocalStorageSupport) {
      return;
    }
    const serializedCookies = Array.from(this.store.entries()).map(
      ([origin, cookies]) => {
        return [origin, Array.from(cookies.entries())];
      }
    );
    localStorage.setItem(PERSISTENCY_KEY, JSON.stringify(serializedCookies));
  }
  deleteExpiredCookies() {
    const now = Date.now();
    this.store.forEach((originCookies, origin) => {
      originCookies.forEach(({ expires, name }) => {
        if (expires !== void 0 && expires.getTime() <= now) {
          originCookies.delete(name);
        }
      });
      if (originCookies.size === 0) {
        this.store.delete(origin);
      }
    });
  }
};
var store = new CookieStore();

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/request/getRequestCookies.mjs
function getAllDocumentCookies() {
  return source_default2.parse(document.cookie);
}
function getRequestCookies(request2) {
  if (typeof document === "undefined" || typeof location === "undefined") {
    return {};
  }
  switch (request2.credentials) {
    case "same-origin": {
      const url = new URL(request2.url);
      return location.origin === url.origin ? getAllDocumentCookies() : {};
    }
    case "include": {
      return getAllDocumentCookies();
    }
    default: {
      return {};
    }
  }
}
function getAllRequestCookies(request2) {
  var _a3;
  const requestCookiesString = request2.headers.get("cookie");
  const cookiesFromHeaders = requestCookiesString ? source_default2.parse(requestCookiesString) : {};
  store.hydrate();
  const cookiesFromStore = Array.from((_a3 = store.get(request2)) == null ? void 0 : _a3.entries()).reduce((cookies, [name, { value }]) => {
    return Object.assign(cookies, { [name.trim()]: value });
  }, {});
  const cookiesFromDocument = getRequestCookies(request2);
  const forwardedCookies = {
    ...cookiesFromDocument,
    ...cookiesFromStore
  };
  for (const [name, value] of Object.entries(forwardedCookies)) {
    request2.headers.append("cookie", source_default2.serialize(name, value));
  }
  return {
    ...forwardedCookies,
    ...cookiesFromHeaders
  };
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/handlers/HttpHandler.mjs
var HttpMethods = /* @__PURE__ */ ((HttpMethods2) => {
  HttpMethods2["HEAD"] = "HEAD";
  HttpMethods2["GET"] = "GET";
  HttpMethods2["POST"] = "POST";
  HttpMethods2["PUT"] = "PUT";
  HttpMethods2["PATCH"] = "PATCH";
  HttpMethods2["OPTIONS"] = "OPTIONS";
  HttpMethods2["DELETE"] = "DELETE";
  return HttpMethods2;
})(HttpMethods || {});
var HttpHandler = class extends RequestHandler {
  constructor(method, path, resolver, options) {
    super({
      info: {
        header: `${method} ${path}`,
        path,
        method
      },
      resolver,
      options
    });
    this.checkRedundantQueryParameters();
  }
  checkRedundantQueryParameters() {
    const { method, path } = this.info;
    if (path instanceof RegExp) {
      return;
    }
    const url = cleanUrl(path);
    if (url === path) {
      return;
    }
    const searchParams = getSearchParams(path);
    const queryParams = [];
    searchParams.forEach((_, paramName) => {
      queryParams.push(paramName);
    });
    devUtils.warn(
      `Found a redundant usage of query parameters in the request handler URL for "${method} ${path}". Please match against a path instead and access query parameters using "new URL(request.url).searchParams" instead. Learn more: https://mswjs.io/docs/recipes/query-parameters`
    );
  }
  async parse(args) {
    var _a3;
    const url = new URL(args.request.url);
    const match2 = matchRequestUrl(
      url,
      this.info.path,
      (_a3 = args.resolutionContext) == null ? void 0 : _a3.baseUrl
    );
    const cookies = getAllRequestCookies(args.request);
    return {
      match: match2,
      cookies
    };
  }
  predicate(args) {
    const hasMatchingMethod = this.matchMethod(args.request.method);
    const hasMatchingUrl = args.parsedResult.match.matches;
    return hasMatchingMethod && hasMatchingUrl;
  }
  matchMethod(actualMethod) {
    return this.info.method instanceof RegExp ? this.info.method.test(actualMethod) : isStringEqual(this.info.method, actualMethod);
  }
  extendResolverArgs(args) {
    var _a3;
    return {
      params: ((_a3 = args.parsedResult.match) == null ? void 0 : _a3.params) || {},
      cookies: args.parsedResult.cookies
    };
  }
  async log(args) {
    const publicUrl = toPublicUrl(args.request.url);
    const loggedRequest = await serializeRequest(args.request);
    const loggedResponse = await serializeResponse(args.response);
    const statusColor = getStatusCodeColor(loggedResponse.status);
    console.groupCollapsed(
      devUtils.formatMessage(
        `${getTimestamp()} ${args.request.method} ${publicUrl} (%c${loggedResponse.status} ${loggedResponse.statusText}%c)`
      ),
      `color:${statusColor}`,
      "color:inherit"
    );
    console.log("Request", loggedRequest);
    console.log("Handler:", this);
    console.log("Response", loggedResponse);
    console.groupEnd();
  }
};

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/http.mjs
function createHttpHandler(method) {
  return (path, resolver, options = {}) => {
    return new HttpHandler(method, path, resolver, options);
  };
}
var http = {
  all: createHttpHandler(/.+/),
  head: createHttpHandler(HttpMethods.HEAD),
  get: createHttpHandler(HttpMethods.GET),
  post: createHttpHandler(HttpMethods.POST),
  put: createHttpHandler(HttpMethods.PUT),
  delete: createHttpHandler(HttpMethods.DELETE),
  patch: createHttpHandler(HttpMethods.PATCH),
  options: createHttpHandler(HttpMethods.OPTIONS)
};

// ../../node_modules/.pnpm/headers-polyfill@4.0.3/node_modules/headers-polyfill/lib/index.mjs
var __create4 = Object.create;
var __defProp6 = Object.defineProperty;
var __getOwnPropDesc4 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames4 = Object.getOwnPropertyNames;
var __getProtoOf4 = Object.getPrototypeOf;
var __hasOwnProp4 = Object.prototype.hasOwnProperty;
var __commonJS4 = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames4(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps4 = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames4(from))
      if (!__hasOwnProp4.call(to, key) && key !== except)
        __defProp6(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc4(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM4 = (mod, isNodeMode, target) => (target = mod != null ? __create4(__getProtoOf4(mod)) : {}, __copyProps4(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp6(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var require_set_cookie2 = __commonJS4({
  "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
    "use strict";
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str) {
      return typeof str === "string" && !!str.trim();
    }
    function parseString(setCookieValue, options) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValuePairStr = parts.shift();
      var parsed = parseNameValuePair(nameValuePairStr);
      var name = parsed.name;
      var value = parsed.value;
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      try {
        value = options.decodeValues ? decodeURIComponent(value) : value;
      } catch (e) {
        console.error(
          "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
          e
        );
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key === "expires") {
          cookie.expires = new Date(value2);
        } else if (key === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key === "secure") {
          cookie.secure = true;
        } else if (key === "httponly") {
          cookie.httpOnly = true;
        } else if (key === "samesite") {
          cookie.sameSite = value2;
        } else {
          cookie[key] = value2;
        }
      });
      return cookie;
    }
    function parseNameValuePair(nameValuePairStr) {
      var name = "";
      var value = "";
      var nameValueArr = nameValuePairStr.split("=");
      if (nameValueArr.length > 1) {
        name = nameValueArr.shift();
        value = nameValueArr.join("=");
      } else {
        value = nameValuePairStr;
      }
      return { name, value };
    }
    function parse2(input, options) {
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!input) {
        if (!options.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers) {
        if (typeof input.headers.getSetCookie === "function") {
          input = input.headers.getSetCookie();
        } else if (input.headers["set-cookie"]) {
          input = input.headers["set-cookie"];
        } else {
          var sch = input.headers[Object.keys(input.headers).find(function(key) {
            return key.toLowerCase() === "set-cookie";
          })];
          if (!sch && input.headers.cookie && !options.silent) {
            console.warn(
              "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
            );
          }
          input = sch;
        }
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
      if (!options.map) {
        return input.filter(isNonEmptyString).map(function(str) {
          return parseString(str, options);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
          var cookie = parseString(str, options);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    function splitCookiesString2(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    module.exports = parse2;
    module.exports.parse = parse2;
    module.exports.parseString = parseString;
    module.exports.splitCookiesString = splitCookiesString2;
  }
});
var import_set_cookie_parser2 = __toESM4(require_set_cookie2());
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
  if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") {
    throw new TypeError("Invalid character in header field name");
  }
  return name.trim().toLowerCase();
}
var charCodesToRemove = [
  String.fromCharCode(10),
  String.fromCharCode(13),
  String.fromCharCode(9),
  String.fromCharCode(32)
];
var HEADER_VALUE_REMOVE_REGEXP = new RegExp(
  `(^[${charCodesToRemove.join("")}]|$[${charCodesToRemove.join("")}])`,
  "g"
);
function normalizeHeaderValue(value) {
  const nextValue = value.replace(HEADER_VALUE_REMOVE_REGEXP, "");
  return nextValue;
}
function isValidHeaderName(value) {
  if (typeof value !== "string") {
    return false;
  }
  if (value.length === 0) {
    return false;
  }
  for (let i = 0; i < value.length; i++) {
    const character = value.charCodeAt(i);
    if (character > 127 || !isToken(character)) {
      return false;
    }
  }
  return true;
}
function isToken(value) {
  return ![
    127,
    32,
    "(",
    ")",
    "<",
    ">",
    "@",
    ",",
    ";",
    ":",
    "\\",
    '"',
    "/",
    "[",
    "]",
    "?",
    "=",
    "{",
    "}"
  ].includes(value);
}
function isValidHeaderValue(value) {
  if (typeof value !== "string") {
    return false;
  }
  if (value.trim() !== value) {
    return false;
  }
  for (let i = 0; i < value.length; i++) {
    const character = value.charCodeAt(i);
    if (
      // NUL.
      character === 0 || // HTTP newline bytes.
      character === 10 || character === 13
    ) {
      return false;
    }
  }
  return true;
}
var NORMALIZED_HEADERS = Symbol("normalizedHeaders");
var RAW_HEADER_NAMES = Symbol("rawHeaderNames");
var HEADER_VALUE_DELIMITER = ", ";
var _a;
var _b;
var _c;
var Headers2 = class _Headers {
  constructor(init) {
    this[_a] = {};
    this[_b] = /* @__PURE__ */ new Map();
    this[_c] = "Headers";
    if (["Headers", "HeadersPolyfill"].includes(init == null ? void 0 : init.constructor.name) || init instanceof _Headers || typeof globalThis.Headers !== "undefined" && init instanceof globalThis.Headers) {
      const initialHeaders = init;
      initialHeaders.forEach((value, name) => {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(init)) {
      init.forEach(([name, value]) => {
        this.append(
          name,
          Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value
        );
      });
    } else if (init) {
      Object.getOwnPropertyNames(init).forEach((name) => {
        const value = init[name];
        this.append(
          name,
          Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value
        );
      });
    }
  }
  [(_a = NORMALIZED_HEADERS, _b = RAW_HEADER_NAMES, _c = Symbol.toStringTag, Symbol.iterator)]() {
    return this.entries();
  }
  *keys() {
    for (const [name] of this.entries()) {
      yield name;
    }
  }
  *values() {
    for (const [, value] of this.entries()) {
      yield value;
    }
  }
  *entries() {
    let sortedKeys = Object.keys(this[NORMALIZED_HEADERS]).sort(
      (a, b) => a.localeCompare(b)
    );
    for (const name of sortedKeys) {
      if (name === "set-cookie") {
        for (const value of this.getSetCookie()) {
          yield [name, value];
        }
      } else {
        yield [name, this.get(name)];
      }
    }
  }
  /**
   * Returns a boolean stating whether a `Headers` object contains a certain header.
   */
  has(name) {
    if (!isValidHeaderName(name)) {
      throw new TypeError(`Invalid header name "${name}"`);
    }
    return this[NORMALIZED_HEADERS].hasOwnProperty(normalizeHeaderName(name));
  }
  /**
   * Returns a `ByteString` sequence of all the values of a header with a given name.
   */
  get(name) {
    var _a3;
    if (!isValidHeaderName(name)) {
      throw TypeError(`Invalid header name "${name}"`);
    }
    return (_a3 = this[NORMALIZED_HEADERS][normalizeHeaderName(name)]) != null ? _a3 : null;
  }
  /**
   * Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
   */
  set(name, value) {
    if (!isValidHeaderName(name) || !isValidHeaderValue(value)) {
      return;
    }
    const normalizedName = normalizeHeaderName(name);
    const normalizedValue = normalizeHeaderValue(value);
    this[NORMALIZED_HEADERS][normalizedName] = normalizeHeaderValue(normalizedValue);
    this[RAW_HEADER_NAMES].set(normalizedName, name);
  }
  /**
   * Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
   */
  append(name, value) {
    if (!isValidHeaderName(name) || !isValidHeaderValue(value)) {
      return;
    }
    const normalizedName = normalizeHeaderName(name);
    const normalizedValue = normalizeHeaderValue(value);
    let resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${normalizedValue}` : normalizedValue;
    this.set(name, resolvedValue);
  }
  /**
   * Deletes a header from the `Headers` object.
   */
  delete(name) {
    if (!isValidHeaderName(name)) {
      return;
    }
    if (!this.has(name)) {
      return;
    }
    const normalizedName = normalizeHeaderName(name);
    delete this[NORMALIZED_HEADERS][normalizedName];
    this[RAW_HEADER_NAMES].delete(normalizedName);
  }
  /**
   * Traverses the `Headers` object,
   * calling the given callback for each header.
   */
  forEach(callback, thisArg) {
    for (const [name, value] of this.entries()) {
      callback.call(thisArg, value, name, this);
    }
  }
  /**
   * Returns an array containing the values
   * of all Set-Cookie headers associated
   * with a response
   */
  getSetCookie() {
    const setCookieHeader = this.get("set-cookie");
    if (setCookieHeader === null) {
      return [];
    }
    if (setCookieHeader === "") {
      return [""];
    }
    return (0, import_set_cookie_parser2.splitCookiesString)(setCookieHeader);
  }
};

// ../../node_modules/.pnpm/@open-draft+until@2.1.0/node_modules/@open-draft/until/lib/index.mjs
var until = async (promise) => {
  try {
    const data = await promise().catch((error3) => {
      throw error3;
    });
    return { error: null, data };
  } catch (error3) {
    return { error: error3, data: null };
  }
};

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/executeHandlers.mjs
var executeHandlers = async ({
  request: request2,
  requestId,
  handlers,
  resolutionContext
}) => {
  let matchingHandler = null;
  let result = null;
  for (const handler of handlers) {
    result = await handler.run({ request: request2, requestId, resolutionContext });
    if (result !== null) {
      matchingHandler = handler;
    }
    if (result == null ? void 0 : result.response) {
      break;
    }
  }
  if (matchingHandler) {
    return {
      handler: matchingHandler,
      parsedResult: result == null ? void 0 : result.parsedResult,
      response: result == null ? void 0 : result.response
    };
  }
  return null;
};

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/request/onUnhandledRequest.mjs
async function onUnhandledRequest(request2, strategy = "warn") {
  const url = new URL(request2.url);
  const publicUrl = toPublicUrl(url) + url.search;
  const unhandledRequestMessage = `intercepted a request without a matching request handler:

  \u2022 ${request2.method} ${publicUrl}

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/getting-started/mocks`;
  function applyStrategy(strategy2) {
    switch (strategy2) {
      case "error": {
        devUtils.error("Error: %s", unhandledRequestMessage);
        throw new InternalError(
          devUtils.formatMessage(
            'Cannot bypass a request when using the "error" strategy for the "onUnhandledRequest" option.'
          )
        );
      }
      case "warn": {
        devUtils.warn("Warning: %s", unhandledRequestMessage);
        break;
      }
      case "bypass":
        break;
      default:
        throw new InternalError(
          devUtils.formatMessage(
            'Failed to react to an unhandled request: unknown strategy "%s". Please provide one of the supported strategies ("bypass", "warn", "error") or a custom callback function as the value of the "onUnhandledRequest" option.',
            strategy2
          )
        );
    }
  }
  if (typeof strategy === "function") {
    strategy(request2, {
      warning: applyStrategy.bind(null, "warn"),
      error: applyStrategy.bind(null, "error")
    });
    return;
  }
  if (url.protocol === "file:") {
    return;
  }
  applyStrategy(strategy);
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/request/readResponseCookies.mjs
function readResponseCookies(request2, response) {
  store.add({ ...request2, url: request2.url.toString() }, response);
  store.persist();
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/handleRequest.mjs
async function handleRequest(request2, requestId, handlers, options, emitter, handleRequestOptions) {
  var _a3, _b2, _c2, _d, _e, _f;
  emitter.emit("request:start", { request: request2, requestId });
  if (request2.headers.get("x-msw-intention") === "bypass") {
    emitter.emit("request:end", { request: request2, requestId });
    (_a3 = handleRequestOptions == null ? void 0 : handleRequestOptions.onPassthroughResponse) == null ? void 0 : _a3.call(handleRequestOptions, request2);
    return;
  }
  const lookupResult = await until(() => {
    return executeHandlers({
      request: request2,
      requestId,
      handlers,
      resolutionContext: handleRequestOptions == null ? void 0 : handleRequestOptions.resolutionContext
    });
  });
  if (lookupResult.error) {
    emitter.emit("unhandledException", {
      error: lookupResult.error,
      request: request2,
      requestId
    });
    throw lookupResult.error;
  }
  if (!lookupResult.data) {
    await onUnhandledRequest(request2, options.onUnhandledRequest);
    emitter.emit("request:unhandled", { request: request2, requestId });
    emitter.emit("request:end", { request: request2, requestId });
    (_b2 = handleRequestOptions == null ? void 0 : handleRequestOptions.onPassthroughResponse) == null ? void 0 : _b2.call(handleRequestOptions, request2);
    return;
  }
  const { response } = lookupResult.data;
  if (!response) {
    emitter.emit("request:end", { request: request2, requestId });
    (_c2 = handleRequestOptions == null ? void 0 : handleRequestOptions.onPassthroughResponse) == null ? void 0 : _c2.call(handleRequestOptions, request2);
    return;
  }
  if (response.status === 302 && response.headers.get("x-msw-intention") === "passthrough") {
    emitter.emit("request:end", { request: request2, requestId });
    (_d = handleRequestOptions == null ? void 0 : handleRequestOptions.onPassthroughResponse) == null ? void 0 : _d.call(handleRequestOptions, request2);
    return;
  }
  readResponseCookies(request2, response);
  emitter.emit("request:match", { request: request2, requestId });
  const requiredLookupResult = lookupResult.data;
  const transformedResponse = ((_e = handleRequestOptions == null ? void 0 : handleRequestOptions.transformResponse) == null ? void 0 : _e.call(handleRequestOptions, response)) || response;
  (_f = handleRequestOptions == null ? void 0 : handleRequestOptions.onMockedResponse) == null ? void 0 : _f.call(
    handleRequestOptions,
    transformedResponse,
    requiredLookupResult
  );
  emitter.emit("request:end", { request: request2, requestId });
  return transformedResponse;
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/HttpResponse/decorators.mjs
var { message: message2 } = source_default;
function normalizeResponseInit(init = {}) {
  const status = (init == null ? void 0 : init.status) || 200;
  const statusText = (init == null ? void 0 : init.statusText) || message2[status] || "";
  const headers = new Headers(init == null ? void 0 : init.headers);
  return {
    ...init,
    headers,
    status,
    statusText
  };
}
function decorateResponse(response, init) {
  if (init.type) {
    Object.defineProperty(response, "type", {
      value: init.type,
      enumerable: true,
      writable: false
    });
  }
  if (typeof document !== "undefined") {
    const responseCookies = Headers2.prototype.getSetCookie.call(
      init.headers
    );
    for (const cookieString of responseCookies) {
      document.cookie = cookieString;
    }
  }
  return response;
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/HttpResponse.mjs
var HttpResponse = class _HttpResponse extends Response {
  constructor(body, init) {
    const responseInit = normalizeResponseInit(init);
    super(body, responseInit);
    decorateResponse(this, responseInit);
  }
  /**
   * Create a `Response` with a `Content-Type: "text/plain"` body.
   * @example
   * HttpResponse.text('hello world')
   * HttpResponse.text('Error', { status: 500 })
   */
  static text(body, init) {
    const responseInit = normalizeResponseInit(init);
    if (!responseInit.headers.has("Content-Type")) {
      responseInit.headers.set("Content-Type", "text/plain");
    }
    if (!responseInit.headers.has("Content-Length")) {
      responseInit.headers.set(
        "Content-Length",
        body ? new Blob([body]).size.toString() : "0"
      );
    }
    return new _HttpResponse(body, responseInit);
  }
  /**
   * Create a `Response` with a `Content-Type: "application/json"` body.
   * @example
   * HttpResponse.json({ firstName: 'John' })
   * HttpResponse.json({ error: 'Not Authorized' }, { status: 401 })
   */
  static json(body, init) {
    const responseInit = normalizeResponseInit(init);
    if (!responseInit.headers.has("Content-Type")) {
      responseInit.headers.set("Content-Type", "application/json");
    }
    const responseText = JSON.stringify(body);
    if (!responseInit.headers.has("Content-Length")) {
      responseInit.headers.set(
        "Content-Length",
        responseText ? new Blob([responseText]).size.toString() : "0"
      );
    }
    return new _HttpResponse(
      responseText,
      responseInit
    );
  }
  /**
   * Create a `Response` with a `Content-Type: "application/xml"` body.
   * @example
   * HttpResponse.xml(`<user name="John" />`)
   * HttpResponse.xml(`<article id="abc-123" />`, { status: 201 })
   */
  static xml(body, init) {
    const responseInit = normalizeResponseInit(init);
    if (!responseInit.headers.has("Content-Type")) {
      responseInit.headers.set("Content-Type", "text/xml");
    }
    return new _HttpResponse(body, responseInit);
  }
  /**
   * Create a `Response` with an `ArrayBuffer` body.
   * @example
   * const buffer = new ArrayBuffer(3)
   * const view = new Uint8Array(buffer)
   * view.set([1, 2, 3])
   *
   * HttpResponse.arrayBuffer(buffer)
   */
  static arrayBuffer(body, init) {
    const responseInit = normalizeResponseInit(init);
    if (body) {
      responseInit.headers.set("Content-Length", body.byteLength.toString());
    }
    return new _HttpResponse(body, responseInit);
  }
  /**
   * Create a `Response` with a `FormData` body.
   * @example
   * const data = new FormData()
   * data.set('name', 'Alice')
   *
   * HttpResponse.formData(data)
   */
  static formData(body, init) {
    return new _HttpResponse(body, normalizeResponseInit(init));
  }
};

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/index.mjs
checkGlobals();

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/node/index.mjs
import { AsyncLocalStorage } from "async_hooks";

// ../../node_modules/.pnpm/@open-draft+deferred-promise@2.2.0/node_modules/@open-draft/deferred-promise/build/index.mjs
function createDeferredExecutor() {
  const executor = (resolve, reject) => {
    executor.state = "pending";
    executor.resolve = (data) => {
      if (executor.state !== "pending") {
        return;
      }
      executor.result = data;
      const onFulfilled = (value) => {
        executor.state = "fulfilled";
        return value;
      };
      return resolve(
        data instanceof Promise ? data : Promise.resolve(data).then(onFulfilled)
      );
    };
    executor.reject = (reason) => {
      if (executor.state !== "pending") {
        return;
      }
      queueMicrotask(() => {
        executor.state = "rejected";
      });
      return reject(executor.rejectionReason = reason);
    };
  };
  return executor;
}
var _executor, _decorate, decorate_fn, _a2;
var DeferredPromise = (_a2 = class extends Promise {
  constructor(executor = null) {
    const deferredExecutor = createDeferredExecutor();
    super((originalResolve, originalReject) => {
      deferredExecutor(originalResolve, originalReject);
      executor == null ? void 0 : executor(deferredExecutor.resolve, deferredExecutor.reject);
    });
    __privateAdd(this, _decorate);
    __privateAdd(this, _executor, void 0);
    __publicField(this, "resolve");
    __publicField(this, "reject");
    __privateSet(this, _executor, deferredExecutor);
    this.resolve = __privateGet(this, _executor).resolve;
    this.reject = __privateGet(this, _executor).reject;
  }
  get state() {
    return __privateGet(this, _executor).state;
  }
  get rejectionReason() {
    return __privateGet(this, _executor).rejectionReason;
  }
  then(onFulfilled, onRejected) {
    return __privateMethod(this, _decorate, decorate_fn).call(this, super.then(onFulfilled, onRejected));
  }
  catch(onRejected) {
    return __privateMethod(this, _decorate, decorate_fn).call(this, super.catch(onRejected));
  }
  finally(onfinally) {
    return __privateMethod(this, _decorate, decorate_fn).call(this, super.finally(onfinally));
  }
}, _executor = new WeakMap(), _decorate = new WeakSet(), decorate_fn = function(promise) {
  return Object.defineProperties(promise, {
    resolve: { configurable: true, value: this.resolve },
    reject: { configurable: true, value: this.reject }
  });
}, _a2);

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/chunk-OUWBQF3Z.mjs
var RequestController = class {
  constructor(request2) {
    this.request = request2;
    this.responsePromise = new DeferredPromise();
  }
  respondWith(response) {
    invariant2(
      this.responsePromise.state === "pending",
      'Failed to respond to "%s %s" request: the "request" event has already been responded to.',
      this.request.method,
      this.request.url
    );
    this.responsePromise.resolve(response);
  }
};
function toInteractiveRequest(request2) {
  const requestController = new RequestController(request2);
  Reflect.set(
    request2,
    "respondWith",
    requestController.respondWith.bind(requestController)
  );
  return {
    interactiveRequest: request2,
    requestController
  };
}
async function emitAsync(emitter, eventName, ...data) {
  const listners = emitter.listeners(eventName);
  if (listners.length === 0) {
    return;
  }
  for (const listener of listners) {
    await listener.apply(emitter, data);
  }
}

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/chunk-CVV3L375.mjs
import http2 from "http";
import https from "https";
import { ClientRequest, IncomingMessage as IncomingMessage2, STATUS_CODES } from "http";
import { IncomingMessage } from "http";
import { PassThrough } from "stream";
import {
  Agent as HttpAgent,
  globalAgent as httpGlobalAgent
} from "http";
import {
  Agent as HttpsAgent,
  globalAgent as httpsGlobalAgent
} from "https";
import { parse as parseUrl } from "url";
import { Agent } from "http";
var logger = new Logger("utils getUrlByRequestOptions");
function normalizeClientRequestEndArgs(...args) {
  logger.info("arguments", args);
  const normalizedArgs = new Array(3).fill(null).map((value, index) => args[index] || value);
  normalizedArgs.sort((a, b) => {
    if (typeof a === "function") {
      return 1;
    }
    if (typeof b === "function") {
      return -1;
    }
    if (typeof a === "string" && typeof b === "string") {
      return normalizedArgs.indexOf(a) - normalizedArgs.indexOf(b);
    }
    return 0;
  });
  logger.info("normalized args", normalizedArgs);
  return normalizedArgs;
}
var logger2 = new Logger("http normalizeWriteArgs");
function normalizeClientRequestWriteArgs(args) {
  logger2.info("normalizing ClientRequest.write arguments...", args);
  const chunk = args[0];
  const encoding = typeof args[1] === "string" ? args[1] : void 0;
  const callback = typeof args[1] === "function" ? args[1] : args[2];
  const writeArgs = [
    chunk,
    encoding,
    callback
  ];
  logger2.info(
    "successfully normalized ClientRequest.write arguments:",
    writeArgs
  );
  return writeArgs;
}
var IS_CLONE = Symbol("isClone");
function cloneIncomingMessage(message3) {
  const clone = message3.pipe(new PassThrough());
  inheritProperties(message3, clone);
  const clonedPrototype = Object.create(IncomingMessage.prototype);
  getPrototypes(clone).forEach((prototype) => {
    inheritProperties(prototype, clonedPrototype);
  });
  Object.setPrototypeOf(clone, clonedPrototype);
  Object.defineProperty(clone, IS_CLONE, {
    enumerable: true,
    value: true
  });
  return clone;
}
function getPrototypes(source) {
  const prototypes = [];
  let current = source;
  while (current = Object.getPrototypeOf(current)) {
    prototypes.push(current);
  }
  return prototypes;
}
function inheritProperties(source, target) {
  const properties = [
    ...Object.getOwnPropertyNames(source),
    ...Object.getOwnPropertySymbols(source)
  ];
  for (const property of properties) {
    if (target.hasOwnProperty(property)) {
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(source, property);
    if (!descriptor) {
      continue;
    }
    Object.defineProperty(target, property, descriptor);
  }
}
function createResponse(message3) {
  const responseBodyOrNull = isResponseWithoutBody(message3.statusCode || 200) ? null : new ReadableStream({
    start(controller) {
      message3.on("data", (chunk) => controller.enqueue(chunk));
      message3.on("end", () => controller.close());
    }
  });
  return new Response(responseBodyOrNull, {
    status: message3.statusCode,
    statusText: message3.statusMessage,
    headers: createHeadersFromIncomingHttpHeaders(message3.headers)
  });
}
function createHeadersFromIncomingHttpHeaders(httpHeaders) {
  const headers = new Headers();
  for (const headerName in httpHeaders) {
    const headerValues = httpHeaders[headerName];
    if (typeof headerValues === "undefined") {
      continue;
    }
    if (Array.isArray(headerValues)) {
      headerValues.forEach((headerValue) => {
        headers.append(headerName, headerValue);
      });
      continue;
    }
    headers.set(headerName, headerValues);
  }
  return headers;
}
function createRequest(clientRequest) {
  const headers = new Headers();
  const outgoingHeaders = clientRequest.getHeaders();
  for (const headerName in outgoingHeaders) {
    const headerValue = outgoingHeaders[headerName];
    if (typeof headerValue === "undefined") {
      continue;
    }
    const valuesList = Array.prototype.concat([], headerValue);
    for (const value of valuesList) {
      headers.append(headerName, value.toString());
    }
  }
  if (clientRequest.url.username || clientRequest.url.password) {
    const username = decodeURIComponent(clientRequest.url.username || "");
    const password = decodeURIComponent(clientRequest.url.password || "");
    const auth = `${username}:${password}`;
    headers.set("Authorization", `Basic ${btoa(auth)}`);
    clientRequest.url.username = "";
    clientRequest.url.password = "";
  }
  const method = clientRequest.method || "GET";
  return new Request(clientRequest.url, {
    method,
    headers,
    credentials: "same-origin",
    body: method === "HEAD" || method === "GET" ? null : clientRequest.requestBuffer
  });
}
function getValueBySymbol(symbolName, source) {
  const ownSymbols = Object.getOwnPropertySymbols(source);
  const symbol = ownSymbols.find((symbol2) => {
    return symbol2.description === symbolName;
  });
  if (symbol) {
    return Reflect.get(source, symbol);
  }
  return;
}
function isObject(value, loose = false) {
  return loose ? Object.prototype.toString.call(value).startsWith("[object ") : Object.prototype.toString.call(value) === "[object Object]";
}
function getRawFetchHeaders(headers) {
  const headersList = getValueBySymbol("headers list", headers);
  if (!headersList) {
    return;
  }
  const headersMap = getValueBySymbol("headers map", headersList);
  if (!headersMap || !isHeadersMapWithRawHeaderNames(headersMap)) {
    return;
  }
  const rawHeaders = /* @__PURE__ */ new Map();
  headersMap.forEach(({ name, value }) => {
    rawHeaders.set(name, value);
  });
  return rawHeaders;
}
function isHeadersMapWithRawHeaderNames(headersMap) {
  return Array.from(
    headersMap.values()
  ).every((value) => {
    return isObject(value) && "name" in value;
  });
}
function isNodeLikeError(error3) {
  if (error3 == null) {
    return false;
  }
  if (!(error3 instanceof Error)) {
    return false;
  }
  return "code" in error3 && "errno" in error3;
}
var _NodeClientRequest = class extends ClientRequest {
  constructor([url, requestOptions, callback], options) {
    super(requestOptions, callback);
    this.chunks = [];
    this.logger = options.logger.extend(
      `request ${requestOptions.method} ${url.href}`
    );
    this.logger.info("constructing ClientRequest using options:", {
      url,
      requestOptions,
      callback
    });
    this.state = 0;
    this.url = url;
    this.emitter = options.emitter;
    this.requestBuffer = null;
    this.response = new IncomingMessage2(this.socket);
  }
  writeRequestBodyChunk(chunk, encoding) {
    if (chunk == null) {
      return;
    }
    if (this.requestBuffer == null) {
      this.requestBuffer = Buffer.from([]);
    }
    const resolvedChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding);
    this.requestBuffer = Buffer.concat([this.requestBuffer, resolvedChunk]);
  }
  write(...args) {
    var _a3;
    const [chunk, encoding, callback] = normalizeClientRequestWriteArgs(args);
    this.logger.info("write:", { chunk, encoding, callback });
    this.chunks.push({ chunk, encoding });
    this.writeRequestBodyChunk(chunk, encoding);
    this.logger.info(
      "chunk successfully stored!",
      (_a3 = this.requestBuffer) == null ? void 0 : _a3.byteLength
    );
    if (!chunk || chunk.length === 0) {
      this.logger.info("written chunk is empty, skipping callback...");
    } else {
      callback == null ? void 0 : callback();
    }
    return true;
  }
  end(...args) {
    this.logger.info("end", args);
    const requestId = createRequestId();
    const [chunk, encoding, callback] = normalizeClientRequestEndArgs(...args);
    this.logger.info("normalized arguments:", { chunk, encoding, callback });
    this.writeRequestBodyChunk(chunk, encoding || void 0);
    this.state = 2;
    const capturedRequest = createRequest(this);
    const { interactiveRequest, requestController } = toInteractiveRequest(capturedRequest);
    Object.defineProperty(capturedRequest, "respondWith", {
      value: requestController.respondWith.bind(requestController)
    });
    if (this.hasHeader(INTERNAL_REQUEST_ID_HEADER_NAME)) {
      this.removeHeader(INTERNAL_REQUEST_ID_HEADER_NAME);
      return this.passthrough(chunk, encoding, callback);
    }
    this.emitter.once("request", ({ requestId: pendingRequestId }) => {
      if (pendingRequestId !== requestId) {
        return;
      }
      if (requestController.responsePromise.state === "pending") {
        this.logger.info(
          "request has not been handled in listeners, executing fail-safe listener..."
        );
        requestController.responsePromise.resolve(void 0);
      }
    });
    until(async () => {
      this.logger.info(
        'emitting the "request" event for %d listener(s)...',
        this.emitter.listenerCount("request")
      );
      this.state = 3;
      await emitAsync(this.emitter, "request", {
        request: interactiveRequest,
        requestId
      });
      this.logger.info('all "request" listeners done!');
      const mockedResponse = await requestController.responsePromise;
      this.logger.info("event.respondWith called with:", mockedResponse);
      return mockedResponse;
    }).then((resolverResult) => {
      this.logger.info("the listeners promise awaited!");
      this.state = 4;
      if (!this.headersSent) {
        for (const [headerName, headerValue] of capturedRequest.headers) {
          this.setHeader(headerName, headerValue);
        }
      }
      if (resolverResult.error) {
        this.logger.info(
          "unhandled resolver exception, coercing to an error response...",
          resolverResult.error
        );
        if (resolverResult.error instanceof Response) {
          if (isResponseError(resolverResult.error)) {
            this.logger.info(
              "received network error response, erroring request..."
            );
            this.errorWith(new TypeError("Network error"));
          } else {
            this.respondWith(resolverResult.error);
          }
          return;
        }
        if (isNodeLikeError(resolverResult.error)) {
          this.errorWith(resolverResult.error);
          return this;
        }
        until(async () => {
          if (this.emitter.listenerCount("unhandledException") > 0) {
            await emitAsync(this.emitter, "unhandledException", {
              error: resolverResult.error,
              request: capturedRequest,
              requestId,
              controller: {
                respondWith: this.respondWith.bind(this),
                errorWith: this.errorWith.bind(this)
              }
            });
            if (this.writableEnded || this.destroyed) {
              return;
            }
          }
          this.respondWith(createServerErrorResponse(resolverResult.error));
        });
        return this;
      }
      const mockedResponse = resolverResult.data;
      if (mockedResponse) {
        this.logger.info(
          "received mocked response:",
          mockedResponse.status,
          mockedResponse.statusText
        );
        this.destroyed = false;
        if (isResponseError(mockedResponse)) {
          this.logger.info(
            "received network error response, erroring request..."
          );
          this.errorWith(new TypeError("Network error"));
          return this;
        }
        const responseClone = mockedResponse.clone();
        this.respondWith(mockedResponse);
        this.logger.info(
          mockedResponse.status,
          mockedResponse.statusText,
          "(MOCKED)"
        );
        callback == null ? void 0 : callback();
        this.logger.info('emitting the custom "response" event...');
        this.emitter.emit("response", {
          response: responseClone,
          isMockedResponse: true,
          request: capturedRequest,
          requestId
        });
        this.logger.info("request (mock) is completed");
        return this;
      }
      this.logger.info("no mocked response received!");
      this.once("response-internal", (message3) => {
        this.logger.info(message3.statusCode, message3.statusMessage);
        this.logger.info("original response headers:", message3.headers);
        this.logger.info('emitting the custom "response" event...');
        this.emitter.emit("response", {
          response: createResponse(message3),
          isMockedResponse: false,
          request: capturedRequest,
          requestId
        });
      });
      return this.passthrough(chunk, encoding, callback);
    });
    return this;
  }
  emit(event, ...data) {
    this.logger.info("emit: %s", event);
    if (event === "response") {
      this.logger.info('found "response" event, cloning the response...');
      try {
        const response = data[0];
        const firstClone = cloneIncomingMessage(response);
        const secondClone = cloneIncomingMessage(response);
        this.emit("response-internal", secondClone);
        this.logger.info(
          'response successfully cloned, emitting "response" event...'
        );
        return super.emit(event, firstClone, ...data.slice(1));
      } catch (error3) {
        this.logger.info("error when cloning response:", error3);
        return super.emit(event, ...data);
      }
    }
    if (event === "error") {
      const error3 = data[0];
      const errorCode = error3.code || "";
      this.logger.info("error:\n", error3);
      if (_NodeClientRequest.suppressErrorCodes.includes(errorCode)) {
        if (this.state < 4) {
          if (!this.capturedError) {
            this.capturedError = error3;
            this.logger.info("captured the first error:", this.capturedError);
          }
          return false;
        }
        if (this.state === 5 && this.responseType === "mock") {
          return false;
        }
      }
    }
    return super.emit(event, ...data);
  }
  /**
   * Performs the intercepted request as-is.
   * Replays the captured request body chunks,
   * still emits the internal events, and wraps
   * up the request with `super.end()`.
   */
  passthrough(chunk, encoding, callback) {
    this.state = 5;
    this.responseType = "passthrough";
    if (this.capturedError) {
      this.emit("error", this.capturedError);
      return this;
    }
    this.logger.info("writing request chunks...", this.chunks);
    for (const { chunk: chunk2, encoding: encoding2 } of this.chunks) {
      if (encoding2) {
        super.write(chunk2, encoding2);
      } else {
        super.write(chunk2);
      }
    }
    this.once("error", (error3) => {
      this.logger.info("original request error:", error3);
    });
    this.once("abort", () => {
      this.logger.info("original request aborted!");
    });
    this.once("response-internal", (message3) => {
      this.logger.info(message3.statusCode, message3.statusMessage);
      this.logger.info("original response headers:", message3.headers);
    });
    this.logger.info("performing original request...");
    return super.end(...[chunk, encoding, callback].filter(Boolean));
  }
  /**
   * Responds to this request instance using a mocked response.
   */
  respondWith(mockedResponse) {
    this.logger.info("responding with a mocked response...", mockedResponse);
    this.state = 5;
    this.responseType = "mock";
    Object.defineProperties(this, {
      writableFinished: { value: true },
      writableEnded: { value: true }
    });
    this.emit("finish");
    const { status, statusText, headers, body } = mockedResponse;
    this.response.statusCode = status;
    this.response.statusMessage = statusText || STATUS_CODES[status];
    const rawHeaders = getRawFetchHeaders(headers) || headers;
    if (rawHeaders) {
      this.response.headers = {};
      rawHeaders.forEach((headerValue, headerName) => {
        this.response.rawHeaders.push(headerName, headerValue);
        const insensitiveHeaderName = headerName.toLowerCase();
        const prevHeaders = this.response.headers[insensitiveHeaderName];
        this.response.headers[insensitiveHeaderName] = prevHeaders ? Array.prototype.concat([], prevHeaders, headerValue) : headerValue;
      });
    }
    this.logger.info("mocked response headers ready:", headers);
    this.res = this.response;
    this.emit("response", this.response);
    const isResponseStreamFinished = new DeferredPromise();
    const finishResponseStream = () => {
      this.logger.info("finished response stream!");
      this.response.push(null);
      this.response.complete = true;
      isResponseStreamFinished.resolve();
    };
    if (body) {
      const bodyReader = body.getReader();
      const readNextChunk = async () => {
        const { done, value } = await bodyReader.read();
        if (done) {
          finishResponseStream();
          return;
        }
        this.response.emit("data", value);
        return readNextChunk();
      };
      readNextChunk();
    } else {
      finishResponseStream();
    }
    isResponseStreamFinished.then(() => {
      this.logger.info("finalizing response...");
      this.response.emit("end");
      this.terminate();
      this.logger.info("request complete!");
    });
  }
  errorWith(error3) {
    this.destroyed = true;
    this.emit("error", error3);
    this.terminate();
  }
  /**
   * Terminates a pending request.
   */
  terminate() {
    var _a3;
    (_a3 = this.agent) == null ? void 0 : _a3.destroy();
  }
};
var NodeClientRequest = _NodeClientRequest;
NodeClientRequest.suppressErrorCodes = [
  "ENOTFOUND",
  "ECONNREFUSED",
  "ECONNRESET",
  "EAI_AGAIN",
  "ENETUNREACH",
  "EHOSTUNREACH"
];
function getRequestOptionsByUrl(url) {
  const options = {
    method: "GET",
    protocol: url.protocol,
    hostname: typeof url.hostname === "string" && url.hostname.startsWith("[") ? url.hostname.slice(1, -1) : url.hostname,
    host: url.host,
    path: `${url.pathname}${url.search || ""}`
  };
  if (!!url.port) {
    options.port = Number(url.port);
  }
  if (url.username || url.password) {
    options.auth = `${url.username}:${url.password}`;
  }
  return options;
}
var logger3 = new Logger("utils getUrlByRequestOptions");
var DEFAULT_PATH = "/";
var DEFAULT_PROTOCOL = "http:";
var DEFAULT_HOSTNAME = "localhost";
var SSL_PORT = 443;
function getAgent(options) {
  return options.agent instanceof Agent ? options.agent : void 0;
}
function getProtocolByRequestOptions(options) {
  var _a3;
  if (options.protocol) {
    return options.protocol;
  }
  const agent = getAgent(options);
  const agentProtocol = agent == null ? void 0 : agent.protocol;
  if (agentProtocol) {
    return agentProtocol;
  }
  const port = getPortByRequestOptions(options);
  const isSecureRequest = options.cert || port === SSL_PORT;
  return isSecureRequest ? "https:" : ((_a3 = options.uri) == null ? void 0 : _a3.protocol) || DEFAULT_PROTOCOL;
}
function getPortByRequestOptions(options) {
  if (options.port) {
    return Number(options.port);
  }
  const agent = getAgent(options);
  if (agent == null ? void 0 : agent.options.port) {
    return Number(agent.options.port);
  }
  if (agent == null ? void 0 : agent.defaultPort) {
    return Number(agent.defaultPort);
  }
  return void 0;
}
function getAuthByRequestOptions(options) {
  if (options.auth) {
    const [username, password] = options.auth.split(":");
    return { username, password };
  }
}
function isRawIPv6Address(host) {
  return host.includes(":") && !host.startsWith("[") && !host.endsWith("]");
}
function getHostname(options) {
  let host = options.hostname || options.host;
  if (host) {
    if (isRawIPv6Address(host)) {
      host = `[${host}]`;
    }
    return new URL(`http://${host}`).hostname;
  }
  return DEFAULT_HOSTNAME;
}
function getUrlByRequestOptions(options) {
  logger3.info("request options", options);
  if (options.uri) {
    logger3.info(
      'constructing url from explicitly provided "options.uri": %s',
      options.uri
    );
    return new URL(options.uri.href);
  }
  logger3.info("figuring out url from request options...");
  const protocol = getProtocolByRequestOptions(options);
  logger3.info("protocol", protocol);
  const port = getPortByRequestOptions(options);
  logger3.info("port", port);
  const hostname = getHostname(options);
  logger3.info("hostname", hostname);
  const path = options.path || DEFAULT_PATH;
  logger3.info("path", path);
  const credentials = getAuthByRequestOptions(options);
  logger3.info("credentials", credentials);
  const authString = credentials ? `${credentials.username}:${credentials.password}@` : "";
  logger3.info("auth string:", authString);
  const portString = typeof port !== "undefined" ? `:${port}` : "";
  const url = new URL(`${protocol}//${hostname}${portString}${path}`);
  url.username = (credentials == null ? void 0 : credentials.username) || "";
  url.password = (credentials == null ? void 0 : credentials.password) || "";
  logger3.info("created url:", url);
  return url;
}
var logger4 = new Logger("cloneObject");
function isPlainObject(obj) {
  var _a3;
  logger4.info("is plain object?", obj);
  if (obj == null || !((_a3 = obj.constructor) == null ? void 0 : _a3.name)) {
    logger4.info("given object is undefined, not a plain object...");
    return false;
  }
  logger4.info("checking the object constructor:", obj.constructor.name);
  return obj.constructor.name === "Object";
}
function cloneObject(obj) {
  logger4.info("cloning object:", obj);
  const enumerableProperties = Object.entries(obj).reduce(
    (acc, [key, value]) => {
      logger4.info("analyzing key-value pair:", key, value);
      acc[key] = isPlainObject(value) ? cloneObject(value) : value;
      return acc;
    },
    {}
  );
  return isPlainObject(obj) ? enumerableProperties : Object.assign(Object.getPrototypeOf(obj), enumerableProperties);
}
var logger5 = new Logger("http normalizeClientRequestArgs");
function resolveRequestOptions(args, url) {
  if (typeof args[1] === "undefined" || typeof args[1] === "function") {
    logger5.info("request options not provided, deriving from the url", url);
    return getRequestOptionsByUrl(url);
  }
  if (args[1]) {
    logger5.info("has custom RequestOptions!", args[1]);
    const requestOptionsFromUrl = getRequestOptionsByUrl(url);
    logger5.info("derived RequestOptions from the URL:", requestOptionsFromUrl);
    logger5.info("cloning RequestOptions...");
    const clonedRequestOptions = cloneObject(args[1]);
    logger5.info("successfully cloned RequestOptions!", clonedRequestOptions);
    return {
      ...requestOptionsFromUrl,
      ...clonedRequestOptions
    };
  }
  logger5.info("using an empty object as request options");
  return {};
}
function overrideUrlByRequestOptions(url, options) {
  url.host = options.host || url.host;
  url.hostname = options.hostname || url.hostname;
  url.port = options.port ? options.port.toString() : url.port;
  if (options.path) {
    const parsedOptionsPath = parseUrl(options.path, false);
    url.pathname = parsedOptionsPath.pathname || "";
    url.search = parsedOptionsPath.search || "";
  }
  return url;
}
function resolveCallback(args) {
  return typeof args[1] === "function" ? args[1] : args[2];
}
function normalizeClientRequestArgs(defaultProtocol, ...args) {
  let url;
  let options;
  let callback;
  logger5.info("arguments", args);
  logger5.info("using default protocol:", defaultProtocol);
  if (args.length === 0) {
    const url2 = new URL("http://localhost");
    const options2 = resolveRequestOptions(args, url2);
    return [url2, options2];
  }
  if (typeof args[0] === "string") {
    logger5.info("first argument is a location string:", args[0]);
    url = new URL(args[0]);
    logger5.info("created a url:", url);
    const requestOptionsFromUrl = getRequestOptionsByUrl(url);
    logger5.info("request options from url:", requestOptionsFromUrl);
    options = resolveRequestOptions(args, url);
    logger5.info("resolved request options:", options);
    callback = resolveCallback(args);
  } else if (args[0] instanceof URL) {
    url = args[0];
    logger5.info("first argument is a URL:", url);
    if (typeof args[1] !== "undefined" && isObject(args[1])) {
      url = overrideUrlByRequestOptions(url, args[1]);
    }
    options = resolveRequestOptions(args, url);
    logger5.info("derived request options:", options);
    callback = resolveCallback(args);
  } else if ("hash" in args[0] && !("method" in args[0])) {
    const [legacyUrl] = args;
    logger5.info("first argument is a legacy URL:", legacyUrl);
    if (legacyUrl.hostname === null) {
      logger5.info("given legacy URL is relative (no hostname)");
      return isObject(args[1]) ? normalizeClientRequestArgs(
        defaultProtocol,
        { path: legacyUrl.path, ...args[1] },
        args[2]
      ) : normalizeClientRequestArgs(
        defaultProtocol,
        { path: legacyUrl.path },
        args[1]
      );
    }
    logger5.info("given legacy url is absolute");
    const resolvedUrl = new URL(legacyUrl.href);
    return args[1] === void 0 ? normalizeClientRequestArgs(defaultProtocol, resolvedUrl) : typeof args[1] === "function" ? normalizeClientRequestArgs(defaultProtocol, resolvedUrl, args[1]) : normalizeClientRequestArgs(
      defaultProtocol,
      resolvedUrl,
      args[1],
      args[2]
    );
  } else if (isObject(args[0])) {
    options = args[0];
    logger5.info("first argument is RequestOptions:", options);
    options.protocol = options.protocol || defaultProtocol;
    logger5.info("normalized request options:", options);
    url = getUrlByRequestOptions(options);
    logger5.info("created a URL from RequestOptions:", url.href);
    callback = resolveCallback(args);
  } else {
    throw new Error(
      `Failed to construct ClientRequest with these parameters: ${args}`
    );
  }
  options.protocol = options.protocol || url.protocol;
  options.method = options.method || "GET";
  if (typeof options.agent === "undefined") {
    const agent = options.protocol === "https:" ? new HttpsAgent({
      rejectUnauthorized: options.rejectUnauthorized
    }) : new HttpAgent();
    options.agent = agent;
    logger5.info("resolved fallback agent:", agent);
  }
  if (!options._defaultAgent) {
    logger5.info(
      'has no default agent, setting the default agent for "%s"',
      options.protocol
    );
    options._defaultAgent = options.protocol === "https:" ? httpsGlobalAgent : httpGlobalAgent;
  }
  logger5.info("successfully resolved url:", url.href);
  logger5.info("successfully resolved options:", options);
  logger5.info("successfully resolved callback:", callback);
  return [url, options, callback];
}
function get(protocol, options) {
  return function interceptorsHttpGet(...args) {
    const clientRequestArgs = normalizeClientRequestArgs(
      `${protocol}:`,
      ...args
    );
    const request2 = new NodeClientRequest(clientRequestArgs, options);
    request2.end();
    return request2;
  };
}
var logger6 = new Logger("http request");
function request(protocol, options) {
  return function interceptorsHttpRequest(...args) {
    logger6.info('request call (protocol "%s"):', protocol, args);
    const clientRequestArgs = normalizeClientRequestArgs(
      `${protocol}:`,
      ...args
    );
    return new NodeClientRequest(clientRequestArgs, options);
  };
}
var _ClientRequestInterceptor = class extends Interceptor {
  constructor() {
    super(_ClientRequestInterceptor.interceptorSymbol);
    this.modules = /* @__PURE__ */ new Map();
    this.modules.set("http", http2);
    this.modules.set("https", https);
  }
  setup() {
    const logger7 = this.logger.extend("setup");
    for (const [protocol, requestModule] of this.modules) {
      const { request: pureRequest, get: pureGet } = requestModule;
      this.subscriptions.push(() => {
        requestModule.request = pureRequest;
        requestModule.get = pureGet;
        logger7.info('native "%s" module restored!', protocol);
      });
      const options = {
        emitter: this.emitter,
        logger: this.logger
      };
      requestModule.request = // Force a line break.
      request(protocol, options);
      requestModule.get = // Force a line break.
      get(protocol, options);
      logger7.info('native "%s" module patched!', protocol);
    }
  }
};
var ClientRequestInterceptor = _ClientRequestInterceptor;
ClientRequestInterceptor.interceptorSymbol = Symbol("http");

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/chunk-KSHIDGUL.mjs
function concatArrayBuffer(left, right) {
  const result = new Uint8Array(left.byteLength + right.byteLength);
  result.set(left, 0);
  result.set(right, left.byteLength);
  return result;
}
var EventPolyfill = class {
  constructor(type, options) {
    this.AT_TARGET = 0;
    this.BUBBLING_PHASE = 0;
    this.CAPTURING_PHASE = 0;
    this.NONE = 0;
    this.type = "";
    this.srcElement = null;
    this.currentTarget = null;
    this.eventPhase = 0;
    this.isTrusted = true;
    this.composed = false;
    this.cancelable = true;
    this.defaultPrevented = false;
    this.bubbles = true;
    this.lengthComputable = true;
    this.loaded = 0;
    this.total = 0;
    this.cancelBubble = false;
    this.returnValue = true;
    this.type = type;
    this.target = (options == null ? void 0 : options.target) || null;
    this.currentTarget = (options == null ? void 0 : options.currentTarget) || null;
    this.timeStamp = Date.now();
  }
  composedPath() {
    return [];
  }
  initEvent(type, bubbles, cancelable) {
    this.type = type;
    this.bubbles = !!bubbles;
    this.cancelable = !!cancelable;
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
  stopPropagation() {
  }
  stopImmediatePropagation() {
  }
};
var ProgressEventPolyfill = class extends EventPolyfill {
  constructor(type, init) {
    super(type);
    this.lengthComputable = (init == null ? void 0 : init.lengthComputable) || false;
    this.composed = (init == null ? void 0 : init.composed) || false;
    this.loaded = (init == null ? void 0 : init.loaded) || 0;
    this.total = (init == null ? void 0 : init.total) || 0;
  }
};
var SUPPORTS_PROGRESS_EVENT = typeof ProgressEvent !== "undefined";
function createEvent(target, type, init) {
  const progressEvents = [
    "error",
    "progress",
    "loadstart",
    "loadend",
    "load",
    "timeout",
    "abort"
  ];
  const ProgressEventClass = SUPPORTS_PROGRESS_EVENT ? ProgressEvent : ProgressEventPolyfill;
  const event = progressEvents.includes(type) ? new ProgressEventClass(type, {
    lengthComputable: true,
    loaded: (init == null ? void 0 : init.loaded) || 0,
    total: (init == null ? void 0 : init.total) || 0
  }) : new EventPolyfill(type, {
    target,
    currentTarget: target
  });
  return event;
}
function findPropertySource(target, propertyName) {
  if (!(propertyName in target)) {
    return null;
  }
  const hasProperty = Object.prototype.hasOwnProperty.call(target, propertyName);
  if (hasProperty) {
    return target;
  }
  const prototype = Reflect.getPrototypeOf(target);
  return prototype ? findPropertySource(prototype, propertyName) : null;
}
function createProxy(target, options) {
  const proxy = new Proxy(target, optionsToProxyHandler(options));
  return proxy;
}
function optionsToProxyHandler(options) {
  const { constructorCall, methodCall, getProperty, setProperty } = options;
  const handler = {};
  if (typeof constructorCall !== "undefined") {
    handler.construct = function(target, args, newTarget) {
      const next = Reflect.construct.bind(null, target, args, newTarget);
      return constructorCall.call(newTarget, args, next);
    };
  }
  handler.set = function(target, propertyName, nextValue) {
    const next = () => {
      const propertySource = findPropertySource(target, propertyName) || target;
      const ownDescriptors = Reflect.getOwnPropertyDescriptor(
        propertySource,
        propertyName
      );
      if (typeof (ownDescriptors == null ? void 0 : ownDescriptors.set) !== "undefined") {
        ownDescriptors.set.apply(target, [nextValue]);
        return true;
      }
      return Reflect.defineProperty(propertySource, propertyName, {
        writable: true,
        enumerable: true,
        configurable: true,
        value: nextValue
      });
    };
    if (typeof setProperty !== "undefined") {
      return setProperty.call(target, [propertyName, nextValue], next);
    }
    return next();
  };
  handler.get = function(target, propertyName, receiver) {
    const next = () => target[propertyName];
    const value = typeof getProperty !== "undefined" ? getProperty.call(target, [propertyName, receiver], next) : next();
    if (typeof value === "function") {
      return (...args) => {
        const next2 = value.bind(target, ...args);
        if (typeof methodCall !== "undefined") {
          return methodCall.call(target, [propertyName, args], next2);
        }
        return next2();
      };
    }
    return value;
  };
  return handler;
}
function isDomParserSupportedType(type) {
  const supportedTypes = [
    "application/xhtml+xml",
    "application/xml",
    "image/svg+xml",
    "text/html",
    "text/xml"
  ];
  return supportedTypes.some((supportedType) => {
    return type.startsWith(supportedType);
  });
}
function parseJson(data) {
  try {
    const json = JSON.parse(data);
    return json;
  } catch (_) {
    return null;
  }
}
function createResponse2(request2, body) {
  const responseBodyOrNull = isResponseWithoutBody(request2.status) ? null : body;
  return new Response(responseBodyOrNull, {
    status: request2.status,
    statusText: request2.statusText,
    headers: createHeadersFromXMLHttpReqestHeaders(
      request2.getAllResponseHeaders()
    )
  });
}
function createHeadersFromXMLHttpReqestHeaders(headersString) {
  const headers = new Headers();
  const lines = headersString.split(/[\r\n]+/);
  for (const line of lines) {
    if (line.trim() === "") {
      continue;
    }
    const [name, ...parts] = line.split(": ");
    const value = parts.join(": ");
    headers.append(name, value);
  }
  return headers;
}
var IS_MOCKED_RESPONSE = Symbol("isMockedResponse");
var IS_NODE2 = isNodeProcess();
var XMLHttpRequestController = class {
  constructor(initialRequest, logger7) {
    this.initialRequest = initialRequest;
    this.logger = logger7;
    this.method = "GET";
    this.url = null;
    this.events = /* @__PURE__ */ new Map();
    this.requestId = createRequestId();
    this.requestHeaders = new Headers();
    this.responseBuffer = new Uint8Array();
    this.request = createProxy(initialRequest, {
      setProperty: ([propertyName, nextValue], invoke) => {
        switch (propertyName) {
          case "ontimeout": {
            const eventName = propertyName.slice(
              2
            );
            this.request.addEventListener(eventName, nextValue);
            return invoke();
          }
          default: {
            return invoke();
          }
        }
      },
      methodCall: ([methodName, args], invoke) => {
        var _a3;
        switch (methodName) {
          case "open": {
            const [method, url] = args;
            if (typeof url === "undefined") {
              this.method = "GET";
              this.url = toAbsoluteUrl(method);
            } else {
              this.method = method;
              this.url = toAbsoluteUrl(url);
            }
            this.logger = this.logger.extend(`${this.method} ${this.url.href}`);
            this.logger.info("open", this.method, this.url.href);
            return invoke();
          }
          case "addEventListener": {
            const [eventName, listener] = args;
            this.registerEvent(eventName, listener);
            this.logger.info("addEventListener", eventName, listener);
            return invoke();
          }
          case "setRequestHeader": {
            const [name, value] = args;
            this.requestHeaders.set(name, value);
            this.logger.info("setRequestHeader", name, value);
            return invoke();
          }
          case "send": {
            const [body] = args;
            if (body != null) {
              this.requestBody = typeof body === "string" ? encodeBuffer(body) : body;
            }
            this.request.addEventListener("load", () => {
              if (typeof this.onResponse !== "undefined") {
                const fetchResponse = createResponse2(
                  this.request,
                  /**
                   * The `response` property is the right way to read
                   * the ambiguous response body, as the request's "responseType" may differ.
                   * @see https://xhr.spec.whatwg.org/#the-response-attribute
                   */
                  this.request.response
                );
                this.onResponse.call(this, {
                  response: fetchResponse,
                  isMockedResponse: IS_MOCKED_RESPONSE in this.request,
                  request: fetchRequest,
                  requestId: this.requestId
                });
              }
            });
            const fetchRequest = this.toFetchApiRequest();
            const onceRequestSettled = ((_a3 = this.onRequest) == null ? void 0 : _a3.call(this, {
              request: fetchRequest,
              requestId: this.requestId
            })) || Promise.resolve();
            onceRequestSettled.finally(() => {
              if (this.request.readyState < this.request.LOADING) {
                this.logger.info(
                  "request callback settled but request has not been handled (readystate %d), performing as-is...",
                  this.request.readyState
                );
                if (IS_NODE2) {
                  this.request.setRequestHeader(
                    INTERNAL_REQUEST_ID_HEADER_NAME,
                    this.requestId
                  );
                }
                return invoke();
              }
            });
            break;
          }
          default: {
            return invoke();
          }
        }
      }
    });
  }
  registerEvent(eventName, listener) {
    const prevEvents = this.events.get(eventName) || [];
    const nextEvents = prevEvents.concat(listener);
    this.events.set(eventName, nextEvents);
    this.logger.info('registered event "%s"', eventName, listener);
  }
  /**
   * Responds to the current request with the given
   * Fetch API `Response` instance.
   */
  respondWith(response) {
    this.logger.info(
      "responding with a mocked response: %d %s",
      response.status,
      response.statusText
    );
    define(this.request, IS_MOCKED_RESPONSE, true);
    define(this.request, "status", response.status);
    define(this.request, "statusText", response.statusText);
    define(this.request, "responseURL", this.url.href);
    this.request.getResponseHeader = new Proxy(this.request.getResponseHeader, {
      apply: (_, __, args) => {
        this.logger.info("getResponseHeader", args[0]);
        if (this.request.readyState < this.request.HEADERS_RECEIVED) {
          this.logger.info("headers not received yet, returning null");
          return null;
        }
        const headerValue = response.headers.get(args[0]);
        this.logger.info(
          'resolved response header "%s" to',
          args[0],
          headerValue
        );
        return headerValue;
      }
    });
    this.request.getAllResponseHeaders = new Proxy(
      this.request.getAllResponseHeaders,
      {
        apply: () => {
          this.logger.info("getAllResponseHeaders");
          if (this.request.readyState < this.request.HEADERS_RECEIVED) {
            this.logger.info("headers not received yet, returning empty string");
            return "";
          }
          const headersList = Array.from(response.headers.entries());
          const allHeaders = headersList.map(([headerName, headerValue]) => {
            return `${headerName}: ${headerValue}`;
          }).join("\r\n");
          this.logger.info("resolved all response headers to", allHeaders);
          return allHeaders;
        }
      }
    );
    Object.defineProperties(this.request, {
      response: {
        enumerable: true,
        configurable: false,
        get: () => this.response
      },
      responseText: {
        enumerable: true,
        configurable: false,
        get: () => this.responseText
      },
      responseXML: {
        enumerable: true,
        configurable: false,
        get: () => this.responseXML
      }
    });
    const totalResponseBodyLength = response.headers.has("Content-Length") ? Number(response.headers.get("Content-Length")) : (
      /**
       * @todo Infer the response body length from the response body.
       */
      void 0
    );
    this.logger.info("calculated response body length", totalResponseBodyLength);
    this.trigger("loadstart", {
      loaded: 0,
      total: totalResponseBodyLength
    });
    this.setReadyState(this.request.HEADERS_RECEIVED);
    this.setReadyState(this.request.LOADING);
    const finalizeResponse = () => {
      this.logger.info("finalizing the mocked response...");
      this.setReadyState(this.request.DONE);
      this.trigger("load", {
        loaded: this.responseBuffer.byteLength,
        total: totalResponseBodyLength
      });
      this.trigger("loadend", {
        loaded: this.responseBuffer.byteLength,
        total: totalResponseBodyLength
      });
    };
    if (response.body) {
      this.logger.info("mocked response has body, streaming...");
      const reader = response.body.getReader();
      const readNextResponseBodyChunk = async () => {
        const { value, done } = await reader.read();
        if (done) {
          this.logger.info("response body stream done!");
          finalizeResponse();
          return;
        }
        if (value) {
          this.logger.info("read response body chunk:", value);
          this.responseBuffer = concatArrayBuffer(this.responseBuffer, value);
          this.trigger("progress", {
            loaded: this.responseBuffer.byteLength,
            total: totalResponseBodyLength
          });
        }
        readNextResponseBodyChunk();
      };
      readNextResponseBodyChunk();
    } else {
      finalizeResponse();
    }
  }
  responseBufferToText() {
    return decodeBuffer(this.responseBuffer);
  }
  get response() {
    this.logger.info(
      "getResponse (responseType: %s)",
      this.request.responseType
    );
    if (this.request.readyState !== this.request.DONE) {
      return null;
    }
    switch (this.request.responseType) {
      case "json": {
        const responseJson = parseJson(this.responseBufferToText());
        this.logger.info("resolved response JSON", responseJson);
        return responseJson;
      }
      case "arraybuffer": {
        const arrayBuffer = toArrayBuffer(this.responseBuffer);
        this.logger.info("resolved response ArrayBuffer", arrayBuffer);
        return arrayBuffer;
      }
      case "blob": {
        const mimeType = this.request.getResponseHeader("Content-Type") || "text/plain";
        const responseBlob = new Blob([this.responseBufferToText()], {
          type: mimeType
        });
        this.logger.info(
          "resolved response Blob (mime type: %s)",
          responseBlob,
          mimeType
        );
        return responseBlob;
      }
      default: {
        const responseText = this.responseBufferToText();
        this.logger.info(
          'resolving "%s" response type as text',
          this.request.responseType,
          responseText
        );
        return responseText;
      }
    }
  }
  get responseText() {
    invariant2(
      this.request.responseType === "" || this.request.responseType === "text",
      "InvalidStateError: The object is in invalid state."
    );
    if (this.request.readyState !== this.request.LOADING && this.request.readyState !== this.request.DONE) {
      return "";
    }
    const responseText = this.responseBufferToText();
    this.logger.info('getResponseText: "%s"', responseText);
    return responseText;
  }
  get responseXML() {
    invariant2(
      this.request.responseType === "" || this.request.responseType === "document",
      "InvalidStateError: The object is in invalid state."
    );
    if (this.request.readyState !== this.request.DONE) {
      return null;
    }
    const contentType = this.request.getResponseHeader("Content-Type") || "";
    if (typeof DOMParser === "undefined") {
      console.warn(
        "Cannot retrieve XMLHttpRequest response body as XML: DOMParser is not defined. You are likely using an environment that is not browser or does not polyfill browser globals correctly."
      );
      return null;
    }
    if (isDomParserSupportedType(contentType)) {
      return new DOMParser().parseFromString(
        this.responseBufferToText(),
        contentType
      );
    }
    return null;
  }
  errorWith(error3) {
    this.logger.info("responding with an error");
    this.setReadyState(this.request.DONE);
    this.trigger("error");
    this.trigger("loadend");
  }
  /**
   * Transitions this request's `readyState` to the given one.
   */
  setReadyState(nextReadyState) {
    this.logger.info(
      "setReadyState: %d -> %d",
      this.request.readyState,
      nextReadyState
    );
    if (this.request.readyState === nextReadyState) {
      this.logger.info("ready state identical, skipping transition...");
      return;
    }
    define(this.request, "readyState", nextReadyState);
    this.logger.info("set readyState to: %d", nextReadyState);
    if (nextReadyState !== this.request.UNSENT) {
      this.logger.info('triggerring "readystatechange" event...');
      this.trigger("readystatechange");
    }
  }
  /**
   * Triggers given event on the `XMLHttpRequest` instance.
   */
  trigger(eventName, options) {
    const callback = this.request[`on${eventName}`];
    const event = createEvent(this.request, eventName, options);
    this.logger.info('trigger "%s"', eventName, options || "");
    if (typeof callback === "function") {
      this.logger.info('found a direct "%s" callback, calling...', eventName);
      callback.call(this.request, event);
    }
    for (const [registeredEventName, listeners] of this.events) {
      if (registeredEventName === eventName) {
        this.logger.info(
          'found %d listener(s) for "%s" event, calling...',
          listeners.length,
          eventName
        );
        listeners.forEach((listener) => listener.call(this.request, event));
      }
    }
  }
  /**
   * Converts this `XMLHttpRequest` instance into a Fetch API `Request` instance.
   */
  toFetchApiRequest() {
    this.logger.info("converting request to a Fetch API Request...");
    const fetchRequest = new Request(this.url.href, {
      method: this.method,
      headers: this.requestHeaders,
      /**
       * @see https://xhr.spec.whatwg.org/#cross-origin-credentials
       */
      credentials: this.request.withCredentials ? "include" : "same-origin",
      body: ["GET", "HEAD"].includes(this.method) ? null : this.requestBody
    });
    const proxyHeaders = createProxy(fetchRequest.headers, {
      methodCall: ([methodName, args], invoke) => {
        switch (methodName) {
          case "append":
          case "set": {
            const [headerName, headerValue] = args;
            this.request.setRequestHeader(headerName, headerValue);
            break;
          }
          case "delete": {
            const [headerName] = args;
            console.warn(
              `XMLHttpRequest: Cannot remove a "${headerName}" header from the Fetch API representation of the "${fetchRequest.method} ${fetchRequest.url}" request. XMLHttpRequest headers cannot be removed.`
            );
            break;
          }
        }
        return invoke();
      }
    });
    define(fetchRequest, "headers", proxyHeaders);
    this.logger.info("converted request to a Fetch API Request!", fetchRequest);
    return fetchRequest;
  }
};
function toAbsoluteUrl(url) {
  if (typeof location === "undefined") {
    return new URL(url);
  }
  return new URL(url.toString(), location.href);
}
function define(target, property, value) {
  Reflect.defineProperty(target, property, {
    // Ensure writable properties to allow redefining readonly properties.
    writable: true,
    enumerable: true,
    value
  });
}
function createXMLHttpRequestProxy({
  emitter,
  logger: logger7
}) {
  const XMLHttpRequestProxy = new Proxy(globalThis.XMLHttpRequest, {
    construct(target, args, newTarget) {
      logger7.info("constructed new XMLHttpRequest");
      const originalRequest = Reflect.construct(
        target,
        args,
        newTarget
      );
      const prototypeDescriptors = Object.getOwnPropertyDescriptors(
        target.prototype
      );
      for (const propertyName in prototypeDescriptors) {
        Reflect.defineProperty(
          originalRequest,
          propertyName,
          prototypeDescriptors[propertyName]
        );
      }
      const xhrRequestController = new XMLHttpRequestController(
        originalRequest,
        logger7
      );
      xhrRequestController.onRequest = async function({ request: request2, requestId }) {
        const { interactiveRequest, requestController } = toInteractiveRequest(request2);
        this.logger.info("awaiting mocked response...");
        emitter.once("request", ({ requestId: pendingRequestId }) => {
          if (pendingRequestId !== requestId) {
            return;
          }
          if (requestController.responsePromise.state === "pending") {
            requestController.respondWith(void 0);
          }
        });
        const resolverResult = await until(async () => {
          this.logger.info(
            'emitting the "request" event for %s listener(s)...',
            emitter.listenerCount("request")
          );
          await emitAsync(emitter, "request", {
            request: interactiveRequest,
            requestId
          });
          this.logger.info('all "request" listeners settled!');
          const mockedResponse2 = await requestController.responsePromise;
          this.logger.info("event.respondWith called with:", mockedResponse2);
          return mockedResponse2;
        });
        if (resolverResult.error) {
          this.logger.info(
            "request listener threw an exception, aborting request...",
            resolverResult.error
          );
          if (resolverResult.error instanceof Response) {
            if (isResponseError(resolverResult.error)) {
              xhrRequestController.errorWith(new TypeError("Network error"));
            } else {
              this.respondWith(resolverResult.error);
            }
            return;
          }
          if (emitter.listenerCount("unhandledException") > 0) {
            await emitAsync(emitter, "unhandledException", {
              error: resolverResult.error,
              request: request2,
              requestId,
              controller: {
                respondWith: xhrRequestController.respondWith.bind(xhrRequestController),
                errorWith: xhrRequestController.errorWith.bind(xhrRequestController)
              }
            });
            if (originalRequest.readyState > XMLHttpRequest.OPENED) {
              return;
            }
          }
          xhrRequestController.respondWith(
            createServerErrorResponse(resolverResult.error)
          );
          return;
        }
        const mockedResponse = resolverResult.data;
        if (typeof mockedResponse !== "undefined") {
          this.logger.info(
            "received mocked response: %d %s",
            mockedResponse.status,
            mockedResponse.statusText
          );
          if (isResponseError(mockedResponse)) {
            this.logger.info(
              "received a network error response, rejecting the request promise..."
            );
            xhrRequestController.errorWith(new TypeError("Network error"));
            return;
          }
          return xhrRequestController.respondWith(mockedResponse);
        }
        this.logger.info(
          "no mocked response received, performing request as-is..."
        );
      };
      xhrRequestController.onResponse = async function({
        response,
        isMockedResponse,
        request: request2,
        requestId
      }) {
        this.logger.info(
          'emitting the "response" event for %s listener(s)...',
          emitter.listenerCount("response")
        );
        emitter.emit("response", {
          response,
          isMockedResponse,
          request: request2,
          requestId
        });
      };
      return xhrRequestController.request;
    }
  });
  return XMLHttpRequestProxy;
}
var _XMLHttpRequestInterceptor = class extends Interceptor {
  constructor() {
    super(_XMLHttpRequestInterceptor.interceptorSymbol);
  }
  checkEnvironment() {
    return typeof globalThis.XMLHttpRequest !== "undefined";
  }
  setup() {
    const logger7 = this.logger.extend("setup");
    logger7.info('patching "XMLHttpRequest" module...');
    const PureXMLHttpRequest = globalThis.XMLHttpRequest;
    invariant2(
      !PureXMLHttpRequest[IS_PATCHED_MODULE],
      'Failed to patch the "XMLHttpRequest" module: already patched.'
    );
    globalThis.XMLHttpRequest = createXMLHttpRequestProxy({
      emitter: this.emitter,
      logger: this.logger
    });
    logger7.info(
      'native "XMLHttpRequest" module patched!',
      globalThis.XMLHttpRequest.name
    );
    Object.defineProperty(globalThis.XMLHttpRequest, IS_PATCHED_MODULE, {
      enumerable: true,
      configurable: true,
      value: true
    });
    this.subscriptions.push(() => {
      Object.defineProperty(globalThis.XMLHttpRequest, IS_PATCHED_MODULE, {
        value: void 0
      });
      globalThis.XMLHttpRequest = PureXMLHttpRequest;
      logger7.info(
        'native "XMLHttpRequest" module restored!',
        globalThis.XMLHttpRequest.name
      );
    });
  }
};
var XMLHttpRequestInterceptor = _XMLHttpRequestInterceptor;
XMLHttpRequestInterceptor.interceptorSymbol = Symbol("xhr");

// ../../node_modules/.pnpm/@mswjs+interceptors@0.29.1/node_modules/@mswjs/interceptors/lib/node/interceptors/fetch/index.mjs
function canParseUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_error) {
    return false;
  }
}
var _FetchInterceptor = class extends Interceptor {
  constructor() {
    super(_FetchInterceptor.symbol);
  }
  checkEnvironment() {
    return typeof globalThis !== "undefined" && typeof globalThis.fetch !== "undefined";
  }
  async setup() {
    const pureFetch = globalThis.fetch;
    invariant2(
      !pureFetch[IS_PATCHED_MODULE],
      'Failed to patch the "fetch" module: already patched.'
    );
    globalThis.fetch = async (input, init) => {
      var _a3;
      const requestId = createRequestId();
      const resolvedInput = typeof input === "string" && typeof location !== "undefined" && !canParseUrl(input) ? new URL(input, location.origin) : input;
      const request2 = new Request(resolvedInput, init);
      this.logger.info("[%s] %s", request2.method, request2.url);
      const { interactiveRequest, requestController } = toInteractiveRequest(request2);
      this.logger.info(
        'emitting the "request" event for %d listener(s)...',
        this.emitter.listenerCount("request")
      );
      this.emitter.once("request", ({ requestId: pendingRequestId }) => {
        if (pendingRequestId !== requestId) {
          return;
        }
        if (requestController.responsePromise.state === "pending") {
          requestController.responsePromise.resolve(void 0);
        }
      });
      this.logger.info("awaiting for the mocked response...");
      const signal = interactiveRequest.signal;
      const requestAborted = new DeferredPromise();
      if (signal) {
        signal.addEventListener(
          "abort",
          () => {
            requestAborted.reject(signal.reason);
          },
          { once: true }
        );
      }
      const responsePromise = new DeferredPromise();
      const respondWith = (response) => {
        this.logger.info("responding with a mock response:", response);
        if (this.emitter.listenerCount("response") > 0) {
          this.logger.info('emitting the "response" event...');
          const responseClone = response.clone();
          this.emitter.emit("response", {
            response: responseClone,
            isMockedResponse: true,
            request: interactiveRequest,
            requestId
          });
        }
        Object.defineProperty(response, "url", {
          writable: false,
          enumerable: true,
          configurable: false,
          value: request2.url
        });
        responsePromise.resolve(response);
      };
      const errorWith = (reason) => {
        responsePromise.reject(reason);
      };
      const resolverResult = await until(
        async () => {
          const listenersFinished = emitAsync(this.emitter, "request", {
            request: interactiveRequest,
            requestId
          });
          await Promise.race([
            requestAborted,
            // Put the listeners invocation Promise in the same race condition
            // with the request abort Promise because otherwise awaiting the listeners
            // would always yield some response (or undefined).
            listenersFinished,
            requestController.responsePromise
          ]);
          this.logger.info("all request listeners have been resolved!");
          const mockedResponse2 = await requestController.responsePromise;
          this.logger.info("event.respondWith called with:", mockedResponse2);
          return mockedResponse2;
        }
      );
      if (requestAborted.state === "rejected") {
        this.logger.info(
          "request has been aborted:",
          requestAborted.rejectionReason
        );
        responsePromise.reject(requestAborted.rejectionReason);
        return responsePromise;
      }
      if (resolverResult.error) {
        this.logger.info(
          "request listerner threw an error:",
          resolverResult.error
        );
        if (resolverResult.error instanceof Response) {
          if (isResponseError(resolverResult.error)) {
            errorWith(createNetworkError(resolverResult.error));
          } else {
            respondWith(resolverResult.error);
          }
        }
        if (this.emitter.listenerCount("unhandledException") > 0) {
          await emitAsync(this.emitter, "unhandledException", {
            error: resolverResult.error,
            request: request2,
            requestId,
            controller: {
              respondWith,
              errorWith
            }
          });
          if (responsePromise.state !== "pending") {
            return responsePromise;
          }
        }
        respondWith(createServerErrorResponse(resolverResult.error));
        return responsePromise;
      }
      const mockedResponse = resolverResult.data;
      if (mockedResponse && !((_a3 = request2.signal) == null ? void 0 : _a3.aborted)) {
        this.logger.info("received mocked response:", mockedResponse);
        if (isResponseError(mockedResponse)) {
          this.logger.info(
            "received a network error response, rejecting the request promise..."
          );
          errorWith(createNetworkError(mockedResponse));
        } else {
          respondWith(mockedResponse);
        }
        return responsePromise;
      }
      this.logger.info("no mocked response received!");
      return pureFetch(request2).then((response) => {
        this.logger.info("original fetch performed", response);
        if (this.emitter.listenerCount("response") > 0) {
          this.logger.info('emitting the "response" event...');
          const responseClone = response.clone();
          this.emitter.emit("response", {
            response: responseClone,
            isMockedResponse: false,
            request: interactiveRequest,
            requestId
          });
        }
        return response;
      });
    };
    Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE, {
      enumerable: true,
      configurable: true,
      value: true
    });
    this.subscriptions.push(() => {
      Object.defineProperty(globalThis.fetch, IS_PATCHED_MODULE, {
        value: void 0
      });
      globalThis.fetch = pureFetch;
      this.logger.info(
        'restored native "globalThis.fetch"!',
        globalThis.fetch.name
      );
    });
  }
};
var FetchInterceptor = _FetchInterceptor;
FetchInterceptor.symbol = Symbol("fetch");
function createNetworkError(cause) {
  return Object.assign(new TypeError("Failed to fetch"), {
    cause
  });
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/isObject.mjs
function isObject2(value) {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/core/utils/internal/mergeRight.mjs
function mergeRight(left, right) {
  return Object.entries(right).reduce(
    (result, [key, rightValue]) => {
      const leftValue = result[key];
      if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
        result[key] = leftValue.concat(rightValue);
        return result;
      }
      if (isObject2(leftValue) && isObject2(rightValue)) {
        result[key] = mergeRight(leftValue, rightValue);
        return result;
      }
      result[key] = rightValue;
      return result;
    },
    Object.assign({}, left)
  );
}

// ../../node_modules/.pnpm/msw@2.3.1_typescript@5.5.4/node_modules/msw/lib/node/index.mjs
var DEFAULT_LISTEN_OPTIONS = {
  onUnhandledRequest: "warn"
};
var SetupServerCommonApi = class extends SetupApi {
  constructor(interceptors, handlers) {
    super(...handlers);
    __publicField(this, "interceptor");
    __publicField(this, "resolvedOptions");
    this.interceptor = new BatchInterceptor({
      name: "setup-server",
      interceptors: interceptors.map((Interceptor2) => new Interceptor2())
    });
    this.resolvedOptions = {};
    this.init();
  }
  /**
   * Subscribe to all requests that are using the interceptor object
   */
  init() {
    this.interceptor.on("request", async ({ request: request2, requestId }) => {
      const response = await handleRequest(
        request2,
        requestId,
        this.handlersController.currentHandlers(),
        this.resolvedOptions,
        this.emitter
      );
      if (response) {
        request2.respondWith(response);
      }
      return;
    });
    this.interceptor.on("unhandledException", ({ error: error3 }) => {
      if (error3 instanceof InternalError) {
        throw error3;
      }
    });
    this.interceptor.on(
      "response",
      ({ response, isMockedResponse, request: request2, requestId }) => {
        this.emitter.emit(
          isMockedResponse ? "response:mocked" : "response:bypass",
          {
            response,
            request: request2,
            requestId
          }
        );
      }
    );
  }
  listen(options = {}) {
    this.resolvedOptions = mergeRight(
      DEFAULT_LISTEN_OPTIONS,
      options
    );
    this.interceptor.apply();
    this.subscriptions.push(() => {
      this.interceptor.dispose();
    });
    invariant(
      [InterceptorReadyState.APPLYING, InterceptorReadyState.APPLIED].includes(
        this.interceptor.readyState
      ),
      devUtils.formatMessage(
        'Failed to start "setupServer": the interceptor failed to apply. This is likely an issue with the library and you should report it at "%s".'
      ),
      "https://github.com/mswjs/msw/issues/new/choose"
    );
  }
  close() {
    this.dispose();
  }
};
var store2 = new AsyncLocalStorage();
var AsyncHandlersController = class {
  constructor(initialHandlers) {
    __publicField(this, "rootContext");
    this.rootContext = { initialHandlers, handlers: [] };
  }
  get context() {
    return store2.getStore() || this.rootContext;
  }
  prepend(runtimeHandlers) {
    this.context.handlers.unshift(...runtimeHandlers);
  }
  reset(nextHandlers) {
    const context = this.context;
    context.handlers = [];
    context.initialHandlers = nextHandlers.length > 0 ? nextHandlers : context.initialHandlers;
  }
  currentHandlers() {
    const { initialHandlers, handlers } = this.context;
    return handlers.concat(initialHandlers);
  }
};
var SetupServerApi = class extends SetupServerCommonApi {
  constructor(handlers) {
    super(
      [ClientRequestInterceptor, XMLHttpRequestInterceptor, FetchInterceptor],
      handlers
    );
    this.handlersController = new AsyncHandlersController(handlers);
  }
  boundary(callback) {
    return (...args) => {
      return store2.run(
        {
          initialHandlers: this.handlersController.currentHandlers(),
          handlers: []
        },
        callback,
        ...args
      );
    };
  }
  close() {
    super.close();
    store2.disable();
  }
};
var setupServer = (...handlers) => {
  return new SetupServerApi(handlers);
};

// src/test/json-test-server.ts
var JsonTestServer = class {
  constructor(url) {
    this.responseHeaders = {};
    this.responseBodyJson = {};
    const responseBodyJson = () => this.responseBodyJson;
    this.server = setupServer(
      http.post(url, ({ request: request2 }) => {
        this.request = request2;
        return HttpResponse.json(responseBodyJson(), {
          headers: {
            "Content-Type": "application/json",
            ...this.responseHeaders
          }
        });
      })
    );
  }
  async getRequestBodyJson() {
    expect(this.request).toBeDefined();
    return JSON.parse(await this.request.text());
  }
  async getRequestHeaders() {
    expect(this.request).toBeDefined();
    const requestHeaders = this.request.headers;
    const headersObject = {};
    requestHeaders.forEach((value, key) => {
      headersObject[key] = value;
    });
    return headersObject;
  }
  async getRequestUrlSearchParams() {
    expect(this.request).toBeDefined();
    return new URL(this.request.url).searchParams;
  }
  async getRequestUrl() {
    expect(this.request).toBeDefined();
    return new URL(this.request.url).toString();
  }
  setupTestEnvironment() {
    beforeAll(() => this.server.listen());
    beforeEach(() => {
      this.responseBodyJson = {};
      this.request = void 0;
    });
    afterEach(() => this.server.resetHandlers());
    afterAll(() => this.server.close());
  }
};

// src/test/streaming-test-server.ts
var StreamingTestServer = class {
  constructor(url) {
    this.responseHeaders = {};
    this.responseChunks = [];
    const responseChunks = () => this.responseChunks;
    this.server = setupServer(
      http.post(url, ({ request: request2 }) => {
        this.request = request2;
        const encoder2 = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for (const chunk of responseChunks()) {
                controller.enqueue(encoder2.encode(chunk));
              }
            } finally {
              controller.close();
            }
          }
        });
        return new HttpResponse(stream, {
          status: 200,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
            ...this.responseHeaders
          }
        });
      })
    );
  }
  async getRequestBodyJson() {
    expect(this.request).toBeDefined();
    return JSON.parse(await this.request.text());
  }
  async getRequestHeaders() {
    expect(this.request).toBeDefined();
    const requestHeaders = this.request.headers;
    const headersObject = {};
    requestHeaders.forEach((value, key) => {
      headersObject[key] = value;
    });
    return headersObject;
  }
  async getRequestUrlSearchParams() {
    expect(this.request).toBeDefined();
    return new URL(this.request.url).searchParams;
  }
  setupTestEnvironment() {
    beforeAll(() => this.server.listen());
    beforeEach(() => {
      this.responseChunks = [];
      this.request = void 0;
    });
    afterEach(() => this.server.resetHandlers());
    afterAll(() => this.server.close());
  }
};

// src/test/test-server.ts
var TestServerCall = class {
  constructor(request2) {
    this.request = request2;
  }
  async getRequestBodyJson() {
    expect(this.request).toBeDefined();
    return JSON.parse(await this.request.text());
  }
  getRequestHeaders() {
    expect(this.request).toBeDefined();
    const requestHeaders = this.request.headers;
    const headersObject = {};
    requestHeaders.forEach((value, key) => {
      headersObject[key] = value;
    });
    return headersObject;
  }
  getRequestUrlSearchParams() {
    expect(this.request).toBeDefined();
    return new URL(this.request.url).searchParams;
  }
};
function createServer({
  responses,
  pushCall,
  pushController
}) {
  const responsesArray = Array.isArray(responses) ? responses : [responses];
  const responsesByUrl = responsesArray.reduce((responsesByUrl2, response) => {
    if (!responsesByUrl2[response.url]) {
      responsesByUrl2[response.url] = [];
    }
    responsesByUrl2[response.url].push(response);
    return responsesByUrl2;
  }, {});
  const streams = {};
  responsesArray.filter(
    (response) => response.type === "controlled-stream"
  ).forEach((response) => {
    var _a3, _b2;
    let streamController;
    const stream = new ReadableStream({
      start(controller) {
        streamController = controller;
      }
    });
    pushController((_a3 = response.id) != null ? _a3 : "", () => streamController);
    streams[(_b2 = response.id) != null ? _b2 : ""] = stream;
  });
  const urlInvocationCounts = Object.fromEntries(
    Object.entries(responsesByUrl).map(([url]) => [url, 0])
  );
  return setupServer(
    ...Object.entries(responsesByUrl).map(([url, responses2]) => {
      return http.post(url, ({ request: request2 }) => {
        var _a3, _b2;
        pushCall(new TestServerCall(request2));
        const invocationCount = urlInvocationCounts[url]++;
        const response = responses2[invocationCount > responses2.length ? responses2.length - 1 : invocationCount];
        switch (response.type) {
          case "json-value":
            return HttpResponse.json(response.content, {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                ...response.headers
              }
            });
          case "stream-values":
            return new HttpResponse(
              convertArrayToReadableStream(response.content).pipeThrough(
                new TextEncoderStream()
              ),
              {
                status: 200,
                headers: {
                  "Content-Type": "text/event-stream",
                  "Cache-Control": "no-cache",
                  Connection: "keep-alive",
                  ...response.headers
                }
              }
            );
          case "controlled-stream": {
            return new HttpResponse(
              streams[(_a3 = response.id) != null ? _a3 : ""].pipeThrough(new TextEncoderStream()),
              {
                status: 200,
                headers: {
                  "Content-Type": "text/event-stream",
                  "Cache-Control": "no-cache",
                  Connection: "keep-alive",
                  ...response.headers
                }
              }
            );
          }
          case "error":
            return HttpResponse.text((_b2 = response.content) != null ? _b2 : "Error", {
              status: response.status,
              headers: {
                ...response.headers
              }
            });
        }
      });
    })
  );
}
function withTestServer(responses, testFunction) {
  return async () => {
    const calls = [];
    const controllers = {};
    const server = createServer({
      responses,
      pushCall: (call) => calls.push(call),
      pushController: (id, controller) => {
        controllers[id] = controller;
      }
    });
    try {
      server.listen();
      await testFunction({
        calls: () => calls,
        call: (index) => calls[index],
        getStreamController: (id) => {
          return controllers[id]();
        },
        get streamController() {
          return controllers[""]();
        }
      });
    } finally {
      server.close();
    }
  };
}
function describeWithTestServer(description, responses, testFunction) {
  describe(description, () => {
    let calls;
    let controllers;
    let server;
    beforeAll(() => {
      server = createServer({
        responses,
        pushCall: (call) => calls.push(call),
        pushController: (id, controller) => {
          controllers[id] = controller;
        }
      });
      server.listen();
    });
    beforeEach(() => {
      calls = [];
      controllers = {};
      server.resetHandlers();
    });
    afterAll(() => {
      server.close();
    });
    testFunction({
      calls: () => calls,
      call: (index) => calls[index],
      getStreamController: (id) => controllers[id](),
      get streamController() {
        return controllers[""]();
      }
    });
  });
}

// src/test/index.ts
var convertStreamToArray = convertReadableStreamToArray;
export {
  JsonTestServer,
  StreamingTestServer,
  convertArrayToAsyncIterable,
  convertArrayToReadableStream,
  convertAsyncIterableToArray,
  convertReadableStreamToArray,
  convertResponseStreamToArray,
  convertStreamToArray,
  describeWithTestServer,
  withTestServer
};
/*! Bundled license information:

@bundled-es-modules/statuses/index-esm.js:
  (*! Bundled license information:
  
  statuses/index.js:
    (*!
     * statuses
     * Copyright(c) 2014 Jonathan Ong
     * Copyright(c) 2016 Douglas Christopher Wilson
     * MIT Licensed
     *)
  *)

@bundled-es-modules/cookie/index-esm.js:
  (*! Bundled license information:
  
  cookie/index.js:
    (*!
     * cookie
     * Copyright(c) 2012-2014 Roman Shtylman
     * Copyright(c) 2015 Douglas Christopher Wilson
     * MIT Licensed
     *)
  *)
*/
//# sourceMappingURL=index.mjs.map