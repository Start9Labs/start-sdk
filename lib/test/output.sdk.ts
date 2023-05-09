import { StartSDK } from "../StartSDK"

export type Manifest = any
export const sdk = StartSDK.of()
  .withManifest<Manifest>()
  .withStore<{ storeRoot: { storeLeaf: "value" } }>()
  .build()
