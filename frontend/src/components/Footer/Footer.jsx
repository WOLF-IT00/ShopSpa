function Footer({ studentName, courseName }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-900 text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Logo */}
          <div>
            <h2 className="mb-3 text-3xl font-bold tracking-wide">
              🌿 Mộc Spa
            </h2>
            <p className="text-emerald-100 leading-7">
              Mang đến những phút giây thư giãn và chăm sóc sức khỏe với đội ngũ
              chuyên nghiệp cùng không gian sang trọng.
            </p>
          </div>

          {/* Student */}
          <div>
            <div>
              <h3 className="mb-3 text-xl font-semibold border-b border-emerald-400 pb-2">
                Members
              </h3>

              {studentName.map((student, index) => (
                <p key={index} className="text-emerald-100">
                  {student}
                </p>
              ))}
            </div>
          </div>

          {/* Course */}
          <div>
            <h3 className="mb-3 text-xl font-semibold border-b border-emerald-400 pb-2">
              Course
            </h3>

            <p className="text-emerald-100">{courseName}</p>
          </div>
        </div>

        <div className="mt-8 border-t border-emerald-600 pt-5 text-center text-sm text-emerald-200">
          © {year} <span className="font-semibold">The Mộc Spa</span>. All
          Rights Reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
