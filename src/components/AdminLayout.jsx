import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  Code2,
  FolderKanban,
  BriefcaseBusiness,
  FileText,
  MessageSquareQuote,
  PanelsTopLeft,
  Image,
  GitBranch,
  LogOut,
} from "lucide-react";

import "./AdminLayout.css";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "About", path: "/about", icon: UserRound },
  { name: "Skills", path: "/skills", icon: Code2 },
  { name: "Projects", path: "/projects", icon: FolderKanban },
  { name: "Experience", path: "/experience", icon: BriefcaseBusiness },
  { name: "Blogs", path: "/blogs", icon: FileText },
  { name: "Testimonials", path: "/testimonials", icon: MessageSquareQuote },
  { name: "Services", path: "/services", icon: PanelsTopLeft },
  { name: "Media", path: "/media", icon: Image },
  { name: "GitHub Import", path: "/github", icon: GitBranch },
];

function AdminLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("portfolio_admin_token");
    navigate("/login");
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">A</div>

          <div>
            <h1>Portfolio CMS</h1>
            <p>Admin Workspace</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">WORKSPACE</span>

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? "active" : ""}`
                }
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}

export default AdminLayout;