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

// solid/index.ts
var solid_exports = {};
__export(solid_exports, {
  useChat: () => useChat,
  useCompletion: () => useCompletion
});
module.exports = __toCommonJS(solid_exports);
var import_solid = require("@ai-sdk/solid");
var useChat = import_solid.useChat;
var useCompletion = import_solid.useCompletion;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useChat,
  useCompletion
});
//# sourceMappingURL=index.js.map