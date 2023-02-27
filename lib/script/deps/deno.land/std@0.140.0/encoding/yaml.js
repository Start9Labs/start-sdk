"use strict";
// Ported from js-yaml v3.13.1:
// https://github.com/nodeca/js-yaml/commit/665aadda42349dcae869f12040d9b10ef18d12da
// Copyright 2011-2015 by Vitaly Puzrin. All rights reserved. MIT license.
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSON_SCHEMA = exports.FAILSAFE_SCHEMA = exports.EXTENDED_SCHEMA = exports.DEFAULT_SCHEMA = exports.CORE_SCHEMA = exports.Type = exports.stringify = exports.parseAll = exports.parse = void 0;
var parse_js_1 = require("./_yaml/parse.js");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parse_js_1.parse; } });
Object.defineProperty(exports, "parseAll", { enumerable: true, get: function () { return parse_js_1.parseAll; } });
var stringify_js_1 = require("./_yaml/stringify.js");
Object.defineProperty(exports, "stringify", { enumerable: true, get: function () { return stringify_js_1.stringify; } });
var type_js_1 = require("./_yaml/type.js");
Object.defineProperty(exports, "Type", { enumerable: true, get: function () { return type_js_1.Type; } });
var mod_js_1 = require("./_yaml/schema/mod.js");
Object.defineProperty(exports, "CORE_SCHEMA", { enumerable: true, get: function () { return mod_js_1.CORE_SCHEMA; } });
Object.defineProperty(exports, "DEFAULT_SCHEMA", { enumerable: true, get: function () { return mod_js_1.DEFAULT_SCHEMA; } });
Object.defineProperty(exports, "EXTENDED_SCHEMA", { enumerable: true, get: function () { return mod_js_1.EXTENDED_SCHEMA; } });
Object.defineProperty(exports, "FAILSAFE_SCHEMA", { enumerable: true, get: function () { return mod_js_1.FAILSAFE_SCHEMA; } });
Object.defineProperty(exports, "JSON_SCHEMA", { enumerable: true, get: function () { return mod_js_1.JSON_SCHEMA; } });
