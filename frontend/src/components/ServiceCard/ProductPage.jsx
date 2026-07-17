import { useEffect, useState } from "react";
import ProductList from "./ProductList";
import { productAPI } from "../../services/api";
import CategoryTabs from "../Service/CategoryTabs";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (products.length === 0) return;

    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) => product.category === selectedCategory,
      );
    }

    setFilteredProducts(result);
  }, [products, selectedCategory]);

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-lg font-medium">
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600 font-semibold">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800">Khám phá dịch vụ</h1>

        <p className="mt-4 text-lg text-gray-500">
          Lựa chọn liệu trình phù hợp nhất dành cho bạn.
        </p>
      </div>

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <ProductList products={filteredProducts} />
    </div>
  );
};

export default ProductPage;
