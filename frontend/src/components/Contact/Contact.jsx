function ContactForm() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h2 className="mb-2 text-center text-4xl font-bold text-emerald-700">
            Đặt Lịch Hẹn
          </h2>
          <p className="mb-10 text-center text-gray-500">
            Điền đầy đủ thông tin để Mộc Spa liên hệ xác nhận lịch hẹn của bạn.
          </p>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Dịch vụ
                </label>

                <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none">
                  <option>Chọn dịch vụ</option>
                  <option>Massage Body</option>
                  <option>Chăm sóc da</option>
                  <option>Massage Foot</option>
                  <option>Xông hơi</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Ngày đặt lịch
                </label>

                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-gray-700">
                  Giờ đặt lịch
                </label>

                <input
                  type="time"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Ghi chú
              </label>

              <textarea
                rows="5"
                placeholder="Nhập yêu cầu của bạn..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="rounded-full bg-emerald-600 px-10 py-3 text-lg font-semibold text-white transition hover:bg-emerald-700"
              >
                Đặt lịch
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
