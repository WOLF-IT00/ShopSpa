function GallerySection() {
  const images = [
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1",
    "https://images.unsplash.com/photo-1507652313519-d4e9174996dd",
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2",
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
  ];

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-[5px] text-emerald-600">
            Gallery
          </p>

          <h2 className="mt-3 text-5xl font-bold text-gray-800">
            Không gian Mộc Spa
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-gray-500">
            Khám phá không gian thư giãn, hiện đại và gần gũi với thiên nhiên,
            nơi mang đến cho bạn những phút giây chăm sóc sức khỏe trọn vẹn.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
          {images.map((image, index) => (
            <div key={index} className="overflow-hidden rounded-3xl shadow-lg">
              <img
                src={image}
                alt={`Spa ${index + 1}`}
                className="h-72 w-full object-cover transition duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default GallerySection;
