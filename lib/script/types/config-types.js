"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValueSpecListOf = void 0;
// sometimes the type checker needs just a little bit of help
function isValueSpecListOf(t, s) {
    return t.subtype === s;
}
exports.isValueSpecListOf = isValueSpecListOf;
