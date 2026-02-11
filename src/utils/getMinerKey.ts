import { MinerInfo } from "@/types";

export const getMinerKey = (miner: MinerInfo): string =>
  `${miner.hostname}:${miner.port}`;
