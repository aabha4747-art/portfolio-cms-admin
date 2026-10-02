import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import api from "../api/api";
import "./SimpleCrud.css";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  tags: "",
  published: false,
};

function Blogs() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/blogs/admin/all");
      setItems(res.data.data || []);
    } catch {
      setError("Unable to load blogs.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const generateSlug = (title) =>
    title
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const edit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      content: item.content || "",
      cover_image: item.cover_image || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      published: Boolean(item.published),
    });
    setShowForm(true);
  };

  const save = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await api.put(`/blogs/${editingId}`, payload);
      } else {
        await api.post("/blogs", payload);
      }

      reset();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save blog.");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    await api.delete(`/blogs/${item.id}`);
    await load();
  };

  return (
    <AdminLayout>
      <div className="crud-header">
        <div>
          <span>PORTFOLIO CONTENT</span>
          <h1>Blogs</h1>
          <p>Create and publish portfolio articles.</p>
        </div>

        <button
          className="crud-primary"
          onClick={() => {
            reset();
            setShowForm(true);
          }}
        >
          <Plus size={16} /> Add Blog
        </button>
      </div>

      {error && <div className="crud-error">{error}</div>}

      {showForm && (
        <form className="crud-form" onSubmit={save}>
          <div className="crud-form-title">
            <h2>{editingId ? "Edit Blog" : "Add Blog"}</h2>
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
                onChange={(e) => {
                  const title = e.target.value;
                  setForm({
                    ...form,
                    title,
                    slug: editingId ? form.slug : generateSlug(title),
                  });
                }}
              />
            </label>

            <label>
              Slug *
              <input
                required
                value={form.slug}
                onChange={(e) =>
                  setForm({ ...form, slug: e.target.value })
                }
              />
            </label>

            <label className="crud-full">
              Excerpt
              <textarea
                rows="3"
                value={form.excerpt}
                onChange={(e) =>
                  setForm({ ...form, excerpt: e.target.value })
                }
              />
            </label>

            <label className="crud-full">
              Content *
              <textarea
                required
                rows="10"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
              />
            </label>

            <label>
              Cover Image URL
              <input
                value={form.cover_image}
                onChange={(e) =>
                  setForm({ ...form, cover_image: e.target.value })
                }
              />
            </label>

            <label>
              Tags
              <input
                value={form.tags}
                onChange={(e) =>
                  setForm({ ...form, tags: e.target.value })
                }
                placeholder="AI, Product, Development"
              />
            </label>

            <label className="crud-check crud-full">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
              />
              Published
            </label>
          </div>

          <button className="crud-primary">Save Blog</button>
        </form>
      )}

      <div className="crud-list">
        {items.map((item) => (
          <div className="crud-card" key={item.id}>
            <div>
              <h3>{item.title}</h3>
              <span className="crud-badge">
                {item.published ? "Published" : "Draft"}
              </span>
              <p>{item.excerpt}</p>
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

export default Blogs;