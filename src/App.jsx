import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ComingSoon from "./pages/ComingSoon";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("portfolio_admin_token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedPage({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        {[
          "/about",
          "/skills",
          "/projects",
          "/experience",
          "/blogs",
          "/testimonials",
          "/services",
          "/media",
          "/github",
        ].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedPage>
                <ComingSoon />
              </ProtectedPage>
            }
          />
        ))}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;