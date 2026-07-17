function AboutHero() {
  return (
    <section
      className="relative flex h-[420px] items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519823551278-64ac92734fb1')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-center text-white">
        <p className="mb-3 uppercase tracking-[6px] text-emerald-300">
          The Mộc Spa
        </p>

        <h1 className="text-5xl font-bold">Về Chúng Tôi</h1>

        <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-200">
          Nơi vẻ đẹp, sức khỏe và sự thư giãn được chăm sóc bằng tất cả sự tận
          tâm.
        </p>
      </div>
    </section>
  );
}

export default AboutHero;
