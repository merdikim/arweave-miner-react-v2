import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import MinerInfo from "./MinerInfo";
import Peers from "./Peers";

const Home = () => {
  return (
    <div className="pt-6 px-2 md:pt-10 md:px-6 mx-auto">
      <div>
        <Tabs defaultValue="miner" className="max-w-[1500px] mx-auto">
          <TabsList className="grid h-10 md:h-12 grid-cols-2 border border-gray-300 rounded-4xl">
            <TabsTrigger className="px-6 md:px-10" value="miner">
              Miner
            </TabsTrigger>
            <TabsTrigger className="px-6 md:px-10" value="peers">
              Peers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="miner">
            <MinerInfo />
          </TabsContent>
          <TabsContent value="peers">
            <Peers />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
