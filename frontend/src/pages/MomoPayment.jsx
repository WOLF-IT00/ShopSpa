import { useLocation, useNavigate } from "react-router-dom";
import { paymentAPI } from "../services/api";

function MomoPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const handleConfirm = async () => {
    if (!order) {
      navigate("/payment/success");
      return;
    }

    try {
      await paymentAPI.process({ order_id: order.id, method: "momo" });
      navigate("/payment/success");
    } catch {
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
        <h1 className="mb-4 text-3xl font-bold text-pink-600">Thanh toán MoMo</h1>
        <p className="mb-6 text-gray-600">
          {order
            ? `Số tiền: ${order.total.toLocaleString("vi-VN")} VNĐ`
            : "Quét mã MoMo để thanh toán"}
        </p>
        <button
          onClick={handleConfirm}
          className="w-full rounded-xl bg-pink-600 py-4 font-semibold text-white hover:bg-pink-700"
        >
          Xác nhận đã thanh toán MoMo
        </button>
      </div>
    </div>
  );
}

export default MomoPayment;
