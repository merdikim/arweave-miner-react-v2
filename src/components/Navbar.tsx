import { useState } from "react";
import { Link } from "react-router";
import arweave_logo from "@/assets/arweave.svg";
import miner_logo from "@/assets/miner.svg";
import Button from "@/components/ui/Button";
import AddMinerModal from "@/components/modals/AddMiner";
import useMinersStore from "@/hooks/useMinersStore";
import MinersListDrowpdown from "./modals/MinersListDrowpdown";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMinerKey, setEditingMinerKey] = useState<string | undefined>();
  const [showMinerDropdown, setShowMinerDropdown] = useState(false);
  const { miners, activeMiner, switchMiner } = useMinersStore();

  const openAddMinerModal = (minerKey?: string) => {
    setEditingMinerKey(minerKey);
    setIsModalOpen(true);
    setShowMinerDropdown(false);
  };

  return (
    <header>
      <nav className=" z-3 h-[var(--navbar-height-sm)] w-full md:h-[var(--navbar-height)] px-2 md:px-6">
        <div className="flex h-full items-center justify-between whitespace-nowrap border-b border-gray-300">
          <Link to="/" className="flex items-center">
            <img
              src={arweave_logo}
              alt="arweave-logo"
              className="mr-2 h-8 w-8 sm:h-10 sm:w-10"
            />
          </Link>

          {miners.length === 0 ? (
            <Button
              className="h-8 w-24 sm:h-10 sm:w-28"
              onClick={openAddMinerModal}
            >
              Add Miner
            </Button>
          ) : (
            <div className="relative">
              <Button
                className="hidden sm:flex h-8 sm:h-10 max-w-[250px] px-2"
                onClick={() => setShowMinerDropdown(!showMinerDropdown)}
              >
                <img src={miner_logo} alt="miner" className="h-4 mr-2" />
                {`${activeMiner?.hostname}:${activeMiner?.port}`}
              </Button>
              <Button
                className="sm:hidden h-8 sm:h-10 max-w-[250px] px-2"
                onClick={() => setShowMinerDropdown(!showMinerDropdown)}
              >
                <img src={miner_logo} alt="miner" className="h-4 mr-2" />
                {`${activeMiner?.hostname}`}
              </Button>

              {showMinerDropdown && (
                <div
                  className="fixed inset-0 w-full flex flex-col items-center justify-center overflow-y-auto bg-black/60 z-40"
                  onClick={() => setShowMinerDropdown(false)}
                >
                  <MinersListDrowpdown
                    miners={miners}
                    activeMiner={activeMiner}
                    switchMiner={switchMiner}
                    setShowMinerDropdown={setShowMinerDropdown}
                    openAddMinerModal={openAddMinerModal}
                  />
                </div>
              )}

              {isModalOpen && (
                <div className="fixed inset-0 w-full flex flex-col items-center justify-center overflow-y-auto bg-black/60 z-40">
                  <AddMinerModal
                    minerKey={editingMinerKey}
                    handleCloseModal={setIsModalOpen}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
