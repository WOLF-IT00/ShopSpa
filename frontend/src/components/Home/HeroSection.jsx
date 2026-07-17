import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section
      className="relative flex h-[700px] items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 text-center text-white">
        <h1 className="mb-6 text-5xl font-bold md:text-6xl">
          Thư giãn cơ thể – Chăm sóc tâm hồn
        </h1>

        <p className="mb-10 text-lg leading-8 text-gray-200">
          Mộc Spa mang đến những liệu trình chăm sóc sức khỏe và sắc đẹp với đội
          ngũ chuyên viên giàu kinh nghiệm trong không gian sang trọng, yên
          bình.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/booking"
            className="rounded-xl bg-emerald-600 px-8 py-4 text-lg font-semibold transition hover:bg-emerald-700"
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

export default HeroSection;
