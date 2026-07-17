import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="flex flex-1 flex-col p-4">
        <h5 className="mb-2 text-xl font-semibold text-gray-800">
          {product.name}
        </h5>

        <span className="mb-3 inline-block w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
          {product.category}
        </span>

        <h6 className="mb-4 text-lg font-bold text-emerald-600">
          {new Intl.NumberFormat("vi-VN").format(product.price)} VNĐ
        </h6>

        <div className="mt-auto flex gap-2">
          <Link
            to={`/services/${product.slug}`}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-center font-medium text-white transition duration-300 hover:bg-emerald-700"
          >
            Xem chi tiết
          </Link>
          <button
            onClick={() => addToCart(product)}
            className="rounded-lg border border-emerald-600 px-4 py-2 font-medium text-emerald-600 hover:bg-emerald-50"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
