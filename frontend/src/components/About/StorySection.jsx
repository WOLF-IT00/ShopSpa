import { Link } from "react-router-dom";
import { FaLeaf, FaHeart, FaSpa } from "react-icons/fa";

function StorySection() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        {/* Hình ảnh */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15"
            alt="Mộc Spa"
            className="h-[550px] w-full rounded-3xl object-cover shadow-xl"
          />
        </div>

        {/* Nội dung */}
        <div>
          <p className="font-semibold uppercase tracking-[4px] text-emerald-600">
            Our Story
          </p>

          <h2 className="mt-3 text-5xl font-bold text-gray-800">
            Hành trình của Mộc Spa
          </h2>

          <p className="mt-6 leading-8 text-gray-600">
            Mộc Spa ra đời với mong muốn mang đến cho khách hàng một không gian
            thư giãn đúng nghĩa, nơi cơ thể được chăm sóc và tâm hồn được cân
            bằng. Chúng tôi kết hợp giữa liệu pháp truyền thống, công nghệ hiện
            đại và các sản phẩm có nguồn gốc thiên nhiên để tạo nên những trải
            nghiệm chăm sóc sức khỏe toàn diện.
          </p>

          <p className="mt-5 leading-8 text-gray-600">
            Mỗi liệu trình đều được xây dựng dựa trên nhu cầu thực tế của khách
            hàng, thực hiện bởi đội ngũ chuyên viên giàu kinh nghiệm với sự tận
            tâm trong từng chi tiết.
          </p>

          {/* Điểm nổi bật */}
          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <FaLeaf className="text-2xl text-emerald-600" />
              <span>Không gian xanh, yên tĩnh và thư giãn.</span>
            </div>

            <div className="flex items-center gap-4">
              <FaHeart className="text-2xl text-emerald-600" />
              <span>Đặt sự hài lòng của khách hàng lên hàng đầu.</span>
            </div>

            <div className="flex items-center gap-4">
              <FaSpa className="text-2xl text-emerald-600" />
              <span>Liệu trình chăm sóc đạt tiêu chuẩn quốc tế.</span>
            </div>
          </div>

          <Link
            to="/booking"
            className="mt-10 inline-block rounded-xl bg-emerald-600 px-8 py-4 font-semibold text-white transition hover:bg-emerald-700"
          >
            Đặt lịch ngay
          </Link>
        </div>
      </div>
    </section>
  );
}

export default StorySection;
