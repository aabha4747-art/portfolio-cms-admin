import { useLocation } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

function ComingSoon() {
  const location = useLocation();

  const pageName =
    location.pathname
      .replace("/", "")
      .replace("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Page";

  return (
    <AdminLayout>
      <div>
        <span className="dashboard-eyebrow">PORTFOLIO CMS</span>

        <h1
          style={{
            margin: "0 0 10px",
            fontSize: "32px",
            letterSpacing: "-0.04em",
          }}
        >
          {pageName}
        </h1>

        <p style={{ color: "#7c8598", margin: 0 }}>
          This CMS section is ready for its management interface.
        </p>
      </div>
    </AdminLayout>
  );
}

export default ComingSoon;