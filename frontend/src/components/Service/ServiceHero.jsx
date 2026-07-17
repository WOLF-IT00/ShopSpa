import { Link } from "react-router-dom";

function ServiceHero() {
  return (
    <section
      className="relative flex h-[450px] items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 px-6 text-center text-white">
        <p className="mb-3 text-lg uppercase tracking-[6px] text-emerald-300">
          The Mộc Spa
        </p>

        <h1 className="text-5xl font-bold md:text-6xl">
          Dịch vụ của chúng tôi
        </h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-200">
          Khám phá những liệu trình chăm sóc sức khỏe và sắc đẹp được thiết kế
          dành riêng cho bạn với đội ngũ chuyên viên giàu kinh nghiệm.
        </p>

        <Link
          to="/booking"
          className="mt-8 inline-block rounded-full bg-emerald-600 px-8 py-4 font-semibold text-white transition hover:bg-emerald-700"
        >
          ĐẶT LỊCH NGAY
        </Link>
      </div>
    </section>
  );
}

export default ServiceHero;
