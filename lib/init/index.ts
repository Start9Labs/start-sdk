import { ExpectedExports } from "../types";

declare const ActionProof: unique symbol;
export type ActionReceipt = {
  [ActionProof]: never;
};

declare const MigrationProof: unique symbol;
export type MigrationReceipt = {
  [MigrationProof]: never;
};
export function noMigration(): MigrationReceipt {
  return {} as MigrationReceipt;
}
export function migrationUp(fn: () => Promise<unknown>): MigrationReceipt {
  fn();
  return {} as MigrationReceipt;
}

declare const MigrationDownProof: unique symbol;
export type MigrationDownReceipt = {
  [MigrationDownProof]: never;
};
export function noMigrationDown(): MigrationDownReceipt {
  return {} as MigrationDownReceipt;
}
export function migrationDown(
  fn: () => Promise<unknown>
): MigrationDownReceipt {
  fn();
  return {} as MigrationDownReceipt;
}

export function setupInit(
  fn: (
    ...args: Parameters<ExpectedExports.init>
  ) => Promise<[MigrationReceipt, ActionReceipt]>
) {
  const initFn: ExpectedExports.init = (...args) => fn(...args);
  return initFn;
}

export function setupUninit(
  fn: (
    ...args: Parameters<ExpectedExports.uninit>
  ) => Promise<[MigrationDownReceipt]>
) {
  const uninitFn: ExpectedExports.uninit = (...args) => fn(...args);
  return uninitFn;
}
