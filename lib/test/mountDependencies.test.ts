import { setupManifest } from "../manifest/setupManifest"
import { mountDependencies } from "../dependency/mountDependencies"
import {
  BuildPath,
  setupDependencyMounts,
} from "../dependency/setupDependencyMounts"

describe("mountDependencies", () => {
  const clnManifest = setupManifest({
    id: "cln",
    title: "",
    version: "1",
    releaseNotes: "",
    license: "",
    replaces: [],
    wrapperRepo: "",
    upstreamRepo: "",
    supportSite: "",
    marketingSite: "",
    donationUrl: null,
    description: {
      short: "",
      long: "",
    },
    assets: {
      icon: "",
      instructions: "",
      license: "",
    },
    containers: {},
    volumes: { main: "data" },
    alerts: {
      install: null,
      update: null,
      uninstall: null,
      restore: null,
      start: null,
      stop: null,
    },
    dependencies: {},
  })
  const lndManifest = setupManifest({
    id: "lnd",
    title: "",
    version: "1",
    releaseNotes: "",
    license: "",
    replaces: [],
    wrapperRepo: "",
    upstreamRepo: "",
    supportSite: "",
    marketingSite: "",
    donationUrl: null,
    description: {
      short: "",
      long: "",
    },
    assets: {
      icon: "",
      instructions: "",
      license: "",
    },
    containers: {},
    volumes: {},
    alerts: {
      install: null,
      update: null,
      uninstall: null,
      restore: null,
      start: null,
      stop: null,
    },
    dependencies: {},
  })
  clnManifest.id
  type test = BuildPath<{
    name: "root"
    manifest: typeof clnManifest
    volume: "main"
    path: "/"
    readonly: true
  }> extends BuildPath<{
    name: "root"
    manifest: typeof clnManifest
    volume: "main2"
    path: "/"
    readonly: true
  }>
    ? true
    : false

  test("Types work", () => {
    const dependencyMounts = setupDependencyMounts()
      .addPath({
        name: "root",
        volume: "main",
        path: "/",
        manifest: clnManifest,
        readonly: true,
      })
      .addPath({
        name: "root",
        manifest: lndManifest,
        volume: "main",
        path: "/",
        readonly: true,
      })
      .build()
    ;() => {
      const test = mountDependencies(
        null as any,
        dependencyMounts,
      ) satisfies Promise<{
        cln: {
          main: {
            root: string
          }
        }
        lnd: {
          main: {
            root: string
          }
        }
      }>
      const test2 = mountDependencies(
        null as any,
        dependencyMounts.cln,
      ) satisfies Promise<{
        main: { root: string }
      }>
      const test3 = mountDependencies(
        null as any,
        dependencyMounts.cln.main,
      ) satisfies Promise<{
        root: string
      }>
    }
  })
})
