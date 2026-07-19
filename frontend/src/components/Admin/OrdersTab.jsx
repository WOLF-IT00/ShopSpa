import { useCallback, useEffect, useRef, useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiEye,
  FiSearch,
  FiShoppingBag,
  FiX,
  FiXCircle,
} from "react-icons/fi";
import { adminAPI } from "../../services/api";
import {
  BOOKING_STATUSES,
  EmptyState,
  Pagination,
  PAYMENT_STATUSES,
  StatusBadge,
  TableSkeleton,
  formatCurrency,
  formatDateTime,
} from "./shared";

function StatusConfirmDialog({ open, title, confirmLabel, onConfirm, onCancel, loading }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">{title}</h3>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function formatServices(items) {
  if (!items?.length) return "—";
  return items.map((item) => `${item.product_name} x${item.quantity}`).join(", ");
}

function OrderDetailModal({ order, onClose, onStatusAction, actionLoading }) {
  if (!order) return null;

  const canConfirm = order.status === "PENDING";
  const canCancel = order.status === "PENDING" || order.status === "CONFIRMED";
  const canComplete = order.status === "CONFIRMED";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl dark:bg-gray-900">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Chi tiết đơn #{order.id}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20} />
          </button>
        </div>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={order.status} type="order" />
            <StatusBadge status={order.payment_status} type="payment" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            <div>
              <span className="text-gray-500">Khách hàng:</span>{" "}
              <span className="font-medium text-gray-800 dark:text-white">{order.full_name}</span>
            </div>
            <div>
              <span className="text-gray-500">Email:</span> {order.email}
            </div>
            <div>
              <span className="text-gray-500">SĐT:</span> {order.phone}
            </div>
            <div>
              <span className="text-gray-500">Ngày tạo:</span> {formatDateTime(order.created_at)}
            </div>
            <div>
              <span className="text-gray-500">Ngày đặt:</span> {order.booking_date}
            </div>
            <div>
              <span className="text-gray-500">Giờ đặt:</span> {order.booking_time}
            </div>
            <div className="sm:col-span-2">
              <span className="text-gray-500">Tổng tiền:</span>{" "}
              <span className="font-semibold text-emerald-600">{formatCurrency(order.total)}</span>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-800 dark:text-white">Dịch vụ</h4>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm dark:bg-gray-800"
                >
                  <span className="text-gray-800 dark:text-gray-200">{item.product_name}</span>
                  <span className="text-gray-500">
                    x{item.quantity} · {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {order.note && (
            <div>
              <h4 className="mb-1 font-medium text-gray-800 dark:text-white">Ghi chú</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{order.note}</p>
            </div>
          )}

          {order.status_logs?.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium text-gray-800 dark:text-white">Lịch sử trạng thái</h4>
              <ol className="space-y-2 text-sm">
                {order.status_logs.map((log) => (
                  <li
                    key={log.id}
                    className="rounded-lg border border-gray-100 px-3 py-2 dark:border-gray-800"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {log.old_value ? `${log.old_value} → ${log.new_value}` : log.new_value}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDateTime(log.created_at)}
                      </span>
                    </div>
                    {log.created_by && (
                      <p className="mt-1 text-xs text-gray-500">bởi {log.created_by}</p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {(canConfirm || canCancel || canComplete) && (
            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
              {canConfirm && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => onStatusAction(order, "CONFIRMED")}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <FiCheck size={16} />
                  Xác nhận
                </button>
              )}
              {canComplete && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => onStatusAction(order, "COMPLETED")}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <FiCheckCircle size={16} />
                  Hoàn thành
                </button>
              )}
              {canCancel && (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => onStatusAction(order, "CANCELLED")}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
                >
                  <FiXCircle size={16} />
                  Hủy đơn
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OrdersTab({ onToast }) {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [detailTarget, setDetailTarget] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 10, sort: "desc" };
      if (debouncedSearch.trim()) params.q = debouncedSearch.trim();
      if (statusFilter) params.status = statusFilter;
      if (paymentFilter) params.payment_status = paymentFilter;
      const res = await adminAPI.getOrders(params);
      setOrders(res.data.items);
      setMeta(res.data.meta);
    } catch {
      onToast("Không thể tải danh sách đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, paymentFilter, onToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleViewDetail = async (order) => {
    try {
      const res = await adminAPI.getOrder(order.id);
      setDetailTarget(res.data);
    } catch {
      onToast("Không thể tải chi tiết đơn hàng", "error");
    }
  };

  const handleStatusUpdate = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    try {
      await adminAPI.updateOrderStatus(confirmAction.order.id, {
        status: confirmAction.status,
      });
      onToast(confirmAction.successMessage, "success");
      setConfirmAction(null);
      if (detailTarget?.id === confirmAction.order.id) {
        const res = await adminAPI.getOrder(confirmAction.order.id);
        setDetailTarget(res.data);
      }
      loadOrders();
    } catch (err) {
      const msg =
        err.response?.data?.detail ?? "Không thể cập nhật trạng thái đơn hàng";
      onToast(typeof msg === "string" ? msg : "Không thể cập nhật trạng thái đơn hàng", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const openStatusConfirm = (order, status) => {
    const labels = {
      CONFIRMED: {
        title: `Xác nhận đơn #${order.id}?`,
        successMessage: "Đã xác nhận đơn hàng",
        confirmLabel: "Xác nhận",
      },
      COMPLETED: {
        title: `Hoàn thành đơn #${order.id}?`,
        successMessage: "Đã hoàn thành đơn hàng",
        confirmLabel: "Hoàn thành",
      },
      CANCELLED: {
        title: `Hủy đơn #${order.id}?`,
        successMessage: "Đã hủy đơn hàng",
        confirmLabel: "Hủy đơn",
      },
    };
    const config = labels[status];
    setConfirmAction({
      order,
      status,
      title: config.title,
      confirmLabel: config.confirmLabel,
      successMessage: config.successMessage,
    });
  };

  const renderRowActions = (order) => {
    const actions = [];
    if (order.status === "PENDING") {
      actions.push(
        <button
          key="confirm"
          type="button"
          onClick={() => openStatusConfirm(order, "CONFIRMED")}
          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          title="Xác nhận"
        >
          <FiCheck size={16} />
        </button>
      );
    }
    if (order.status === "CONFIRMED") {
      actions.push(
        <button
          key="complete"
          type="button"
          onClick={() => openStatusConfirm(order, "COMPLETED")}
          className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          title="Hoàn thành"
        >
          <FiCheckCircle size={16} />
        </button>
      );
    }
    if (order.status === "PENDING" || order.status === "CONFIRMED") {
      actions.push(
        <button
          key="cancel"
          type="button"
          onClick={() => openStatusConfirm(order, "CANCELLED")}
          className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          title="Hủy"
        >
          <FiXCircle size={16} />
        </button>
      );
    }
    return actions;
  };

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Quản lý đơn hàng
          </h2>
          <p className="text-sm text-gray-500">{meta?.total ?? 0} đơn</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã đơn, tên, email, SĐT..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="">Tất cả trạng thái</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => {
            setPaymentFilter(e.target.value);
            setPage(1);
          }}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
        >
          <option value="">Tất cả thanh toán</option>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <TableSkeleton rows={6} cols={10} />
      ) : orders.length === 0 ? (
        <EmptyState
          icon={FiShoppingBag}
          title="Chưa có đơn hàng"
          description="Đơn hàng mới sẽ hiển thị tại đây."
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="border-b border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
              <tr>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Mã đơn</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Khách hàng</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Email</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">SĐT</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Dịch vụ</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Tổng tiền</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Trạng thái</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Thanh toán</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Ngày tạo</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-50 transition hover:bg-gray-50/50 dark:border-gray-800 dark:hover:bg-gray-800/30"
                >
                  <td className="p-4 font-medium text-gray-800 dark:text-gray-200">#{order.id}</td>
                  <td className="p-4 text-gray-800 dark:text-gray-200">{order.full_name}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{order.email}</td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{order.phone}</td>
                  <td className="max-w-[200px] truncate p-4 text-gray-600 dark:text-gray-300" title={formatServices(order.items)}>
                    {formatServices(order.items)}
                  </td>
                  <td className="p-4 font-medium text-emerald-600">{formatCurrency(order.total)}</td>
                  <td className="p-4">
                    <StatusBadge status={order.status} type="order" />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={order.payment_status} type="payment" />
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    {formatDateTime(order.created_at)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(order)}
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        title="Xem chi tiết"
                      >
                        <FiEye size={16} />
                      </button>
                      {renderRowActions(order)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 pb-4">
            <Pagination meta={meta} onPageChange={setPage} />
          </div>
        </div>
      )}

      <OrderDetailModal
        order={detailTarget}
        onClose={() => setDetailTarget(null)}
        onStatusAction={openStatusConfirm}
        actionLoading={actionLoading}
      />

      <StatusConfirmDialog
        open={!!confirmAction}
        title={confirmAction?.title ?? ""}
        confirmLabel={confirmAction?.confirmLabel ?? "Xác nhận"}
        loading={actionLoading}
        onConfirm={handleStatusUpdate}
        onCancel={() => setConfirmAction(null)}
      />
    </section>
  );
}
