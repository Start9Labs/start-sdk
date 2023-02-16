// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt@0.33.1/mod.ts";

await emptyDir("./lib");
await build({
  entryPoints: ["./mod.ts"],
  outDir: "./lib",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "embassy-sdk-ts",
    version: Deno.args[0],
    description: "Sdk that is used by the embassy packages, and the OS.",
    license: "MIT",
    sideEffects: false,
    repository: {
      type: "git",
      url: "git+https://github.com/Start9Labs/embassy-sdk-ts.git",
    },
    bugs: {
      url: "https://github.com/Start9Labs/embassy-sdk-ts/issues",
    },
  },
});

// post build steps
Deno.copyFileSync("./README.md", "lib/README.md");
