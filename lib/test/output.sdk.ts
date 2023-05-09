import { StartSdk } from "../StartSdk"

export type Manifest = any
export const sdk = StartSdk.of()
  .withManifest({} as any)
  .withStore<{ storeRoot: { storeLeaf: "value" } }>()
  .build(true)
