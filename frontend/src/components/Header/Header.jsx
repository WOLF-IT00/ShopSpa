import Navbar from "../Navbar/Navbar.jsx";

function Header({ titles }) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <a
          href="#"
          className="text-3xl font-bold text-emerald-700 transition hover:text-emerald-800"
        >
          {titles}
        </a>

        <Navbar />
      </div>
    </header>
  );
}

export default Header;
