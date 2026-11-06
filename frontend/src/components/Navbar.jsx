import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/portfolio", label: "Portfolio" },
  { to: "/packages", label: "Packages" },
  { to: "/contact", label: "Contact" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-md border-b border-gray-200" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-wide text-black">
        <img
          src="/logo.png"
          alt="ELVOVE Logo"
          className="w-7 h-7 object-contain"
        />
        
        <span className="text-[#E11D48]">ELVOVE</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors ${
                  isActive ? "text-[#E11D48]" : "text-black hover:text-black"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/booking"
          className="hidden lg:inline-block border border-[#E11D48] text-[#E11D48] px-5 py-2 text-sm tracking-wide hover:bg-[#E11D48] hover:text-ink transition-colors"
        >
          Book Now
        </Link>

        <button className="lg:hidden text-black" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "text-[#E11D48]" : "text-black")}
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/booking"
            onClick={() => setOpen(false)}
            className="border border-[#E11D48] text-[#E11D48] px-5 py-2 text-sm text-center"
          >
            Book Now
          </Link>
        </nav>
      )}
    </header>
  );
}
