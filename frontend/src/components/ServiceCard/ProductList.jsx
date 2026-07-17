import defaultProducts from "../../data/products.json";
import ProductCard from "./ProductCard";

const ProductList = ({ products = defaultProducts }) => {
  return (
    <section className="container mx-auto py-5 px-4">
      <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard key={product.id} product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
