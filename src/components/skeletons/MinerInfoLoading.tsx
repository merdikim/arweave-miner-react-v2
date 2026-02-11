const MinerInfoLoading = () => {
  return (
    <div className="py-10">
      <div className="flex justify-between overflow-scroll">
        <TotalRateLoading title={"Total Storage"} />
        <TotalRateLoading title={"Total Read Rate"} />
        <TotalRateLoading title={"Total Hash Rate"} />
        <TotalRateLoading title={"Total Ideal Read Rate"} />
        <TotalRateLoading title={"Total Ideal Hash Rate"} />
        <TotalRateLoading title={"% Ideal Read Rate"} />
        <TotalRateLoading title={"% Ideal Hash Rate"} />
      </div>
      <div className="mt-10">
        {Array(4)
          .fill("")
          .map((_, index) => (
            <PartitionLoading key={index} />
          ))}
      </div>
    </div>
  );
};

const TotalRateLoading = ({ title }: { title: string }) => {
  return (
    <div className="flex-none h-18 w-[140px] md:w-[180px] mx-1 md:mx-2 border border-gray-100 bg-white rounded-xl px-2 py-1 md:px-3 md:py-2">
      <div className="text-gray-700 font-medium text-xs md:text-sm mb-4 md:mb-3">
        {title}
      </div>
      <div className="text-black font-medium text-base h-4 md:h-5 w-[100px] bg-gray-200 animate-pulse"></div>
    </div>
  );
};

const PartitionLoading = () => {
  return (
    <div className="bg-white border border-gray-100 w-full p-3 sm:p-5 md:p-6 rounded-xl mb-6 shadow">
      <div className="flex justify-between">
        <div className="h-5 md:h-6 w-40 mb-4 md:mb-6 bg-gray-200 animate-pulse"></div>
      </div>
      <div className="bg-gray-50 rounded-xl p-2 md:p-6 flex flex-col md:flex-row gap-10 justify-between text-gray-700 font-normal">
        <div className="flex gap-14 text-base sm:text-xl md:text-2xl">
          <div className="flex flex-col gap-1 md:gap-3">
            <div>Data Size</div>
            <div className="h-5 md:h-6 bg-gray-200 animate-pulse"></div>
          </div>
          <div className="flex flex-col gap-1 md:gap-3">
            <div>% of Max</div>
            <div className="h-5 md:h-6 bg-gray-200 animate-pulse"></div>
          </div>
        </div>

        <div className="flex gap-2 md:gap-20 text-xs sm:text-base sm:min-w-[400px]">
          <div className="flex-1">
            <div className="font-medium text-black mb-3">Read Information</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                Current :{" "}
                <div className="ml-2 h-3 md:h-5 w-20 bg-gray-200 animate-pulse"></div>{" "}
              </div>
              <div className="flex items-center">
                Ideal :{" "}
                <div className="ml-2 h-3 md:h-5 w-20 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="flex items-center">
                % of Ideal :{" "}
                <div className="ml-2 h-3 md:h-5 w-16 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="font-medium text-black mb-3">Hash Information</div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center">
                Current :{" "}
                <div className="ml-2 h-3 md:h-5 w-20 bg-gray-200 animate-pulse"></div>{" "}
              </div>
              <div className="flex items-center">
                Ideal :{" "}
                <div className="ml-2 h-3 md:h-5 w-20 bg-gray-200 animate-pulse"></div>
              </div>
              <div className="flex items-center">
                % of Ideal :{" "}
                <div className="ml-2 h-3 md:h-5 w-16 bg-gray-200 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinerInfoLoading;
