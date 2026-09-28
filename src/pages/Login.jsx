import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

import api from "../api/api";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error("Authentication token was not returned");
      }

      localStorage.setItem("portfolio_admin_token", token);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      localStorage.removeItem("portfolio_admin_token");

      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-brand">
          <div className="brand-mark">A</div>

          <div>
            <h1>Portfolio CMS</h1>
            <p>Admin Workspace</p>
          </div>
        </div>

        <div className="login-heading">
          <span className="login-label">ADMIN ACCESS</span>

          <h2>Welcome back</h2>

          <p>
            Sign in to manage your projects, skills, experience and portfolio
            content.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email address</label>

            <div className="input-wrapper">
              <Mail size={19} />

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="input-wrapper">
              <Lock size={19} />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle className="login-spinner" size={18} />
                Signing in...
              </>
            ) : (
              "Sign in to CMS"
            )}
          </button>
        </form>

        <p className="login-footer">
          Portfolio administration • Authorized access only
        </p>
      </div>

      <div className="login-showcase">
        <div className="showcase-content">
          <span className="showcase-tag">CUSTOM BUILT CMS</span>

          <h2>
            Build.
            <br />
            Publish.
            <br />
            Showcase.
          </h2>

          <p>
            One workspace to manage the content recruiters see across your
            portfolio.
          </p>

          <div className="showcase-stats">
            <div>
              <strong>Projects</strong>
              <span>Case studies & proof of work</span>
            </div>

            <div>
              <strong>Content</strong>
              <span>Skills, blogs & experience</span>
            </div>

            <div>
              <strong>GitHub</strong>
              <span>Repository integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;