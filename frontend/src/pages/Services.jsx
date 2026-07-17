import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
// import Banner from "../components/Banner/Banner.jsx";
import ProductPage from "../components/ServiceCard/ProductPage.jsx";
// import HeroSection from "../components/Home/HeroSection.jsx";
import ServiceHero from "../components/Service/ServiceHero.jsx";
function Service() {
  return (
    <div>
      <Header titles="The Moc Spa" />
      {/* <HeroSection /> */}
      <ServiceHero />
      {/* <Banner
        subtitle="The Moc Spa"
        cardtext=" Cải thiện sức khỏe của mọi người!"
        buttonText="Đặt lịch"
      /> */}
      <ProductPage />
      <Footer
        studentName={[
          "Quách Tiến Tài - 2200006985",
          "Lê Thanh Trọng - 2200009170",
          "Nguyễn Mai Tú Mẫn - 2200006620",
          "Nguyễn Hoàng Pháp Bảo - 2200006550",
        ]}
        courseName="Full-Stack Web Development"
      />
    </div>
  );
}

export default Service;
