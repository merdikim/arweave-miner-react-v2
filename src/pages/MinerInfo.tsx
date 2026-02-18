import Partition from "@/components/cards/Partition";
import TotalRate from "@/components/cards/TotalRate";
import Error from "@/components/Error";
import NotFound from "@/components/NotFound";
import MinerInfoLoading from "@/components/skeletons/MinerInfoLoading";
import useMinerMetrics from "@/hooks/useMinerMetrics";

const MinerInfo = () => {
  const { metrics: minerCombinedMetrics, isLoading, isError, refetch } = useMinerMetrics();

  if (isLoading) {
    return <MinerInfoLoading />;
  }

  if (isError) {
    return (
      <Error
        title="Unable to load miner metrics"
        msg={"We could not fetch miner metrics right now. Check miner connectivity and try again."}
        onRetry={refetch}
      />
    );
  }

  const read_percentage_num = Number(minerCombinedMetrics?.totalReadRate);
  const hash_percentage_num = Number(minerCombinedMetrics?.totalHashRate);
  const totalIdealReadRate = Number(minerCombinedMetrics?.totalIdealReadRate || "0");
  const totalIdealHashRate = Number(minerCombinedMetrics?.totalIdealHashRate || "0");
  
  const read_percentage =
    read_percentage_num === 0 || totalIdealReadRate === 0
      ? "0.00"
      : ((read_percentage_num / totalIdealReadRate) * 100).toFixed(2);
  const hash_percentage =
    hash_percentage_num === 0 || totalIdealHashRate === 0
      ? "0.00"
      : ((hash_percentage_num / totalIdealHashRate) * 100).toFixed(2);

  return (
    <div className="py-10">
      <div className="flex justify-between overflow-scroll">
        <TotalRate
          title={"Total Storage"}
          metric={minerCombinedMetrics?.totalStorageSize || "0"}
          unit={"TiB"}
        />
        <TotalRate
          title={"Total Read Rate"}
          metric={minerCombinedMetrics?.totalReadRate || "0"}
          unit={"MiB/s"}
        />
        <TotalRate
          title={"Total Hash Rate"}
          metric={minerCombinedMetrics?.totalIdealHashRate || "0"}
          unit={"h/s"}
        />
        <TotalRate
          title={"Total Ideal Read Rate"}
          metric={minerCombinedMetrics?.totalIdealReadRate || "0"}
          unit={"MiB/s"}
        />
        <TotalRate
          title={"Total Ideal Hash Rate"}
          metric={minerCombinedMetrics?.totalIdealHashRate || "0"}
          unit={"h/s"}
        />
        <TotalRate
          title={"% Ideal Read Rate"}
          metric={read_percentage}
          unit={"%"}
        />
        <TotalRate
          title={"% Ideal Hash Rate"}
          metric={hash_percentage}
          unit={"%"}
        />
      </div>
      <div className="mt-10">
        {!!minerCombinedMetrics?.minerMetrics?.length ? (
          <>
            {minerCombinedMetrics?.minerMetrics?.map((metrics, index) => {
              const minerPerformanceRates =
                minerCombinedMetrics.minerRatesOverTime[
                  metrics.labels.partition_number
                ];
              return (
                <Partition
                  key={index}
                  metrics={metrics}
                  performanceRates={minerPerformanceRates}
                />
              );
            })}
          </>
        ) : (
          <NotFound msg="No partitions found" />
        )}
      </div>
    </div>
  );
};

export default MinerInfo;
