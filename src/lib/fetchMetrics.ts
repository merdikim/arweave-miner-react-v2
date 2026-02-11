import {
  MetricsState,
  MinerRate,
  PrometheusMetricParser,
  PrometheusMetrics,
} from "@/types";
import { ONE_TERABYTE } from "@/utils";
//@ts-ignore
import parsePrometheusTextFormat from "parse-prometheus-text-format";

const minerRatesOverTimeStore: MinerRate = {};

const fetchRawMinerMetrics = async (url: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 480000);
  const fetchAttempts = 3;

  try {
    for (let attempt = 1; attempt <= fetchAttempts; attempt++) {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch metrics");
        return await res.text();
      } catch (err) {
        if (attempt === fetchAttempts)
          throw new Error("Error fetching miner's metrics");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }
  throw new Error("Unexpected error fetching metrics");
};

const extractMetricData = (
  data: PrometheusMetricParser[],
  metricName: string,
): PrometheusMetricParser | undefined =>
  data.find((item) => item.name === metricName);

const getMiningRateData = (data: PrometheusMetricParser[]) => {
  const miningRateData = data.find(
    (item: PrometheusMetricParser) => item.name === "mining_rate",
  );

  const groupedMiningRateData = {} as {
    [key: string]: { [key: string]: string };
  };

  if (miningRateData) {
    miningRateData.metrics.forEach((item) => {
      let partition = item.labels.partition;
      if (partition !== "total") {
        groupedMiningRateData[partition] =
          groupedMiningRateData[partition] || {};
        groupedMiningRateData[partition][item.labels.type] = item.value;
      }
    });
  }
  return groupedMiningRateData;
};

const getMiningRateDataOverTime = (data: PrometheusMetricParser[]) => {
  const miningRateData = extractMetricData(data, "mining_rate");

  miningRateData?.metrics.forEach(({ labels, value }) => {
    if (labels.partition !== "total") {
      minerRatesOverTimeStore[labels.partition] ??= [];

      // Get the current time in HH:mm format (UTC)
      const currentTimestamp = new Date().toISOString().slice(11, 16);

      // Find the last entry in the partition array
      //@ts-ignore
      const lastEntry = minerRatesOverTimeStore[labels.partition].at(-1);

      if (lastEntry && lastEntry.timestamp === currentTimestamp) {
        // If last entry exists and has the same timestamp, add the value to it
        lastEntry[labels.type] = Number(value).toFixed(3);
      } else {
        // Otherwise, create a new entry with the timestamp and value
        minerRatesOverTimeStore[labels.partition].push({
          timestamp: currentTimestamp,
          [labels.type]: Number(value).toFixed(),
        });
      }
    }
  });

  return minerRatesOverTimeStore;
};
const getCoordinatedMiningData = (data: PrometheusMetricParser[]) => {
  const resultH1 = extractMetricData(data, "cm_h1_rate");
  const resultH2 = extractMetricData(data, "cm_h2_count");

  const coordinatedMiningData: Record<
    string,
    { h1: { from: string; to: string }; h2: { from: string; to: string } }
  > = {};

  [resultH1, resultH2].forEach((result, index) => {
    result?.metrics.forEach(({ labels, value }) => {
      if (labels.peer !== "total") {
        coordinatedMiningData[labels.peer] ??= {
          h1: { from: "0", to: "0" },
          h2: { from: "0", to: "0" },
        };
        const key = index === 0 ? "h1" : "h2";
        //@ts-ignore
        coordinatedMiningData[labels.peer][key][labels.direction] = value;
      }
    });
  });

  return coordinatedMiningData;
};

export const fetchMetrics = async (url: string): Promise<MetricsState> => {
  const data = await fetchRawMinerMetrics(url);
  const parsedData = parsePrometheusTextFormat(data) || [];
  const minerRates = getMiningRateData(parsedData);
  const minerRatesOverTime = getMiningRateDataOverTime(parsedData);
  const coordinatedMiningData = getCoordinatedMiningData(parsedData);

  let totalStorageSize = 0,
    totalReadRate = 0,
    totalIdealReadRate = 0,
    totalHashRate = 0,
    totalIdealHashRate = 0;

  const dataByPacking = extractMetricData(
    parsedData,
    "v2_index_data_size_by_packing",
  );
  const minerMetrics: PrometheusMetrics[] = [];

  dataByPacking?.metrics.forEach((item) => {
    if (item.labels.packing !== "unpacked") {
      Object.assign(item.labels, minerRates[item.labels.partition_number]);
      minerMetrics.push(item);
      totalStorageSize += Number(item.value);
    }
  });

  const weaveSizeMetric = extractMetricData(parsedData, "weave_size");
  const weaveSize = Number(weaveSizeMetric?.metrics[0]?.value || 0);

  const minerMetricsWithNoDuplicates = Object.values(
    minerMetrics.reduce<Record<string, PrometheusMetrics>>((acc, curr) => {
      const partitionNumber = curr.labels.partition_number;
      acc[partitionNumber] ??= { ...curr, value: "0" };
      acc[partitionNumber].value =
        `${Number(acc[partitionNumber].value) + Number(curr.value)}`;
      return acc;
    }, {}),
  ).sort(
    (a, b) =>
      parseInt(a.labels.partition_number) - parseInt(b.labels.partition_number),
  );

  Object.entries(minerRates).forEach(([, rates]) => {
    totalReadRate += parseFloat(rates.read || "0");
    totalIdealReadRate += parseFloat(rates.ideal_read || "0");
    totalHashRate += parseFloat(rates.hash || "0");
    totalIdealHashRate += parseFloat(rates.ideal_hash || "0");
  });

  return {
    totalStorageSize: (totalStorageSize / ONE_TERABYTE).toFixed(2),
    totalReadRate: totalReadRate.toFixed(2),
    totalIdealReadRate: totalIdealReadRate.toFixed(2),
    totalHashRate: totalHashRate.toFixed(2),
    totalIdealHashRate: totalIdealHashRate.toFixed(2),
    minerRates,
    minerRatesOverTime,
    weaveSize,
    minerMetrics: minerMetricsWithNoDuplicates,
    coordinatedMiningData,
  };
};
