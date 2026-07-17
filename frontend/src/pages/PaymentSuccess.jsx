import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

function PaymentSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-10 text-center shadow-2xl">
        <FaCheckCircle className="mx-auto mb-6 text-7xl text-emerald-600" />

        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          Thanh toán thành công
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          Cảm ơn bạn đã đặt lịch tại
          <span className="font-semibold text-emerald-600"> The Mộc Spa</span>.
          <br />
          Chúng tôi sẽ liên hệ xác nhận lịch hẹn trong thời gian sớm nhất.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="block rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            Về Trang Chủ
          </Link>

          <Link
            to="/services"
            className="block rounded-xl border border-emerald-600 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-50"
          >
            Tiếp tục xem dịch vụ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
