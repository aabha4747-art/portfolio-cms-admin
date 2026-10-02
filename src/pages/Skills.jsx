import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  LoaderCircle,
  Star,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import api from "../api/api";
import "./ContentPage.css";
import "./Skills.css";

const emptyForm = {
  name: "",
  category: "",
  icon: "",
  proficiency: 50,
  display_order: 1,
  featured: false,
};

function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadSkills = async () => {
    try {
      setError("");

      const response = await api.get("/skills");

      setSkills(response.data.data || []);
    } catch (err) {
      console.error("Load skills error:", err);
      setError("Unable to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const openAddForm = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
      display_order: skills.length + 1,
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const openEditForm = (skill) => {
    setEditingId(skill.id);

    setForm({
      name: skill.name || "",
      category: skill.category || "",
      icon: skill.icon || "",
      proficiency: skill.proficiency ?? 50,
      display_order: skill.display_order ?? 1,
      featured: Boolean(skill.featured),
    });

    setMessage("");
    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Skill name is required.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      icon: form.icon.trim() || null,
      proficiency: Number(form.proficiency),
      display_order: Number(form.display_order),
      featured: Boolean(form.featured),
    };

    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, payload);
        setMessage("Skill updated successfully.");
      } else {
        await api.post("/skills", payload);
        setMessage("Skill added successfully.");
      }

      await loadSkills();

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      console.error("Save skill error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save skill."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill) => {
    const confirmed = window.confirm(
      `Delete "${skill.name}" from your skills?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await api.delete(`/skills/${skill.id}`);

      setMessage(`${skill.name} deleted successfully.`);

      await loadSkills();
    } catch (err) {
      console.error("Delete skill error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete skill."
      );
    }
  };

  return (
    <AdminLayout>
      <div className="content-header">
        <div>
          <span className="dashboard-eyebrow">
            PORTFOLIO CONTENT
          </span>

          <h1>Skills</h1>

          <p>
            Manage the technologies and professional skills shown on
            your portfolio.
          </p>
        </div>

        <button
          className="primary-action"
          type="button"
          onClick={openAddForm}
        >
          <Plus size={17} />
          Add skill
        </button>
      </div>

      {message && (
        <div className="form-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="form-message error">
          {error}
        </div>
      )}

      {showForm && (
        <form
          className="content-card skill-form-card"
          onSubmit={handleSubmit}
        >
          <div className="skill-form-header">
            <div>
              <h2>
                {editingId ? "Edit skill" : "Add skill"}
              </h2>

              <p>
                {editingId
                  ? "Update this skill's portfolio information."
                  : "Add a new skill to your portfolio."}
              </p>
            </div>

            <button
              className="icon-button"
              type="button"
              onClick={closeForm}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="content-form-grid">
            <div className="content-field">
              <label>Skill name *</label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Python"
                required
              />
            </div>

            <div className="content-field">
              <label>Category</label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Programming"
              />
            </div>

            <div className="content-field">
              <label>Icon</label>

              <input
                name="icon"
                value={form.icon}
                onChange={handleChange}
                placeholder="Optional icon name or URL"
              />
            </div>

            <div className="content-field">
              <label>Display order</label>

              <input
                name="display_order"
                type="number"
                min="0"
                value={form.display_order}
                onChange={handleChange}
              />
            </div>

            <div className="content-field full-width">
              <label>
                Proficiency: {form.proficiency}%
              </label>

              <input
                className="skill-range"
                name="proficiency"
                type="range"
                min="0"
                max="100"
                value={form.proficiency}
                onChange={handleChange}
              />
            </div>

            <div className="content-field full-width">
              <label className="checkbox-field">
                <input
                  name="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={handleChange}
                />

                <span>
                  Feature this skill on the portfolio
                </span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="secondary-action"
              type="button"
              onClick={closeForm}
            >
              Cancel
            </button>

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
                  {editingId ? "Save changes" : "Add skill"}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="skills-grid">
        {loading ? (
          <div className="page-loading">
            <LoaderCircle
              className="page-spinner"
              size={24}
            />
            Loading skills...
          </div>
        ) : skills.length === 0 ? (
          <div className="skills-empty">
            <h3>No skills yet</h3>
            <p>Add your first portfolio skill.</p>
          </div>
        ) : (
          skills.map((skill) => (
            <div className="skill-card" key={skill.id}>
              <div className="skill-card-top">
                <div>
                  <div className="skill-name-row">
                    <h3>{skill.name}</h3>

                    {skill.featured && (
                      <Star
                        size={14}
                        fill="currentColor"
                      />
                    )}
                  </div>

                  <span className="skill-category">
                    {skill.category || "Uncategorized"}
                  </span>
                </div>

                <div className="skill-actions">
                  <button
                    type="button"
                    onClick={() => openEditForm(skill)}
                    title="Edit skill"
                  >
                    <Pencil size={15} />
                  </button>

                  <button
                    type="button"
                    className="delete"
                    onClick={() => handleDelete(skill)}
                    title="Delete skill"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <div className="skill-proficiency-row">
                <span>Proficiency</span>
                <strong>{skill.proficiency}%</strong>
              </div>

              <div className="skill-progress">
                <div
                  className="skill-progress-fill"
                  style={{
                    width: `${skill.proficiency}%`,
                  }}
                />
              </div>

              <div className="skill-footer">
                <span>
                  Display order: {skill.display_order}
                </span>

                <span>
                  {skill.featured
                    ? "Featured"
                    : "Standard"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

export default Skills;