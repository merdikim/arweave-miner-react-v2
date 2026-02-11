import { getMinerKey } from "@/utils/getMinerKey";
import Button from "../ui/Button";
import { MinerInfo } from "@/types";

type MinersListDrowpdownProps = {
  miners: MinerInfo[];
  activeMiner: MinerInfo | null;
  switchMiner: (minerKey: string) => void;
  setShowMinerDropdown: (show: boolean) => void;
  openAddMinerModal: (minerKey?: string) => void;
};

const MinersListDrowpdown = ({
  miners,
  activeMiner,
  switchMiner,
  setShowMinerDropdown,
  openAddMinerModal,
}: MinersListDrowpdownProps) => {
  const activeMinerKey = activeMiner ? getMinerKey(activeMiner) : "";

  return (
    <div className="h-full w-full relative">
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-2 md:right-6 top-[var(--navbar-height-sm)] md:top-[var(--navbar-height)] w-[calc(100vw-1rem)] max-w-[430px] bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <p className="text-sm font-semibold text-gray-800">Select Miner</p>
          <p className="text-xs text-gray-500">
            Choose a miner to view its dashboard
          </p>
        </div>
        <div className="max-h-72 overflow-y-auto p-2">
          {miners.map((miner) => {
            const minerKey = getMinerKey(miner);
            const isActive = activeMinerKey === minerKey;
            return (
              <div
                key={minerKey}
                className={`mb-2 last:mb-0 rounded-lg border transition-colors flex items-center ${
                  isActive
                    ? "border-black/20 bg-gray-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <button
                  onClick={() => {
                    switchMiner(minerKey);
                    setShowMinerDropdown(false);
                  }}
                  className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "text-black" : "text-gray-700"
                  }`}
                >
                  <div
                    className={`text-sm ${
                      isActive ? "font-semibold" : "font-medium"
                    }`}
                  >
                    {miner.hostname}
                  </div>
                  <div className="text-xs text-gray-500">
                    {miner.protocol}://{miner.hostname}:{miner.port}
                  </div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddMinerModal(minerKey);
                  }}
                  className="ml-2 mr-3 h-7 px-2 text-xs font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-gray-200 bg-white">
          <Button
            onClick={openAddMinerModal}
            className="w-full h-9 text-sm font-medium bg-black text-white hover:bg-gray-900"
          >
            + Add Miner
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MinersListDrowpdown;
