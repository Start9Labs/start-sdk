import fs from "fs/promises"
import * as T from "../types"
import cp from "child_process"
import { promisify } from "util"
import { Buffer } from "node:buffer"
export const execFile = promisify(cp.execFile)

export class Overlay {
  private constructor(readonly effects: T.Effects, readonly rootfs: string) {}
  static async of(effects: T.Effects, imageId: string) {
    const rootfs = await effects.createOverlayedImage({ imageId })

    for (const dirPart of ["dev", "sys", "proc", "run"] as const) {
      const dir = await fs.mkdir(`${rootfs}/${dirPart}`, { recursive: true })
      if (!dir) break
      await execFile("mount", ["--bind", `/${dirPart}`, dir])
    }

    return new Overlay(effects, rootfs)
  }

  async mount(options: MountOptions, path: string): Promise<Overlay> {
    path = path.startsWith("/")
      ? `${this.rootfs}${path}`
      : `${this.rootfs}/${path}`
    if (options.type === "volume") {
      await execFile("mount", [
        "--bind",
        `/media/startos/volumes/${options.id}`,
        path,
      ])
    } else if (options.type === "assets") {
      await execFile("mount", [
        "--bind",
        `/media/startos/assets/${options.id}`,
        path,
      ])
    } else if (options.type === "pointer") {
      await this.effects.mount({ location: path, target: options })
    } else {
      throw new Error(`unknown type ${(options as any).type}`)
    }
    return this
  }

  async destroy() {
    await execFile("umount", ["-R", this.rootfs])
    await fs.rm(this.rootfs, { recursive: true, force: true })
  }

  async exec(
    command: string[],
    options?: CommandOptions,
  ): Promise<{ stdout: string | Buffer; stderr: string | Buffer }> {
    return await execFile("chroot", [this.rootfs, ...command], options)
  }

  spawn(
    command: string[],
    options?: CommandOptions,
  ): cp.ChildProcessWithoutNullStreams {
    return cp.spawn("chroot", [this.rootfs, ...command], options)
  }
}

export type CommandOptions = {
  env?: { [variable: string]: string }
  cwd?: string
}

export type MountOptions =
  | MountOptionsVolume
  | MountOptionsAssets
  | MountOptionsPointer

export type MountOptionsVolume = {
  type: "volume"
  id: string
}

export type MountOptionsAssets = {
  type: "assets"
  id: string
}

export type MountOptionsPointer = {
  type: "pointer"
  packageId: string
  volumeId: string
  path: string
  readonly: boolean
}
