import { useLocation, useNavigate } from "react-router-dom";
import { paymentAPI } from "../../services/api";

function BankTransfer() {
  const navigate = useNavigate();
  const location = useLocation();
  const order = location.state?.order;

  const accountNumber = "123456789";
  const accountName = "THE MOC SPA";
  const bankName = "Vietcombank";
  const amount = order
    ? `${order.total.toLocaleString("vi-VN")} VNĐ`
    : "0 VNĐ";
  const transferContent = order ? `ORDER${order.id}` : "BOOKING12345";

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    alert("Đã sao chép!");
  };

  const handleConfirm = async () => {
    if (!order) {
      navigate("/payment/success");
      return;
    }

    try {
      await paymentAPI.process({ order_id: order.id, method: "bank" });
      navigate("/payment/success");
    } catch {
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-10 shadow-xl">
      <h1 className="mb-8 text-center text-3xl font-bold text-emerald-700">
        Thanh toán QR Banking
      </h1>

      <div className="flex justify-center">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=TheMocSpaBooking"
          alt="QR"
          className="rounded-xl border"
        />
      </div>

      <div className="mt-10 space-y-5">
        <Info label="Ngân hàng" value={bankName} />
        <Info label="Chủ tài khoản" value={accountName} />
        <Info label="Số tài khoản" value={accountNumber} />
        <Info label="Số tiền" value={amount} />
        <Info label="Nội dung" value={transferContent} />
      </div>

      <div className="mt-8 flex gap-4">
        <button
          onClick={() => copyText(accountNumber)}
          className="flex-1 rounded-xl bg-gray-200 py-3"
        >
          Copy STK
        </button>

        <button
          onClick={() => copyText(transferContent)}
          className="flex-1 rounded-xl bg-gray-200 py-3"
        >
          Copy Nội dung
        </button>
      </div>

      <button
        onClick={handleConfirm}
        className="mt-10 w-full rounded-xl bg-emerald-600 py-4 font-semibold text-white hover:bg-emerald-700"
      >
        Tôi đã thanh toán
      </button>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between border-b pb-3">
      <span className="font-semibold text-gray-600">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

export default BankTransfer;
