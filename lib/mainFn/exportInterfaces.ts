import { AddressReceipt } from "./AddressReceipt"
import { InterfaceReceipt } from "./interfaceReceipt"

/**
 * Takes a list of addressReceipts
 *
 * Returns an interfaceReceipt, which is needed to create the service daemons
 */
export const exportInterfaces = (
  _firstProof: AddressReceipt,
  ..._rest: AddressReceipt[]
) => ({} as InterfaceReceipt)
export default exportInterfaces
