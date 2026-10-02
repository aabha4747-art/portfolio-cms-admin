import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import api from "../api/api";
import "./SimpleCrud.css";

const emptyForm = {
  title: "",
  description: "",
  icon: "",
  featured: false,
  display_order: 0,
};

function Services() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const res = await api.get("/services");
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
      title: item.title || "",
      description: item.description || "",
      icon: item.icon || "",
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
      await api.put(`/services/${editingId}`, payload);
    } else {
      await api.post("/services", payload);
    }

    reset();
    await load();
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    await api.delete(`/services/${item.id}`);
    await load();
  };

  return (
    <AdminLayout>
      <div className="crud-header">
        <div>
          <span>PORTFOLIO CONTENT</span>
          <h1>Services</h1>
          <p>Manage services and capabilities.</p>
        </div>

        <button
          className="crud-primary"
          onClick={() => {
            reset();
            setShowForm(true);
          }}
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      {showForm && (
        <form className="crud-form" onSubmit={save}>
          <div className="crud-form-title">
            <h2>{editingId ? "Edit Service" : "Add Service"}</h2>
            <button type="button" onClick={reset}>
              <X size={18} />
            </button>
          </div>

          <div className="crud-grid">
            <label>
              Title *
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </label>

            <label>
              Icon
              <input
                value={form.icon}
                onChange={(e) =>
                  setForm({ ...form, icon: e.target.value })
                }
                placeholder="Optional icon name"
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
              Description *
              <textarea
                required
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
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
              />
              Featured
            </label>
          </div>

          <button className="crud-primary">Save Service</button>
        </form>
      )}

      <div className="crud-list">
        {items.map((item) => (
          <div className="crud-card" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              {item.featured && <span className="crud-badge">Featured</span>}
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

export default Services;