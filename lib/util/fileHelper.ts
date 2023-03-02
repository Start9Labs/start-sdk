import * as matches from "ts-matches";
import * as YAML from "yaml";
import * as TOML from "@iarna/toml";
import * as T from "../types";
import { exists } from ".";

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
        const jsonFile = FileHelper.json({
        path: 'data.json',
        validator: someValidator,
        volume: 'main'
        })
        const  tomlFile = FileHelper.toml({
        path: 'data.toml',
        validator: someValidator,
        volume: 'main'
        })
        const rawFile = FileHelper.raw({
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
export class FileHelper<A> {
  protected constructor(
    readonly path: string,
    readonly volume: string,
    readonly writeData: (dataIn: A) => string,
    readonly readData: (stringValue: string) => A
  ) {}
  async write(data: A, effects: T.Effects) {
    let matched;
    if ((matched = previousPath.exec(this.path))) {
      await effects.createDir({
        volumeId: this.volume,
        path: matched[1],
      });
    }

    await effects.writeFile({
      path: this.path,
      volumeId: this.volume,
      toWrite: this.writeData(data),
    });
  }
  async read(effects: T.Effects) {
    if (
      !(await exists(effects, {
        path: this.path,
        volumeId: this.volume,
      }))
    ) {
      return null;
    }
    return this.readData(
      await effects.readFile({
        path: this.path,
        volumeId: this.volume,
      })
    );
  }
  static raw<A>(
    path: string,
    volume: string,
    toFile: (dataIn: A) => string,
    fromFile: (rawData: string) => A
  ) {
    return new FileHelper<A>(path, volume, toFile, fromFile);
  }
  static json<A>(
    path: string,
    volume: string,
    shape: matches.Validator<unknown, A>
  ) {
    return new FileHelper<A>(
      path,
      volume,
      (inData) => {
        return JSON.stringify(inData, null, 2);
      },
      (inString) => {
        return shape.unsafeCast(JSON.parse(inString));
      }
    );
  }
  static toml<A extends Record<string, unknown>>(
    path: string,
    volume: string,
    shape: matches.Validator<unknown, A>
  ) {
    return new FileHelper<A>(
      path,
      volume,
      (inData) => {
        return JSON.stringify(inData, null, 2);
      },
      (inString) => {
        return shape.unsafeCast(TOML.parse(inString));
      }
    );
  }
  static yaml<A extends Record<string, unknown>>(
    path: string,
    volume: string,
    shape: matches.Validator<unknown, A>
  ) {
    return new FileHelper<A>(
      path,
      volume,
      (inData) => {
        return JSON.stringify(inData, null, 2);
      },
      (inString) => {
        return shape.unsafeCast(YAML.parse(inString));
      }
    );
  }
}

export default FileHelper;
