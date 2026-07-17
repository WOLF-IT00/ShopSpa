import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { paymentAPI } from "../services/api";

function PayPalSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Capturing PayPal payment...");

  useEffect(() => {
    const capturePayment = async () => {
      const token = searchParams.get("token");
      const orderId = searchParams.get("order_id");

      if (!orderId) {
        setStatus("error");
        setMessage("Missing order_id from PayPal return URL.");
        return;
      }

      if (!token) {
        setStatus("error");
        setMessage("Missing PayPal token from return URL.");
        return;
      }

      try {
        await paymentAPI.capturePayPalOrder({
          order_id: Number(orderId),
          paypal_order_id: token,
        });
        sessionStorage.removeItem("pending_order");
        setStatus("success");
        setMessage("PayPal payment successful");
      } catch {
        setStatus("error");
        setMessage("Could not capture PayPal payment.");
      }
    };

    capturePayment();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-2xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          {status === "loading" && "Processing..."}
          {status === "success" && "PayPal payment successful"}
          {status === "error" && "Payment Error"}
        </h1>
        <p className="mb-8 text-lg text-gray-600">{message}</p>
        <Link
          to="/"
          className="inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}

export default PayPalSuccess;
