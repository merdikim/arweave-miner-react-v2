import { PrometheusMetrics } from "@/types";
import { ONE_TERABYTE } from "@/utils";
import { FC, useState } from "react";
import MinerPerformance from "../charts/MinerPerformance";
import Button from "../ui/Button";

const Partition: FC<{
  metrics: PrometheusMetrics;
  performanceRates: Array<{ [key: string]: string }>;
}> = ({ metrics, performanceRates }) => {
  const [isPerformanceModalOpen, setIsPerformanceModalOpen] = useState(false);
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
  const dataSizePercentValue = Math.min(
    100,
    Math.max(0, Number(data_size_percentage)),
  );
  const readPercentValue = Math.min(100, Math.max(0, Number(read_percentage)));
  const hashPercentValue = Math.min(100, Math.max(0, Number(hash_percentage)));
  const getProgressColorClass = (value: number) => {
    if (value >= 85) return "bg-emerald-500";
    if (value >= 60) return "bg-amber-400";
    return "bg-rose-500";
  };

  return (
    <>
      <section className="w-full mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Partition
            </p>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              #{metrics.labels.partition_number}
            </h3>
          </div>
          <Button
            onClick={() => setIsPerformanceModalOpen(true)}
            className="h-8 px-3 sm:h-9 sm:px-4 text-xs sm:text-sm font-medium bg-black text-white hover:bg-gray-900"
          >
            View Performance
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Data Size
            </p>
            <p className="mt-1 text-xl font-semibold text-gray-900">
              {data_size} TiB
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                % of Max
              </p>
              <p className="text-sm font-semibold text-gray-900">
                {data_size_percentage}%
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full ${getProgressColorClass(
                  dataSizePercentValue,
                )}`}
                style={{ width: `${dataSizePercentValue}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                Read Information
              </h4>
              <span className="text-xs font-medium text-gray-500">
                {read_percentage}%
              </span>
            </div>
            <div className="space-y-1 text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <span>Current</span>
                <span className="font-medium text-gray-900">
                  {read_rate} MiB/s
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Ideal</span>
                <span className="font-medium text-gray-900">
                  {ideal_read_rate} MiB/s
                </span>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full ${getProgressColorClass(
                  readPercentValue,
                )}`}
                style={{ width: `${readPercentValue}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                Hash Information
              </h4>
              <span className="text-xs font-medium text-gray-500">
                {hash_percentage}%
              </span>
            </div>
            <div className="space-y-1 text-gray-600">
              <div className="flex items-center justify-between gap-3">
                <span>Current</span>
                <span className="font-medium text-gray-900">{hash_rate} h/s</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Ideal</span>
                <span className="font-medium text-gray-900">
                  {ideal_hash_rate} h/s
                </span>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full ${getProgressColorClass(
                  hashPercentValue,
                )}`}
                style={{ width: `${hashPercentValue}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {isPerformanceModalOpen && (
        <div
          className="fixed inset-0 w-full flex items-center justify-center overflow-y-auto bg-black/60 z-50 p-2 md:p-6"
          onClick={() => setIsPerformanceModalOpen(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm sm:text-base font-semibold text-gray-800">
                Partition #{metrics.labels.partition_number} Performance
              </div>
              <Button
                onClick={() => setIsPerformanceModalOpen(false)}
                className="h-8 px-3 text-xs sm:text-sm border-gray-300 text-gray-700 bg-white hover:bg-gray-100 font-medium"
              >
                Close
              </Button>
            </div>
            <MinerPerformance chartData={performanceRates} />
          </div>
        </div>
      )}
    </>
  );
};

export default Partition;
