"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKnownError = exports.ok = exports.error = exports.errorCode = exports.exists = exports.unwrapResultType = exports.typeFromProps = exports.guardAll = void 0;
var propertiesMatcher_js_1 = require("./utils/propertiesMatcher.js");
Object.defineProperty(exports, "guardAll", { enumerable: true, get: function () { return propertiesMatcher_js_1.guardAll; } });
Object.defineProperty(exports, "typeFromProps", { enumerable: true, get: function () { return propertiesMatcher_js_1.typeFromProps; } });
function unwrapResultType(res) {
    if ("error-code" in res) {
        throw new Error(res["error-code"][1]);
    }
    else if ("error" in res) {
        throw new Error(res["error"]);
    }
    else {
        return res.result;
    }
}
exports.unwrapResultType = unwrapResultType;
/** Used to check if the file exists before hand */
const exists = (effects, props) => effects.metadata(props).then((_) => true, (_) => false);
exports.exists = exists;
const errorCode = (code, error) => ({
    "error-code": [code, error],
});
exports.errorCode = errorCode;
const error = (error) => ({ error });
exports.error = error;
exports.ok = { result: null };
const isKnownError = (e) => e instanceof Object && ("error" in e || "error-code" in e);
exports.isKnownError = isKnownError;
