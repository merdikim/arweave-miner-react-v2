import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import MinerInfo from "./MinerInfo";
import Peers from "./Peers";
import MinerUsage from "./MinerUsage";

const pages = [
  { name: "Miner", value: "miner", component: <MinerInfo /> },
  { name: "Peers", value: "peers", component: <Peers /> },
  { name: "Usage", value: "usage", component: <MinerUsage /> },
];

const Home = () => {
  return (
    <div className="pt-6 px-2 md:pt-10 md:px-6 mx-auto">
      <div>
        <Tabs defaultValue="miner" className="max-w-[1500px] mx-auto">
          <TabsList
            className="grid h-10 md:h-12 border border-gray-300 rounded-4xl"
            style={{ gridTemplateColumns: `repeat(${pages.length}, minmax(0, 1fr))` }}
          >
            {pages.map((page) => (
              <TabsTrigger key={page.value} className="px-6 md:px-10" value={page.value}>
                {page.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {pages.map((page) => (
            <TabsContent key={page.value} value={page.value}>
              {page.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
