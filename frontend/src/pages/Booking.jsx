import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import BookingForm from "../components/Booking/BookingFrom";
function Booking() {
  return (
    <>
      <Header titles="The Mộc Spa" />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-3 text-center text-5xl font-bold text-gray-800">
          Đặt lịch
        </h1>

        <p className="mb-10 text-center text-gray-500">
          Vui lòng điền đầy đủ thông tin để đặt lịch tại Mộc Spa.
        </p>
      </main>
      <BookingForm />
      <Footer
        studentName={[
          "Quách Tiến Tài - 2200006985",
          "Lê Thanh Trọng - 2200009170",
          "Nguyễn Mai Tú Mẫn - 2200006620",
          "Nguyễn Hoàng Pháp Bảo - 2200006550",
        ]}
        courseName="Full-Stack Web Development"
      />
    </>
  );
}

export default Booking;
