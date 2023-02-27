export class IBuilder {
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
