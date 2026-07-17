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

export function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <p className="text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-emerald-600">{value}</p>
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
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "PAID", label: "Paid" },
];
