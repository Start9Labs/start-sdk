export { guardAll, typeFromProps } from "./utils/propertiesMatcher.js";
export function unwrapResultType(res) {
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
/** Used to check if the file exists before hand */
export const exists = (effects, props) => effects.metadata(props).then((_) => true, (_) => false);
export const errorCode = (code, error) => ({
    "error-code": [code, error],
});
export const error = (error) => ({ error });
export const ok = { result: null };
export const isKnownError = (e) => e instanceof Object && ("error" in e || "error-code" in e);
