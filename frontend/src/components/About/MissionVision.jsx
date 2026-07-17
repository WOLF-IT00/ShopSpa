import { FaBullseye, FaEye } from "react-icons/fa";

function MissionVision() {
  const data = [
    {
      icon: <FaBullseye size={45} />,
      title: "Sứ mệnh",
      content:
        "Mang đến những liệu trình chăm sóc sức khỏe và sắc đẹp chất lượng cao, giúp khách hàng thư giãn, phục hồi năng lượng và nâng cao chất lượng cuộc sống thông qua sự tận tâm và chuyên nghiệp.",
    },
    {
      icon: <FaEye size={45} />,
      title: "Tầm nhìn",
      content:
        "Trở thành thương hiệu Spa được khách hàng tin tưởng hàng đầu tại Việt Nam, tiên phong trong việc kết hợp liệu pháp thiên nhiên với công nghệ chăm sóc hiện đại.",
    },
  ];

  return (
    <section className="bg-emerald-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Heading */}
        <div className="mb-14 text-center">
          <p className="font-semibold uppercase tracking-[5px] text-emerald-600">
            Mission & Vision
          </p>

          <h2 className="mt-3 text-5xl font-bold text-gray-800">
            Sứ mệnh & Tầm nhìn
          </h2>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          {data.map((item, index) => (
            <div
              key={index}
              className="group rounded-3xl bg-white p-10 shadow-lg transition duration-300 hover:-translate-y-2 hover:bg-emerald-600 hover:text-white"
            >
              <div className="mb-6 text-emerald-600 transition group-hover:text-white">
                {item.icon}
              </div>

              <h3 className="mb-5 text-3xl font-bold">{item.title}</h3>

              <p className="leading-8">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MissionVision;
