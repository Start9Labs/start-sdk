import { InputSpec, ValueSpecUnion } from "../configTypes"
import { Config } from "."
import { LazyBuild } from "./config"
import { Parser, anyOf, literals, object } from "ts-matches"

/**
 * Used in the the Value.select { @link './value.ts' }
 * to indicate the type of select variants that are available. The key for the record passed in will be the
 * key to the tag.id in the Value.select
```ts
 
export const disabled = Config.of({});
export const size = Value.number({
  name: "Max Chain Size",
  default: 550,
  description: "Limit of blockchain size on disk.",
  warning: "Increasing this value will require re-syncing your node.",
  required: true,
  range: "[550,1000000)",
  integral: true,
  units: "MiB",
  placeholder: null,
});
export const automatic = Config.of({ size: size });
export const size1 = Value.number({
  name: "Failsafe Chain Size",
  default: 65536,
  description: "Prune blockchain if size expands beyond this.",
  warning: null,
  required: true,
  range: "[550,1000000)",
  integral: true,
  units: "MiB",
  placeholder: null,
});
export const manual = Config.of({ size: size1 });
export const pruningSettingsVariants = Variants.of({
  disabled: { name: "Disabled", spec: disabled },
  automatic: { name: "Automatic", spec: automatic },
  manual: { name: "Manual", spec: manual },
});
export const pruning = Value.union(
  {
    name: "Pruning Settings",
    description:
      '- Disabled: Disable pruning\n- Automatic: Limit blockchain size on disk to a certain number of megabytes\n- Manual: Prune blockchain with the "pruneblockchain" RPC\n',
    warning: null,
    required: true,
    default: "disabled",
  },
  pruningSettingsVariants
);
```
 */
export class Variants<Type, WD, ConfigType> {
  private constructor(
    public build: LazyBuild<WD, ConfigType, ValueSpecUnion["variants"]>,
    public validator: Parser<unknown, Type>,
  ) {}
  // A extends {
  //   [key: string]: {
  //     name: string
  //     spec: InputSpec
  //   }
  // },
  static of<
    TypeMap extends Record<string, Record<string, any>>,
    WrapperData,
    ConfigType,
  >(a: {
    [K in keyof TypeMap]: {
      name: string
      spec: Config<TypeMap[K], WrapperData, ConfigType>
    }
  }) {
    type TypeOut = {
      [K in keyof TypeMap & string]: {
        unionSelectKey: K
        unionValueKey: TypeMap[K]
      }
    }[keyof TypeMap & string]

    const validator = anyOf(
      ...Object.entries(a).map(([name, { spec }]) =>
        object({
          unionSelectKey: literals(name),
          unionValueKey: spec.validator,
        }),
      ),
    ) as Parser<unknown, TypeOut>

    return new Variants<TypeOut, WrapperData, ConfigType>(async (options) => {
      const variants = {} as {
        [K in keyof TypeMap]: { name: string; spec: InputSpec }
      }
      for (const key in a) {
        const value = a[key]
        variants[key] = {
          name: value.name,
          spec: await value.spec.build(options),
        }
      }
      return variants
    }, validator)
  }
}
