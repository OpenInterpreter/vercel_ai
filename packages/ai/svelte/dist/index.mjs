// svelte/use-chat.ts
import {
  callChatApi,
  generateId as generateIdFunc,
  processChatStream
} from "@ai-sdk/ui-utils";

// ../../node_modules/.pnpm/swrev@4.0.0/node_modules/swrev/dist/swrev.mjs
var P = Object.defineProperty;
var F = (r, e, t) => e in r ? P(r, e, { enumerable: true, configurable: true, writable: true, value: t }) : r[e] = t;
var h = (r, e, t) => (F(r, typeof e != "symbol" ? e + "" : e, t), t);
var I = class {
  constructor() {
    h(this, "listeners", /* @__PURE__ */ new Map());
  }
  /**
   * Subscribes a given listener.
   */
  subscribe(e, t) {
    this.listeners.has(e) || this.listeners.set(e, []), !this.listeners.get(e).includes(t) && this.listeners.get(e).push(t);
  }
  /**
   * Unsubscribes the given listener.
   */
  unsubscribe(e, t) {
    this.listeners.has(e) && this.listeners.get(e).includes(t) && (this.listeners.get(e).splice(this.listeners.get(e).indexOf(t), 1), this.listeners.get(e).length === 0 && this.listeners.delete(e));
  }
  /**
   * Emits an event to all active listeners.
   */
  emit(e, t) {
    this.listeners.has(e) && this.listeners.get(e).forEach((s) => s(t));
  }
};
var L = {
  broadcast: false
};
var S = {
  broadcast: false
};
var O = class {
  /**
   * Creates the cache item given the data and expiration at.
   */
  constructor({ data: e, expiresAt: t = null }) {
    h(this, "data");
    h(this, "expiresAt");
    this.data = e, this.expiresAt = t;
  }
  /**
   * Determines if the current cache item is still being resolved.
   * This returns true if data is a promise, or false if type `D`.
   */
  isResolving() {
    return this.data instanceof Promise;
  }
  /**
   * Determines if the given cache item has expired.
   */
  hasExpired() {
    return this.expiresAt === null || this.expiresAt < /* @__PURE__ */ new Date();
  }
  /**
   * Set the expiration time of the given cache item relative to now.
   */
  expiresIn(e) {
    return this.expiresAt = /* @__PURE__ */ new Date(), this.expiresAt.setMilliseconds(this.expiresAt.getMilliseconds() + e), this;
  }
};
var q = class {
  constructor() {
    h(this, "elements", /* @__PURE__ */ new Map());
    h(this, "event", new I());
  }
  /**
   * Resolves the promise and replaces the Promise to the resolved data.
   * It also broadcasts the value change if needed or deletes the key if
   * the value resolves to undefined or null.
   */
  resolve(e, t) {
    Promise.resolve(t.data).then((s) => {
      if (s == null)
        return this.remove(e);
      t.data = s, this.broadcast(e, s);
    });
  }
  /**
   * Gets an element from the cache.
   *
   * It is assumed the item always exist when
   * you get it. Use the has method to check
   * for the existence of it.
   */
  get(e) {
    return this.elements.get(e);
  }
  /**
   * Sets an element to the cache.
   */
  set(e, t) {
    this.elements.set(e, t), this.resolve(e, t);
  }
  /**
   * Removes an key-value pair from the cache.
   */
  remove(e, t) {
    const { broadcast: s } = { ...L, ...t };
    s && this.broadcast(e, void 0), this.elements.delete(e);
  }
  /**
   * Removes all the key-value pairs from the cache.
   */
  clear(e) {
    const { broadcast: t } = { ...S, ...e };
    if (t)
      for (const s of this.elements.keys())
        this.broadcast(s, void 0);
    this.elements.clear();
  }
  /**
   * Determines if the given key exists
   * in the cache.
   */
  has(e) {
    return this.elements.has(e);
  }
  /**
   * Subscribes the callback to the given key.
   */
  subscribe(e, t) {
    this.event.subscribe(e, t);
  }
  /**
   * Unsubscribes to the given key events.
   */
  unsubscribe(e, t) {
    this.event.unsubscribe(e, t);
  }
  /**
   * Broadcasts a value change  on all subscribed instances.
   */
  broadcast(e, t) {
    this.event.emit(e, t);
  }
};
var x = {
  cache: new q(),
  errors: new I(),
  fetcher: async (r) => {
    const e = await fetch(r);
    if (!e.ok)
      throw Error("Not a 2XX response.");
    return e.json();
  },
  fallbackData: void 0,
  loadInitialCache: true,
  revalidateOnStart: true,
  dedupingInterval: 2e3,
  revalidateOnFocus: true,
  focusThrottleInterval: 5e3,
  revalidateOnReconnect: true,
  reconnectWhen: (r, { enabled: e }) => e && typeof window < "u" ? (window.addEventListener("online", r), () => window.removeEventListener("online", r)) : () => {
  },
  focusWhen: (r, { enabled: e, throttleInterval: t }) => {
    if (e && typeof window < "u") {
      let s = null;
      const i = () => {
        const a = Date.now();
        (s === null || a - s > t) && (s = a, r());
      };
      return window.addEventListener("focus", i), () => window.removeEventListener("focus", i);
    }
    return () => {
    };
  },
  revalidateFunction: void 0
};
var E = {
  ...x,
  force: false
};
var T = {
  revalidate: true,
  revalidateOptions: { ...E },
  revalidateFunction: void 0
};
var X = {
  broadcast: false
};
var H = class {
  /**
   * Creates a new instance of SWR.
   */
  constructor(e) {
    h(this, "options");
    this.options = { ...x, ...e };
  }
  /**
   * Gets the cache of the SWR.
   */
  get cache() {
    return this.options.cache;
  }
  /**
   * Gets the cache of the SWR.
   */
  get errors() {
    return this.options.errors;
  }
  /**
   * Requests the data using the provided fetcher.
   */
  async requestData(e, t) {
    return await Promise.resolve(t(e)).catch((s) => {
      throw this.errors.emit(e, s), s;
    });
  }
  /**
   * Resolves the given to a SWRKey or undefined.
   */
  resolveKey(e) {
    if (typeof e == "function")
      try {
        return e();
      } catch (e2) {
        return;
      }
    return e;
  }
  /**
   * Clear the specified keys from the cache. If no keys
   * are specified, it clears all the cache keys.
   */
  clear(e, t) {
    const s = { ...X, ...t };
    if (e == null)
      return this.cache.clear(s);
    if (!Array.isArray(e))
      return this.cache.remove(e, s);
    for (const i of e)
      this.cache.remove(i, s);
  }
  /**
   * Revalidates the key and mutates the cache if needed.
   */
  async revalidate(e, t) {
    if (!e)
      throw new Error("[Revalidate] Key issue: ${key}");
    const { fetcher: s, dedupingInterval: i } = this.options, { force: a, fetcher: o, dedupingInterval: n } = {
      ...E,
      fetcher: s,
      dedupingInterval: i,
      ...t
    };
    if (a || !this.cache.has(e) || this.cache.has(e) && this.cache.get(e).hasExpired()) {
      const c2 = this.requestData(e, o), l = c2.catch(() => {
      });
      return this.cache.set(e, new O({ data: l }).expiresIn(n)), await c2;
    }
    return this.getWait(e);
  }
  /**
   * Mutates the data of a given key with a new value.
   * This is used to replace the cache contents of the
   * given key manually.
   */
  async mutate(e, t, s) {
    var _a;
    if (!e)
      throw new Error("[Mutate] Key issue: ${key}");
    const {
      revalidate: i,
      revalidateOptions: a,
      revalidateFunction: o
    } = {
      ...T,
      ...s
    };
    let n;
    if (typeof t == "function") {
      let c2;
      if (this.cache.has(e)) {
        const l = this.cache.get(e);
        l.isResolving() || (c2 = l.data);
      }
      n = t(c2);
    } else
      n = t;
    return this.cache.set(e, new O({ data: n })), i ? await ((_a = o == null ? void 0 : o(e, a)) != null ? _a : this.revalidate(e, a)) : n;
  }
  /**
   * Gets the data of the given key. Keep in mind
   * this data will be stale and revalidate in the background
   * unless specified otherwise.
   */
  subscribeData(e, t) {
    if (e) {
      const s = (i) => t(i);
      return this.cache.subscribe(e, s), () => this.cache.unsubscribe(e, s);
    }
    return () => {
    };
  }
  /**
   * Subscribes to errors on the given key.
   */
  subscribeErrors(e, t) {
    if (e) {
      const s = (i) => t(i);
      return this.errors.subscribe(e, s), () => this.errors.unsubscribe(e, s);
    }
    return () => {
    };
  }
  /**
   * Gets the current cached data of the given key.
   * This does not trigger any revalidation nor mutation
   * of the data.
   * - If the data has never been validated
   * (there is no cache) it will return undefined.
   * - If the item is pending to resolve (there is a request
   * pending to resolve) it will return undefined.
   */
  get(e) {
    if (e && this.cache.has(e)) {
      const t = this.cache.get(e);
      if (!t.isResolving())
        return t.data;
    }
  }
  /**
   * Gets an element from the cache. The difference
   * with the get is that this method returns a promise
   * that will resolve the the value. If there's no item
   * in the cache, it will wait for it before resolving.
   */
  getWait(e) {
    return new Promise((t, s) => {
      const i = this.subscribeData(e, (n) => {
        if (i(), n !== void 0)
          return t(n);
      }), a = this.subscribeErrors(e, (n) => {
        if (a(), n !== void 0)
          return s(n);
      }), o = this.get(e);
      if (o !== void 0)
        return t(o);
    });
  }
  /**
   * Use a SWR value given the key and
   * subscribe to future changes.
   */
  subscribe(e, t, s, i) {
    const {
      fetcher: a,
      fallbackData: o,
      loadInitialCache: n,
      revalidateOnStart: c2,
      dedupingInterval: l,
      revalidateOnFocus: A2,
      focusThrottleInterval: C,
      revalidateOnReconnect: R,
      reconnectWhen: W2,
      focusWhen: D2,
      revalidateFunction: d
    } = {
      // Current instance options
      // (includes default options)
      ...this.options,
      // Current call options.
      ...i
    }, K2 = (m) => {
      var _a;
      return (_a = d == null ? void 0 : d(this.resolveKey(e), m)) != null ? _a : this.revalidate(this.resolveKey(e), m);
    }, f = () => K2({ fetcher: a, dedupingInterval: l }), u = n ? this.get(this.resolveKey(e)) : o != null ? o : void 0, g = c2 ? f() : Promise.resolve(void 0), M = u ? Promise.resolve(u) : g;
    u && (t == null || t(u));
    const v2 = t ? this.subscribeData(this.resolveKey(e), t) : void 0, b = s ? this.subscribeErrors(this.resolveKey(e), s) : void 0, p2 = D2(f, {
      throttleInterval: C,
      enabled: A2
    }), w2 = W2(f, {
      enabled: R
    });
    return { unsubscribe: () => {
      v2 == null || v2(), b == null || b(), p2 == null || p2(), w2 == null || w2();
    }, dataPromise: M, revalidatePromise: g };
  }
};

// ../../node_modules/.pnpm/sswr@2.1.0_svelte@4.2.18/node_modules/sswr/dist/sswr.js
import { beforeUpdate as w, onDestroy as E2 } from "svelte";
function p() {
}
function D(t) {
  return t();
}
function q2(t) {
  t.forEach(D);
}
function x2(t) {
  return typeof t == "function";
}
function K(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function z(t, ...e) {
  if (t == null) {
    for (const r of e)
      r(void 0);
    return p;
  }
  const n = t.subscribe(...e);
  return n.unsubscribe ? () => n.unsubscribe() : n;
}
var v = [];
function A(t, e) {
  return {
    subscribe: y(t, e).subscribe
  };
}
function y(t, e = p) {
  let n;
  const r = /* @__PURE__ */ new Set();
  function i(u) {
    if (K(t, u) && (t = u, n)) {
      const f = !v.length;
      for (const s of r)
        s[1](), v.push(s, t);
      if (f) {
        for (let s = 0; s < v.length; s += 2)
          v[s][0](v[s + 1]);
        v.length = 0;
      }
    }
  }
  function a(u) {
    i(u(t));
  }
  function d(u, f = p) {
    const s = [u, f];
    return r.add(s), r.size === 1 && (n = e(i, a) || p), u(t), () => {
      r.delete(s), r.size === 0 && n && (n(), n = null);
    };
  }
  return { set: i, update: a, subscribe: d };
}
function S2(t, e, n) {
  const r = !Array.isArray(t), i = r ? [t] : t;
  if (!i.every(Boolean))
    throw new Error("derived() expects stores as input, got a falsy value");
  const a = e.length < 2;
  return A(n, (d, u) => {
    let f = false;
    const s = [];
    let h2 = 0, o = p;
    const l = () => {
      if (h2)
        return;
      o();
      const b = e(r ? s[0] : s, d, u);
      a ? d(b) : o = x2(b) ? b : p;
    }, g = i.map(
      (b, m) => z(
        b,
        (R) => {
          s[m] = R, h2 &= ~(1 << m), f && l();
        },
        () => {
          h2 |= 1 << m;
        }
      )
    );
    return f = true, l(), function() {
      q2(g), o(), f = false;
    };
  });
}
var O2 = class extends H {
  /**
   * Svelte specific use of SWR.
   */
  useSWR(e, n) {
    let r;
    const i = y(void 0, () => () => r == null ? void 0 : r()), a = y(void 0, () => () => r == null ? void 0 : r());
    w(() => {
      const o = (g) => {
        a.set(void 0), i.set(g);
      }, l = (g) => a.set(g);
      r || (r = this.subscribe(e, o, l, {
        loadInitialCache: true,
        ...n
      }).unsubscribe);
    }), E2(() => r == null ? void 0 : r());
    const d = (o, l) => this.mutate(this.resolveKey(e), o, {
      revalidateOptions: n,
      ...l
    }), u = (o) => this.revalidate(this.resolveKey(e), { ...n, ...o }), f = (o) => this.clear(this.resolveKey(e), o), s = S2([i, a], ([o, l]) => o === void 0 && l === void 0), h2 = S2([i, a], ([o, l]) => o !== void 0 && l === void 0);
    return { data: i, error: a, mutate: d, revalidate: u, clear: f, isLoading: s, isValid: h2 };
  }
};
var W = (t) => new O2(t);
var c = W();
var F2 = (t, e) => c.useSWR(t, e);

// svelte/use-chat.ts
import { derived, get, writable } from "svelte/store";
var getStreamedResponse = async (api, chatRequest, mutate, mutateStreamData, existingData, extraMetadata, previousMessages, abortControllerRef, generateId2, streamProtocol, onFinish, onResponse, onToolCall, sendExtraMessageFields, fetch2, keepLastMessageOnError) => {
  mutate(chatRequest.messages);
  const constructedMessagesPayload = sendExtraMessageFields ? chatRequest.messages : chatRequest.messages.map(
    ({
      role,
      content,
      name,
      data,
      annotations,
      function_call,
      tool_calls,
      tool_call_id,
      toolInvocations
    }) => ({
      role,
      content,
      ...name !== void 0 && { name },
      ...data !== void 0 && { data },
      ...annotations !== void 0 && { annotations },
      ...toolInvocations !== void 0 && { toolInvocations },
      // outdated function/tool call handling (TODO deprecate):
      tool_call_id,
      ...function_call !== void 0 && { function_call },
      ...tool_calls !== void 0 && { tool_calls }
    })
  );
  return await callChatApi({
    api,
    body: {
      messages: constructedMessagesPayload,
      data: chatRequest.data,
      ...extraMetadata.body,
      ...chatRequest.body,
      ...chatRequest.functions !== void 0 && {
        functions: chatRequest.functions
      },
      ...chatRequest.function_call !== void 0 && {
        function_call: chatRequest.function_call
      },
      ...chatRequest.tools !== void 0 && {
        tools: chatRequest.tools
      },
      ...chatRequest.tool_choice !== void 0 && {
        tool_choice: chatRequest.tool_choice
      }
    },
    streamProtocol,
    credentials: extraMetadata.credentials,
    headers: {
      ...extraMetadata.headers,
      ...chatRequest.headers
    },
    abortController: () => abortControllerRef,
    restoreMessagesOnFailure() {
      if (!keepLastMessageOnError) {
        mutate(previousMessages);
      }
    },
    onResponse,
    onUpdate(merged, data) {
      mutate([...chatRequest.messages, ...merged]);
      mutateStreamData([...existingData || [], ...data || []]);
    },
    onFinish,
    generateId: generateId2,
    onToolCall,
    fetch: fetch2
  });
};
var uniqueId = 0;
var store = {};
function isAssistantMessageWithCompletedToolCalls(message) {
  return message.role === "assistant" && message.toolInvocations && message.toolInvocations.length > 0 && message.toolInvocations.every((toolInvocation) => "result" in toolInvocation);
}
function countTrailingAssistantMessages(messages) {
  let count = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "assistant") {
      count++;
    } else {
      break;
    }
  }
  return count;
}
function useChat({
  api = "/api/chat",
  id,
  initialMessages = [],
  initialInput = "",
  sendExtraMessageFields,
  experimental_onFunctionCall,
  experimental_onToolCall,
  streamMode,
  streamProtocol,
  onResponse,
  onFinish,
  onError,
  onToolCall,
  credentials,
  headers,
  body,
  generateId: generateId2 = generateIdFunc,
  fetch: fetch2,
  keepLastMessageOnError = false,
  maxToolRoundtrips = 0
} = {}) {
  if (streamMode) {
    streamProtocol != null ? streamProtocol : streamProtocol = streamMode === "text" ? "text" : void 0;
  }
  const chatId = id || `chat-${uniqueId++}`;
  const key = `${api}|${chatId}`;
  const {
    data,
    mutate: originalMutate,
    isLoading: isSWRLoading
  } = F2(key, {
    fetcher: () => store[key] || initialMessages,
    fallbackData: initialMessages
  });
  const streamData = writable(void 0);
  const loading = writable(false);
  data.set(initialMessages);
  const mutate = (data2) => {
    store[key] = data2;
    return originalMutate(data2);
  };
  const messages = data;
  let abortController = null;
  const extraMetadata = {
    credentials,
    headers,
    body
  };
  const error = writable(void 0);
  async function triggerRequest(chatRequest) {
    const messagesSnapshot = get(messages);
    const messageCount = messagesSnapshot.length;
    try {
      error.set(void 0);
      loading.set(true);
      abortController = new AbortController();
      await processChatStream({
        getStreamedResponse: () => getStreamedResponse(
          api,
          chatRequest,
          mutate,
          (data2) => {
            streamData.set(data2);
          },
          get(streamData),
          extraMetadata,
          get(messages),
          abortController,
          generateId2,
          streamProtocol,
          onFinish,
          onResponse,
          onToolCall,
          sendExtraMessageFields,
          fetch2,
          keepLastMessageOnError
        ),
        experimental_onFunctionCall,
        experimental_onToolCall,
        updateChatRequest: (chatRequestParam) => {
          chatRequest = chatRequestParam;
        },
        getCurrentMessages: () => get(messages)
      });
      abortController = null;
    } catch (err) {
      if (err.name === "AbortError") {
        abortController = null;
        return null;
      }
      if (onError && err instanceof Error) {
        onError(err);
      }
      error.set(err);
    } finally {
      loading.set(false);
    }
    const newMessagesSnapshot = get(messages);
    const lastMessage = newMessagesSnapshot[newMessagesSnapshot.length - 1];
    if (
      // ensure we actually have new messages (to prevent infinite loops in case of errors):
      newMessagesSnapshot.length > messageCount && // ensure there is a last message:
      lastMessage != null && // check if the feature is enabled:
      maxToolRoundtrips > 0 && // check that roundtrip is possible:
      isAssistantMessageWithCompletedToolCalls(lastMessage) && // limit the number of automatic roundtrips:
      countTrailingAssistantMessages(newMessagesSnapshot) <= maxToolRoundtrips
    ) {
      await triggerRequest({ messages: newMessagesSnapshot });
    }
  }
  const append = async (message, {
    options,
    functions,
    function_call,
    tools,
    tool_choice,
    data: data2,
    headers: headers2,
    body: body2
  } = {}) => {
    if (!message.id) {
      message.id = generateId2();
    }
    const requestOptions = {
      headers: headers2 != null ? headers2 : options == null ? void 0 : options.headers,
      body: body2 != null ? body2 : options == null ? void 0 : options.body
    };
    const chatRequest = {
      messages: get(messages).concat(message),
      options: requestOptions,
      headers: requestOptions.headers,
      body: requestOptions.body,
      data: data2,
      ...functions !== void 0 && { functions },
      ...function_call !== void 0 && { function_call },
      ...tools !== void 0 && { tools },
      ...tool_choice !== void 0 && { tool_choice }
    };
    return triggerRequest(chatRequest);
  };
  const reload = async ({
    options,
    functions,
    function_call,
    tools,
    tool_choice,
    data: data2,
    headers: headers2,
    body: body2
  } = {}) => {
    const messagesSnapshot = get(messages);
    if (messagesSnapshot.length === 0)
      return null;
    const requestOptions = {
      headers: headers2 != null ? headers2 : options == null ? void 0 : options.headers,
      body: body2 != null ? body2 : options == null ? void 0 : options.body
    };
    const lastMessage = messagesSnapshot.at(-1);
    if ((lastMessage == null ? void 0 : lastMessage.role) === "assistant") {
      const chatRequest2 = {
        messages: messagesSnapshot.slice(0, -1),
        options: requestOptions,
        headers: requestOptions.headers,
        body: requestOptions.body,
        data: data2,
        ...functions !== void 0 && { functions },
        ...function_call !== void 0 && { function_call },
        ...tools !== void 0 && { tools },
        ...tool_choice !== void 0 && { tool_choice }
      };
      return triggerRequest(chatRequest2);
    }
    const chatRequest = {
      messages: messagesSnapshot,
      options: requestOptions,
      headers: requestOptions.headers,
      body: requestOptions.body,
      data: data2
    };
    return triggerRequest(chatRequest);
  };
  const stop = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  const setMessages = (messagesArg) => {
    if (typeof messagesArg === "function") {
      messagesArg = messagesArg(get(messages));
    }
    mutate(messagesArg);
  };
  const input = writable(initialInput);
  const handleSubmit = (event, options = {}) => {
    var _a, _b, _c, _d, _e;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = get(input);
    if (!inputValue && !options.allowEmptySubmit)
      return;
    const requestOptions = {
      headers: (_c = options.headers) != null ? _c : (_b = options.options) == null ? void 0 : _b.headers,
      body: (_e = options.body) != null ? _e : (_d = options.options) == null ? void 0 : _d.body
    };
    const chatRequest = {
      messages: !inputValue && options.allowEmptySubmit ? get(messages) : get(messages).concat({
        id: generateId2(),
        content: inputValue,
        role: "user",
        createdAt: /* @__PURE__ */ new Date()
      }),
      options: requestOptions,
      body: requestOptions.body,
      headers: requestOptions.headers,
      data: options.data
    };
    triggerRequest(chatRequest);
    input.set("");
  };
  const isLoading = derived(
    [isSWRLoading, loading],
    ([$isSWRLoading, $loading]) => {
      return $isSWRLoading || $loading;
    }
  );
  const addToolResult = ({
    toolCallId,
    result
  }) => {
    var _a;
    const messagesSnapshot = (_a = get(messages)) != null ? _a : [];
    const updatedMessages = messagesSnapshot.map(
      (message, index, arr) => (
        // update the tool calls in the last assistant message:
        index === arr.length - 1 && message.role === "assistant" && message.toolInvocations ? {
          ...message,
          toolInvocations: message.toolInvocations.map(
            (toolInvocation) => toolInvocation.toolCallId === toolCallId ? { ...toolInvocation, result } : toolInvocation
          )
        } : message
      )
    );
    messages.set(updatedMessages);
    const lastMessage = updatedMessages[updatedMessages.length - 1];
    if (isAssistantMessageWithCompletedToolCalls(lastMessage)) {
      triggerRequest({ messages: updatedMessages });
    }
  };
  return {
    messages,
    error,
    append,
    reload,
    stop,
    setMessages,
    input,
    handleSubmit,
    isLoading,
    data: streamData,
    addToolResult
  };
}

// svelte/use-completion.ts
import { callCompletionApi } from "@ai-sdk/ui-utils";
import { derived as derived2, get as get2, writable as writable2 } from "svelte/store";
var uniqueId2 = 0;
var store2 = {};
function useCompletion({
  api = "/api/completion",
  id,
  initialCompletion = "",
  initialInput = "",
  credentials,
  headers,
  body,
  streamMode,
  streamProtocol,
  onResponse,
  onFinish,
  onError,
  fetch: fetch2
} = {}) {
  if (streamMode) {
    streamProtocol != null ? streamProtocol : streamProtocol = streamMode === "text" ? "text" : void 0;
  }
  const completionId = id || `completion-${uniqueId2++}`;
  const key = `${api}|${completionId}`;
  const {
    data,
    mutate: originalMutate,
    isLoading: isSWRLoading
  } = F2(key, {
    fetcher: () => store2[key] || initialCompletion,
    fallbackData: initialCompletion
  });
  const streamData = writable2(void 0);
  const loading = writable2(false);
  data.set(initialCompletion);
  const mutate = (data2) => {
    store2[key] = data2;
    return originalMutate(data2);
  };
  const completion = data;
  const error = writable2(void 0);
  let abortController = null;
  const complete = async (prompt, options) => {
    const existingData = get2(streamData);
    return callCompletionApi({
      api,
      prompt,
      credentials,
      headers: {
        ...headers,
        ...options == null ? void 0 : options.headers
      },
      body: {
        ...body,
        ...options == null ? void 0 : options.body
      },
      streamProtocol,
      setCompletion: mutate,
      setLoading: (loadingState) => loading.set(loadingState),
      setError: (err) => error.set(err),
      setAbortController: (controller) => {
        abortController = controller;
      },
      onResponse,
      onFinish,
      onError,
      onData(data2) {
        streamData.set([...existingData || [], ...data2 || []]);
      },
      fetch: fetch2
    });
  };
  const stop = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  const setCompletion = (completion2) => {
    mutate(completion2);
  };
  const input = writable2(initialInput);
  const handleSubmit = (event) => {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = get2(input);
    return inputValue ? complete(inputValue) : void 0;
  };
  const isLoading = derived2(
    [isSWRLoading, loading],
    ([$isSWRLoading, $loading]) => {
      return $isSWRLoading || $loading;
    }
  );
  return {
    completion,
    complete,
    error,
    stop,
    setCompletion,
    input,
    handleSubmit,
    isLoading,
    data: streamData
  };
}

// svelte/use-assistant.ts
import { isAbortError } from "@ai-sdk/provider-utils";
import { generateId, readDataStream } from "@ai-sdk/ui-utils";
import { get as get3, writable as writable3 } from "svelte/store";
var getOriginalFetch = () => fetch;
var uniqueId3 = 0;
var store3 = {};
function useAssistant({
  api,
  threadId: threadIdParam,
  credentials,
  headers,
  body,
  onError,
  fetch: fetch2
}) {
  const threadIdStore = writable3(threadIdParam);
  const key = `${api}|${threadIdParam != null ? threadIdParam : `completion-${uniqueId3++}`}`;
  const messages = writable3(store3[key] || []);
  const input = writable3("");
  const status = writable3("awaiting_message");
  const error = writable3(void 0);
  let abortController = null;
  const mutateMessages = (newMessages) => {
    store3[key] = newMessages;
    messages.set(newMessages);
  };
  async function append(message, requestOptions) {
    var _a, _b, _c, _d, _e;
    status.set("in_progress");
    abortController = new AbortController();
    mutateMessages([
      ...get3(messages),
      { ...message, id: (_a = message.id) != null ? _a : generateId() }
    ]);
    input.set("");
    try {
      const actualFetch = fetch2 != null ? fetch2 : getOriginalFetch();
      const response = await actualFetch(api, {
        method: "POST",
        credentials,
        signal: abortController.signal,
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          ...body,
          // always use user-provided threadId when available:
          threadId: (_b = threadIdParam != null ? threadIdParam : get3(threadIdStore)) != null ? _b : null,
          message: message.content,
          // optional request data:
          data: requestOptions == null ? void 0 : requestOptions.data
        })
      });
      if (!response.ok) {
        throw new Error(
          (_c = await response.text()) != null ? _c : "Failed to fetch the assistant response."
        );
      }
      if (response.body == null) {
        throw new Error("The response body is empty.");
      }
      for await (const { type, value } of readDataStream(
        response.body.getReader()
      )) {
        switch (type) {
          case "assistant_message": {
            mutateMessages([
              ...get3(messages),
              {
                id: value.id,
                role: value.role,
                content: value.content[0].text.value
              }
            ]);
            break;
          }
          case "text": {
            mutateMessages(
              get3(messages).map((msg, index, array) => {
                if (index === array.length - 1) {
                  return { ...msg, content: msg.content + value };
                }
                return msg;
              })
            );
            break;
          }
          case "data_message": {
            mutateMessages([
              ...get3(messages),
              {
                id: (_d = value.id) != null ? _d : generateId(),
                role: "data",
                content: "",
                data: value.data
              }
            ]);
            break;
          }
          case "assistant_control_data": {
            threadIdStore.set(value.threadId);
            mutateMessages(
              get3(messages).map((msg, index, array) => {
                if (index === array.length - 1) {
                  return { ...msg, id: value.messageId };
                }
                return msg;
              })
            );
            break;
          }
          case "error": {
            error.set(new Error(value));
            break;
          }
        }
      }
    } catch (err) {
      if (isAbortError(error) && ((_e = abortController == null ? void 0 : abortController.signal) == null ? void 0 : _e.aborted)) {
        abortController = null;
        return;
      }
      if (onError && err instanceof Error) {
        onError(err);
      }
      error.set(err);
    } finally {
      abortController = null;
      status.set("awaiting_message");
    }
  }
  function setMessages(messages2) {
    mutateMessages(messages2);
  }
  function stop() {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  }
  async function submitMessage(event, requestOptions) {
    var _a;
    (_a = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a.call(event);
    const inputValue = get3(input);
    if (!inputValue)
      return;
    await append({ role: "user", content: inputValue }, requestOptions);
  }
  return {
    messages,
    error,
    threadId: threadIdStore,
    input,
    append,
    submitMessage,
    status,
    setMessages,
    stop
  };
}
export {
  useAssistant,
  useChat,
  useCompletion
};
//# sourceMappingURL=index.mjs.map