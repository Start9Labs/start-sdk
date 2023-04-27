import { Effects } from "../../types"
import { CheckResult } from "./CheckResult"
import { timeoutPromise } from "./index"

/**
 * This is a helper function to check if a web url is reachable.
 * @param url
 * @param createSuccess
 * @returns
 */
export const checkWebUrl = async (
  effects: Effects,
  url: string,
  {
    timeout = 1000,
    successMessage = `Reached ${url}`,
    errorMessage = `Error while fetching URL: ${url}`,
  } = {},
): Promise<CheckResult> => {
  return Promise.race([effects.fetch(url), timeoutPromise(timeout)])
    .then((x) => ({
      status: "passing" as const,
      message: successMessage,
    }))
    .catch((e) => {
      effects.console.warn(`Error while fetching URL: ${url}`)
      effects.console.error(JSON.stringify(e))
      effects.console.error(e.toString())
      return { status: "failing" as const, message: errorMessage }
    })
}
