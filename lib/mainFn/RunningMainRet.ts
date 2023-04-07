import { Daemon } from "../types";
import { ReadyProof } from "../health/ReadyProof";

export type RunningMainRet = {
  [ReadyProof]: never;
  daemon: Daemon;
};
