import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  Save,
  LoaderCircle,
  Plus,
  X,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import api from "../api/api";

import "./ContentPage.css";
import "./ProjectEditor.css";

const emptyProject = {
  title: "",
  slug: "",
  short_description: "",
  full_description: "",
  category: "",

  thumbnail: "",
  banner_image: "",

  github_frontend_url: "",
  github_backend_url: "",
  github_repo_url: "",

  live_frontend_url: "",
  live_backend_url: "",
  demo_video_url: "",

  problem: "",
  solution: "",
  my_role: "",
  challenges: "",
  learnings: "",

  technologies: [],
  features: [],
  screenshots: [],

  featured: false,
  published: false,
  display_order: 1,
};

function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    ...emptyProject,
  });

  const [technologyInput, setTechnologyInput] =
    useState("");

  const [featureInput, setFeatureInput] =
    useState("");

  const [loading, setLoading] = useState(
    isEditing
  );

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setLoading(false);
      return;
    }

    const loadProject = async () => {
      try {
        setError("");

        const response = await api.get(
          "/projects/admin/all"
        );

        const projects =
          response.data.data || [];

        const project = projects.find(
          (item) =>
            Number(item.id) === Number(id)
        );

        if (!project) {
          setError("Project not found.");
          return;
        }

        setForm({
          ...emptyProject,
          ...project,

          title: project.title || "",
          slug: project.slug || "",

          short_description:
            project.short_description || "",

          full_description:
            project.full_description || "",

          category: project.category || "",

          thumbnail:
            project.thumbnail || "",

          banner_image:
            project.banner_image || "",

          github_frontend_url:
            project.github_frontend_url || "",

          github_backend_url:
            project.github_backend_url || "",

          github_repo_url:
            project.github_repo_url || "",

          live_frontend_url:
            project.live_frontend_url || "",

          live_backend_url:
            project.live_backend_url || "",

          demo_video_url:
            project.demo_video_url || "",

          problem: project.problem || "",
          solution: project.solution || "",
          my_role: project.my_role || "",

          challenges:
            project.challenges || "",

          learnings:
            project.learnings || "",

          technologies: Array.isArray(
            project.technologies
          )
            ? project.technologies
            : [],

          features: Array.isArray(
            project.features
          )
            ? project.features
            : [],

          screenshots: Array.isArray(
            project.screenshots
          )
            ? project.screenshots
            : [],

          featured: Boolean(
            project.featured
          ),

          published: Boolean(
            project.published
          ),

          display_order:
            project.display_order ?? 1,
        });
      } catch (err) {
        console.error(
          "Load project error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load project."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((current) => ({
      ...current,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const generateSlug = () => {
    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((current) => ({
      ...current,
      slug,
    }));
  };

  const addTechnology = () => {
    const value = technologyInput.trim();

    if (!value) {
      return;
    }

    const alreadyExists =
      form.technologies.some(
        (technology) =>
          technology.toLowerCase() ===
          value.toLowerCase()
      );

    if (alreadyExists) {
      setTechnologyInput("");
      return;
    }

    setForm((current) => ({
      ...current,

      technologies: [
        ...current.technologies,
        value,
      ],
    }));

    setTechnologyInput("");
  };

  const removeTechnology = (index) => {
    setForm((current) => ({
      ...current,

      technologies:
        current.technologies.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  };

  const addFeature = () => {
    const value = featureInput.trim();

    if (!value) {
      return;
    }

    const alreadyExists =
      form.features.some(
        (feature) =>
          feature.toLowerCase() ===
          value.toLowerCase()
      );

    if (alreadyExists) {
      setFeatureInput("");
      return;
    }

    setForm((current) => ({
      ...current,

      features: [
        ...current.features,
        value,
      ],
    }));

    setFeatureInput("");
  };

  const removeFeature = (index) => {
    setForm((current) => ({
      ...current,

      features:
        current.features.filter(
          (_, itemIndex) =>
            itemIndex !== index
        ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError(
        "Project title is required."
      );

      return;
    }

    if (!form.slug.trim()) {
      setError(
        "Project slug is required."
      );

      return;
    }

    setSaving(true);

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),

      short_description:
        form.short_description.trim(),

      full_description:
        form.full_description.trim(),

      category: form.category.trim(),

      thumbnail:
        form.thumbnail.trim() || null,

      banner_image:
        form.banner_image.trim() || null,

      github_frontend_url:
        form.github_frontend_url.trim() ||
        null,

      github_backend_url:
        form.github_backend_url.trim() ||
        null,

      github_repo_url:
        form.github_repo_url.trim() ||
        null,

      live_frontend_url:
        form.live_frontend_url.trim() ||
        null,

      live_backend_url:
        form.live_backend_url.trim() ||
        null,

      demo_video_url:
        form.demo_video_url.trim() ||
        null,

      problem:
        form.problem.trim(),

      solution:
        form.solution.trim(),

      my_role:
        form.my_role.trim(),

      challenges:
        form.challenges.trim(),

      learnings:
        form.learnings.trim(),

      technologies:
        form.technologies,

      features:
        form.features,

      screenshots:
        form.screenshots,

      featured:
        Boolean(form.featured),

      published:
        Boolean(form.published),

      display_order:
        Number(form.display_order) || 0,
    };

    try {
      if (isEditing) {
        await api.put(
          `/projects/${id}`,
          payload
        );
      } else {
        await api.post(
          "/projects",
          payload
        );
      }

      navigate("/projects");
    } catch (err) {
      console.error(
        "Save project error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to save project."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="page-loading">
          <LoaderCircle
            className="page-spinner"
            size={24}
          />

          Loading project...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button
        className="editor-back"
        type="button"
        onClick={() =>
          navigate("/projects")
        }
      >
        <ArrowLeft size={16} />
        Back to projects
      </button>

      <div className="content-header">
        <div>
          <span className="dashboard-eyebrow">
            PROJECT CMS
          </span>

          <h1>
            {isEditing
              ? "Edit Project"
              : "Add Project"}
          </h1>

          <p>
            Manage project information,
            case-study content and portfolio
            visibility.
          </p>
        </div>
      </div>

      {error && (
        <div className="form-message error">
          {error}
        </div>
      )}

      <form
        className="project-editor"
        onSubmit={handleSubmit}
      >
        {/* BASIC INFORMATION */}

        <section className="content-card">
          <div className="content-card-heading">
            <h2>Basic information</h2>

            <p>
              Main information shown on
              project cards and project pages.
            </p>
          </div>

          <div className="content-form-grid">
            <div className="content-field">
              <label>Project title *</label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Project title"
                required
              />
            </div>

            <div className="content-field">
              <label>Category</label>

              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Full Stack Development"
              />
            </div>

            <div className="content-field full-width">
              <label>Slug *</label>

              <div className="slug-row">
                <input
                  name="slug"
                  value={form.slug}
                  onChange={handleChange}
                  placeholder="project-slug"
                  required
                />

                <button
                  type="button"
                  onClick={generateSlug}
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="content-field full-width">
              <label>
                Short description
              </label>

              <textarea
                name="short_description"
                value={
                  form.short_description
                }
                onChange={handleChange}
                rows="3"
                placeholder="Short summary displayed on project cards."
              />
            </div>

            <div className="content-field full-width">
              <label>
                Full description
              </label>

              <textarea
                name="full_description"
                value={
                  form.full_description
                }
                onChange={handleChange}
                rows="6"
                placeholder="Detailed project description."
              />
            </div>
          </div>
        </section>

        {/* CASE STUDY */}

        <section className="content-card">
          <div className="content-card-heading">
            <h2>Case study</h2>

            <p>
              Explain the project to
              recruiters beyond the technical
              stack.
            </p>
          </div>

          <div className="content-form-grid">
            <div className="content-field full-width">
              <label>Problem</label>

              <textarea
                name="problem"
                value={form.problem}
                onChange={handleChange}
                rows="4"
                placeholder="What problem did this project solve?"
              />
            </div>

            <div className="content-field full-width">
              <label>Solution</label>

              <textarea
                name="solution"
                value={form.solution}
                onChange={handleChange}
                rows="4"
                placeholder="How did you solve the problem?"
              />
            </div>

            <div className="content-field full-width">
              <label>My role</label>

              <textarea
                name="my_role"
                value={form.my_role}
                onChange={handleChange}
                rows="4"
                placeholder="What did you personally contribute?"
              />
            </div>

            <div className="content-field full-width">
              <label>Challenges</label>

              <textarea
                name="challenges"
                value={form.challenges}
                onChange={handleChange}
                rows="4"
                placeholder="What were the main challenges?"
              />
            </div>

            <div className="content-field full-width">
              <label>Learnings</label>

              <textarea
                name="learnings"
                value={form.learnings}
                onChange={handleChange}
                rows="4"
                placeholder="What did you learn?"
              />
            </div>
          </div>
        </section>

        {/* TECHNOLOGIES */}

        <section className="content-card">
          <div className="content-card-heading">
            <h2>
              Technologies & features
            </h2>

            <p>
              Add structured technologies and
              key project features.
            </p>
          </div>

          <div className="tag-editor-section">
            <label>Technologies</label>

            <div className="tag-input-row">
              <input
                value={technologyInput}
                onChange={(e) =>
                  setTechnologyInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
                placeholder="e.g. React"
              />

              <button
                type="button"
                onClick={addTechnology}
              >
                <Plus size={15} />
                Add
              </button>
            </div>

            <div className="editor-tags">
              {form.technologies.map(
                (technology, index) => (
                  <span
                    key={`${technology}-${index}`}
                  >
                    {technology}

                    <button
                      type="button"
                      onClick={() =>
                        removeTechnology(index)
                      }
                    >
                      <X size={12} />
                    </button>
                  </span>
                )
              )}
            </div>
          </div>

          <div className="tag-editor-section">
            <label>Features</label>

            <div className="tag-input-row">
              <input
                value={featureInput}
                onChange={(e) =>
                  setFeatureInput(
                    e.target.value
                  )
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="e.g. JWT authentication"
              />

              <button
                type="button"
                onClick={addFeature}
              >
                <Plus size={15} />
                Add
              </button>
            </div>

            <div className="editor-tags">
              {form.features.map(
                (feature, index) => (
                  <span
                    key={`${feature}-${index}`}
                  >
                    {feature}

                    <button
                      type="button"
                      onClick={() =>
                        removeFeature(index)
                      }
                    >
                      <X size={12} />
                    </button>
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* LINKS */}

        <section className="content-card">
          <div className="content-card-heading">
            <h2>Project links</h2>

            <p>
              GitHub repositories, deployed
              applications and demo video.
            </p>
          </div>

          <div className="content-form-grid">
            <div className="content-field">
              <label>
                Frontend GitHub URL
              </label>

              <input
                name="github_frontend_url"
                value={
                  form.github_frontend_url
                }
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="content-field">
              <label>
                Backend GitHub URL
              </label>

              <input
                name="github_backend_url"
                value={
                  form.github_backend_url
                }
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="content-field">
              <label>
                Primary GitHub URL
              </label>

              <input
                name="github_repo_url"
                value={form.github_repo_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
            </div>

            <div className="content-field">
              <label>
                Live frontend URL
              </label>

              <input
                name="live_frontend_url"
                value={
                  form.live_frontend_url
                }
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="content-field">
              <label>
                Live backend URL
              </label>

              <input
                name="live_backend_url"
                value={
                  form.live_backend_url
                }
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="content-field">
              <label>
                Demo video URL
              </label>

              <input
                name="demo_video_url"
                value={form.demo_video_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* IMAGES */}

        <section className="content-card">
          <div className="content-card-heading">
            <h2>Images</h2>

            <p>
              For now these accept URLs. We
              will connect the Media Library
              later.
            </p>
          </div>

          <div className="content-form-grid">
            <div className="content-field">
              <label>Thumbnail URL</label>

              <input
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            <div className="content-field">
              <label>
                Banner image URL
              </label>

              <input
                name="banner_image"
                value={form.banner_image}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </section>

        {/* PUBLISHING */}

        <section className="content-card">
          <div className="content-card-heading">
            <h2>
              Publishing settings
            </h2>

            <p>
              Control project ordering and
              public visibility.
            </p>
          </div>

          <div className="content-form-grid">
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
              <label className="checkbox-field">
                <input
                  name="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={handleChange}
                />

                <span>
                  Feature this project
                </span>
              </label>
            </div>

            <div className="content-field full-width">
              <label className="checkbox-field">
                <input
                  name="published"
                  type="checkbox"
                  checked={form.published}
                  onChange={handleChange}
                />

                <span>
                  Publish this project
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* SAVE BAR */}

        <div className="project-save-bar">
          <button
            className="secondary-action"
            type="button"
            onClick={() =>
              navigate("/projects")
            }
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

                {isEditing
                  ? "Save changes"
                  : "Create project"}
              </>
            )}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}

export default ProjectEditor;