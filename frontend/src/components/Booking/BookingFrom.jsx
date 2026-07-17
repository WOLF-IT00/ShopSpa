import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { productAPI } from "../../services/api";

function BookingForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselected = location.state?.service;
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    service: preselected?.name || "",
    productId: preselected?.id || "",
    price: preselected?.price || 0,
    date: "",
    time: "",
    note: "",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setProducts(response.data);
      } catch {
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "service") {
      const selected = products.find((item) => String(item.id) === value);
      setFormData({
        ...formData,
        service: selected?.name || "",
        productId: selected?.id || "",
        price: selected?.price || 0,
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Họ tên phải có ít nhất 3 ký tự.";
    }
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập Email.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không hợp lệ.";
    }
    if (!formData.productId) {
      newErrors.service = "Vui lòng chọn dịch vụ.";
    }
    if (!formData.date) {
      newErrors.date = "Vui lòng chọn ngày.";
    }
    if (!formData.time) {
      newErrors.time = "Vui lòng chọn giờ.";
    }
    if (formData.note.length > 300) {
      newErrors.note = "Ghi chú tối đa 300 ký tự.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    navigate("/booking-summary", {
      state: formData,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl rounded-3xl bg-white p-10 shadow-xl"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">Họ và tên</label>

          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full rounded-xl border p-3 focus:outline-none ${
              errors.fullName ? "border-red-500" : "focus:border-emerald-500"
            }`}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block font-medium">Số điện thoại</label>

          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full rounded-xl border p-3 focus:outline-none ${
              errors.phone ? "border-red-500" : "focus:border-emerald-500"
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-xl border p-3 focus:outline-none ${
              errors.email ? "border-red-500" : "focus:border-emerald-500"
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block font-medium">Dịch vụ</label>

          <select
            name="service"
            value={formData.productId}
            onChange={handleChange}
            className="w-full rounded-xl border p-3 focus:border-emerald-500 focus:outline-none"
          >
            <option value="">-- Chọn dịch vụ --</option>

            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">Ngày đặt</label>

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full rounded-xl border p-3 focus:outline-none ${
              errors.date ? "border-red-500" : "focus:border-emerald-500"
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">Giờ đặt</label>

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`w-full rounded-xl border p-3 focus:outline-none ${
              errors.time ? "border-red-500" : "focus:border-emerald-500"
            }`}
          />
          {errors.time && (
            <p className="mt-1 text-sm text-red-500">{errors.time}</p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <label className="mb-2 block font-medium">Ghi chú</label>

        <textarea
          rows="5"
          name="note"
          value={formData.note}
          onChange={handleChange}
          className="w-full rounded-xl border p-3 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-8 w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700"
      >
        ĐẶT LỊCH NGAY
      </button>
    </form>
  );
}

export default BookingForm;
