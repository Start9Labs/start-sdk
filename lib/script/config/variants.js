"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Variants = void 0;
const builder_js_1 = require("./builder.js");
class Variants extends builder_js_1.IBuilder {
    static of(a) {
        // deno-lint-ignore no-explicit-any
        const variants = {};
        for (const key in a) {
            // deno-lint-ignore no-explicit-any
            variants[key] = a[key].build();
        }
        return new Variants(variants);
    }
    static empty() {
        return Variants.of({});
    }
    static withVariant(key, value) {
        return Variants.empty().withVariant(key, value);
    }
    withVariant(key, value) {
        return new Variants({
            ...this.a,
            [key]: value.build(),
        });
    }
}
exports.Variants = Variants;
