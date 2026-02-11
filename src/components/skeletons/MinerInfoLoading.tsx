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
    <section className="w-full mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="h-3 w-16 rounded bg-gray-200 animate-pulse" />
          <div className="h-6 w-24 mt-2 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="h-8 w-28 sm:h-9 sm:w-36 rounded-lg bg-gray-200 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="h-3 w-18 rounded bg-gray-200 animate-pulse" />
          <div className="h-7 w-28 mt-2 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="h-3 w-14 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-2/3 rounded-full bg-gray-300 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl border border-gray-200 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-3/5 rounded-full bg-gray-300 animate-pulse" />
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="h-4 w-12 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="h-4 w-10 rounded bg-gray-200 animate-pulse" />
              <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div className="h-full w-1/2 rounded-full bg-gray-300 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinerInfoLoading;
