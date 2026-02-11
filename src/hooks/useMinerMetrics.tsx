import { fetchMetrics } from "@/lib/fetchMetrics";
import { useQuery } from "@tanstack/react-query";
import useMinersStore from "./useMinersStore";

const useMinerMetrics = () => {
  const {activeMiner} = useMinersStore()

  const {
    isLoading,
    isFetching,
    data: metrics,
    refetch,
  } = useQuery({
    queryKey: ["fetch metrics", activeMiner],
    queryFn: async () => {
      try {
        const {
          totalStorageSize,
          totalReadRate,
          totalIdealReadRate,
          totalHashRate,
          totalIdealHashRate,
          minerRates,
          minerRatesOverTime,
          weaveSize,
          minerMetrics,
          coordinatedMiningData,
        } = await fetchMetrics(
          `${activeMiner?.protocol}://${activeMiner?.hostname}:${activeMiner?.port}/metrics`,
        );

        return {
          totalStorageSize,
          totalReadRate,
          totalIdealReadRate,
          totalHashRate,
          totalIdealHashRate,
          minerRates,
          minerRatesOverTime,
          weaveSize,
          minerMetrics,
          coordinatedMiningData,
        };
      } catch (error) {
        console.log(error);
        console.error("Error fetching metrics.");
      }
    },
    refetchInterval: 60000,
  });

  return {
    isLoading,
    metrics,
    refetch,
    isFetching,
  };
};

export default useMinerMetrics;
