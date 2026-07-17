import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Contact", path: "/contact" },
];

function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();

  return (
    <nav className="ml-auto flex items-center gap-6">
      {navItems.map(({ label, path }) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) =>
            `pb-1 transition-all duration-200 ${
              isActive
                ? "border-b-4 border-emerald-600 font-bold text-emerald-600"
                : "text-gray-700 hover:text-emerald-600"
            }`
          }
        >
          {label}
        </NavLink>
      ))}

      <Link to="/cart" className="relative text-gray-700 hover:text-emerald-600">
        Giỏ ({count})
      </Link>

      {isAdmin && (
        <Link to="/admin" className="text-gray-700 hover:text-emerald-600">
          Admin
        </Link>
      )}

      {user ? (
        <button
          onClick={logout}
          className="text-gray-700 hover:text-emerald-600"
        >
          Đăng xuất
        </button>
      ) : (
        <Link to="/login" className="text-gray-700 hover:text-emerald-600">
          Đăng nhập
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
