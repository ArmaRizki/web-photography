
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Image,
  FolderOpen,
  Package,
  CalendarCheck,
  CalendarDays,
  Info,
  Phone,
  Share2,
  FileText,
  LogOut,
  Menu,
  X,
  Mail,
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/photos", label: "Photos", icon: Image },
  { to: "/admin/categories", label: "Categories", icon: FolderOpen },
  { to: "/admin/packages", label: "Packages", icon: Package },
  { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/admin/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/admin/about", label: "About Page", icon: Info },
  { to: "/admin/contact", label: "Contact Info", icon: Phone },
  { to: "/admin/social-links", label: "Social Links", icon: Share2 },
  { to: "/admin/terms", label: "Terms & Conditions", icon: FileText },
  { to: "/admin/smtp", label: "SMTP Settings", icon: Mail },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } shrink-0 overflow-hidden border-r border-gray-200 transition-all duration-300`}
      >
        <div className="w-64 h-screen px-4 py-6 flex flex-col">
          <p className="font-display text-lg text-gray-900 px-2 mb-6">
            ELVOVE
          </p>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                    isActive
                      ? "bg-white text-[#E11D48]"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-gray-200 pt-4 mt-4 px-2">
            <p className="text-xs text-gray-700 mb-3">
              {admin?.username}
            </p>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">

        {/* Topbar */}
        <header className="h-14 border-b border-gray-200 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded text-gray-700 hover:bg-gray-100 transition-colors"
            title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
            aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        {/* Page Content */}
        <main className="p-8 overflow-x-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
