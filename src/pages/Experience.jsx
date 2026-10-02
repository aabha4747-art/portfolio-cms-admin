import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import api from "../api/api";
import "./SimpleCrud.css";

const emptyForm = {
  company: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  currently_working: false,
  description: "",
  technologies: "",
  company_logo: "",
  display_order: 0,
};

function Experience() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/experience");
      setItems(res.data.data || []);
    } catch {
      setError("Unable to load experience.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      company: item.company || "",
      role: item.role || "",
      location: item.location || "",
      start_date: item.start_date
        ? item.start_date.slice(0, 10)
        : "",
      end_date: item.end_date
        ? item.end_date.slice(0, 10)
        : "",
      currently_working: Boolean(item.currently_working),
      description: item.description || "",
      technologies: Array.isArray(item.technologies)
        ? item.technologies.join(", ")
        : "",
      company_logo: item.company_logo || "",
      display_order: item.display_order ?? 0,
    });
    setShowForm(true);
  };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      end_date: form.currently_working
        ? null
        : form.end_date || null,
      technologies: form.technologies
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      display_order: Number(form.display_order),
    };

    try {
      if (editingId) {
        await api.put(`/experience/${editingId}`, payload);
      } else {
        await api.post("/experience", payload);
      }

      setMessage(editingId ? "Experience updated." : "Experience created.");
      reset();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save.");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.company}?`)) return;

    try {
      await api.delete(`/experience/${item.id}`);
      await load();
    } catch {
      setError("Unable to delete experience.");
    }
  };

  return (
    <AdminLayout>
      <div className="crud-header">
        <div>
          <span>PORTFOLIO CONTENT</span>
          <h1>Experience</h1>
          <p>Manage work and internship experience.</p>
        </div>

        <button
          className="crud-primary"
          onClick={() => {
            reset();
            setShowForm(true);
          }}
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      {message && <div className="crud-success">{message}</div>}
      {error && <div className="crud-error">{error}</div>}

      {showForm && (
        <form className="crud-form" onSubmit={save}>
          <div className="crud-form-title">
            <h2>{editingId ? "Edit Experience" : "Add Experience"}</h2>
            <button type="button" onClick={reset}>
              <X size={18} />
            </button>
          </div>

          <div className="crud-grid">
            <label>
              Company *
              <input
                required
                value={form.company}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value })
                }
              />
            </label>

            <label>
              Role *
              <input
                required
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              />
            </label>

            <label>
              Location
              <input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </label>

            <label>
              Start Date *
              <input
                required
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm({ ...form, start_date: e.target.value })
                }
              />
            </label>

            {!form.currently_working && (
              <label>
                End Date
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) =>
                    setForm({ ...form, end_date: e.target.value })
                  }
                />
              </label>
            )}

            <label>
              Display Order
              <input
                type="number"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: e.target.value })
                }
              />
            </label>

            <label className="crud-full">
              Technologies (comma separated)
              <input
                value={form.technologies}
                onChange={(e) =>
                  setForm({ ...form, technologies: e.target.value })
                }
                placeholder="React, Node.js, PostgreSQL"
              />
            </label>

            <label className="crud-full">
              Company Logo URL
              <input
                value={form.company_logo}
                onChange={(e) =>
                  setForm({ ...form, company_logo: e.target.value })
                }
              />
            </label>

            <label className="crud-full">
              Description
              <textarea
                rows="5"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>

            <label className="crud-check crud-full">
              <input
                type="checkbox"
                checked={form.currently_working}
                onChange={(e) =>
                  setForm({
                    ...form,
                    currently_working: e.target.checked,
                  })
                }
              />
              Currently working here
            </label>
          </div>

          <button className="crud-primary" type="submit">
            Save Experience
          </button>
        </form>
      )}

      <div className="crud-list">
        {items.map((item) => (
          <div className="crud-card" key={item.id}>
            <div>
              <h3>{item.role}</h3>
              <strong>{item.company}</strong>
              <p>{item.location}</p>
              <p>{item.description}</p>
            </div>

            <div className="crud-actions">
              <button onClick={() => edit(item)}>
                <Pencil size={15} />
              </button>
              <button onClick={() => remove(item)}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default Experience;