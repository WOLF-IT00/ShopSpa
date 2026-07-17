function AboutBanner() {
  return (
    <section
      className="relative flex h-[400px] items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="relative z-10 px-6 text-center text-white">
        <h1 className="mb-6 text-5xl font-bold md:text-6xl">Về Mộc Spa</h1>

        <p className="mx-auto max-w-3xl text-xl leading-8">
          Hành trình chăm sóc sức khỏe và vẻ đẹp tự nhiên với sự tận tâm, chuyên
          nghiệp và những liệu trình chuẩn quốc tế.
        </p>
      </div>
    </section>
  );
}

export default AboutBanner;
