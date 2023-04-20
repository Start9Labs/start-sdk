import camelCase from "lodash/camelCase";
import * as fs from "fs";
import { InputSpec } from "./configTypes";
import * as C from "./configTypes";

export async function specToBuilderFile(
  file: string,
  inputData: Promise<InputSpec> | InputSpec,
  options: Parameters<typeof specToBuilder>[1],
) {
  await fs.writeFile(file, await specToBuilder(inputData, options), (err) =>
    console.error(err),
  );
}
export async function specToBuilder(
  inputData: Promise<InputSpec> | InputSpec,
  { startSdk = "start-sdk" } = {},
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
    `${configName}.validator()`,
  );
  outputLines.push(
    `export type InputSpec = typeof ${configMatcherName}._TYPE;`,
  );

  return outputLines.join("\n");

  function newConst(key: string, data: string) {
    const variableName = getNextConstName(camelCase(key));
    outputLines.push(`export const ${variableName} = ${data};`);
    return variableName;
  }
  function convertInputSpec(data: C.InputSpec) {
    let answer = "Config.of({";
    for (const [key, value] of Object.entries(data)) {
      const variableName = newConst(key, convertValueSpec(value));

      answer += `${JSON.stringify(key)}: ${variableName},`;
    }
    return `${answer}});`;
  }
  function convertValueSpec(value: C.ValueSpec): string {
    switch (value.type) {
      case "text":
      case "textarea":
      case "number":
      case "color":
      case "datetime":
      case "toggle":
      case "select":
      case "multiselect": {
        const { type, ...rest } = value;
        return `Value.${type}(${JSON.stringify(rest, null, 2)})`;
      }
      case "object": {
        const { type, spec, ...rest } = value;
        const specName = newConst(value.name + "_spec", convertInputSpec(spec));
        return `Value.object({
        name: ${JSON.stringify(rest.name || null)},
        description: ${JSON.stringify(rest.description || null)},
        warning: ${JSON.stringify(rest.warning || null)},
        spec: ,
      }, ${specName})`;
      }
      case "union": {
        const { variants, type, ...rest } = value;
        const variantVariable = newConst(
          value.name + "_variants",
          convertVariants(variants),
        );

        return `Value.union(${JSON.stringify(rest)}, ${variantVariable})`;
      }
      case "list": {
        const list = newConst(value.name + "_list", convertList(value));
        return `Value.list(${list})`;
      }
      case "file": {
        throw new Error("File not implemented yet");
      }
    }
  }

  function convertList(valueSpecList: C.ValueSpecList) {
    const { spec, ...value } = valueSpecList;
    switch (spec.type) {
      case "text": {
        return `List.text(${JSON.stringify(
          {
            name: value.name || null,
            minLength: value.minLength || null,
            maxLength: value.maxLength || null,
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
          },
          null,
          2,
        )}, ${JSON.stringify({
          masked: spec?.masked || false,
          placeholder: spec?.placeholder || null,
          pattern: spec?.patterns || [],
          inputMode: spec?.inputMode || "text",
        })})`;
      }
      case "number": {
        return `List.number(${JSON.stringify(
          {
            name: value.name || null,
            minLength: value.minLength || null,
            maxLength: value.maxLength || null,
            default: value.default || null,
            description: value.description || null,
            warning: value.warning || null,
          },
          null,
          2,
        )}, ${JSON.stringify({
          integer: spec?.integer || false,
          min: spec?.min || null,
          max: spec?.max || null,
          step: spec?.step || null,
          units: spec?.units || null,
          placeholder: spec?.placeholder || null,
        })})`;
      }
      case "object": {
        const specName = newConst(
          value.name + "_spec",
          convertInputSpec(spec.spec),
        );
        return `List.obj({
          name: ${JSON.stringify(value.name || null)},
          minLength: ${JSON.stringify(value.minLength || null)},
          maxLength: ${JSON.stringify(value.maxLength || null)},
          default: ${JSON.stringify(value.default || null)},
          description: ${JSON.stringify(value.description || null)},
          warning: ${JSON.stringify(value.warning || null)},
        }, {
          spec: ${specName},
          displayAs: ${JSON.stringify(spec?.displayAs || null)},
          uniqueBy: ${JSON.stringify(spec?.uniqueBy || null)},
        })`;
      }
    }
  }

  function convertVariants(
    variants: Record<
      string,
      {
        name: string;
        spec: C.InputSpec;
      }
    >,
  ): string {
    let answer = "Variants.of({";
    for (const [key, { name, spec }] of Object.entries(variants)) {
      const variantSpec = newConst(key, convertInputSpec(spec));
      answer += `"${key}": {name: "${name}", spec: ${variantSpec}},`;
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
