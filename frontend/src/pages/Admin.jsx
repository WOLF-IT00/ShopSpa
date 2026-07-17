import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../context/AuthContext";
import { adminAPI, orderAPI, productAPI } from "../services/api";

function Admin() {
  const { user, loading, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadData = async () => {
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        adminAPI.getStats(),
        productAPI.getAll(),
        orderAPI.getAll(),
      ]);
      setStats(statsRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    };

    loadData();
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    await productAPI.delete(id);
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading) {
    return <div className="py-20 text-center">Đang tải...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header titles="Admin Dashboard" />

      <main className="container mx-auto px-4 py-12">
        <h1 className="mb-8 text-4xl font-bold text-gray-800">Admin Dashboard</h1>

        {stats && (
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            <StatCard label="Sản phẩm" value={stats.total_products} />
            <StatCard label="Đơn hàng" value={stats.total_orders} />
            <StatCard
              label="Doanh thu"
              value={`${stats.total_revenue.toLocaleString("vi-VN")} VNĐ`}
            />
          </div>
        )}

        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold">Quản lý sản phẩm</h2>
          <div className="overflow-x-auto rounded-2xl bg-white shadow-md">
            <table className="w-full text-left">
              <thead className="bg-emerald-50">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Tên</th>
                  <th className="p-4">Giá</th>
                  <th className="p-4">Danh mục</th>
                  <th className="p-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t">
                    <td className="p-4">{product.id}</td>
                    <td className="p-4">{product.name}</td>
                    <td className="p-4">
                      {product.price.toLocaleString("vi-VN")} VNĐ
                    </td>
                    <td className="p-4">{product.category}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:underline"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold">Đơn hàng</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-white p-6 shadow-md">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold">Đơn #{order.id}</p>
                  <p>{order.full_name}</p>
                  <p>{order.total.toLocaleString("vi-VN")} VNĐ</p>
                  <p className="text-emerald-600">{order.payment_status}</p>
                </div>
              </div>
            ))}
          </div>
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

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <p className="text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-emerald-600">{value}</p>
    </div>
  );
}

export default Admin;
