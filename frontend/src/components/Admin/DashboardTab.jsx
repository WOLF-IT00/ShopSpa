import { useEffect, useState } from "react";
import { adminAPI } from "../../services/api";
import { StatCard } from "./shared";

export default function DashboardTab() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.getStats().then((res) => setStats(res.data));
  }, []);

  if (!stats) {
    return <p className="text-gray-500">Đang tải thống kê...</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Người dùng" value={stats.total_users} />
      <StatCard label="Dịch vụ" value={stats.total_products} />
      <StatCard label="Lịch đặt" value={stats.total_bookings} />
      <StatCard
        label="Doanh thu"
        value={`${stats.total_revenue.toLocaleString("vi-VN")} VNĐ`}
      />
    </div>
  );
}
