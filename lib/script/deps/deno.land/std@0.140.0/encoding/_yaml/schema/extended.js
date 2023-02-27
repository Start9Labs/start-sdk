"use strict";
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.extended = void 0;
const schema_js_1 = require("../schema.js");
const mod_js_1 = require("../type/mod.js");
const default_js_1 = require("./default.js");
// Extends JS-YAML default schema with additional JavaScript types
// It is not described in the YAML specification.
exports.extended = new schema_js_1.Schema({
    explicit: [mod_js_1.regexp, mod_js_1.undefinedType],
    include: [default_js_1.def],
});
