import { SmtpValue } from "../types"
import { Config, TypeAsConfigOf } from "./builder/config"
import { Value } from "./builder/value"
import { Variants } from "./builder/variants"

export const smtpConfig = Value.union(
  {
    name: "SMTP",
    description: "Optionally provide an SMTP server for sending email",
    required: { default: "disabled" },
  },
  Variants.of({
    disabled: { name: "Disabled", spec: Config.of({}) },
    system: { name: "System Credentials", spec: Config.of({}) },
    custom: {
      name: "Custom Credentials",
      spec: Config.of<TypeAsConfigOf<SmtpValue>>({
        server: Value.text({
          name: "SMTP Server",
          required: {
            default: null,
          },
        }),
        port: Value.number({
          name: "Port",
          required: { default: 587 },
          min: 1,
          max: 65535,
          integer: true,
        }),
        from: Value.text({
          name: "From Address",
          required: {
            default: null,
          },
          placeholder: "<name>test@example.com",
          inputmode: "email",
        }),
        login: Value.text({
          name: "Login",
          required: {
            default: null,
          },
        }),
        password: Value.text({
          name: "Password",
          required: false,
        }),
        tls: Value.toggle({
          name: "Require Transport Security",
          default: true,
          description:
            "Require TLS transport security. If disabled, email will use plaintext by default and TLS via STARTTLS <strong>if the SMTP server supports it</strong>. If enabled, email will refuse to connect unless the server supports STARTTLS.",
        }),
      }),
    },
  }),
)
