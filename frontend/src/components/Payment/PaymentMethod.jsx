import { useState } from "react";
import { FaMoneyCheckAlt, FaPaypal, FaWallet } from "react-icons/fa";

function PaymentMethod({ onPayment, loading = false }) {
  const [method, setMethod] = useState("paypal");

  return (
    <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="mb-8 text-2xl font-bold">Chọn phương thức thanh toán</h2>

      <label
        className={`mb-5 flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
          method === "paypal"
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-5">
          <FaPaypal size={30} className="text-blue-600" />
          <div>
            <h3 className="font-semibold">PayPal</h3>
            <p className="text-gray-500">Thanh toán qua PayPal Sandbox</p>
          </div>
        </div>
        <input
          type="radio"
          checked={method === "paypal"}
          onChange={() => setMethod("paypal")}
        />
      </label>

      <label
        className={`mb-5 flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
          method === "bank"
            ? "border-emerald-600 bg-emerald-50"
            : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-5">
          <FaMoneyCheckAlt size={30} className="text-emerald-600" />
          <div>
            <h3 className="font-semibold">QR Banking</h3>
            <p className="text-gray-500">Thanh toán bằng mã QR ngân hàng</p>
          </div>
        </div>
        <input
          type="radio"
          checked={method === "bank"}
          onChange={() => setMethod("bank")}
        />
      </label>

      <label
        className={`flex cursor-pointer items-center justify-between rounded-2xl border p-5 transition ${
          method === "momo" ? "border-pink-500 bg-pink-50" : "border-gray-200"
        }`}
      >
        <div className="flex items-center gap-5">
          <FaWallet size={30} className="text-pink-600" />
          <div>
            <h3 className="font-semibold">Ví MoMo</h3>
            <p className="text-gray-500">Thanh toán bằng ví điện tử</p>
          </div>
        </div>
        <input
          type="radio"
          checked={method === "momo"}
          onChange={() => setMethod("momo")}
        />
      </label>

      <button
        onClick={() => onPayment(method)}
        disabled={loading}
        className="mt-8 w-full rounded-xl bg-emerald-600 py-4 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Đang xử lý..." : "THANH TOÁN NGAY"}
      </button>
    </div>
  );
}

export default PaymentMethod;
