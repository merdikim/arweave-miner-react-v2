import useMinersStore from "@/hooks/useMinersStore";
import { MinerInfo } from "@/types";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getMinerKey } from "@/utils/getMinerKey";

interface AddMinerModalProps {
  minerKey?: string;
  handleCloseModal?: Dispatch<SetStateAction<boolean>>;
}

const AddMinerModal = ({ minerKey, handleCloseModal }: AddMinerModalProps) => {
  const { miners, addMiner, updateMiner, removeMiner } = useMinersStore();

  const existingMiner = minerKey
    ? miners.find((m) => getMinerKey(m) === minerKey)
    : null;

  const [minerInfo, setMinerInfo] = useState<MinerInfo>({
    hostname: existingMiner?.hostname || "",
    port: existingMiner?.port || "1984",
    protocol: existingMiner?.protocol || "http",
  });
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (existingMiner) {
      updateMiner(getMinerKey(existingMiner), minerInfo);
    } else {
      addMiner(minerInfo);
    }

    if (handleCloseModal) {
      handleCloseModal(false);
    }
  };

  const handleConfirmRemove = () => {
    if (!existingMiner) return;

    removeMiner(getMinerKey(existingMiner));
    setShowRemoveConfirm(false);
    if (handleCloseModal) {
      handleCloseModal(false);
    }
  };

  return (
    <div className="h-full w-full bg-white/60 md:bg-white/30 flex items-center justify-center">
      <div
        className="relative rounded-3xl bg-white px-10 py-6 md:py-15 md:px-25 shadow-2xl md:shadow-xl max-w-[700px]"
      >
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center justify-center z-[2]"
        >
          <div className=" mb-8 sm:mb-12">
            <h2 className="font-semibold text-center text-lg sm:text-2xl mb-3">
              {existingMiner ? "Edit Miner" : "Add Miner"}
            </h2>
            <p className="text-xs sm:text-base">
              Enter the details below to connect to the miner
            </p>
          </div>
          <div className="w-full">
            <Input
              placeholder="Enter Miner Hostname or IP address"
              value={minerInfo?.hostname}
              autoFocus
              required
              onChange={(e) =>
                setMinerInfo({ ...minerInfo, hostname: e.target.value })
              }
            />
          </div>
          <div className="w-full">
            <Input
              placeholder="Enter Miner Port Number"
              value={minerInfo?.port}
              onChange={(e) =>
                setMinerInfo({ ...minerInfo, port: e.target.value })
              }
            />
          </div>
          <div className="w-full">
            <Input
              placeholder="Enter Miner Protocol"
              value={minerInfo?.protocol}
              onChange={(e) =>
                setMinerInfo({ ...minerInfo, protocol: e.target.value })
              }
            />
          </div>
          <div className="flex w-full gap-4 mt-8 sm:mt-12">
            {handleCloseModal && (
              <Button
                onClick={() => handleCloseModal(false)}
                className="h-9 flex-1 sm:h-10 sm:w-28 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-medium transition-colors"
              >
                Close
              </Button>
            )}
            {existingMiner && (
              <Button
                type="button"
                onClick={() => setShowRemoveConfirm(true)}
                className="h-9 flex-1 sm:h-10 sm:w-28 border-red-600 text-white bg-red-600 hover:bg-red-700 hover:border-red-700 font-medium transition-colors"
              >
                Remove
              </Button>
            )}
            <Button
              type="submit"
              className="h-9 flex-1 sm:h-10 sm:w-28 border-black text-white bg-black hover:bg-gray-900 font-medium transition-colors"
            >
              {existingMiner ? "Update" : "Add"}
            </Button>
          </div>
        </form>

        {showRemoveConfirm && existingMiner && (
          <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl bg-white border border-gray-200 shadow-xl p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Remove Miner
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Are you sure you want to remove "
                {existingMiner.hostname}:{existingMiner.port}"?
              </p>
              <div className="mt-5 flex gap-3">
                <Button
                  type="button"
                  onClick={() => setShowRemoveConfirm(false)}
                  className="h-9 flex-1 border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-medium transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmRemove}
                  className="h-9 flex-1 border-red-600 text-white bg-red-600 hover:bg-red-700 hover:border-red-700 font-medium transition-colors"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMinerModal;
