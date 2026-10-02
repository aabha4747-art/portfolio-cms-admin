import { useEffect, useState } from "react";
import {
  Save,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import api from "../api/api";
import "./ContentPage.css";

function About() {
  const [form, setForm] = useState({
    name: "",
    headline: "",
    short_bio: "",
    full_bio: "",
    profile_image: "",
    location: "",
    email: "",
    github_url: "",
    linkedin_url: "",
    resume_url: "",
    availability_status: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAbout = async () => {
      try {
        const response = await api.get("/about");
        const about = response.data.data;

        if (about) {
          setForm({
            name: about.name || "",
            headline: about.headline || "",
            short_bio: about.short_bio || "",
            full_bio: about.full_bio || "",
            profile_image: about.profile_image || "",
            location: about.location || "",
            email: about.email || "",
            github_url: about.github_url || "",
            linkedin_url: about.linkedin_url || "",
            resume_url: about.resume_url || "",
            availability_status: about.availability_status || "",
          });
        }
      } catch (err) {
        console.error("Load About error:", err);
        setError("Unable to load About information.");
      } finally {
        setLoading(false);
      }
    };

    loadAbout();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.put("/about", form);

      if (response.data.data) {
        const about = response.data.data;

        setForm({
          name: about.name || "",
          headline: about.headline || "",
          short_bio: about.short_bio || "",
          full_bio: about.full_bio || "",
          profile_image: about.profile_image || "",
          location: about.location || "",
          email: about.email || "",
          github_url: about.github_url || "",
          linkedin_url: about.linkedin_url || "",
          resume_url: about.resume_url || "",
          availability_status: about.availability_status || "",
        });
      }

      setMessage("About information saved successfully.");
    } catch (err) {
      console.error("Save About error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save About information."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="page-loading">
          <LoaderCircle className="page-spinner" size={24} />
          Loading About information...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="content-header">
        <div>
          <span className="dashboard-eyebrow">
            PORTFOLIO CONTENT
          </span>

          <h1>About</h1>

          <p>
            Manage the personal information displayed across your portfolio.
          </p>
        </div>
      </div>

      <form className="content-card" onSubmit={handleSubmit}>
        <div className="content-card-heading">
          <div>
            <h2>Profile information</h2>
            <p>Update your public portfolio profile.</p>
          </div>
        </div>

        {message && (
          <div className="form-message success">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="form-message error">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        <div className="content-form-grid">
          <div className="content-field">
            <label>Full name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>

          <div className="content-field">
            <label>Headline</label>

            <input
              name="headline"
              value={form.headline}
              onChange={handleChange}
              placeholder="Professional headline"
            />
          </div>

          <div className="content-field full-width">
            <label>Short bio</label>

            <textarea
              name="short_bio"
              value={form.short_bio}
              onChange={handleChange}
              rows="3"
              placeholder="A short introduction for cards and summaries..."
            />
          </div>

          <div className="content-field full-width">
            <label>Full bio</label>

            <textarea
              name="full_bio"
              value={form.full_bio}
              onChange={handleChange}
              rows="7"
              placeholder="Your complete portfolio introduction..."
            />
          </div>

          <div className="content-field">
            <label>Location</label>

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>

          <div className="content-field">
            <label>Email</label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Public contact email"
            />
          </div>

          <div className="content-field">
            <label>Availability status</label>

            <input
              name="availability_status"
              value={form.availability_status}
              onChange={handleChange}
              placeholder="e.g. Open to opportunities"
            />
          </div>

          <div className="content-field">
            <label>Profile image URL</label>

            <input
              name="profile_image"
              value={form.profile_image}
              onChange={handleChange}
              placeholder="Image URL"
            />
          </div>

          <div className="content-field">
            <label>GitHub URL</label>

            <input
              name="github_url"
              value={form.github_url}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="content-field">
            <label>LinkedIn URL</label>

            <input
              name="linkedin_url"
              value={form.linkedin_url}
              onChange={handleChange}
              placeholder="https://www.linkedin.com/in/..."
            />
          </div>

          <div className="content-field full-width">
            <label>Resume URL</label>

            <input
              name="resume_url"
              value={form.resume_url}
              onChange={handleChange}
              placeholder="Resume link"
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="primary-action"
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <LoaderCircle
                  className="page-spinner"
                  size={17}
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save changes
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default About;