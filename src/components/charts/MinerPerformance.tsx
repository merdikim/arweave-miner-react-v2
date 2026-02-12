import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { FC } from "react";

const read_chartConfig = {
  read: {
    label: "Read",
    color: "hsl(var(--chart-1))",
  },
  ideal_read: {
    label: "Ideal Read",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const hash_chartConfig = {
  hash: {
    label: "Hash",
    color: "hsl(var(--chart-3))",
  },
  ideal_hash: {
    label: "Ideal Hash",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

type PerformancePoint = {
  timestamp?: string;
  read: number;
  ideal_read: number;
  hash: number;
  ideal_hash: number;
};

const toNumber = (value?: string | number) => Number(value || 0);

const formatMetric = (value: number, unit: string) => {
  const fractionDigits = unit === "h/s" ? 0 : 2;
  return `${value.toFixed(fractionDigits)} ${unit}`;
};

const getSeriesStats = (
  data: PerformancePoint[],
  currentKey: "read" | "hash",
  idealKey: "ideal_read" | "ideal_hash",
) => {
  const latestPoint = data.at(-1);
  const current = toNumber(latestPoint?.[currentKey]);
  const ideal = toNumber(latestPoint?.[idealKey]);
  const utilization = ideal > 0 ? (current / ideal) * 100 : 0;

  const currentValues = data.map((row) => toNumber(row[currentKey]));
  const peak = currentValues.length ? Math.max(...currentValues) : 0;
  const avg =
    currentValues.length > 0
      ? currentValues.reduce((sum, val) => sum + val, 0) / currentValues.length
      : 0;

  return {
    current,
    ideal,
    utilization,
    peak,
    avg,
    lastTimestamp: latestPoint?.timestamp || "-",
  };
};

const MinerPerformance: FC<{ chartData: Array<{ [key: string]: string }> }> = ({
  chartData,
}) => {
  const data: PerformancePoint[] = chartData.map((row) => ({
    timestamp: row.timestamp,
    read: toNumber(row.read),
    ideal_read: toNumber(row.ideal_read),
    hash: toNumber(row.hash),
    ideal_hash: toNumber(row.ideal_hash),
  }));
  const readStats = getSeriesStats(data, "read", "ideal_read");
  const hashStats = getSeriesStats(data, "hash", "ideal_hash");
  const readAxisMax =
    readStats.peak > 0 || readStats.ideal > 0
      ? Math.ceil(Math.max(readStats.peak, readStats.ideal) * 1.1)
      : 1;
  const hashAxisMax =
    hashStats.peak > 0 || hashStats.ideal > 0
      ? Math.ceil(Math.max(hashStats.peak, hashStats.ideal) * 1.1)
      : 100;

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-600">
        No performance data available yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-900">Live Summary</p>
          <p className="text-xs text-gray-500">
            Latest sample: {readStats.lastTimestamp}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="rounded-lg bg-white border border-gray-200 p-2">
            <p className="text-xs text-gray-500">Read Current</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatMetric(readStats.current, "MiB/s")}
            </p>
          </div>
          <div className="rounded-lg bg-white border border-gray-200 p-2">
            <p className="text-xs text-gray-500">Read Avg</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatMetric(readStats.avg, "MiB/s")}
            </p>
          </div>
          <div className="rounded-lg bg-white border border-gray-200 p-2">
            <p className="text-xs text-gray-500">Hash Current</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatMetric(hashStats.current, "h/s")}
            </p>
          </div>
          <div className="rounded-lg bg-white border border-gray-200 p-2">
            <p className="text-xs text-gray-500">Hash Avg</p>
            <p className="text-sm font-semibold text-gray-900">
              {formatMetric(hashStats.avg, "h/s")}
            </p>
          </div>
        </div>
      </div>

      <Card className="gap-4 py-4">
        <CardContent>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">Read Rates</CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Current vs ideal read throughput over time
              </p>
            </div>
            <div className="min-w-[160px] text-right">
              <p className="text-xs text-gray-500">
                {formatMetric(readStats.current, "MiB/s")} /{" "}
                {formatMetric(readStats.ideal, "MiB/s")}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {readStats.utilization.toFixed(2)}% utilization
              </p>
            </div>
          </div>

          <ChartContainer
            config={read_chartConfig}
            className="h-[34vh] md:h-[28vh] xl:h-[32vh] w-full"
          >
            <LineChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                domain={[0, readAxisMax]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                dataKey="read"
                type="natural"
                stroke="var(--color-read)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="ideal_read"
                type="natural"
                stroke="var(--color-ideal_read)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
          <p className="mt-2 text-xs text-gray-500">
            Peak read: {formatMetric(readStats.peak, "MiB/s")}
          </p>
        </CardContent>
      </Card>

      <Card className="gap-4 py-4">
        <CardContent>
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base">Hash Rates</CardTitle>
              <p className="text-xs text-gray-500 mt-1">
                Current vs ideal hashing performance over time
              </p>
            </div>
            <div className="min-w-[160px] text-right">
              <p className="text-xs text-gray-500">
                {formatMetric(hashStats.current, "h/s")} /{" "}
                {formatMetric(hashStats.ideal, "h/s")}
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {hashStats.utilization.toFixed(2)}% utilization
              </p>
            </div>
          </div>

          <ChartContainer
            config={hash_chartConfig}
            className="h-[34vh] md:h-[28vh] xl:h-[32vh] w-full"
          >
            <LineChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey="timestamp"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={56}
                domain={[0, hashAxisMax]}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Line
                dataKey="hash"
                type="natural"
                stroke="var(--color-hash)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="ideal_hash"
                type="natural"
                stroke="var(--color-ideal_hash)"
                strokeWidth={2}
                strokeDasharray="6 4"
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ChartContainer>
          <p className="mt-2 text-xs text-gray-500">
            Peak hash: {formatMetric(hashStats.peak, "h/s")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default MinerPerformance;
