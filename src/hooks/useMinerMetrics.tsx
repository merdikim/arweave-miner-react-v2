import { fetchMetrics } from "@/lib/fetchMetrics";
import { useQuery } from "@tanstack/react-query";
import useStoredMinerInfo from "./useStoredMinerInfo";

const useMinerMetrics = () => {
  const { storedMinerInfo } = useStoredMinerInfo();

  const {
    isLoading,
    isFetching,
    data: metrics,
    refetch,
  } = useQuery({
    queryKey: ["fetch netrics", storedMinerInfo],
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
          `${storedMinerInfo?.protocol}://${storedMinerInfo?.hostname}:${storedMinerInfo?.port}/metrics`,
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
