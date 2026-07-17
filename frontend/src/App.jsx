import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import PaymentPage from "./pages/PaymentPay";
import PaymentSuccess from "./pages/PaymentSuccess";
import BankPayment from "./pages/BankPayment";
import MomoPayment from "./pages/MomoPayment";
import BookingSummary from "./components/Payment/BookingSumary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import PayPalSuccess from "./pages/PayPalSuccess";
import PayPalCancel from "./pages/PayPalCancel";
import OrderPayment from "./pages/OrderPayment";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment/success" element={<PaymentSuccess />} />
      <Route path="/payment/bank" element={<BankPayment />} />
      <Route path="/payment/momo" element={<MomoPayment />} />
      <Route path="/payment/paypal/success" element={<PayPalSuccess />} />
      <Route path="/payment/paypal/cancel" element={<PayPalCancel />} />
      <Route path="/orders/:id/payment" element={<OrderPayment />} />
      <Route path="/booking-summary" element={<BookingSummary />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}
export default App;
