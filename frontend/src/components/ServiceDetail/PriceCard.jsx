import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function PriceCard({ service }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  return (
    <div className="sticky top-24 rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-3xl font-bold text-gray-800">
        Chi tiết dịch vụ
      </h2>

      <div className="space-y-5">
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <span className="font-medium text-gray-600">Thời gian</span>

          <span className="font-semibold text-emerald-600">
            {service.duration}
          </span>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <span className="font-medium text-gray-600">Giá</span>

          <span className="text-xl font-bold text-emerald-600">
            {Number(service.price).toLocaleString("vi-VN")} VNĐ
          </span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
          <span className="font-medium text-gray-600">Danh mục</span>

          <span className="font-semibold">{service.category}</span>
        </div>
      </div>

      <button
        onClick={() => addToCart(service)}
        className="mt-4 w-full rounded-xl border border-emerald-600 py-4 text-lg font-semibold text-emerald-600 transition hover:bg-emerald-50"
      >
        THÊM VÀO GIỎ
      </button>

      <button
        onClick={() => navigate("/booking", { state: { service } })}
        className="mt-3 w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700"
      >
        ĐẶT LỊCH NGAY
      </button>
    </div>
  );
}

export default PriceCard;
