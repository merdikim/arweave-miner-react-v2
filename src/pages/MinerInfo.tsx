import Partition from "@/components/cards/Partition";
import TotalRate from "@/components/cards/TotalRate";
import NotFound from "@/components/NotFound";
import MinerInfoLoading from "@/components/skeletons/MinerInfoLoading";
import useMinerMetrics from "@/hooks/useMinerMetrics";

const MinerInfo = () => {
  const { metrics: minerCombinedMetrics, isLoading } = useMinerMetrics();

  if (isLoading) {
    return <MinerInfoLoading />;
  }

  const read_percentage_num = Number(minerCombinedMetrics?.totalReadRate);
  const hash_percentage_num = Number(minerCombinedMetrics?.totalHashRate);
  const read_percentage =
    read_percentage_num === 0
      ? "0.00"
      : (
          (read_percentage_num /
            Number(minerCombinedMetrics?.totalIdealReadRate)) *
          100
        ).toFixed(2);
  const hash_percentage =
    hash_percentage_num === 0
      ? "0.00"
      : (
          (hash_percentage_num /
            Number(minerCombinedMetrics?.totalIdealHashRate)) *
          100
        ).toFixed(2);

  return (
    <div className="py-10">
      <div className="flex justify-between overflow-scroll">
        <TotalRate
          title={"Total Storage"}
          metric={minerCombinedMetrics?.totalStorageSize}
          unit={"TiB"}
        />
        <TotalRate
          title={"Total Read Rate"}
          metric={minerCombinedMetrics?.totalReadRate}
          unit={"MiB/s"}
        />
        <TotalRate
          title={"Total Hash Rate"}
          metric={minerCombinedMetrics?.totalIdealHashRate}
          unit={"h/s"}
        />
        <TotalRate
          title={"Total Ideal Read Rate"}
          metric={minerCombinedMetrics?.totalIdealReadRate}
          unit={"MiB/s"}
        />
        <TotalRate
          title={"Total Ideal Hash Rate"}
          metric={minerCombinedMetrics?.totalIdealHashRate}
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
