# Start SDK

## Config Conversion

- Copy the old config json (from the getConfig.ts)
- Install the start-sdk with `npm i`
- paste the config into make output (second param)
- Make the third param

```ts
  {
    startSdk: "start-sdk/lib",
  }
```

- run the script `npm run buildOutput` to make the output.ts
- Copy this whole file into startos/procedures/config/spec.ts
- Fix all the TODO
