import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "ADMIN" ? "/admin" : "/");
    } catch {
      setError("Email hoặc mật khẩu không đúng");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl"
      >
        <h1 className="mb-6 text-center text-3xl font-bold text-emerald-700">
          Đăng nhập
        </h1>

        {error && (
          <p className="mb-4 text-center text-sm text-red-500">{error}</p>
        )}

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
          Đăng nhập
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="font-semibold text-emerald-600">
            Đăng ký
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
