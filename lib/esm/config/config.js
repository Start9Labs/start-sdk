import { IBuilder } from "./builder.js";
export class Config extends IBuilder {
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
