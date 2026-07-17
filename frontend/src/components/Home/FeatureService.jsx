import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../../services/api";

function FeaturedServices() {
  const [featuredServices, setFeaturedServices] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setFeaturedServices(response.data.slice(0, 3));
      } catch {
        setFeaturedServices([]);
      }
    };

    loadProducts();
  }, []);

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="text-lg font-semibold uppercase tracking-widest text-emerald-600">
            Our Services
          </p>

          <h2 className="mt-2 text-5xl font-bold text-gray-800">
            Dịch vụ nổi bật
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-500">
            Khám phá những liệu trình được khách hàng yêu thích nhất tại Mộc
            Spa.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              <img
                src={service.imageUrl}
                alt={service.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-6">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  {service.category}
                </span>

                <h3 className="mt-4 text-2xl font-bold text-gray-800">
                  {service.name}
                </h3>

                <p className="mt-3 line-clamp-2 text-gray-500">
                  {service.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xl font-bold text-emerald-600">
                    {service.price.toLocaleString("vi-VN")} VNĐ
                  </span>

                  <Link
                    to={`/services/${service.slug}`}
                    className="rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;
