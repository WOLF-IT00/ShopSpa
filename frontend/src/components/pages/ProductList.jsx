import products from "./../../data/products.json";
import ProductCard from "./ProductCard";
const ProductList = () => {
  return (
    <section className="container py-5">
      <h2 className="mb-3">Our Services</h2>
      <div className="row g-4 mt-2">
        {products.map((product) => (
          <div key={product.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
            <ProductCard
              name={product.name}
              price={product.price}
              category={product.category}
              imageUrl={product.imageUrl}
              description={product.description}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;
