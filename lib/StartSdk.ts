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
import { CreatedAction, createAction } from "./actions/createAction"
import {
  ActionMetadata,
  Effects,
  ActionResult,
  BackupOptions,
  DeepPartial,
} from "./types"
import * as patterns from "./util/patterns"
import { Utils } from "./util/utils"
import { DependencyConfig } from "./dependencyConfig/DependencyConfig"
import { BackupSet, Backups } from "./backup/Backups"
import { smtpConfig } from "./config/configConstants"
import { Daemons } from "./mainFn/Daemons"
import { healthCheck } from "./health/HealthCheck"
import { checkPortListening } from "./health/checkFns/checkPortListening"
import { checkWebUrl, runHealthScript } from "./health/checkFns"
import { List } from "./config/builder/list"
import { Migration } from "./inits/migrations/Migration"
import { Install, InstallFn } from "./inits/setupInstall"
import { setupActions } from "./actions/setupActions"
import { setupDependencyConfig } from "./dependencyConfig/setupDependencyConfig"
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
import { setupDependencyMounts } from "./dependency/setupDependencyMounts"
import {
  InterfacesReceipt,
  SetInterfaces,
  setupInterfaces,
} from "./interfaces/setupInterfaces"
import { successFailure } from "./trigger/successFailure"

// prettier-ignore
type AnyNeverCond<T extends any[], Then, Else> = 
    T extends [] ? Else :
    T extends [never, ...Array<any>] ? Then :
    T extends [any, ...infer U] ? AnyNeverCond<U,Then, Else> :
    never

export class StartSdk<Manifest extends SDKManifest, Store, Vault> {
  private constructor(readonly manifest: Manifest) {}
  static of() {
    return new StartSdk<never, never, never>(null as never)
  }
  withManifest<Manifest extends SDKManifest = never>(manifest: Manifest) {
    return new StartSdk<Manifest, Store, Vault>(manifest)
  }
  withStore<Store extends Record<string, any>>() {
    return new StartSdk<Manifest, Store, Vault>(this.manifest)
  }
  withVault<Vault extends Record<string, string>>() {
    return new StartSdk<Manifest, Store, Vault>(this.manifest)
  }

  build(
    isReady: AnyNeverCond<[Manifest, Store, Vault], "Build not ready", true>,
  ) {
    return {
      configConstants: { smtpConfig },
      createAction: <
        Store,
        ConfigType extends
          | Record<string, any>
          | Config<any, any, any>
          | Config<any, never, never>,
        Type extends Record<string, any> = ExtractConfigType<ConfigType>,
      >(
        metaData: Omit<ActionMetadata, "input"> & {
          input: Config<Type, Store, Vault> | Config<Type, never, never>
        },
        fn: (options: {
          effects: Effects
          utils: Utils<Store, Vault>
          input: Type
        }) => Promise<ActionResult>,
      ) => createAction<Store, Vault, ConfigType, Type>(metaData, fn),
      HealthCheck: {
        of: healthCheck,
      },
      healthCheck: {
        checkPortListening,
        checkWebUrl,
        runHealthScript,
      },
      patterns,
      setupActions: (...createdActions: CreatedAction<any, any, any>[]) =>
        setupActions<Store, Vault>(...createdActions),
      setupBackups: (...args: SetupBackupsParams<Manifest>) =>
        setupBackups<Manifest>(...args),
      setupConfig: <
        ConfigType extends
          | Config<any, Store, Vault>
          | Config<any, never, never>,
        Type extends Record<string, any> = ExtractConfigType<ConfigType>,
      >(
        spec: ConfigType,
        write: Save<Store, Vault, Type, Manifest>,
        read: Read<Store, Vault, Type>,
      ) =>
        setupConfig<Store, Vault, ConfigType, Manifest, Type>(
          spec,
          write,
          read,
        ),
      setupConfigRead: <
        ConfigSpec extends
          | Config<Record<string, any>, any, any>
          | Config<Record<string, never>, never, never>,
      >(
        _configSpec: ConfigSpec,
        fn: Read<Store, Vault, ConfigSpec>,
      ) => fn,
      setupConfigSave: <
        ConfigSpec extends
          | Config<Record<string, any>, any, any>
          | Config<Record<string, never>, never, never>,
      >(
        _configSpec: ConfigSpec,
        fn: Save<Store, Vault, ConfigSpec, Manifest>,
      ) => fn,
      setupDependencyConfig: <Input extends Record<string, any>>(
        config: Config<Input, Store, Vault> | Config<Input, never, never>,
        autoConfigs: {
          [K in keyof Manifest["dependencies"]]: DependencyConfig<
            Store,
            Vault,
            Input,
            any
          >
        },
      ) =>
        setupDependencyConfig<Store, Vault, Input, Manifest>(
          config,
          autoConfigs,
        ),
      setupDependencyMounts,
      setupInit: (
        migrations: Migrations<Store, Vault>,
        install: Install<Store, Vault>,
        uninstall: Uninstall<Store, Vault>,
        setInterfaces: SetInterfaces<Store, Vault, any, any>,
      ) =>
        setupInit<Store, Vault>(migrations, install, uninstall, setInterfaces),
      setupInstall: (fn: InstallFn<Store, Vault>) => Install.of(fn),
      setupInterfaces: <
        ConfigInput extends Record<string, any>,
        Output extends InterfacesReceipt,
      >(
        config: Config<ConfigInput, Store, Vault>,
        fn: SetInterfaces<Store, Vault, ConfigInput, Output>,
      ) => setupInterfaces(config, fn),
      setupMain: (
        fn: (o: {
          effects: Effects
          started(onTerm: () => void): null
          utils: Utils<Store, Vault, {}>
        }) => Promise<Daemons<any>>,
      ) => setupMain<Store, Vault>(fn),
      setupMigrations: <Migrations extends Array<Migration<Store, Vault, any>>>(
        ...migrations: EnsureUniqueId<Migrations>
      ) =>
        setupMigrations<Store, Vault, Migrations>(this.manifest, ...migrations),
      setupUninstall: (fn: UninstallFn<Store, Vault>) =>
        setupUninstall<Store, Vault>(fn),
      trigger: {
        defaultTrigger,
        cooldownTrigger,
        changeOnFirstSuccess,
        successFailure,
      },

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
          Spec extends Record<
            string,
            Value<any, Store, Vault> | Value<any, never, never>
          >,
        >(
          spec: Spec,
        ) => Config.of<Spec, Store, Vault>(spec),
      },
      Daemons: { of: Daemons.of },
      DependencyConfig: {
        of<
          LocalConfig extends Record<string, any>,
          RemoteConfig extends Record<string, any>,
        >({
          localConfig,
          remoteConfig,
          dependencyConfig,
        }: {
          localConfig:
            | Config<LocalConfig, Store, Vault>
            | Config<LocalConfig, never, never>
          remoteConfig:
            | Config<RemoteConfig, any, any>
            | Config<RemoteConfig, never, never>
          dependencyConfig: (options: {
            effects: Effects
            localConfig: LocalConfig
            remoteConfig: RemoteConfig
            utils: Utils<Store, Vault>
          }) => Promise<void | DeepPartial<RemoteConfig>>
        }) {
          return new DependencyConfig<Store, Vault, LocalConfig, RemoteConfig>(
            dependencyConfig,
          )
        },
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
            spec: Config<Type, Store, Vault>
            displayAs?: null | string
            uniqueBy?: null | UniqueBy
          },
        ) => List.obj<Type, Store, Vault>(a, aSpec),
        dynamicText: (
          getA: LazyBuild<
            Store,
            Vault,
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
        ) => List.dynamicText<Store, Vault>(getA),
        dynamicNumber: (
          getA: LazyBuild<
            Store,
            Vault,
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
                step?: number | null
                units?: string | null
                placeholder?: string | null
              }
            }
          >,
        ) => List.dynamicNumber<Store, Vault>(getA),
      },
      Migration: {
        of: <Version extends ManifestVersion>(options: {
          version: Version
          up: (opts: {
            effects: Effects
            utils: Utils<Store, Vault>
          }) => Promise<void>
          down: (opts: {
            effects: Effects
            utils: Utils<Store, Vault>
          }) => Promise<void>
        }) => Migration.of<Store, Vault, Version>(options),
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
            Vault,
            {
              name: string
              description?: string | null
              warning?: string | null
              default: boolean
              disabled?: false | string
            }
          >,
        ) => Value.dynamicToggle<Store, Vault>(a),
        dynamicText: (
          getA: LazyBuild<
            Store,
            Vault,
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
        ) => Value.dynamicText<Store, Vault>(getA),
        dynamicTextarea: (
          getA: LazyBuild<
            Store,
            Vault,
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
        ) => Value.dynamicTextarea<Store, Vault>(getA),
        dynamicNumber: (
          getA: LazyBuild<
            Store,
            Vault,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<number>
              min?: number | null
              max?: number | null
              /** Default = '1' */
              step?: number | null
              integer: boolean
              units?: string | null
              placeholder?: string | null
              disabled?: false | string
            }
          >,
        ) => Value.dynamicNumber<Store, Vault>(getA),
        dynamicColor: (
          getA: LazyBuild<
            Store,
            Vault,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<string>

              disabled?: false | string
            }
          >,
        ) => Value.dynamicColor<Store, Vault>(getA),
        dynamicDatetime: (
          getA: LazyBuild<
            Store,
            Vault,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<string>
              /** Default = 'datetime-local' */
              inputmode?: ValueSpecDatetime["inputmode"]
              min?: string | null
              max?: string | null
              disabled?: false | string
            }
          >,
        ) => Value.dynamicDatetime<Store, Vault>(getA),
        dynamicSelect: (
          getA: LazyBuild<
            Store,
            Vault,
            {
              name: string
              description?: string | null
              warning?: string | null
              required: RequiredDefault<string>
              values: Record<string, string>
              disabled?: false | string
            }
          >,
        ) => Value.dynamicSelect<Store, Vault>(getA),
        dynamicMultiselect: (
          getA: LazyBuild<
            Store,
            Vault,
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
        ) => Value.dynamicMultiselect<Store, Vault>(getA),
        filteredUnion: <
          Required extends RequiredDefault<string>,
          Type extends Record<string, any>,
        >(
          getDisabledFn: LazyBuild<Store, Vault, string[]>,
          a: {
            name: string
            description?: string | null
            warning?: string | null
            required: Required
          },
          aVariants:
            | Variants<Type, Store, Vault>
            | Variants<Type, never, never>,
        ) =>
          Value.filteredUnion<Required, Type, Store, Vault>(
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
              spec: Config<any, Store, Vault>
            }
          },
        >(
          a: VariantValues,
        ) => Variants.of<VariantValues, Store, Vault>(a),
      },
    }
  }
}
