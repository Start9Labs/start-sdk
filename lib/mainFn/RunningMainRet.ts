import { Daemon } from "../types";
import { ReadyProof } from "./ReadyProof";

export type RunningMainRet = {
  [ReadyProof]: never;
  daemon: Daemon;
};
