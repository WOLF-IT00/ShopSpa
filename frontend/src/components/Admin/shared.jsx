import { useEffect } from "react";

export function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const colors =
    type === "error"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div
      className={`fixed right-6 top-6 z-50 rounded-xl border px-5 py-3 shadow-lg ${colors}`}
    >
      {message}
    </div>
  );
}

export function ConfirmDialog({ open, title, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export function Pagination({ meta, onPageChange }) {
  if (!meta || meta.pages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
      <span>
        Trang {meta.page}/{meta.pages} — {meta.total} mục
      </span>
      <div className="flex gap-2">
        <button
          disabled={meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          Trước
        </button>
        <button
          disabled={meta.page >= meta.pages}
          onClick={() => onPageChange(meta.page + 1)}
          className="rounded border px-3 py-1 disabled:opacity-40"
        >
          Sau
        </button>
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {trend != null && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% so với kỳ trước
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50">
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  );
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-");
}

export const BOOKING_STATUSES = [
  { value: "PENDING", label: "Chờ xác nhận" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "PAID", label: "Đã thanh toán" },
];

export const PAYMENT_STATUSES = [
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "PAID", label: "Đã thanh toán" },
];

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
      {Icon && (
        <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400 dark:bg-gray-800">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="border-b border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/50">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-4 flex-1 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex gap-4 border-t border-gray-50 p-4 dark:border-gray-800"
        >
          {Array.from({ length: cols }).map((_, col) => (
            <div
              key={col}
              className="h-4 flex-1 animate-pulse rounded bg-gray-100 dark:bg-gray-800"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
          <div className="mt-3 h-3 w-1/2 rounded bg-gray-100 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ status, type = "order" }) {
  const orderColors = {
    PENDING: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    CONFIRMED: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    COMPLETED: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    CANCELLED: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    PAID: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  };
  const paymentColors = {
    UNPAID: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
    PAID: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  };
  const colors = type === "payment" ? paymentColors : orderColors;
  const label =
    type === "payment"
      ? PAYMENT_STATUSES.find((s) => s.value === status)?.label ?? status
      : BOOKING_STATUSES.find((s) => s.value === status)?.label ?? status;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {label}
    </span>
  );
}

export function formatCurrency(value) {
  return `${Number(value).toLocaleString("vi-VN")} VNĐ`;
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
