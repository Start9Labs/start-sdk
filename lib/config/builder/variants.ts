import { InputSpec } from "../configTypes";
import { BuilderExtract, IBuilder } from "./builder";
import { Config } from ".";

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
export class Variants<
  A extends {
    [key: string]: {
      name: string;
      spec: InputSpec;
    };
  }
> extends IBuilder<A> {
  static of<
    A extends {
      [key: string]: { name: string; spec: Config<InputSpec> };
    }
  >(a: A) {
    const variants: {
      [K in keyof A]: { name: string; spec: BuilderExtract<A[K]["spec"]> };
    } = {} as any;
    for (const key in a) {
      const value = a[key];
      variants[key] = {
        name: value.name,
        spec: value.spec.build() as any,
      };
    }
    return new Variants(variants);
  }

  static empty() {
    return Variants.of({});
  }
  static withVariant<K extends string, B extends InputSpec>(key: K, value: Config<B>) {
    return Variants.empty().withVariant(key, value);
  }

  withVariant<K extends string, B extends InputSpec>(key: K, value: Config<B>) {
    return new Variants({
      ...this.a,
      [key]: value.build(),
    } as A & { [key in K]: B });
  }
}
