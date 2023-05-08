import { AnyParser } from "ts-matches"
import { SDKManifest } from "./manifest/ManifestTypes"
import { RequiredDefault, Value } from "./config/builder/value"
import { Config, ExtractConfigType, LazyBuild } from "./config/builder/config"
import {
  DefaultString,
  Pattern,
  RandomString,
  ValueSpecDatetime,
  ValueSpecText,
} from "./config/configTypes"
import { Variants } from "./config/builder/variants"
import { createAction } from "./actions/createAction"
import {
  ActionMetaData,
  Effects,
  ActionResult,
  Metadata,
  BackupOptions,
} from "./types"
import { Utils } from "./util"
import { AutoConfig, AutoConfigFrom } from "./autoconfig/AutoConfig"
import { BackupSet, Backups } from "./backup/Backups"
import { smtpConfig } from "./config/configConstants"

// prettier-ignore
type AnyNeverCond<T extends any[], Then, Else> = 
    T extends [] ? Else :
    T extends [never, ...Array<any>] ? Then :
    T extends [any, ...infer U] ? AnyNeverCond<U,Then, Else> :
    never

class StartSDK<Manifest extends SDKManifest, Store> {
  private constructor() {}
  private anyOf<A>(
    a: A,
  ): AnyNeverCond<[Manifest, Store], "Build not ready", A> {
    return a as any
  }

  static of() {
    return new StartSDK<never, never>()
  }
  withManifest<Manifest extends SDKManifest = never>() {
    return new StartSDK<Manifest, Store>()
  }
  withStore<Store extends Record<string, any>>() {
    return new StartSDK<Manifest, Store>()
  }

  build() {
    return this.anyOf({
      AutoConfig: <Input, NestedConfigs>(
        configs: AutoConfigFrom<Store, Input, NestedConfigs>,
        path: keyof AutoConfigFrom<Store, Input, NestedConfigs>,
      ) => new AutoConfig<Store, Input, NestedConfigs>(configs, path),
      Backups: {
        volumes: (...volumeNames: Array<keyof Manifest["volumes"] & string>) =>
          Backups.volumes<Manifest>(...volumeNames),
        addSets: (
          ...options: BackupSet<keyof Manifest["volumes"] & string>[]
        ) => Backups.addSets<Manifest>(...options),
        withOptions: (options?: Partial<BackupOptions>) =>
          Backups.with_options<Manifest>(options),
      },
      Config: {
        of: <
          Spec extends Record<string, Value<any, Manifest> | Value<any, never>>,
        >(
          spec: Spec,
        ) => Config.of(spec),
      },
      configConstants: { smtpConfig },
      createAction: <
        Store,
        ConfigType extends
          | Record<string, any>
          | Config<any, any>
          | Config<any, never>,
        Type extends Record<string, any> = ExtractConfigType<ConfigType>,
      >(
        metaData: Omit<ActionMetaData, "input"> & {
          input: Config<Type, Store> | Config<Type, never>
        },
        fn: (options: {
          effects: Effects
          utils: Utils<Store>
          input: Type
        }) => Promise<ActionResult>,
      ) => createAction<Store, ConfigType, Type>(metaData, fn),
      // TODO Daemons
      // TODO HealthCheck
      // TODO healthCheckFns
      // TODO List
      // TODO mainNetwork
      // TODO Migration
      // TODO setupActions
      // TODO setupAutoConfig
      // TODO setupBackup
      // TODO setupInit
      // TODO setupInstall
      // TODO setupMain
      // TODO setupManifest
      // TODO setupMigrations
      // TODO setupUninstall
      // TODO trigger changeOnFirstSuccess, cooldown, default
      Value: {
        toggle: Value.toggle,
        text: Value.text,
        textarea: Value.textarea,
        number: Value.number,
        color: Value.color,
        datetime: Value.datetime,
        select: Value.select,
        multiselect: Value.multiselect,
        object: Value.object,
        union: Value.union,
        list: Value.list,
        dynamicToggle: (
          a: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              default: boolean
              disabled?: false | string
            }
          >,
        ) => Value.dynamicToggle<Store>(a),
        dynamicText: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<DefaultString>

              /** Default = false */
              masked?: boolean
              placeholder?: string | null
              minLength?: number | null
              maxLength?: number | null
              patterns?: Pattern[]
              /** Default = 'text' */
              inputmode?: ValueSpecText["inputmode"]
              generate?: null | RandomString
            }
          >,
        ) => Value.dynamicText<Store>(getA),
        dynamicTextarea: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: boolean
              minLength?: number | null
              maxLength?: number | null
              placeholder?: string | null
              disabled?: false | string
              generate?: null | RandomString
            }
          >,
        ) => Value.dynamicTextarea<Store>(getA),
        dynamicNumber: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<number>
              min?: number | null
              max?: number | null
              /** Default = '1' */
              step?: string | null
              integer: boolean
              units?: string | null
              placeholder?: string | null
              disabled?: false | string
            }
          >,
        ) => Value.dynamicNumber<Store>(getA),
        dynamicColor: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<string>

              disabled?: false | string
            }
          >,
        ) => Value.dynamicColor<Store>(getA),
        dynamicDatetime: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<string>
              /** Default = 'datetime-local' */
              inputmode?: ValueSpecDatetime["inputmode"]
              min?: string | null
              max?: string | null
              step?: string | null
              disabled?: false | string
            }
          >,
        ) => Value.dynamicDatetime<Store>(getA),
        dynamicSelect: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<string>
              values: Record<string, string>
              disabled?: false | string
            }
          >,
        ) => Value.dynamicSelect<Store>(getA),
        dynamicMultiselect: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              default: string[]
              values: Record<string, string>
              minLength?: number | null
              maxLength?: number | null
              disabled?: false | string
            }
          >,
        ) => Value.dynamicMultiselect<Store>(getA),
        filteredUnion: <
          Required extends RequiredDefault<string>,
          Type extends Record<string, any>,
        >(
          getDisabledFn: LazyBuild<Store, string[]>,
          a: {
            name: string
            description?: string | null
            warning?: string | null
            required: Required
          },
          aVariants: Variants<Type, Store> | Variants<Type, never>,
        ) =>
          Value.filteredUnion<Required, Type, Store>(
            getDisabledFn,
            a,
            aVariants,
          ),
      },
      // TODO Variants
    })
  }
}
// TODO Test output.ts with sdk

// const test = StartSDK.of()
//   .withManifest<any>()
//   .withStore<{}>()
//   .Value.dynamicToggle({} as any, {} as any)
