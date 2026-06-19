function FeatureSection() {
  const features = [
    {
      title: "Đội ngũ nhân viên chuyên nghiệp",
      description: "Mang đến dịch vụ massage chuyên nghiệp và thân thiện!",
      image:
        "https://khuongmai.com/wp-content/uploads/dong-phuc-nhan-vien-spa-1.jpg",
      button: "Đặt lịch",
    },
    {
      title: "Không gian sang trong và thoải mái",
      description:
        "Tạo ra môi trường thư giãn và sang trọng cho khách hàng tận hưởng trải nghiệm massage tốt nhất.",
      image:
        "https://thietkehomexinh.com/wp-content/uploads/2017/04/thiet-ke-cua-hang-spa-01.jpg",
      button: "Đặt lịch",
    },
  ];

  return (
    <section className="container my-5">
      <h2 className="text-center mb-4">Our Services</h2>
      {/* bao gồm 1 hàng và 2 cột mỗi cột chím 6 ô */}
      <div className="row">
        {features.map((feature) => (
          <div className="col-md-6 mb-6" key={feature.title}>
            <div className="card h-100 shadow-sm">
              <img
                src={feature.image}
                alt={feature.title}
                className="card-img-top"
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
              />

              <div className="card-body">
                <h5 className="card-title">{feature.title}</h5>
                <p className="card-text">{feature.description}</p>
                <button className="btn btn-success">{feature.button}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeatureSection;
