import * as dntShim from "../_dnt.test_shims.js";
import { Config } from "./config.js";
import { Value } from "./value.js";
import { expect } from "../deps/deno.land/x/expect@v0.2.9/mod.js";
const { test } = dntShim.Deno;
test("String", () => {
    const bitcoinPropertiesBuilt = Config.of({
        "peer-tor-address": Value.string({
            name: "Peer tor address",
            default: "",
            description: "The Tor address of the peer interface",
            warning: null,
            nullable: false,
            masked: true,
            placeholder: null,
            pattern: null,
            "pattern-description": null,
            textarea: null,
        }),
    }).build();
    expect(JSON.stringify(bitcoinPropertiesBuilt)).toEqual(
    /*json*/ `{
  "peer-tor-address": {
    "type": "string",
    "name": "Peer tor address",
    "default": "",
    "description": "The Tor address of the peer interface",
    "warning": null,
    "nullable": false,
    "masked": true,
    "placeholder": null,
    "pattern": null,
    "pattern-description": null,
    "textarea": null
  }}`
        .replaceAll("\n", " ")
        .replaceAll(/\s{2,}/g, "")
        .replaceAll(": ", ":"));
});
