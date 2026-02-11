import { useState, useEffect } from "react";
import { MinerInfo } from "@/types";
import { getMinerKey } from "@/utils/getMinerKey";

const MINERS_STORAGE_KEY = "miners";
const ACTIVE_MINER_KEY = "activeMiner";

const useMinersStore = () => {
  const [miners, setMiners] = useState<MinerInfo[]>(() => {
    try {
      const result = localStorage.getItem(MINERS_STORAGE_KEY);
      return result ? JSON.parse(result) : [];
    } catch (error) {
      console.error("Error parsing miners from localStorage", error);
      return [];
    }
  });

  const [activeMinerKey, setActiveMinerKey] = useState<string | null>(() => {
    try {
      const result = localStorage.getItem(ACTIVE_MINER_KEY);
      return result || null;
    } catch (error) {
      console.error("Error parsing activeMiner from localStorage", error);
      return null;
    }
  });

  // Get the currently active miner
  const activeMiner =
    miners.find((m) => getMinerKey(m) === activeMinerKey) || null;

  // Add a new miner
  const addMiner = (minerInfo: MinerInfo) => {
    try {
      // Check if miner already exists
      if (miners.some((m) => getMinerKey(m) === getMinerKey(minerInfo))) {
        console.warn("Miner already exists");
        return;
      }

      const updatedMiners = [...miners, minerInfo];
      localStorage.setItem(MINERS_STORAGE_KEY, JSON.stringify(updatedMiners));
      setMiners(updatedMiners);

      // Set as active if it's the first miner
      if (miners.length === 0) {
        const key = getMinerKey(minerInfo);
        localStorage.setItem(ACTIVE_MINER_KEY, key);
        setActiveMinerKey(key);
      }

      window.dispatchEvent(new Event("minersUpdated"));
    } catch (error) {
      console.error("Error saving miner to localStorage", error);
    }
  };

  // Update an existing miner
  const updateMiner = (oldMinerKey: string, minerInfo: MinerInfo) => {
    try {
      const updatedMiners = miners.map((m) =>
        getMinerKey(m) === oldMinerKey ? minerInfo : m,
      );
      localStorage.setItem(MINERS_STORAGE_KEY, JSON.stringify(updatedMiners));
      setMiners(updatedMiners);

      // Update active miner reference if it was the one being updated
      if (activeMinerKey === oldMinerKey) {
        const newKey = getMinerKey(minerInfo);
        localStorage.setItem(ACTIVE_MINER_KEY, newKey);
        setActiveMinerKey(newKey);
      }

      window.dispatchEvent(new Event("minersUpdated"));
    } catch (error) {
      console.error("Error updating miner in localStorage", error);
    }
  };

  // Remove a miner
  const removeMiner = (minerKey: string) => {
    try {
      const updatedMiners = miners.filter((m) => getMinerKey(m) !== minerKey);
      localStorage.setItem(MINERS_STORAGE_KEY, JSON.stringify(updatedMiners));
      setMiners(updatedMiners);

      // If the removed miner was active, switch to another one
      if (activeMinerKey === minerKey) {
        const newActiveMiner = updatedMiners[0];
        if (newActiveMiner) {
          const newKey = getMinerKey(newActiveMiner);
          localStorage.setItem(ACTIVE_MINER_KEY, newKey);
          setActiveMinerKey(newKey);
        } else {
          localStorage.removeItem(ACTIVE_MINER_KEY);
          setActiveMinerKey(null);
        }
      }

      window.dispatchEvent(new Event("minersUpdated"));
    } catch (error) {
      console.error("Error removing miner from localStorage", error);
    }
  };

  // Switch to a different miner
  const switchMiner = (minerKey: string) => {
    try {
      if (miners.find((m) => getMinerKey(m) === minerKey)) {
        localStorage.setItem(ACTIVE_MINER_KEY, minerKey);
        setActiveMinerKey(minerKey);
        window.dispatchEvent(new Event("minersUpdated"));
      }
    } catch (error) {
      console.error("Error switching miner", error);
    }
  };

  // Sync state with other tabs
  useEffect(() => {
    const syncMiners = () => {
      try {
        const result = localStorage.getItem(MINERS_STORAGE_KEY);
        setMiners(result ? JSON.parse(result) : []);

        const activeId = localStorage.getItem(ACTIVE_MINER_KEY);
        setActiveMinerKey(activeId || null);
      } catch (error) {
        console.error("Error syncing miners from localStorage", error);
      }
    };

    window.addEventListener("minersUpdated", syncMiners);
    window.addEventListener("storage", syncMiners);

    return () => {
      window.removeEventListener("minersUpdated", syncMiners);
      window.removeEventListener("storage", syncMiners);
    };
  }, []);

  return {
    miners,
    activeMiner,
    addMiner,
    updateMiner,
    removeMiner,
    switchMiner,
  };
};

export default useMinersStore;
