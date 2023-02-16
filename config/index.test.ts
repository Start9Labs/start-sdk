import { Config } from "./config.ts";
import { Pointer } from "./pointer.ts";
import { Value } from "./value.ts";
import { expect } from "https://deno.land/x/expect@v0.2.9/mod.ts";
const { test } = Deno;

test("Pointer", () => {
  const bitcoinPropertiesBuilt: {
    "peer-tor-address": {
      name: string;
      description: string;
      type: "pointer";
      subtype: "package";
      "package-id": string;
      target: "tor-address";
      interface: string;
    };
  } = Config.withValue(
    "peer-tor-address",
    Value.pointer(
      Pointer.packageTorAddress({
        name: "Peer Tor Address",
        description: "The Tor address of the peer interface",
        "package-id": "bitcoind",
        interface: "peer",
        warning: null,
      }),
    ),
  ).build();
  expect(JSON.stringify(bitcoinPropertiesBuilt)).toEqual(
    /*json*/ `{
  "peer-tor-address": {
    "type": "pointer",
    "subtype": "package",
    "target": "tor-address",
    "name": "Peer Tor Address",
    "description": "The Tor address of the peer interface",
    "package-id": "bitcoind",
    "interface": "peer",
    "warning": null
  }}`
      .replaceAll("\n", " ")
      .replaceAll(/\s{2,}/g, "")
      .replaceAll(": ", ":"),
  );
});
