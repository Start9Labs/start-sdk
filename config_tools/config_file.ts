import { matches, TOML, YAML } from "../dependencies.ts";
import * as T from "../types.ts";
import { exists } from "../util.ts";

const previousPath = /(.+?)\/([^/]*)$/;

/**
 * Used in the get config and the set config exported functions.
 * The idea is that we are going to be reading/ writing to a file, or multiple files. And then we use this tool
 * to keep the same path on the read and write, and have methods for helping with structured data.
 * And if we are not using a structured data, we can use the raw method which forces the construction of a BiMap
 * ```ts
        import {configSpec} from './configSpec.ts'
        import {matches, T} from '../deps.ts';
        const { object, string, number, boolean, arrayOf, array, anyOf, allOf } = matches
        const someValidator = object({
        data: string
        })
        const jsonFile = ConfigFile.json({
        path: 'data.json',
        validator: someValidator,
        volume: 'main'
        })
        const  tomlFile = ConfigFile.toml({
        path: 'data.toml',
        validator: someValidator,
        volume: 'main'
        })
        const rawFile = ConfigFile.raw({
        path: 'data.amazingSettings',
        volume: 'main'
        fromData(dataIn: Data): string {
            return `myDatais ///- ${dataIn.data}`
        },
        toData(rawData: string): Data {
        const [,data] = /myDatais \/\/\/- (.*)/.match(rawData)
        return {data}
        }
        })

        export const setConfig : T.ExpectedExports.setConfig= async (effects, config) => {
        await  jsonFile.write({ data: 'here lies data'}, effects)
        }

        export const getConfig: T.ExpectedExports.getConfig = async (effects, config) => ({
        spec: configSpec,
        config: nullIfEmpty({
            ...jsonFile.get(effects)
        })
    ```
 */
export class ConfigFile<A> {
  protected constructor(
    private options: {
      path: string;
      volume: string;
      writeData(dataIn: A): string;
      readData(stringValue: string): A;
    },
  ) {}
  async write(data: A, effects: T.Effects) {
    let matched;
    if ((matched = previousPath.exec(this.options.path))) {
      await effects.createDir({
        volumeId: this.options.volume,
        path: matched[1],
      });
    }

    await effects.writeFile({
      path: this.options.path,
      volumeId: this.options.volume,
      toWrite: this.options.writeData(data),
    });
  }
  async read(effects: T.Effects) {
    if (
      !(await exists(effects, {
        path: this.options.path,
        volumeId: this.options.volume,
      }))
    ) return null;
    return this.options.readData(
      await effects.readFile({
        path: this.options.path,
        volumeId: this.options.volume,
      }),
    );
  }
  static raw<A>(
    options: {
      path: string;
      volume: string;
      fromData(dataIn: A): string;
      toData(rawData: string): A;
    },
  ) {
    return new ConfigFile<A>({
      path: options.path,
      volume: options.volume,
      writeData: options.fromData,
      readData: options.toData,
    });
  }
  static json<A>(
    options: {
      path: string;
      volume: string;
      validator: matches.Validator<unknown, A>;
    },
  ) {
    return new ConfigFile<A>({
      path: options.path,
      volume: options.volume,
      writeData(inData) {
        return JSON.stringify(inData, null, 2);
      },
      readData(inString) {
        return options.validator.unsafeCast(JSON.parse(inString));
      },
    });
  }
  static toml<A extends Record<string, unknown>>(options: {
    path: string;
    volume: string;
    validator: matches.Validator<unknown, A>;
  }) {
    return new ConfigFile<A>({
      path: options.path,
      volume: options.volume,
      writeData(inData) {
        return TOML.stringify(inData);
      },
      readData(inString) {
        return options.validator.unsafeCast(TOML.parse(inString));
      },
    });
  }
  static yaml<A extends Record<string, unknown>>(options: {
    path: string;
    volume: string;
    validator: matches.Validator<unknown, A>;
  }) {
    return new ConfigFile<A>({
      path: options.path,
      volume: options.volume,
      writeData(inData) {
        return YAML.stringify(inData);
      },
      readData(inString) {
        return options.validator.unsafeCast(YAML.parse(inString));
      },
    });
  }
}
