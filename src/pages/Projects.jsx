import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Pencil,
  Trash2,
  LoaderCircle,
  Star,
  ExternalLink,
  GitBranch,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import api from "../api/api";
import "./ContentPage.css";
import "./Projects.css";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProjects = async () => {
    try {
      setError("");

      const response = await api.get("/projects/admin/all");

      setProjects(response.data.data || []);
    } catch (err) {
      console.error("Load projects error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete "${project.title}"?\n\nThis permanently removes the project from the CMS.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(`/projects/${project.id}`);

      setMessage(
        `${project.title} deleted successfully.`
      );

      await loadProjects();
    } catch (err) {
      console.error("Delete project error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete project."
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

          <h1>Projects</h1>

          <p>
            Manage portfolio projects, case studies,
            links and publishing status.
          </p>
        </div>

        <button
          className="primary-action"
          type="button"
          onClick={() => navigate("/projects/new")}
        >
          <Plus size={17} />
          Add project
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

      {loading ? (
        <div className="page-loading">
          <LoaderCircle
            className="page-spinner"
            size={24}
          />

          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="projects-empty">
          <h3>No projects yet</h3>

          <p>
            Add your first project to the portfolio CMS.
          </p>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => {
            const technologies = Array.isArray(
              project.technologies
            )
              ? project.technologies
              : [];

            return (
              <article
                className="project-admin-card"
                key={project.id}
              >
                <div className="project-admin-main">
                  <div className="project-admin-heading">
                    <div>
                      <div className="project-title-row">
                        <h2>{project.title}</h2>

                        {project.featured && (
                          <Star
                            className="project-star"
                            size={15}
                            fill="currentColor"
                          />
                        )}
                      </div>

                      <div className="project-meta">
                        <span>
                          {project.category ||
                            "Uncategorized"}
                        </span>

                        <span>•</span>

                        <span>
                          Order{" "}
                          {project.display_order ?? 0}
                        </span>

                        {project.github_imported && (
                          <>
                            <span>•</span>

                            <span>
                              GitHub imported
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="project-admin-actions">
                      <button
                        type="button"
                        title="Edit project"
                        onClick={() =>
                          navigate(
                            `/projects/edit/${project.id}`
                          )
                        }
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        className="delete"
                        title="Delete project"
                        onClick={() =>
                          handleDelete(project)
                        }
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <p className="project-description">
                    {project.short_description ||
                      "No short description added."}
                  </p>

                  <div className="project-tech-list">
                    {technologies.map(
                      (technology, index) => (
                        <span
                          key={`${technology}-${index}`}
                        >
                          {technology}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div className="project-admin-footer">
                  <div className="project-statuses">
                    <span
                      className={
                        project.published
                          ? "status-badge published"
                          : "status-badge draft"
                      }
                    >
                      {project.published
                        ? "Published"
                        : "Draft"}
                    </span>

                    {project.featured && (
                      <span className="status-badge featured">
                        Featured
                      </span>
                    )}
                  </div>

                  <div className="project-links">
                    {project.github_repo_url ? (
                      <a
                        href={project.github_repo_url}
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub repository"
                      >
                        <GitBranch size={15} />
                        GitHub
                      </a>
                    ) : project.github_backend_url ? (
                      <a
                        href={
                          project.github_backend_url
                        }
                        target="_blank"
                        rel="noreferrer"
                        title="GitHub repository"
                      >
                        <GitBranch size={15} />
                        GitHub
                      </a>
                    ) : null}

                    {project.live_frontend_url && (
                      <a
                        href={
                          project.live_frontend_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink size={15} />
                        Live
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

export default Projects;