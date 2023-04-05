import camelCase from "lodash/camelCase";
import * as fs from "fs";
import { string } from "ts-matches";
import { unionSelectKey } from "../lib/config/configTypes";

export async function writeConvertedFile(
  file: string,
  inputData: Promise<any> | any,
  options: Parameters<typeof makeFileContent>[1]
) {
  await fs.writeFile(file, await makeFileContent(inputData, options), (err) =>
    console.error(err)
  );
}

export default async function makeFileContent(
  inputData: Promise<any> | any,
  { startSdk = "start-sdk" } = {}
) {
  const outputLines: string[] = [];
  outputLines.push(`
  import {Config, Value, List, Variants} from '${startSdk}/config/builder';
`);
  const data = await inputData;

  const namedConsts = new Set(["Config", "Value", "List"]);
  const configName = newConst("InputSpec", convertInputSpec(data));
  const configMatcherName = newConst(
    "matchInputSpec",
    `${configName}.validator()`
  );
  outputLines.push(
    `export type InputSpec = typeof ${configMatcherName}._TYPE;`
  );

  return outputLines.join("\n");

  function newConst(key: string, data: string) {
    const variableName = getNextConstName(camelCase(key));
    outputLines.push(`export const ${variableName} = ${data};`);
    return variableName;
  }
  function convertInputSpec(data: any) {
    let answer = "Config.of({";
    for (const [key, value] of Object.entries(data)) {
      const variableName = newConst(key, convertValueSpec(value));

      answer += `${JSON.stringify(key)}: ${variableName},`;
    }
    return `${answer}});`;
  }
  function convertValueSpec(value: any): string {
    switch (value.type) {
      case "string": {
        if (value.textarea) {
          return `Value.textarea(${JSON.stringify(
            {
              name: value.name || null,
              description: value.description || null,
              warning: value.warning || null,
              required: !(value.nullable || false),
              placeholder: value.placeholder || null,
            },
            null,
            2
          )})`;
        }
        return `Value.string(${JSON.stringify(
          {
            name: value.name || null,
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
            required: !(value.nullable || false),
            masked: value.masked || false,
            placeholder: value.placeholder || null,
            pattern: value.pattern || null,
            patternDescription: value["pattern-description"] || null,
          },
          null,
          2
        )})`;
      }
      case "number": {
        return `Value.number(${JSON.stringify(
          {
            name: value.name || null,
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
            required: !(value.nullable || false),
            range: value.range || null,
            integral: value.integral || false,
            units: value.units || null,
            placeholder: value.placeholder || null,
          },
          null,
          2
        )})`;
      }
      case "boolean": {
        return `Value.boolean(${JSON.stringify(
          {
            name: value.name || null,
            default: value.default || false,
            description: value.description || null,
            warning: value.warning || null,
          },
          null,
          2
        )})`;
      }
      case "enum": {
        const allValueNames = new Set([
          ...(value?.["values"] || []),
          ...Object.keys(value?.["value-names"] || {}),
        ]);
        const values = Object.fromEntries(
          Array.from(allValueNames)
            .filter(string.test)
            .map((key) => [key, value?.spec?.["value-names"]?.[key] || key])
        );
        return `Value.select(${JSON.stringify(
          {
            name: value.name || null,
            description: value.description || null,
            warning: value.warning || null,
            default: value.default || null,
            required: true,
            values,
          },
          null,
          2
        )} as const)`;
      }
      case "object": {
        const specName = newConst(
          value.name + "_spec",
          convertInputSpec(value.spec)
        );
        return `Value.object({
        name: ${JSON.stringify(value.name || null)},
        description: ${JSON.stringify(value.description || null)},
        warning: ${JSON.stringify(value.warning || null)},
        default: ${JSON.stringify(value.default || null)},
        spec: ${specName},
      })`;
      }
      case "union": {
        const variants = newConst(
          value.name + "_variants",
          convertVariants(value.variants, value.tag["variant-names"] || {})
        );

        return `Value.union({
        name: ${JSON.stringify(value.name || null)},
        description: ${JSON.stringify(value.tag.description || null)},
        warning: ${JSON.stringify(value.tag.warning || null)},
        required: true,
        default: ${JSON.stringify(value.default || null)},
      }, ${variants})`;
      }
      case "list": {
        const list = newConst(value.name + "_list", convertList(value));
        return `Value.list(${list})`;
      }
      case "pointer": {
        return "null as any";
      }
    }
    throw Error(`Unknown type "${value.type}"`);
  }

  function convertList(value: any) {
    switch (value.subtype) {
      case "string": {
        return `List.${
          value?.spec?.textarea === true ? "textarea" : "string"
        }(${JSON.stringify(
          {
            name: value.name || null,
            range: value.range || null,
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
          },
          null,
          2
        )}, ${JSON.stringify({
          masked: value?.spec?.masked || false,
          placeholder: value?.spec?.placeholder || null,
          pattern: value?.spec?.pattern || null,
          patternDescription: value?.spec?.["pattern-description"] || null,
        })})`;
      }
      case "number": {
        return `List.number(${JSON.stringify(
          {
            name: value.name || null,
            range: value.range || null,
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
          },
          null,
          2
        )}, ${JSON.stringify({
          range: value?.spec?.range || null,
          integral: value?.spec?.integral || false,
          units: value?.spec?.units || null,
          placeholder: value?.spec?.placeholder || null,
        })})`;
      }
      case "enum": {
        const allValueNames = new Set(
          ...(value?.spec?.["values"] || []),
          ...Object.keys(value?.spec?.["value-names"] || {})
        );
        const values = Object.fromEntries(
          Array.from(allValueNames)
            .filter(string.test)
            .map((key) => [key, value?.spec?.["value-names"]?.[key] || key])
        );
        return `Value.multiselect(${JSON.stringify(
          {
            name: value.name || null,
            range: value.range || null,
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
            values,
          },
          null,
          2
        )})`;
      }
      case "object": {
        const specName = newConst(
          value.name + "_spec",
          convertInputSpec(value.spec.spec)
        );
        return `List.obj({
          name: ${JSON.stringify(value.name || null)},
          range: ${JSON.stringify(value.range || null)},
          default: ${JSON.stringify(value.default || null)},
          description: ${JSON.stringify(value.description || null)},
          warning: ${JSON.stringify(value.warning || null)},
        }, {
          spec: ${specName},
          displayAs: ${JSON.stringify(value?.spec?.["display-as"] || null)},
          uniqueBy: ${JSON.stringify(value?.spec?.["unique-by"] || null)},
        })`;
      }
      case "union": {
        const variants = newConst(
          value.name + "_variants",
          convertVariants(
            value.spec.variants,
            value.spec["variant-names"] || {}
          )
        );
        const unionValueName = newConst(
          value.name + "_union",
          `
          Value.union({
            name: ${JSON.stringify(value?.spec?.tag?.name || null)},
            description: ${JSON.stringify(
              value?.spec?.tag?.description || null
            )},
            warning: ${JSON.stringify(value?.spec?.tag?.warning || null)},
            required: ${JSON.stringify(!(value?.spec?.tag?.nullable || false))},
            default: ${JSON.stringify(value?.spec?.default || null)},
          }, ${variants})
        `
        );
        const listConfig = newConst(
          value.name + "_list_config",
          `
          Config.of({
            "union": ${unionValueName}
          })
        `
        );
        return `List.obj({
          name:${JSON.stringify(value.name || null)},
          range:${JSON.stringify(value.range || null)},
          default: [],
          description: ${JSON.stringify(value.description || null)},
          warning: ${JSON.stringify(value.warning || null)},
        }, {
          spec: ${listConfig},
          displayAs: ${JSON.stringify(value?.spec?.["display-as"] || null)},
          uniqueBy: ${JSON.stringify(value?.spec?.["unique-by"] || null)},
        })`;
      }
    }
    throw new Error(`Unknown subtype "${value.subtype}"`);
  }

  function convertVariants(
    variants: Record<string, unknown>,
    variantNames: Record<string, string>
  ): string {
    let answer = "Variants.of({";
    for (const [key, value] of Object.entries(variants)) {
      const variantSpec = newConst(key, convertInputSpec(value));
      answer += `"${key}": {name: "${
        variantNames[key] || key
      }", spec: ${variantSpec}},`;
    }
    return `${answer}})`;
  }

  function getNextConstName(name: string, i = 0): string {
    const newName = !i ? name : name + i;
    if (namedConsts.has(newName)) {
      return getNextConstName(name, i + 1);
    }
    namedConsts.add(newName);
    return newName;
  }
}
