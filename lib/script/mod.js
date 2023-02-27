"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configTypes = exports.Backups = exports.config = exports.C = exports.util = exports.healthUtil = exports.migrations = exports.compat = exports.types = exports.YAML = exports.matches = void 0;
require("./_dnt.polyfills.js");
var dependencies_js_1 = require("./dependencies.js");
Object.defineProperty(exports, "matches", { enumerable: true, get: function () { return dependencies_js_1.matches; } });
Object.defineProperty(exports, "YAML", { enumerable: true, get: function () { return dependencies_js_1.YAML; } });
exports.types = __importStar(require("./types.js"));
exports.compat = __importStar(require("./compat/mod.js"));
exports.migrations = __importStar(require("./migrations.js"));
exports.healthUtil = __importStar(require("./healthUtil.js"));
exports.util = __importStar(require("./util.js"));
exports.C = __importStar(require("./config/mod.js"));
exports.config = __importStar(require("./config/mod.js"));
var backups_js_1 = require("./backups.js");
Object.defineProperty(exports, "Backups", { enumerable: true, get: function () { return backups_js_1.Backups; } });
exports.configTypes = __importStar(require("./types/config-types.js"));
