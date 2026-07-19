import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartColors = {
  emerald: "#059669",
  teal: "#0d9488",
  grid: "#e5e7eb",
  gridDark: "#374151",
  text: "#6b7280",
  textDark: "#9ca3af",
};

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-emerald-600">
        {formatter ? formatter(payload[0].value) : payload[0].value}
      </p>
    </div>
  );
}

export function RevenueLineChart({ data, darkMode }) {
  if (!data?.length) {
    return <EmptyChart message="Chưa có dữ liệu doanh thu" />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={darkMode ? chartColors.gridDark : chartColors.grid}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: darkMode ? chartColors.textDark : chartColors.text }}
          tickFormatter={(v) => (v.length > 7 ? v.slice(5) : v)}
        />
        <YAxis
          tick={{ fontSize: 11, fill: darkMode ? chartColors.textDark : chartColors.text }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={
            <ChartTooltip formatter={(v) => `${Number(v).toLocaleString("vi-VN")} VNĐ`} />
          }
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={chartColors.emerald}
          strokeWidth={2.5}
          dot={{ r: 3, fill: chartColors.emerald }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function RevenueBarChart({ data, darkMode }) {
  if (!data?.length) {
    return <EmptyChart message="Chưa có dữ liệu doanh thu theo ngày" />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={darkMode ? chartColors.gridDark : chartColors.grid}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: darkMode ? chartColors.textDark : chartColors.text }}
          tickFormatter={(v) => v.slice(8)}
        />
        <YAxis
          tick={{ fontSize: 11, fill: darkMode ? chartColors.textDark : chartColors.text }}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
        />
        <Tooltip
          content={
            <ChartTooltip formatter={(v) => `${Number(v).toLocaleString("vi-VN")} VNĐ`} />
          }
        />
        <Bar dataKey="value" fill={chartColors.teal} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function BookingsBarChart({ data, darkMode }) {
  if (!data?.length) {
    return <EmptyChart message="Chưa có dữ liệu booking" />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke={darkMode ? chartColors.gridDark : chartColors.grid}
        />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: darkMode ? chartColors.textDark : chartColors.text }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: darkMode ? chartColors.textDark : chartColors.text }}
          allowDecimals={false}
        />
        <Tooltip content={<ChartTooltip formatter={(v) => `${v} booking`} />} />
        <Bar dataKey="value" fill={chartColors.emerald} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyChart({ message }) {
  return (
    <div className="flex h-[280px] items-center justify-center text-sm text-gray-400 dark:text-gray-500">
      {message}
    </div>
  );
}
