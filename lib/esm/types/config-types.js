// sometimes the type checker needs just a little bit of help
export function isValueSpecListOf(t, s) {
    return t.subtype === s;
}
