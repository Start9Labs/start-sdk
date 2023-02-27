"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchError = exports.guardDurationAboveMinimum = exports.runHealthScript = exports.checkWebUrl = void 0;
const util_js_1 = require("./util.js");
const checkWebUrl = (url) => {
    return async (effects, duration) => {
        let errorValue;
        if (
        // deno-lint-ignore no-cond-assign
        errorValue = (0, exports.guardDurationAboveMinimum)({ duration, minimumTime: 5000 }))
            return errorValue;
        return await effects.fetch(url)
            .then((_) => util_js_1.ok)
            .catch((e) => {
            effects.warn(`Error while fetching URL: ${url}`);
            effects.error(JSON.stringify(e));
            effects.error(e.toString());
            return (0, util_js_1.error)(`Error while fetching URL: ${url}`);
        });
    };
};
exports.checkWebUrl = checkWebUrl;
const runHealthScript = ({ command, args }) => async (effects, _duration) => {
    const res = await effects.runCommand({ command, args });
    if ("result" in res) {
        return { result: null };
    }
    else {
        return res;
    }
};
exports.runHealthScript = runHealthScript;
// Ensure the starting duration is pass a minimum
const guardDurationAboveMinimum = (input) => (input.duration <= input.minimumTime) ? (0, util_js_1.errorCode)(60, "Starting") : null;
exports.guardDurationAboveMinimum = guardDurationAboveMinimum;
const catchError = (effects) => (e) => {
    if ((0, util_js_1.isKnownError)(e))
        return e;
    effects.error(`Health check failed: ${e}`);
    return (0, util_js_1.error)("Error while running health check");
};
exports.catchError = catchError;
