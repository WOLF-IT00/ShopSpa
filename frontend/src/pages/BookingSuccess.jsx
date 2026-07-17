import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function BookingSuccess() {
  return (
    <>
      <Header titles="The Mộc Spa" />

      <main className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center px-6 py-20">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <div className="mb-6 text-7xl">✅</div>

          <h1 className="mb-4 text-4xl font-bold text-emerald-700">
            Đặt lịch thành công!
          </h1>

          <p className="mb-8 text-lg text-gray-600">
            Cảm ơn bạn đã tin tưởng Mộc Spa.
            <br />
            Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận
            lịch hẹn.
          </p>

          <Link
            to="/"
            className="rounded-xl bg-emerald-600 px-8 py-3 text-white transition hover:bg-emerald-700"
          >
            Quay về Trang chủ
          </Link>
        </div>
      </main>

      <Footer
        studentName={[
          "Quách Tiến Tài - 2200006985",
          "Lê Thanh Trọng - 2200009170",
          "Nguyễn Mai Tú Mẫn - 2200006620",
          "Nguyễn Hoàng Pháp Bảo - 2200006550",
        ]}
        courseName="Full-Stack Web Development"
      />
    </>
  );
}

export default BookingSuccess;
