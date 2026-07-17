function ContactHero() {
  return (
    <section
      className="relative flex h-[380px] items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1600')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55"></div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl px-6 text-center text-white">
        <p className="mb-3 text-lg tracking-[4px] uppercase text-emerald-300">
          The Moc Spa
        </p>

        <h1 className="mb-6 text-5xl font-bold md:text-6xl">
          Liên hệ với chúng tôi
        </h1>

        <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-200">
          Chúng tôi luôn sẵn sàng lắng nghe và đồng hành cùng bạn trên hành
          trình chăm sóc sức khỏe và sắc đẹp. Hãy để The Moc Spa mang đến cho
          bạn những phút giây thư giãn tuyệt vời.
        </p>
      </div>
    </section>
  );
}

export default ContactHero;
