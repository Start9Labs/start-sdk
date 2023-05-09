import { AnyParser } from "ts-matches"
import { ManifestVersion, SDKManifest } from "./manifest/ManifestTypes"
import { RequiredDefault, Value } from "./config/builder/value"
import { Config, ExtractConfigType, LazyBuild } from "./config/builder/config"
import {
  DefaultString,
  ListValueSpecText,
  Pattern,
  RandomString,
  UniqueBy,
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
import { Utils } from "./util/utils"
import { AutoConfig, AutoConfigFrom } from "./autoconfig/AutoConfig"
import { BackupSet, Backups } from "./backup/Backups"
import { smtpConfig } from "./config/configConstants"
import { Daemons } from "./mainFn/Daemons"
import { healthCheck } from "./health/HealthCheck"
import {
  checkPortListening,
  containsAddress,
} from "./health/checkFns/checkPortListening"
import { checkWebUrl, runHealthScript } from "./health/checkFns"
import { List } from "./config/builder/list"
import { Migration } from "./inits/migrations/Migration"
import { Install, InstallFn, setupInstall } from "./inits/setupInstall"
import { setupActions } from "./actions/setupActions"
import { setupAutoConfig } from "./autoconfig/setupAutoConfig"
import { SetupBackupsParams, setupBackups } from "./backup/setupBackups"
import { setupInit } from "./inits/setupInit"
import {
  EnsureUniqueId,
  Migrations,
  setupMigrations,
} from "./inits/migrations/setupMigrations"
import { Uninstall, UninstallFn, setupUninstall } from "./inits/setupUninstall"
import { setupMain } from "./mainFn"
import { defaultTrigger } from "./trigger/defaultTrigger"
import { changeOnFirstSuccess, cooldownTrigger } from "./trigger"
import setupConfig, { Read, Save } from "./config/setupConfig"

// prettier-ignore
type AnyNeverCond<T extends any[], Then, Else> = 
    T extends [] ? Else :
    T extends [never, ...Array<any>] ? Then :
    T extends [any, ...infer U] ? AnyNeverCond<U,Then, Else> :
    never

export class StartSDK<Manifest extends SDKManifest, Store> {
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
          Spec extends Record<string, Value<any, Store> | Value<any, never>>,
        >(
          spec: Spec,
        ) => Config.of<Spec, Store>(spec),
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
      Daemons: { of: Daemons.of },
      healthCheck: {
        checkPortListening,
        checkWebUrl,
        of: healthCheck,
        runHealthScript,
      },
      List: {
        text: List.text,
        number: List.number,
        obj: <Type extends Record<string, any>>(
          a: {
            name: string
            description?: string | null
            warning?: string | null
            /** Default [] */
            default?: []
            minLength?: number | null
            maxLength?: number | null
          },
          aSpec: {
            spec: Config<Type, Store>
            displayAs?: null | string
            uniqueBy?: null | UniqueBy
          },
        ) => List.obj<Type, Store>(a, aSpec),
        dynamicText: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              /** Default = [] */
              default?: string[]
              minLength?: number | null
              maxLength?: number | null
              disabled?: false | string
              generate?: null | RandomString
              spec: {
                /** Default = false */
                masked?: boolean
                placeholder?: string | null
                minLength?: number | null
                maxLength?: number | null
                patterns: Pattern[]
                /** Default = "text" */
                inputmode?: ListValueSpecText["inputmode"]
              }
            }
          >,
        ) => List.dynamicText<Store>(getA),
        dynamicNumber: (
          getA: LazyBuild<
            Store,
            {
              name: string
              description?: string | null
              warning?: string | null
              /** Default = [] */
              default?: string[]
              minLength?: number | null
              maxLength?: number | null
              disabled?: false | string
              spec: {
                integer: boolean
                min?: number | null
                max?: number | null
                step?: string | null
                units?: string | null
                placeholder?: string | null
              }
            }
          >,
        ) => List.dynamicNumber<Store>(getA),
      },
      Migration: {
        of: <Version extends ManifestVersion>(options: {
          version: Version
          up: (opts: { effects: Effects; utils: Utils<Store> }) => Promise<void>
          down: (opts: {
            effects: Effects
            utils: Utils<Store>
          }) => Promise<void>
        }) => Migration.of<Store, Version>(options),
      },
      setupActions,
      setupAutoConfig: <
        Input,
        NestedConfigs extends {
          [key in keyof Manifest["dependencies"]]: unknown
        },
      >(
        configs: AutoConfigFrom<Store, Input, NestedConfigs>,
      ) => setupAutoConfig<Store, Input, Manifest, NestedConfigs>(configs),
      setupBackups: (...args: SetupBackupsParams<Manifest>) =>
        setupBackups<Manifest>(...args),
      setupConfig: <
        ConfigType extends
          | Record<string, any>
          | Config<any, any>
          | Config<any, never>,
        Type extends Record<string, any> = ExtractConfigType<ConfigType>,
      >(
        spec: Config<Type, Store> | Config<Type, never>,
        write: Save<Store, Type, Manifest>,
        read: Read<Store, Type>,
      ) => setupConfig<Store, ConfigType, Manifest, Type>(spec, write, read),
      setupInit: (
        migrations: Migrations<Store>,
        install: Install<Store>,
        uninstall: Uninstall<Store>,
      ) => setupInit<Store>(migrations, install, uninstall),
      setupInstall: (fn: InstallFn<Store>) => Install.of(fn),
      setupMain: (
        fn: (o: {
          effects: Effects
          started(onTerm: () => void): null
          utils: Utils<Store, {}>
        }) => Promise<Daemons<any>>,
      ) => setupMain<Store>(fn),
      setupMigrations: <Migrations extends Array<Migration<Store, any>>>(
        manifest: SDKManifest,
        ...migrations: EnsureUniqueId<Migrations>
      ) => setupMigrations<Store, Migrations>(manifest, ...migrations),
      setupUninstall: (fn: UninstallFn<Store>) => setupUninstall<Store>(fn),
      trigger: {
        defaultTrigger,
        cooldownTrigger,
        changeOnFirstSuccess,
      },
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
      Variants: {
        of: <
          VariantValues extends {
            [K in string]: {
              name: string
              spec: Config<any, Store>
            }
          },
        >(
          a: VariantValues,
        ) => Variants.of<VariantValues, Store>(a),
      },
    })
  }
}
