import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productAPI } from "../../services/api";

function RelatedServices({ currentSlug }) {
  const [relatedServices, setRelatedServices] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productAPI.getAll();
        const related = response.data
          .filter((item) => item.slug !== currentSlug)
          .slice(0, 3);
        setRelatedServices(related);
      } catch {
        setRelatedServices([]);
      }
    };

    loadProducts();
  }, [currentSlug]);

  return (
    <section className="mt-20">
      <h2 className="mb-8 text-center text-4xl font-bold text-gray-800">
        Dịch vụ liên quan
      </h2>

      <div className="grid gap-8 md:grid-cols-3">
        {relatedServices.map((service) => (
          <div
            key={service.id}
            className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <img
              src={service.imageUrl}
              alt={service.name}
              className="h-60 w-full object-cover"
            />

            <div className="space-y-4 p-6">
              <h3 className="text-2xl font-semibold text-gray-800">
                {service.name}
              </h3>

              <p className="font-bold text-emerald-600">
                {service.price.toLocaleString("vi-VN")} VNĐ
              </p>

              <Link
                to={`/services/${service.slug}`}
                className="inline-block rounded-xl bg-emerald-600 px-5 py-2 font-semibold text-white transition hover:bg-emerald-700"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RelatedServices;
