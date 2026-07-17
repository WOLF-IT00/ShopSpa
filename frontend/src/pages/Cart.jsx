import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useCart } from "../context/CartContext";
import { orderAPI } from "../services/api";

function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    booking_date: "",
    booking_time: "",
    note: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const response = await orderAPI.create({
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        ...form,
      });

      clearCart();
      navigate("/payment", { state: { order: response.data } });
    } catch {
      setError("Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header titles="The Moc Spa" />

      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">Giỏ dịch vụ</h1>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="text-lg text-gray-600">Giỏ hàng trống.</p>
            <button
              onClick={() => navigate("/services")}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Xem dịch vụ
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-2xl bg-white p-4 shadow-md"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-emerald-600">
                      {product.price.toLocaleString("vi-VN")} VNĐ
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="rounded bg-gray-200 px-3 py-1"
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="rounded bg-gray-200 px-3 py-1"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(product.id)}
                        className="ml-auto text-sm text-red-500"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleCheckout}
              className="rounded-3xl bg-white p-8 shadow-xl"
            >
              <h2 className="mb-6 text-2xl font-bold">Thông tin đặt lịch</h2>

              {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

              {[
                ["full_name", "Họ và tên", "text"],
                ["phone", "Số điện thoại", "text"],
                ["email", "Email", "email"],
                ["booking_date", "Ngày đặt", "date"],
                ["booking_time", "Giờ đặt", "time"],
              ].map(([name, label, type]) => (
                <div key={name} className="mb-4">
                  <label className="mb-1 block font-medium">{label}</label>
                  <input
                    type={type}
                    value={form[name]}
                    onChange={(e) =>
                      setForm({ ...form, [name]: e.target.value })
                    }
                    className="w-full rounded-xl border p-3 focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              ))}

              <div className="mb-6">
                <label className="mb-1 block font-medium">Ghi chú</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  className="w-full rounded-xl border p-3 focus:border-emerald-500 focus:outline-none"
                  rows={3}
                />
              </div>

              <div className="mb-6 flex justify-between text-xl font-bold">
                <span>Tổng cộng</span>
                <span className="text-emerald-600">
                  {total.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 py-4 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {loading ? "Đang xử lý..." : "Thanh toán"}
              </button>
            </form>
          </div>
        )}
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

export default Cart;
