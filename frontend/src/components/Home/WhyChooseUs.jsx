import { FaLeaf, FaSpa, FaAward, FaUsers } from "react-icons/fa";

function WhyChooseUs() {
  const features = [
    {
      icon: <FaLeaf size={45} />,
      title: "Không gian thư giãn",
      description: "Thiết kế xanh, yên tĩnh và gần gũi với thiên nhiên.",
    },
    {
      icon: <FaSpa size={45} />,
      title: "Chuyên viên chuyên nghiệp",
      description: "Đội ngũ nhiều năm kinh nghiệm trong lĩnh vực Spa.",
    },
    {
      icon: <FaAward size={45} />,
      title: "Liệu trình chuẩn",
      description: "Sử dụng công nghệ hiện đại cùng sản phẩm cao cấp.",
    },
    {
      icon: <FaUsers size={45} />,
      title: "10.000+ khách hàng",
      description: "Được hàng nghìn khách hàng tin tưởng và lựa chọn.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <p className="font-semibold uppercase tracking-[5px] text-emerald-600">
            Why Choose Us
          </p>

          <h2 className="mt-4 text-5xl font-bold text-gray-800">
            Tại sao chọn Mộc Spa?
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg text-gray-500">
            Chúng tôi luôn đặt chất lượng dịch vụ và trải nghiệm khách hàng lên
            hàng đầu.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="group rounded-3xl bg-gray-50 p-8 text-center shadow-md transition duration-300 hover:-translate-y-3 hover:bg-emerald-600 hover:text-white hover:shadow-2xl"
            >
              <div className="mb-6 flex justify-center text-emerald-600 transition group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="mb-4 text-xl font-bold">{item.title}</h3>

              <p className="leading-7">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
