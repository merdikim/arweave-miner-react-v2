import {
  MemoryUsage,
  MetricsState,
  MinerRate,
  PrometheusMetricParser,
  PrometheusMetrics,
} from "@/types";
import { ONE_TERABYTE } from "@/utils";
//@ts-ignore
import parsePrometheusTextFormat from "parse-prometheus-text-format";

const FETCH_TIMEOUT_MS = 480000;
const FETCH_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const MAX_HISTORY_POINTS_PER_PARTITION = 240;

const minerRatesOverTimeStoreBySource: Record<string, MinerRate> = {};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const toFiniteNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const fetchRawMinerMetrics = async (url: string): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let lastError: unknown = null;

  try {
    for (let attempt = 1; attempt <= FETCH_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to fetch metrics");
        return await res.text();
      } catch (err) {
        lastError = err;
        if (attempt === FETCH_ATTEMPTS) break;
        await sleep(RETRY_DELAY_MS);
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }

  if (lastError instanceof Error) {
    throw new Error(`Error fetching miner's metrics: ${lastError.message}`);
  }

  throw new Error("Unexpected error fetching metrics");
};

const extractMetricData = (
  data: PrometheusMetricParser[],
  metricName: string,
): PrometheusMetricParser | undefined =>
  data.find((item) => item.name === metricName);

const getMiningRateData = (miningRateData?: PrometheusMetricParser) => {
  const groupedMiningRateData: Record<string, Record<string, string>> = {};

  miningRateData?.metrics.forEach((item) => {
    const partition = item.labels.partition;
    const type = item.labels.type;
    if (!partition || partition === "total" || !type) return;
    groupedMiningRateData[partition] ??= {};
    groupedMiningRateData[partition][type] = item.value;
  });

  return groupedMiningRateData;
};

const getMiningRateDataOverTime = (
  miningRateData: PrometheusMetricParser | undefined,
  sourceKey: string,
) => {
  const sourceStore = (minerRatesOverTimeStoreBySource[sourceKey] ??= {});
  const currentTimestamp = new Date().toISOString().slice(11, 16);

  miningRateData?.metrics.forEach(({ labels, value }) => {
    const partition = labels.partition;
    const type = labels.type;

    if (!partition || partition === "total" || !type) return;

    sourceStore[partition] ??= [];
    const partitionHistory = sourceStore[partition];
    const lastEntry = partitionHistory.at(-1);
    const formattedValue = toFiniteNumber(value).toFixed(3);

    if (lastEntry?.timestamp === currentTimestamp) {
      lastEntry[type] = formattedValue;
      return;
    }

    partitionHistory.push({
      timestamp: currentTimestamp,
      [type]: formattedValue,
    });

    if (partitionHistory.length > MAX_HISTORY_POINTS_PER_PARTITION) {
      partitionHistory.splice(
        0,
        partitionHistory.length - MAX_HISTORY_POINTS_PER_PARTITION,
      );
    }
  });

  return sourceStore;
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
      const peer = labels.peer;
      const direction = labels.direction;
      if (!peer || peer === "total") return;
      if (direction !== "from" && direction !== "to") return;

      coordinatedMiningData[peer] ??= {
        h1: { from: "0", to: "0" },
        h2: { from: "0", to: "0" },
      };

      const key = index === 0 ? "h1" : "h2";
      coordinatedMiningData[peer][key][direction] = value;
    });
  });

  return coordinatedMiningData;
};

export const fetchMetrics = async (url: string): Promise<MetricsState> => {
  const data = await fetchRawMinerMetrics(url);
  const rawParsedData = parsePrometheusTextFormat(data);
  const parsedData = Array.isArray(rawParsedData) ? rawParsedData : [];
  const miningRateData = extractMetricData(parsedData, "mining_rate");
  const minerRates = getMiningRateData(miningRateData);
  const minerRatesOverTime = getMiningRateDataOverTime(miningRateData, url);
  const coordinatedMiningData = getCoordinatedMiningData(parsedData);

  const totalCowboyRequests = extractMetricData(parsedData, 'cowboy_requests_total');

  const ar_wallets = extractMetricData(parsedData, 'arweave_ar_wallets_bytes_total');
  const ar_node_workers = extractMetricData(parsedData, 'arweave_ar_node_worker_bytes_total');  
  const ar_data_discovery = extractMetricData(parsedData, 'arweave_ar_data_discovery_bytes_total');
  const ar_header_sync = extractMetricData(parsedData, 'arweave_ar_header_sync_bytes_total');

  const processMemory:MemoryUsage[] = [
    { name: "Wallets", bytes: toFiniteNumber(ar_wallets?.metrics[0]?.value) },
    { name: "Node Worker", bytes: toFiniteNumber(ar_node_workers?.metrics[0]?.value) },
    { name: "Data Discovery", bytes: toFiniteNumber(ar_data_discovery?.metrics[0]?.value) },
    { name: "Header Sync", bytes: toFiniteNumber(ar_header_sync?.metrics[0]?.value) },
  ]

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
      const mergedLabels = {
        ...item.labels,
        ...(minerRates[item.labels.partition_number] || {}),
      };
      minerMetrics.push({
        ...item,
        labels: mergedLabels,
      });
      totalStorageSize += toFiniteNumber(item.value);
    }
  });

  const weaveSizeMetric = extractMetricData(parsedData, "weave_size");
  const weaveSize = toFiniteNumber(weaveSizeMetric?.metrics[0]?.value);

  const minerMetricsWithNoDuplicates = Object.values(
    minerMetrics.reduce<Record<string, PrometheusMetrics>>((acc, curr) => {
      const partitionNumber = curr.labels.partition_number;
      acc[partitionNumber] ??= { ...curr, value: "0" };
      acc[partitionNumber].value =
        `${toFiniteNumber(acc[partitionNumber].value) + toFiniteNumber(curr.value)}`;
      return acc;
    }, {}),
  ).sort(
    (a, b) =>
      Number(a.labels.partition_number) - Number(b.labels.partition_number),
  );

  Object.entries(minerRates).forEach(([, rates]) => {
    totalReadRate += toFiniteNumber(rates.read);
    totalIdealReadRate += toFiniteNumber(rates.ideal_read);
    totalHashRate += toFiniteNumber(rates.hash);
    totalIdealHashRate += toFiniteNumber(rates.ideal_hash);
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
    totalCowboyRequestsMetrics: totalCowboyRequests?.metrics || [],
    processMemoryMetrics: processMemory,
  };
};
