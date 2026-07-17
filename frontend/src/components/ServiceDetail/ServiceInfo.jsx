import { FaCheckCircle } from "react-icons/fa";
function ServiceInfo({ service }) {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-6 text-4xl font-bold text-gray-800">
          Về dịch vụ này
        </h1>

        <p className="text-lg leading-9 text-gray-600">{service.description}</p>
      </div>

      <div>
        <h2 className="mb-5 text-2xl font-semibold text-gray-800">Lợi ích</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {service.benefits.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4"
            >
              <FaCheckCircle className="text-xl text-emerald-600" />

              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8">
        <h2 className="mb-4 text-2xl font-semibold text-emerald-700">
          Thông tin sức khỏe
        </h2>

        <p className="leading-8 text-gray-700">{service.healthInfo}</p>
      </div>
    </div>
  );
}

export default ServiceInfo;
