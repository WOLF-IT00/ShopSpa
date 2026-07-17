import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form.email, form.password, form.full_name);
      navigate("/");
    } catch {
      setError("Không thể đăng ký. Email có thể đã tồn tại.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Đăng ký
        </h1>

        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}

        <label className="mb-2 block font-medium">Họ và tên</label>
        <input
          type="text"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="mb-4 w-full rounded-xl border p-3 focus:border-emerald-500 focus:outline-none"
          required
        />

        <label className="mb-2 block font-medium">Email</label>
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mb-4 w-full rounded-xl border p-3 focus:border-emerald-500 focus:outline-none"
          required
        />

        <label className="mb-2 block font-medium">Mật khẩu</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mb-6 w-full rounded-xl border p-3 focus:border-emerald-500 focus:outline-none"
          required
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white hover:bg-emerald-700"
        >
          Đăng ký
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link to="/login" className="font-semibold text-emerald-600">
            Đăng nhập
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
