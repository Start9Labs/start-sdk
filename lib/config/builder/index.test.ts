describe("test", () => {
  test("test", () => {
    expect(true).toEqual(true);
  });
});
import { Config } from "./config";
import { Value } from "./value";
describe("builder tests", () => {
  test("String", () => {
    const bitcoinPropertiesBuilt: {
      "peer-tor-address": {
        name: string;
        description: string | null;
        type: "string";
      };
    } = Config.of({
      "peer-tor-address": Value.string({
        name: "Peer tor address",
        default: "",
        description: "The Tor address of the peer interface",
        warning: null,
        nullable: false,
        masked: true,
        placeholder: null,
        pattern: null,
        patternDescription: null,
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
      "patternDescription": null,
      "textarea": null
    }}`
        .replaceAll("\n", " ")
        .replaceAll(/\s{2,}/g, "")
        .replaceAll(": ", ":")
    );
  });
});
