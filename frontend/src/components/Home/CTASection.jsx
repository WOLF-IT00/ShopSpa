import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-emerald-700 py-20">
      {/* Background decoration */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-emerald-500 opacity-20"></div>

      <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-emerald-400 opacity-20"></div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center text-white">
        <h2 className="mb-6 text-5xl font-bold">
          Bạn đã sẵn sàng trải nghiệm dịch vụ tại Mộc Spa chưa?
        </h2>

        <p className="mx-auto mb-10 max-w-3xl text-lg leading-8 text-emerald-100">
          Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng mang đến cho bạn những
          liệu trình chăm sóc sức khỏe và sắc đẹp tốt nhất.
        </p>

        <div className="flex flex-col justify-center gap-5 sm:flex-row">
          <Link
            to="/booking"
            className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-emerald-700 transition hover:scale-105"
          >
            Đặt lịch ngay
          </Link>

          <Link
            to="/services"
            className="rounded-xl border-2 border-white px-8 py-4 text-lg font-semibold transition hover:bg-white hover:text-emerald-700"
          >
            Xem dịch vụ
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
