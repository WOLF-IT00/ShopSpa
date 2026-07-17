import { Link, useSearchParams } from "react-router-dom";

function PayPalCancel() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-2xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          PayPal payment canceled
        </h1>
        <p className="mb-8 text-lg text-gray-600">
          Bạn đã hủy thanh toán PayPal. Có thể quay lại để thử lại.
        </p>
        {orderId ? (
          <Link
            to={`/orders/${orderId}/payment`}
            className="inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Quay lại thanh toán
          </Link>
        ) : (
          <Link
            to="/cart"
            className="inline-block rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Quay lại giỏ hàng
          </Link>
        )}
      </div>
    </div>
  );
}

export default PayPalCancel;
