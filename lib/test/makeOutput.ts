import { oldSpecToBuilder } from "../../scripts/oldSpecToBuilder"

oldSpecToBuilder(
  // Make the location
  "./lib/test/output.ts",
  // Put the config here
  {
    "tor-address": {
      name: "Tor Address",
      description: "The Tor address.",
      type: "pointer",
      subtype: "package",
      "package-id": "syncthing",
      target: "tor-address",
      interface: "main",
    },
    username: {
      type: "string",
      name: "Username",
      description:
        "The user for loging into the administration page of syncthing",
      nullable: false,
      copyable: true,
      masked: false,
      default: "admin",
    },
    password: {
      type: "string",
      name: "Password",
      description:
        "The password for loging into the administration page of syncthing",
      nullable: false,
      copyable: true,
      masked: true,
      default: {
        charset: "a-z,A-Z,0-9",
        len: 22,
      },
    },
  },
  {
    // convert this to `@start9labs/start-sdk/lib` for conversions
    startSdk: "@start9labs/start-sdk",
    wrapperData: "./output.wrapperData",
  },
)
