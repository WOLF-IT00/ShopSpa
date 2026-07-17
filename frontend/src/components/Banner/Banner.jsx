import mocImage from "../../assets/images/moc3.jpg";
function Banner({ subtitle, cardtext, buttonText }) {
  return (
    <div className="max-w-7xl mx-auto px-4 my-12">
      <div
        className="	
bg-white rounded-lg shadow-md overflow-hidden"
      >
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2">
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
          <div className="w-full md:w-1/2">
            <div className="p-6 ">
              <h2 className="text-2xl font-semibold mb-2">{subtitle}</h2>
              <p className="text-gray-600 mb-4">{cardtext}</p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
