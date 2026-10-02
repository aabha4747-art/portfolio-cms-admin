import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import ProjectEditor from "./pages/ProjectEditor";

import Experience from "./pages/Experience";
import Blogs from "./pages/Blogs";
import Testimonials from "./pages/Testimonials";
import Services from "./pages/Services";

import ComingSoon from "./pages/ComingSoon";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem(
    "portfolio_admin_token"
  );

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedPage>
              <Dashboard />
            </ProtectedPage>
          }
        />

        {/* ABOUT */}

        <Route
          path="/about"
          element={
            <ProtectedPage>
              <About />
            </ProtectedPage>
          }
        />

        {/* SKILLS */}

        <Route
          path="/skills"
          element={
            <ProtectedPage>
              <Skills />
            </ProtectedPage>
          }
        />

        {/* PROJECTS */}

        <Route
          path="/projects"
          element={
            <ProtectedPage>
              <Projects />
            </ProtectedPage>
          }
        />

        <Route
          path="/projects/new"
          element={
            <ProtectedPage>
              <ProjectEditor />
            </ProtectedPage>
          }
        />

        <Route
          path="/projects/edit/:id"
          element={
            <ProtectedPage>
              <ProjectEditor />
            </ProtectedPage>
          }
        />

        {/* EXPERIENCE */}

        <Route
          path="/experience"
          element={
            <ProtectedPage>
              <Experience />
            </ProtectedPage>
          }
        />

        {/* BLOGS */}

        <Route
          path="/blogs"
          element={
            <ProtectedPage>
              <Blogs />
            </ProtectedPage>
          }
        />

        {/* TESTIMONIALS */}

        <Route
          path="/testimonials"
          element={
            <ProtectedPage>
              <Testimonials />
            </ProtectedPage>
          }
        />

        {/* SERVICES */}

        <Route
          path="/services"
          element={
            <ProtectedPage>
              <Services />
            </ProtectedPage>
          }
        />

        {/* PENDING CMS PAGES */}

        {["/media", "/github"].map((path) => (
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

        {/* DEFAULT ROUTES */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;