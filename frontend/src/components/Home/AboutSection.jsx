import { Link } from "react-router-dom";

function AboutSection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        {/* Hình ảnh */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1"
            alt="Mộc Spa"
            className="h-[550px] w-full rounded-3xl object-cover shadow-xl"
          />
        </div>

        {/* Nội dung */}
        <div>
          <p className="mb-2 text-lg font-semibold uppercase tracking-widest text-emerald-600">
            About Us
          </p>

          <h2 className="mb-6 text-5xl font-bold text-gray-800">
            Chăm sóc sức khỏe
            <br />
            từ thiên nhiên
          </h2>

          <p className="mb-8 leading-8 text-gray-600">
            Mộc Spa mang đến không gian thư giãn yên bình, kết hợp các liệu pháp
            massage truyền thống và công nghệ chăm sóc hiện đại nhằm giúp khách
            hàng phục hồi năng lượng, giảm căng thẳng và nâng cao chất lượng
            cuộc sống.
          </p>

          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-xl bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-700">
                🌿 Không gian thư giãn
              </h3>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-700">
                💆 Chuyên viên nhiều kinh nghiệm
              </h3>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-700">
                ⭐ Liệu trình chuẩn quốc tế
              </h3>
            </div>

            <div className="rounded-xl bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-700">
                ❤️ Hơn 10.000 khách hàng
              </h3>
            </div>
          </div>

          <Link
            to="/about"
            className="mt-10 inline-block rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white transition hover:bg-emerald-700"
          >
            Khám phá thêm
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
