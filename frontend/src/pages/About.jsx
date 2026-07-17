import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import AboutBanner from "../components/About/AboutBanner";
import StorySection from "../components/About/StorySection.jsx";
import MissionVision from "../components/About/MissionVision.jsx";
import CoreValues from "../components/About/CoreValue.jsx";
import GallerySection from "../components/About/GallerySection.jsx";

function About() {
  return (
    <div>
      <Header titles="The Moc Spa" />
      <AboutBanner />
      <StorySection />
      <MissionVision />
      <CoreValues />
      <GallerySection />

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

export default About;
