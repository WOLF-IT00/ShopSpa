import { useMemo, useState } from "react";

function ServiceGallery({ service }) {
  const images = useMemo(() => {
    return service.gallery?.length ? service.gallery : [service.imageUrl];
  }, [service]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div>
      {/* Ảnh lớn */}
      <div className="relative overflow-hidden rounded-3xl shadow-lg">
        <img
          src={images[currentIndex]}
          alt={service.name}
          className="h-[500px] w-full object-cover"
        />

        {/* Previous */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 shadow hover:bg-white"
        >
          ❮
        </button>

        {/* Next */}
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 shadow hover:bg-white"
        >
          ❯
        </button>
      </div>

      {/* Thumbnail */}
      <div className="mt-5 grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`overflow-hidden rounded-xl border-4 transition ${
              currentIndex === index
                ? "border-emerald-600"
                : "border-transparent"
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="h-24 w-full object-cover hover:opacity-80"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ServiceGallery;
