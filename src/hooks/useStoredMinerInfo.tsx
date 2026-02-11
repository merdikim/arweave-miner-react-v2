import { MinerInfo } from "@/types";
import useMinersStore from "./useMinersStore";
import { getMinerKey } from "@/utils/getMinerKey";

/**
 * Hook for backward compatibility. Returns the active miner info.
 * For new features, use useMinersStore directly.
 */
const useStoredMinerInfo = () => {
  const { activeMiner, addMiner, updateMiner } = useMinersStore();

  // Function to add or update miner (for backward compatibility)
  const storeMinerInfo = (minerInfo: MinerInfo) => {
    if (activeMiner && getMinerKey(activeMiner) === getMinerKey(minerInfo)) {
      // Update existing miner
      updateMiner(getMinerKey(activeMiner), minerInfo);
    } else {
      // Add new miner
      addMiner(minerInfo);
    }
  };

  return { storedMinerInfo: activeMiner, storeMinerInfo };
};

export default useStoredMinerInfo;
