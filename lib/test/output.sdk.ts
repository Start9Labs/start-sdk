import { StartSDK } from "../StartSDK"

export type WrapperData = any
export const sdk = StartSDK.of()
  .withManifest<WrapperData>()
  .withStore<{ storeRoot: { storeLeaf: "value" } }>()
  .build()
