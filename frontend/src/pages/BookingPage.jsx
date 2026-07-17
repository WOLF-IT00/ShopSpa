import BookingSummary from "../components/Payment/BookingSumary";

function BookingPage() {
  const booking = {
    fullName: "Quách Tiến Tài",
    phone: "0905123456",
    email: "tai@gmail.com",
    service: "Massage Body",
    date: "20/07/2026",
    time: "18:30",
    price: "600.000 VNĐ",
  };

  return (
    <div className="min-h-screen bg-gray-100 py-20">
      <BookingSummary booking={booking} />
    </div>
  );
}

export default BookingPage;
