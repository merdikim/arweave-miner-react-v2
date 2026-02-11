import { PrometheusMetrics } from "@/types";
import { ONE_TERABYTE } from "@/utils";
import { FC } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MinerPerformance from "../charts/MinerPerformance";

const Partition: FC<{
  metrics: PrometheusMetrics;
  performanceRates: Array<{ [key: string]: string }>;
}> = ({ metrics, performanceRates }) => {
  const MODULE_MAX_SIZE = 3.6 * ONE_TERABYTE;
  const data_size = Number(Number(metrics.value || 0) / ONE_TERABYTE).toFixed(
    2,
  );
  const data_size_percentage = (
    (Number(metrics.value || 0) / MODULE_MAX_SIZE) *
    100
  ).toFixed(2);
  const read_rate = Number(metrics.labels.read || 0).toFixed(2);
  const ideal_read_rate = Number(metrics.labels.ideal_read || 0).toFixed(2);
  const read_rate_num = Number(read_rate);
  const ideal_read_rate_num = Number(ideal_read_rate);
  const read_percentage =
    ideal_read_rate_num === 0
      ? "0.00"
      : ((read_rate_num / ideal_read_rate_num) * 100).toFixed(2);
  const hash_rate = Number(metrics.labels.hash || 0).toFixed(2);
  const ideal_hash_rate = Number(metrics.labels.ideal_hash || 0).toFixed(2);
  const hash_rate_num = Number(hash_rate);
  const ideal_hash_rate_num = Number(ideal_hash_rate);
  const hash_percentage =
    ideal_hash_rate_num === 0
      ? "0.00"
      : ((hash_rate_num / ideal_hash_rate_num) * 100).toFixed(2);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <div className="bg-white border border-gray-100 w-full p-3 sm:p-5 md:p-6 rounded-xl mb-6 shadow">
          <div className="flex justify-between mb-4">
            <div className="text-lg md:text-xl font-normal text-gray-700">
              Partition{" "}
              <span className="font-semibold text-black">
                #{metrics.labels.partition_number}
              </span>
            </div>
            <AccordionTrigger />
          </div>
          <div className="bg-gray-50 rounded-xl p-2 md:p-6 flex flex-col md:flex-row gap-10 justify-between text-gray-700 font-normal">
            <div className="flex gap-14 text-base md:text-xl">
              <div className="flex flex-col gap-1 md:gap-3">
                <div>Data Size</div>
                <div className="font-semibold lg:text-2xl">{data_size} TiB</div>
              </div>
              <div className="flex flex-col gap-1 md:gap-3">
                <div>% of Max</div>
                <div className="font-semibold lg:text-2xl">
                  {data_size_percentage} %
                </div>
              </div>
            </div>

            <div className="flex gap-2 md:gap-20 text-sm sm:min-w-[400px]">
              <div className="flex-1">
                <div className="font-medium text-black mb-2 text-base md:text-lg">
                  Read Information
                </div>
                <div className="flex flex-col gap-[2px]">
                  <div>
                    Current :{" "}
                    <span className="text-black font-medium">
                      {read_rate} MiB/s
                    </span>{" "}
                  </div>
                  <div>
                    Ideal :{" "}
                    <span className="text-black font-medium">
                      {ideal_read_rate} MiB/s
                    </span>
                  </div>
                  <div>
                    % of Ideal :{" "}
                    <span className="text-black font-medium">
                      {read_percentage} %
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium text-black mb-2 text-base md:text-lg">
                  Hash Information
                </div>
                <div className="flex flex-col gap-[2px]">
                  <div>
                    Current :{" "}
                    <span className="text-black font-medium">
                      {hash_rate} h/s
                    </span>{" "}
                  </div>
                  <div>
                    Ideal :{" "}
                    <span className="text-black font-medium">
                      {ideal_hash_rate} h/s
                    </span>
                  </div>
                  <div>
                    % of Ideal :{" "}
                    <span className="text-black font-medium">
                      {hash_percentage} %
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AccordionContent className="mt-10">
            <MinerPerformance chartData={performanceRates} />
          </AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default Partition;
