import { Link } from "react-router-dom";

function AboutCTA() {
  return (
    <section className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600 py-20">
      <div className="mx-auto max-w-5xl px-6 text-center text-white">
        <h2 className="text-5xl font-bold">Hãy dành thời gian cho chính bạn</h2>

        <p className="mx-auto mt-6 max-w-3xl text-xl leading-9 text-emerald-100">
          Mộc Spa luôn sẵn sàng đồng hành cùng bạn trên hành trình chăm sóc sức
          khỏe và sắc đẹp. Đặt lịch ngay hôm nay để tận hưởng những liệu trình
          thư giãn chuyên nghiệp.
        </p>

        <Link
          to="/booking"
          className="mt-10 inline-block rounded-full bg-white px-10 py-4 text-lg font-bold text-emerald-700 shadow-lg transition duration-300 hover:scale-105 hover:bg-gray-100"
        >
          ĐẶT LỊCH NGAY
        </Link>
      </div>
    </section>
  );
}

export default AboutCTA;
