import { AddressReceipt } from "./AddressReceipt"
import { InterfaceReceipt } from "./interfaceReceipt"

export const exportInterfaces = (
  _firstProof: AddressReceipt,
  ..._rest: AddressReceipt[]
) => ({} as InterfaceReceipt)
export default exportInterfaces
