import { Pattern } from "../config/configTypes"
import * as regexes from "./regexes"
export const ipv6: Pattern = {
  regex: regexes.ipv6.toString(),
  description: "",
}

export const ipv4: Pattern = { regex: regexes.ipv4.toString(), description: "" }

export const url: Pattern = { regex: regexes.url.toString(), description: "" }

export const local: Pattern = {
  regex: regexes.local.toString(),
  description: "",
}

export const localHost: Pattern = {
  regex: regexes.localHost.toString(),
  description: "",
}
export const onion: Pattern = {
  regex: regexes.onion.toString(),
  description: "",
}

export const onionHost: Pattern = {
  regex: regexes.onionHost.toString(),
  description: "",
}
export const ascii: Pattern = {
  regex: regexes.ascii.toString(),
  description: "",
}
export const email: Pattern = {
  regex: regexes.email.toString(),
  description: "",
}
export const base64: Pattern = {
  regex: regexes.base64.toString(),
  description: "",
}
