import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import api from "../api/api";
import "./SimpleCrud.css";

const emptyForm = {
  name: "",
  role: "",
  company: "",
  message: "",
  profile_image: "",
  linkedin_url: "",
  featured: false,
  display_order: 0,
};

function Testimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await api.get("/testimonials");
    setItems(res.data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      role: item.role || "",
      company: item.company || "",
      message: item.message || "",
      profile_image: item.profile_image || "",
      linkedin_url: item.linkedin_url || "",
      featured: Boolean(item.featured),
      display_order: item.display_order ?? 0,
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      display_order: Number(form.display_order),
    };

    if (editingId) {
      await api.put(`/testimonials/${editingId}`, payload);
    } else {
      await api.post("/testimonials", payload);
    }

    reset();
    await load();
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete testimonial from ${item.name}?`)) return;
    await api.delete(`/testimonials/${item.id}`);
    await load();
  };

  return (
    <AdminLayout>
      <div className="crud-header">
        <div>
          <span>PORTFOLIO CONTENT</span>
          <h1>Testimonials</h1>
          <p>Manage recommendations and testimonials.</p>
        </div>

        <button
          className="crud-primary"
          onClick={() => {
            reset();
            setShowForm(true);
          }}
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <form className="crud-form" onSubmit={save}>
          <div className="crud-form-title">
            <h2>{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
            <button type="button" onClick={reset}>
              <X size={18} />
            </button>
          </div>

          <div className="crud-grid">
            <label>
              Name *
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </label>

            <label>
              Role
              <input
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
              />
            </label>

            <label>
              Company
              <input
                value={form.company}
                onChange={(e) =>
                  setForm({ ...form, company: e.target.value })
                }
              />
            </label>

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
              Message *
              <textarea
                required
                rows="5"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
              />
            </label>

            <label>
              Profile Image URL
              <input
                value={form.profile_image}
                onChange={(e) =>
                  setForm({ ...form, profile_image: e.target.value })
                }
              />
            </label>

            <label>
              LinkedIn URL
              <input
                value={form.linkedin_url}
                onChange={(e) =>
                  setForm({ ...form, linkedin_url: e.target.value })
                }
              />
            </label>

            <label className="crud-check crud-full">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
              Featured
            </label>
          </div>

          <button className="crud-primary">Save Testimonial</button>
        </form>
      )}

      <div className="crud-list">
        {items.map((item) => (
          <div className="crud-card" key={item.id}>
            <div>
              <h3>{item.name}</h3>
              <strong>
                {[item.role, item.company].filter(Boolean).join(" · ")}
              </strong>
              <p>{item.message}</p>
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

export default Testimonials;