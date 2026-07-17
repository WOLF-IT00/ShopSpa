import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaymentMethod from "../components/Payment/PaymentMethod";
import { paymentAPI } from "../services/api";

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async (method) => {
    if (!order) {
      navigate("/services");
      return;
    }

    if (method === "paypal") {
      setLoading(true);
      setError("");
      try {
        sessionStorage.setItem("pending_order", JSON.stringify(order));
        const response = await paymentAPI.createPayPalOrder({
          order_id: order.id,
        });
        window.location.href = response.data.approve_url;
      } catch {
        setError("Không tạo được PayPal order. Kiểm tra cấu hình PayPal.");
        setLoading(false);
      }
      return;
    }

    if (method === "bank") {
      navigate("/payment/bank", { state: { order, method } });
    } else {
      navigate("/payment/momo", { state: { order, method } });
    }
  };

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="rounded-3xl bg-white p-8 text-center shadow-xl">
          <p className="mb-4 text-red-500">Không tìm thấy đơn hàng.</p>
          <button
            onClick={() => navigate("/cart")}
            className="text-emerald-600 underline"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-md">
          <p className="text-gray-600">Đơn hàng #{order.id}</p>
          <p className="text-2xl font-bold text-emerald-600">
            {order.total.toLocaleString("vi-VN")} VNĐ
          </p>
        </div>
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 p-4 text-red-600">{error}</p>
        )}
        <PaymentMethod onPayment={handlePayment} loading={loading} />
      </div>
    </div>
  );
}

export default PaymentPage;
