import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { productAPI } from "../services/api";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ServiceGallery from "../components/ServiceDetail/ServiceGallery";
import PriceCard from "../components/ServiceDetail/PriceCard";
import ServiceInfo from "../components/ServiceDetail/ServiceInfo";
import TreatmentSteps from "../components/ServiceDetail/TreatmentSteps";
import RelatedServices from "../components/ServiceDetail/RelatedServices";

function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadService = async () => {
      try {
        const response = await productAPI.getBySlug(slug);
        setService(response.data);
      } catch {
        setService(null);
      } finally {
        setLoading(false);
      }
    };

    loadService();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center text-2xl">Đang tải dịch vụ...</div>
    );
  }

  if (!service) {
    return (
      <div className="py-20 text-center text-2xl">Không tìm thấy dịch vụ</div>
    );
  }

  return (
    <>
      <Header titles="The Moc Spa" />

      <main className="container mx-auto py-12">
        <section className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ServiceGallery key={service.slug} service={service} />
          </div>

          <div>
            <PriceCard service={service} />
          </div>
        </section>

        <section className="mt-16">
          <ServiceInfo service={service} />
        </section>

        <section className="mt-16">
          <TreatmentSteps service={service} />
        </section>

        <section className="mt-16">
          <RelatedServices currentSlug={service.slug} />
        </section>
      </main>

      <Footer
        studentName={[
          "Quách Tiến Tài - 2200006985",
          "Lê Thanh Trọng - 2200009170",
          "Nguyễn Mai Tú Mẫn - 2200006620",
          "Nguyễn Hoàng Pháp Bảo - 2200006550",
        ]}
        courseName="Full-Stack Web Development"
      />
    </>
  );
}

export default ServiceDetail;
