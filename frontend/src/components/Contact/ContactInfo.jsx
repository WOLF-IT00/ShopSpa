import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

function ContactInfo() {
  return (
    <div className="rounded-3xl bg-emerald-700 p-10 text-white shadow-xl">
      <h2 className="mb-8 text-3xl font-bold">Thông tin liên hệ</h2>

      <div className="space-y-8">
        <div className="flex items-start gap-4">
          <FaMapMarkerAlt className="mt-1 text-2xl text-yellow-300" />

          <div>
            <h3 className="font-semibold">Địa chỉ</h3>

            <p className="text-emerald-100">123 Nguyễn Văn Linh, Đà Nẵng</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <FaPhoneAlt className="mt-1 text-2xl text-yellow-300" />

          <div>
            <h3 className="font-semibold">Hotline</h3>

            <p className="text-emerald-100">0909 999 999</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <FaEnvelope className="mt-1 text-2xl text-yellow-300" />

          <div>
            <h3 className="font-semibold">Email</h3>

            <p className="text-emerald-100">contact@themocspa.vn</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <FaClock className="mt-1 text-2xl text-yellow-300" />

          <div>
            <h3 className="font-semibold">Giờ mở cửa</h3>

            <p className="text-emerald-100">08:00 - 21:00 (Thứ 2 - Chủ nhật)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
