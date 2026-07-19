import { useCallback, useEffect, useState } from "react";
import {
  FiDollarSign,
  FiGift,
  FiShoppingCart,
  FiStar,
  FiUsers,
  FiUserCheck,
  FiPackage,
} from "react-icons/fi";
import { adminAPI } from "../../services/api";
import {
  BookingsBarChart,
  RevenueBarChart,
  RevenueLineChart,
} from "./DashboardCharts";
import { StatCard } from "./shared";

const PERIOD_OPTIONS = [
  { value: "today", label: "Hôm nay" },
  { value: "7d", label: "7 ngày" },
  { value: "30d", label: "30 ngày" },
  { value: "month", label: "Theo tháng" },
  { value: "year", label: "Theo năm" },
  { value: "custom", label: "Khoảng thời gian" },
];

const STATUS_COLORS = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  CONFIRMED: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  PAID: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
};

function formatCurrency(value) {
  return `${Number(value).toLocaleString("vi-VN")} VNĐ`;
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_COLORS[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function SectionCard({ title, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <h3 className="mb-4 text-base font-semibold text-gray-800 dark:text-white">{title}</h3>
      {children}
    </div>
  );
}

function BookingTable({ rows, emptyMessage }) {
  if (!rows?.length) {
    return (
      <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <th className="pb-3 pr-4 font-medium">#</th>
            <th className="pb-3 pr-4 font-medium">Khách hàng</th>
            <th className="pb-3 pr-4 font-medium">Ngày đặt</th>
            <th className="pb-3 pr-4 font-medium">Tổng</th>
            <th className="pb-3 font-medium">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id ?? row.email}
              className="border-b border-gray-50 last:border-0 dark:border-gray-800/50"
            >
              <td className="py-3 pr-4 font-medium text-gray-800 dark:text-gray-200">
                {row.id ? `#${row.id}` : "—"}
              </td>
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-800 dark:text-gray-200">{row.full_name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
              </td>
              <td className="py-3 pr-4 text-gray-600 dark:text-gray-300">
                {row.booking_date
                  ? `${row.booking_date} ${row.booking_time ?? ""}`
                  : formatDateTime(row.created_at)}
              </td>
              <td className="py-3 pr-4 font-medium text-emerald-600">
                {formatCurrency(row.total ?? row.total_spent ?? 0)}
              </td>
              <td className="py-3">
                {row.status ? (
                  <StatusBadge status={row.status} />
                ) : (
                  <span className="text-xs text-gray-500">{row.order_count ?? 0} đơn</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState("30d");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const darkMode = document.documentElement.classList.contains("dark");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { period };
      if (period === "month") {
        params.month = month;
        params.year = year;
      }
      if (period === "year") {
        params.year = year;
      }
      if (period === "custom" && startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }
      const res = await adminAPI.getDashboard(params);
      setData(res.data);
    } catch {
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [period, month, year, startDate, endDate]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading && !data) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-gray-500 dark:text-gray-400">Đang tải dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950/30">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={loadDashboard}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const summary = data?.summary ?? {};

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
              Khoảng thời gian
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {(period === "month" || period === "year") && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Năm
              </label>
              <input
                type="number"
                min="2000"
                max="2100"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-24 rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}

          {period === "month" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Tháng
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <option key={m} value={m}>
                    Tháng {m}
                  </option>
                ))}
              </select>
            </div>
          )}

          {period === "custom" && (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </>
          )}

          <button
            type="button"
            onClick={loadDashboard}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? "Đang tải..." : "Áp dụng"}
          </button>
        </div>

        {data?.filter_start && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Hiển thị từ {new Date(data.filter_start).toLocaleDateString("vi-VN")} đến{" "}
            {new Date(data.filter_end).toLocaleDateString("vi-VN")}
          </p>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Doanh thu"
          value={formatCurrency(summary.total_revenue)}
          icon={FiDollarSign}
          trend={summary.revenue_trend_percent}
        />
        <StatCard
          label="Đơn hàng"
          value={summary.total_orders}
          icon={FiShoppingCart}
          trend={summary.orders_trend_percent}
        />
        <StatCard label="Khách hàng" value={summary.total_customers} icon={FiUsers} />
        <StatCard label="Nhân viên" value={summary.total_staff} icon={FiUserCheck} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Dịch vụ" value={summary.total_services} icon={FiPackage} />
        <StatCard label="Voucher" value={summary.total_vouchers} icon={FiGift} />
        <StatCard label="Đánh giá" value={summary.total_reviews} icon={FiStar} />
      </div>

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Doanh thu theo tháng">
          <RevenueLineChart data={data?.revenue_by_month} darkMode={darkMode} />
        </SectionCard>
        <SectionCard title="Doanh thu theo ngày">
          <RevenueBarChart data={data?.revenue_by_day} darkMode={darkMode} />
        </SectionCard>
        <SectionCard title="Booking theo tháng" className="xl:col-span-2">
          <BookingsBarChart data={data?.bookings_by_month} darkMode={darkMode} />
        </SectionCard>
      </div>

      {/* Top lists */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Top 5 dịch vụ được đặt nhiều nhất">
          {!data?.top_services?.length ? (
            <p className="py-4 text-center text-sm text-gray-400">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {data.top_services.map((service, index) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {service.name}
                      </p>
                      <p className="text-xs text-gray-500">{service.booking_count} lượt đặt</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(service.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Top khách hàng đặt nhiều nhất">
          {!data?.top_customers?.length ? (
            <p className="py-4 text-center text-sm text-gray-400">Chưa có dữ liệu</p>
          ) : (
            <div className="space-y-3">
              {data.top_customers.map((customer, index) => (
                <div
                  key={customer.email}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        {customer.full_name}
                      </p>
                      <p className="text-xs text-gray-500">{customer.order_count} đơn</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-600">
                    {formatCurrency(customer.total_spent)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Booking tables */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Booking mới nhất">
          <BookingTable rows={data?.recent_bookings} emptyMessage="Chưa có booking" />
        </SectionCard>
        <SectionCard title="Booking đang chờ">
          <BookingTable rows={data?.pending_bookings} emptyMessage="Không có booking chờ" />
        </SectionCard>
      </div>

      <SectionCard title="Khách hàng mới">
        <BookingTable rows={data?.new_customers} emptyMessage="Chưa có khách hàng mới" />
      </SectionCard>
    </div>
  );
}
