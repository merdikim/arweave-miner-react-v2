import { Cpu, Network } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatBytes, formatNumber } from "@/utils";
import useMinerMetrics from "@/hooks/useMinerMetrics";
import NotFound from "@/components/NotFound";
import { PrometheusMetrics, RouteUsage } from "@/types";

const COLORS = ["#2563eb", "#059669", "#d97706", "#dc2626", "#0ea5e9", "#f43f5e"];

const MinerUsage = () => {
  const { metrics, isLoading } = useMinerMetrics();
  const processMemory = metrics?.processMemoryMetrics || [];
  const data: PrometheusMetrics[] = metrics?.totalCowboyRequestsMetrics || [];
  const routeUsage = Object.values(
    data.reduce<Record<string, RouteUsage>>((acc, item) => {
      const route = item.labels.route || "unknown";
      const statusClass = item.labels.status_class;
      const value = Number(item.value) || 0;

      acc[route] ??= { route, requests: 0, success: 0, errors: 0 };
      acc[route].requests += value;

      if (statusClass === "success") {
        acc[route].success += value;
      } else {
        acc[route].errors += value;
      }

      return acc;
    }, {}),
  ).sort((a, b) => b.requests - a.requests);

  const totalRequests = routeUsage.reduce((sum, item) => sum + item.requests, 0);
  const totalSuccess = routeUsage.reduce((sum, item) => sum + item.success, 0);
  const totalErrors = routeUsage.reduce((sum, item) => sum + item.errors, 0);
  const totalMemory = processMemory.reduce((sum, item) => sum + item.bytes, 0);
  const errorRate =
    totalRequests === 0 ? "0.00" : ((totalErrors / totalRequests) * 100).toFixed(2);

  if (isLoading) {
    return <div className="py-10 text-sm text-gray-500">Loading usage...</div>;
  }

  return (
    <div className="py-10 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <UsageCard title="Total Requests" value={formatNumber(totalRequests)} unit="" />
        <UsageCard title="Successful Requests" value={formatNumber(totalSuccess)} unit="" />
        <UsageCard title="Error Rate" value={errorRate} unit="%" />
        <UsageCard title="Tracked Memory" value={formatBytes(totalMemory)} unit="" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
            <Network className="h-5 w-5 text-blue-600" />
            Top API Endpoints
          </h3>
          <div className="h-[360px]">
            {!!routeUsage.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={routeUsage.slice(0, 8)} layout="vertical" margin={{ left: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    type="number"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    tickFormatter={(value) => formatNumber(Number(value))}
                  />
                  <YAxis
                    type="category"
                    dataKey="route"
                    width={160}
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f9fafb" }}
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.75rem",
                    }}
                    formatter={(value) => formatNumber(Number(value))}
                  />
                  <Bar dataKey="requests" fill="#2563eb" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <NotFound msg="No usage data found" />
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base sm:text-lg font-semibold text-gray-900">
            <Cpu className="h-5 w-5 text-emerald-600" />
            Process Memory Distribution
          </h3>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processMemory}
                  dataKey="bytes"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} (${((percent || 0) * 100).toFixed(1)}%)`
                  }
                >
                  {processMemory.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value) => formatBytes(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
        <h3 className="mb-4 text-base sm:text-lg font-semibold text-gray-900">Endpoint Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-600">
                <th className="pb-3 font-medium">Route</th>
                <th className="pb-3 font-medium">Requests</th>
                <th className="pb-3 font-medium">Success</th>
                <th className="pb-3 font-medium">Errors</th>
                <th className="pb-3 font-medium">Success Rate</th>
              </tr>
            </thead>
            <tbody>
              {routeUsage.map((item) => {
                const successRate =
                  item.requests === 0 ? "0.00" : ((item.success / item.requests) * 100).toFixed(2);
                return (
                  <tr key={item.route} className="border-b border-gray-100 text-gray-700">
                    <td className="py-3 pr-3 font-medium text-gray-900">{item.route}</td>
                    <td className="py-3 pr-3">{formatNumber(item.requests)}</td>
                    <td className="py-3 pr-3">{formatNumber(item.success)}</td>
                    <td className="py-3 pr-3">{formatNumber(item.errors)}</td>
                    <td className="py-3 pr-3">{successRate}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const UsageCard = ({
  title,
  value,
  unit,
}: {
  title: string;
  value: string;
  unit: string;
}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-1 text-xl font-semibold text-gray-900">
        {value}
        {unit && <span className="ml-1 text-base font-medium text-gray-500">{unit}</span>}
      </p>
    </div>
  );
};

export default MinerUsage;
