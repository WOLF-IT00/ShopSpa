const ProductCard = ({ name, price, category, imageUrl, description }) => {
  const handleViewDetails = () => {
    alert(description);
  };

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={imageUrl}
        alt={name}
        className="card-img-top"
        style={{
          height: "220px",
          objectFit: "cover",
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <p className="text-muted mb-2">{category}</p>
        <h6 className="text-success">{price} VNĐ</h6>
        <button onClick={handleViewDetails} className="btn btn-success mt-auto">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
