"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IBuilder = void 0;
class IBuilder {
    constructor(a) {
        Object.defineProperty(this, "a", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: a
        });
    }
    build() {
        return this.a;
    }
}
exports.IBuilder = IBuilder;
