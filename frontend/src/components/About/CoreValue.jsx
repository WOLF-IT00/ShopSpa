import { FaLeaf, FaHandsHelping, FaGem, FaStar } from "react-icons/fa";

function CoreValues() {
  const values = [
    {
      icon: <FaLeaf size={45} />,
      title: "Thiên nhiên",
      description:
        "Ưu tiên sử dụng các sản phẩm có nguồn gốc thiên nhiên, an toàn và lành tính.",
    },
    {
      icon: <FaHandsHelping size={45} />,
      title: "Tận tâm",
      description:
        "Luôn lắng nghe và chăm sóc khách hàng bằng sự chân thành trong từng liệu trình.",
    },
    {
      icon: <FaGem size={45} />,
      title: "Chất lượng",
      description:
        "Cam kết mang đến dịch vụ đạt tiêu chuẩn cao với quy trình chuyên nghiệp.",
    },
    {
      icon: <FaStar size={45} />,
      title: "Chuyên nghiệp",
      description:
        "Đội ngũ kỹ thuật viên được đào tạo bài bản và luôn cập nhật công nghệ mới.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="font-semibold uppercase tracking-[5px] text-emerald-600">
            Core Values
          </p>

          <h2 className="mt-3 text-5xl font-bold text-gray-800">
            Giá trị cốt lõi
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-gray-500">
            Những giá trị tạo nên sự khác biệt và giúp Mộc Spa luôn được khách
            hàng tin tưởng trong suốt hành trình phát triển.
          </p>
        </div>

        {/* Card */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((item, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-md transition duration-300 hover:-translate-y-3 hover:bg-emerald-600 hover:text-white hover:shadow-xl"
            >
              <div className="mb-6 flex justify-center text-emerald-600 transition group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="mb-4 text-2xl font-bold">{item.title}</h3>

              <p className="leading-7">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CoreValues;
