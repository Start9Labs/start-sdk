import { InputSpec } from "../../types/config-types";
import { BuilderExtract, IBuilder } from "./builder";
import { Config } from ".";

/**
 * Used in the the Value.select { @link './value.ts' }
 * to indicate the type of select variants that are available. The key for the record passed in will be the
 * key to the tag.id in the Value.select
```ts
 export const pruningSettingsVariants = Variants.of({
    "disabled": disabled,
    "automatic": automatic,
    "manual": manual,
  });
  export const pruning = Value.union({
    name: "Pruning Settings",
    description:
      "Blockchain Pruning Options\nReduce the blockchain size on disk\n",
    warning:
      "If you set pruning to Manual and your disk is smaller than the total size of the blockchain, you MUST have something running that prunes these blocks or you may overfill your disk!\nDisabling pruning will convert your node into a full archival node. This requires a resync of the entire blockchain, a process that may take several days. Make sure you have enough free disk space or you may fill up your disk.\n",
    default: "disabled",
    variants: pruningSettingsVariants,
    tag: {
      "id": "mode",
      "name": "Pruning Mode",
      "description":
        '- Disabled: Disable pruning\n- Automatic: Limit blockchain size on disk to a certain number of megabytes\n- Manual: Prune blockchain with the "pruneblockchain" RPC\n',
      "warning": null,
      "variantNames": {
        "disabled": "Disabled",
        "automatic": "Automatic",
        "manual": "Manual",
      },
    },
    "displayAs": null,
    "uniqueBy": null,
    "variantNames": null,
  });
```
 */
export class Variants<
  A extends {
    [key: string]: {
      name: string,
      spec: InputSpec
    }
  }
> extends IBuilder<A> {
  static of<
    A extends {
      [key: string]: { name: string, spec: Config<InputSpec> };
    }
  >(a: A) {
    const variants: { [K in keyof A]: { name: string, spec: BuilderExtract<A[K]['spec']> } } = {} as any;
    for (const key in a) {
      const value = a[key]
      variants[key] = {
        name: value.name, spec: value.spec.build() as any
      }
    }
    return new Variants(variants);
  }

  static empty() {
    return Variants.of({});
  }
  static withVariant<K extends string, B extends InputSpec>(
    key: K,
    value: Config<B>
  ) {
    return Variants.empty().withVariant(key, value);
  }

  withVariant<K extends string, B extends InputSpec>(key: K, value: Config<B>) {
    return new Variants({
      ...this.a,
      [key]: value.build(),
    } as A & { [key in K]: B });
  }
}
