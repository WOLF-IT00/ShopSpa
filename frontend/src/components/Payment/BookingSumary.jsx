import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { orderAPI } from "../../services/api";

function BookingSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const booking = location.state?.booking || location.state;

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 text-center shadow-xl">
        <p className="mb-4 font-semibold text-red-500">
          Không tìm thấy thông tin đặt lịch!
        </p>
        <button
          onClick={() => navigate("/booking")}
          className="text-emerald-600 underline"
        >
          Quay lại đặt lịch
        </button>
      </div>
    );
  }

  const priceLabel =
    typeof booking.price === "number"
      ? `${booking.price.toLocaleString("vi-VN")} VNĐ`
      : booking.price;

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await orderAPI.create({
        items: [{ product_id: Number(booking.productId), quantity: 1 }],
        full_name: booking.fullName,
        phone: booking.phone,
        email: booking.email,
        booking_date: booking.date,
        booking_time: booking.time,
        note: booking.note || null,
      });

      navigate("/payment", { state: { order: response.data } });
    } catch {
      setError("Không thể lưu đặt lịch. Vui lòng thử lại.");
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="mb-8 text-center text-3xl font-bold text-emerald-700">
        Xác nhận đặt lịch
      </h2>

      <div className="space-y-5">
        <InfoRow label="Họ tên" value={booking.fullName} />
        <InfoRow label="Số điện thoại" value={booking.phone} />
        <InfoRow label="Email" value={booking.email} />
        <InfoRow label="Dịch vụ" value={booking.service} />
        <InfoRow label="Ngày" value={booking.date} />
        <InfoRow label="Giờ" value={booking.time} />
        <InfoRow label="Giá dịch vụ" value={priceLabel} />
      </div>

      <div className="mt-10 flex justify-between border-t pt-6 text-2xl font-bold">
        <span>Tổng thanh toán</span>
        <span className="text-emerald-600">{priceLabel}</span>
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <button
        onClick={handleConfirm}
        disabled={loading}
        className="mt-10 w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Đang lưu..." : "TIẾP TỤC THANH TOÁN"}
      </button>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-3">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="font-medium">{value || "Chưa cập nhật"}</span>
    </div>
  );
}

export default BookingSummary;
