# Start SDK

### About

For making the patterns that are wanted in making services for the startOS.

### Generate: Config class from legacy ConfigSpec

```sh
cat utils/test/config.json | deno run https://deno.land/x/embassyd_sdk/scripts/oldSpecToBuilder.ts "../../mod" |deno fmt -  > utils/test/output.ts
```
