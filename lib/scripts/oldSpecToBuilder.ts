import camelCase from "lodash/camelCase";
import * as fs from "fs";

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

      answer += `"${key}": ${variableName},`;
    }
    return `${answer}});`;
  }
  function convertValueSpec(value: any): string {
    switch (value.type) {
      case "string": {
        return `Value.string(${JSON.stringify(
          {
            name: value.name || null,
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
            nullable: value.nullable || false,
            masked: value.masked || null,
            placeholder: value.placeholder || null,
            pattern: value.pattern || null,
            patternDescription: value["pattern-description"] || null,
            textarea: value.textarea || null,
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
            nullable: value.nullable || false,
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
        return `Value.select(${JSON.stringify(
          {
            name: value.name || null,
            description: value.description || null,
            warning: value.warning || null,
            default: value.default || null,
            values: value.values || null,
            valueNames: value["value-names"] || null,
          },
          null,
          2
        )})`;
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
        displayAs: ${JSON.stringify(value["display-as"] || null)},
        uniqueBy: ${JSON.stringify(value["unique-by"] || null)},
        spec: ${specName},
        valueNames: ${JSON.stringify(value["value-names"] || {})},
      })`;
      }
      case "union": {
        const variants = newConst(
          value.name + "_variants",
          convertVariants(value.variants)
        );
        return `Value.union({
        name: ${JSON.stringify(value.name || null)},
        description: ${JSON.stringify(value.description || null)},
        warning: ${JSON.stringify(value.warning || null)},
        default: ${JSON.stringify(value.default || null)},
        variants: ${variants},
        tag: ${JSON.stringify({
          id: value?.tag?.id || null,
          name: value?.tag?.name || null,
          description: value?.tag?.description || null,
          warning: value?.tag?.warning || null,
          variantNames: value?.tag?.["variant-names"] || {},
        })},
        displayAs: ${JSON.stringify(value["display-as"] || null)},
        uniqueBy: ${JSON.stringify(value["unique-by"] || null)},
        variantNames: ${JSON.stringify(
          (value["variant-names"] as any) || null
        )},
      })`;
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
        return `List.string(${JSON.stringify(
          {
            name: value.name || null,
            range: value.range || null,
            spec: {
              masked: value?.spec?.masked || null,
              placeholder: value?.spec?.placeholder || null,
              pattern: value?.spec?.pattern || null,
              patternDescription:
                value?.spec?.["pattern-description"] || null,
              textarea: value?.spec?.textarea || false,
            },
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
          },
          null,
          2
        )})`;
      }
      case "number": {
        return `List.number(${JSON.stringify(
          {
            name: value.name || null,
            range: value.range || null,
            spec: {
              range: value?.spec?.range || null,
              integral: value?.spec?.integral || false,
              units: value?.spec?.units || null,
              placeholder: value?.spec?.placeholder || null,
            },
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
          },
          null,
          2
        )})`;
      }
      case "enum": {
        return `Value.multiselect(${JSON.stringify(
          {
            name: value.name || null,
            range: value.range || null,
            values: value?.spec?.["values"] || null,
            valueNames: value?.spec?.["value-names"] || {},
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
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
        spec: {
            spec: ${specName},
            displayAs: ${JSON.stringify(
              value?.spec?.["display-as"] || null
            )},
            uniqueBy: ${JSON.stringify(value?.spec?.["unique-by"] || null)},
        },
        default: ${JSON.stringify(value.default || null)},
        description: ${JSON.stringify(value.description || null)},
        warning: ${JSON.stringify(value.warning || null)},
      })`;
      }
      case "union": {
        const variants = newConst(
          value.name + "_variants",
          convertInputSpec(value.spec.variants)
        );
        return `List.union(
        {
            name:${JSON.stringify(value.name || null)},
            range:${JSON.stringify(value.range || null)},
            spec: {
                tag: {
                    "id":${JSON.stringify(value?.spec?.tag?.["id"] || null)},
                    "name": ${JSON.stringify(
                      value?.spec?.tag?.name || null
                    )},
                    "description": ${JSON.stringify(
                      value?.spec?.tag?.description || null
                    )},
                    "warning": ${JSON.stringify(
                      value?.spec?.tag?.warning || null
                    )},
                    variantNames: ${JSON.stringify(
                      value?.spec?.tag?.["variant-names"] || {}
                    )},
                },
                variants: ${variants},
                displayAs: ${JSON.stringify(
                  value?.spec?.["display-as"] || null
                )},
                uniqueBy: ${JSON.stringify(
                  value?.spec?.["unique-by"] || null
                )},
                default: ${JSON.stringify(value?.spec?.default || null)},
            },
            default: ${JSON.stringify(value.default || null)},
            description: ${JSON.stringify(value.description || null)},
            warning: ${JSON.stringify(value.warning || null)},
          }
      )`;
      }
    }
    throw new Error(`Unknown subtype "${value.subtype}"`);
  }

  function convertVariants(variants: any) {
    let answer = "Variants.of({";
    for (const [key, value] of Object.entries(variants)) {
      const variableName = newConst(key, convertInputSpec(value));
      answer += `"${key}": ${variableName},`;
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
