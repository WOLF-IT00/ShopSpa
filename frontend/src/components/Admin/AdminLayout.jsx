import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiHome,
  FiLogOut,
  FiMenu,
  FiMoon,
  FiPackage,
  FiShoppingBag,
  FiSun,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: FiBarChart2 },
  { id: "services", label: "Dịch vụ", icon: FiPackage },
  { id: "orders", label: "Đơn hàng", icon: FiShoppingBag },
];

export default function AdminLayout({ activeTab, onTabChange, children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("admin-dark-mode") === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("admin-dark-mode", String(darkMode));
  }, [darkMode]);

  const sidebarContent = (
    <>
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
          S
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">ShopHub Spa</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Admin Panel</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              onTabChange(id);
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
              activeTab === id
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            }`}
          >
            <Icon className="text-lg" />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-gray-200 pt-4 dark:border-gray-700">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FiHome />
          Về trang chủ
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <FiLogOut />
          Đăng xuất
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white p-5 transition-transform dark:border-gray-800 dark:bg-gray-900 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-500 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <FiX size={20} />
        </button>
        {sidebarContent}
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/90 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {NAV_ITEMS.find((item) => item.id === activeTab)?.label ?? "Admin"}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Xin chào, {user?.full_name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode((prev) => !prev)}
            className="rounded-xl border border-gray-200 p-2.5 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
