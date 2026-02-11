import useMinersStore from "@/hooks/useMinersStore";
import AddMinerModal from "@/components/modals/AddMiner";
import { ReactNode } from "react";

const MinerAuth = ({ children }: { children: ReactNode }) => {
  const { miners, activeMiner } = useMinersStore();

  // Show the add miner prompt only if there are no miners at all
  if (miners.length === 0) {
    return (
      <div className="fixed inset-0 w-full flex flex-col items-center justify-center overflow-y-auto bg-[url(/add_miner_background.svg)] bg-white/40 bg-cover">
        <AddMinerModal />
      </div>
    );
  }

  // If there are miners but none is active (shouldn't happen), show add miner
  if (!activeMiner && miners.length > 0) {
    return (
      <div className="fixed inset-0 w-full flex flex-col items-center justify-center overflow-y-auto bg-[url(/add_miner_background.svg)] bg-white/40 bg-cover">
        <AddMinerModal />
      </div>
    );
  }

  return <div>{children}</div>;
};

export default MinerAuth;
