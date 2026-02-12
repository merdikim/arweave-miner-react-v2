export type PrometheusMetrics = {
  value: string;
  labels: Record<string, string>;
  buckets: Record<string, string>;
};

export type PrometheusMetricParser = {
  name: string;
  help: string;
  type: string;
  metrics: PrometheusMetrics[];
};

export type MinerInfo = {
  hostname: string;
  protocol: string;
  port: string;
};

export type MinerRate = Record<string, Array<Record<string, string>>>;

export type TotalMetrics = {
  totalStorageSize: string;
  totalReadRate: string;
  totalIdealReadRate: string;
  totalIdealHashRate: string;
  totalHashRate: string;
};

export type MetricsState = TotalMetrics & {
  minerRates: { [key: string]: { [key: string]: string } };
  minerRatesOverTime: MinerRate;
  weaveSize: number | null;
  minerMetrics: PrometheusMetrics[] | undefined;
  coordinatedMiningData: { [key: string]: { [key: string]: any } };
totalCowboyRequestsMetrics: PrometheusMetrics[];
  processMemoryMetrics: MemoryUsage[];
};

export type RouteUsage = {
  route: string;
  requests: number;
  success: number;
  errors: number;
};

export type MemoryUsage = {
  name: string;
  bytes: number;
};
