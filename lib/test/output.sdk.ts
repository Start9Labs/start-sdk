import { StartSdk } from "../StartSdk"

export type Manifest = any
export const sdk = StartSdk.of()
  .withManifest<Manifest>()
  .withStore<{ storeRoot: { storeLeaf: "value" } }>()
  .build()
