import useMinerMetrics from "@/hooks/useMinerMetrics";
import miner_logo from "@/assets/miner.svg";
import arrow_in_logo from "@/assets/arrow_in.svg";
import arrow_out_logo from "@/assets/arrow_out.svg";

type TPeer = {
  peer: string;
  h1_in: string;
  h1_out: string;
  h2_in: string;
  h2_out: string;
};

type Column = {
  key: string;
  label: string;
};

const Peers = () => {
  const { metrics } = useMinerMetrics();

  const data = Object.keys(metrics?.coordinatedMiningData || {}).map((peer) => {
    const transformedData: TPeer = {
      peer,
      h1_in: Number(metrics?.coordinatedMiningData[peer].h1.from).toFixed(2),
      h1_out: Number(metrics?.coordinatedMiningData[peer].h1.to).toFixed(2),
      h2_in: Number(metrics?.coordinatedMiningData[peer].h2.from).toFixed(2),
      h2_out: Number(metrics?.coordinatedMiningData[peer].h2.to).toFixed(2),
    };
    return transformedData;
  });

  const columns: Array<Column> = [
    {
      key: "peer",
      label: "Peer",
    },
    {
      key: "h1_in",
      label: "Hash 1 In",
    },
    {
      key: "h1_out",
      label: "Hash 1 Out",
    },
    {
      key: "h2_in",
      label: "Hash 2 In",
    },
    {
      key: "h2_out",
      label: "Hash 2 Out",
    },
  ];

  return (
    <div className="py-10 space-y-6">
      <section className="hidden md:block rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
        <h3 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">
          Peer Traffic
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                {columns.map((col) => (
                  <th key={col.key} className="pb-3 pr-4 font-medium whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {(col.key == "h1_in" || col.key == "h2_in") && (
                        <img src={arrow_in_logo} alt="arrow_in" className="h-4 w-4" />
                      )}
                      {(col.key == "h1_out" || col.key == "h2_out") && (
                        <img src={arrow_out_logo} alt="arrow_out" className="h-4 w-4" />
                      )}
                      {col.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!!data.length ? (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-gray-100 text-gray-700">
                    {columns.map((col) => (
                      <td key={col.key} className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          {col.key == "peer" && (
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                              <img src={miner_logo} alt="miner" className="h-4" />
                            </span>
                          )}
                          {(col.key == "h1_in" || col.key == "h2_in") && (
                            <img src={arrow_in_logo} alt="arrow_in" className="h-4 w-4" />
                          )}
                          {(col.key == "h1_out" || col.key == "h2_out") && (
                            <img src={arrow_out_logo} alt="arrow_out" className="h-4 w-4" />
                          )}
                          <span className="font-medium text-gray-800">
                            {
                              //@ts-ignore
                              row[col.key]
                            }
                          </span>
                          {(col.key == "h1_in" || col.key == "h1_out") && (
                            <span className="text-gray-500">h/s</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr className="h-24">
                  <td
                    colSpan={columns.length}
                    className="py-6 text-sm text-gray-500 text-center align-middle"
                  >
                    No Peers
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {!!data.length && (
        <div className="md:hidden grid grid-cols-1 gap-3">
          {data.map((peer, index) => (
            <Peer key={index} data={peer} />
          ))}
        </div>
      )}

      {!data.length && (
        <div className="md:hidden">
          <p className="text-sm text-gray-500">No Peers</p>
        </div>
      )}
    </div>
  );
};

const Peer = ({ data }: { data: TPeer }) => {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-center border-b border-gray-200 pb-3">
        <div className="bg-gray-50 border border-gray-200 flex items-center justify-center rounded-lg h-8 w-8 mr-2">
          <img src={miner_logo} alt="miner" className="h-5" />
        </div>
        <span className="font-medium text-gray-900">{data.peer}</span>
      </div>
      <div className="mt-3 text-sm">
        <div className="flex justify-between mb-2">
          <div className="text-gray-500">Hash 1 In</div>
          <div className="flex items-center text-gray-800 font-medium">
            <img src={arrow_in_logo} alt="arrow_in" className="h-4 mr-2" />
            {data.h1_in} h/s
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="text-gray-500">Hash 1 Out</div>
          <div className="flex items-center text-gray-800 font-medium">
            <img src={arrow_out_logo} alt="arrow_out" className="h-4 mr-2" />
            {data.h1_out} h/s
          </div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="text-gray-500">Hash 2 In</div>
          <div className="flex items-center text-gray-800 font-medium">
            <img src={arrow_in_logo} alt="arrow_in" className="h-4 mr-2" />
            {data.h2_in}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-500">Hash 2 Out</div>
          <div className="flex items-center text-gray-800 font-medium">
            <img src={arrow_out_logo} alt="arrow_out" className="h-4 mr-2" />
            {data.h2_out}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Peers;
