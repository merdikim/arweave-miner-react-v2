import { LineChart, Line, XAxis } from "recharts";

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

const MinerPerformance: FC<{ chartData: Array<{ [key: string]: string }> }> = ({
  chartData,
}) => {
  const data = [...chartData];

  return (
    <Card>
      <CardContent>
        <CardTitle className="text-center">Read Rates</CardTitle>
        <ChartContainer
          config={read_chartConfig}
          className="h-[35vh] md:h-[30vh] 2xl:h-[40vh] w-full"
        >
          <LineChart accessibilityLayer data={data}>
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line dataKey="read" type="natural" stroke="var(--color-read)" />
            <Line
              dataKey="ideal_read"
              type="natural"
              stroke="var(--color-ideal_read)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>

      <CardContent className=" mt-20">
        <CardTitle className="text-center">Hash Rates</CardTitle>
        <ChartContainer
          config={hash_chartConfig}
          className="h-[35vh] md:h-[30vh] 2xl:h-[40vh] w-full"
        >
          <LineChart accessibilityLayer data={data}>
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line dataKey="hash" type="natural" stroke="var(--color-hash)" />
            <Line
              dataKey="ideal_hash"
              type="natural"
              stroke="var(--color-ideal_hash)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MinerPerformance;
