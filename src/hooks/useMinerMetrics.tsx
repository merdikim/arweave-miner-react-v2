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
    error,
    isError
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
          totalCowboyRequestsMetrics,
          processMemoryMetrics
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
          totalCowboyRequestsMetrics,
          processMemoryMetrics
        };
      } catch (error) {
        console.log(error);
        console.error("Error fetching metrics.");
      }
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    enabled: !!activeMiner // Only run the query if activeMiner is defined
  });

  return {
    isLoading,
    metrics,
    refetch,
    isFetching,
    error,
    isError
  };
};

export default useMinerMetrics;
