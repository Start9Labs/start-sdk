import { Config } from "./config.ts";
import { Value } from "./value.ts";
import { expect } from "https://deno.land/x/expect@v0.2.9/mod.ts";
const { test } = Deno;

test("String", () => {
  const bitcoinPropertiesBuilt: {
    "peer-tor-address": {
      name: string;
      description: string | null;
      type: "string";
    };
  } = Config.of(
    {
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
    },
  ).build();
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
      .replaceAll(": ", ":"),
  );
});
