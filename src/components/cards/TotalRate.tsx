import { FC } from "react";

const TotalRate: FC<{
  title: string;
  metric: string | undefined;
  unit: string;
}> = ({ title, metric, unit }) => {
  return (
    <div className="flex-1 min-h-15 min-w-[140px] md:min-w-[180px] mx-1 md:mx-2 border border-gray-100 bg-white rounded-xl px-2 py-1 md:px-3 md:py-2">
      <div className="text-gray-600 font-medium text-xs md:text-sm mb-2 md:mb-3">
        {title}
      </div>
      <div className="text-black font-medium text-base md:text-lg">
        {metric} {unit}
      </div>
    </div>
  );
};

export default TotalRate;
