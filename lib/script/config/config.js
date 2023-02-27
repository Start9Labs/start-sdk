"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const builder_js_1 = require("./builder.js");
class Config extends builder_js_1.IBuilder {
    static empty() {
        return new Config({});
    }
    static withValue(key, value) {
        return Config.empty().withValue(key, value);
    }
    static addValue(key, value) {
        return Config.empty().withValue(key, value);
    }
    static of(spec) {
        // deno-lint-ignore no-explicit-any
        const answer = {};
        for (const key in spec) {
            // deno-lint-ignore no-explicit-any
            answer[key] = spec[key].build();
        }
        return new Config(answer);
    }
    withValue(key, value) {
        return new Config({
            ...this.a,
            [key]: value.build(),
        });
    }
    addValue(key, value) {
        return new Config({
            ...this.a,
            [key]: value.build(),
        });
    }
}
exports.Config = Config;
