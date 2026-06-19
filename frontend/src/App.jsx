import Banner from "./components/pages/Banner";
import FeatureSection from "./components/pages/FeatureSection";
import Header from "./components/pages/Header";
import Footer from "./components/pages/Footer";
import ProductList from "./components/pages/ProductList";

function App() {
  return (
    <div>
      <Header titles="The Moc Spa" />
      <Banner
        subtitle="The Moc Spa"
        cardtext=" Cải thiện sức khỏe của mọi người!"
        buttonText="Đặt lịch"
      />
      <FeatureSection />
      <ProductList />

      <Footer studentName="Mandu" courseName="Full‑Stack Web Development" />
    </div>
  );
}

export default App;
