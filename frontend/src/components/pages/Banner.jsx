import mocImage from "./../../images/moc3.jpg";
function Banner({ subtitle, cardtext, buttonText }) {
  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="row align-items-center">
          <div className="col-md-6">
            <img
              src={mocImage}
              className="card-img-top"
              style={{
                width: "100%",
                height: "350px",
                objectFit: "cover",
              }}
            />
          </div>
          <div className="col-md-6">
            <div className="card-body ">
              <h2 className="card-title">{subtitle}</h2>
              <p className="card-text">{cardtext}</p>
              <button className="btn btn-success">{buttonText}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
