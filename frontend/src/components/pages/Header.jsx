import { useState } from "react";
function Header({ titles }) {
  const navbar = ["Home", "Products", "Cart", "Login"];
  const [active, setActive] = useState("Home");
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          {titles}
        </a>
        <div className="navbar-nav ms-auto">
          {/* Phần tử nav sẽ duyệt qua từng phần tử như là home product cart và login và chuyền vào các tham số item */}
          {navbar.map((item) => (
            <a
              key={item}
              href="#"
              className={`nav-link ${
                active === item
                  ? "text-success fw-bold border-bottom border-3 border-success"
                  : ""
              }`}
              onClick={() => setActive(item)}
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Header;
