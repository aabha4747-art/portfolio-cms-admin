import { useEffect, useState } from "react";
import {
  FolderKanban,
  Code2,
  BriefcaseBusiness,
  Image,
  FileText,
  ArrowUpRight,
} from "lucide-react";

import AdminLayout from "../components/AdminLayout";
import api from "../api/api";
import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experience: 0,
    blogs: 0,
    media: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [
          projectsResponse,
          skillsResponse,
          experienceResponse,
          blogsResponse,
          mediaResponse,
        ] = await Promise.all([
          api.get("/projects/admin/all"),
          api.get("/skills"),
          api.get("/experience"),
          api.get("/blogs/admin/all"),
          api.get("/media"),
        ]);

        const projects = projectsResponse.data.data || [];

        setStats({
          projects: projects.length,
          skills: skillsResponse.data.data?.length || 0,
          experience: experienceResponse.data.data?.length || 0,
          blogs: blogsResponse.data.data?.length || 0,
          media: mediaResponse.data.data?.length || 0,
        });

        setRecentProjects(projects.slice(0, 4));
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = [
    {
      label: "Projects",
      value: stats.projects,
      icon: FolderKanban,
    },
    {
      label: "Skills",
      value: stats.skills,
      icon: Code2,
    },
    {
      label: "Experience",
      value: stats.experience,
      icon: BriefcaseBusiness,
    },
    {
      label: "Blogs",
      value: stats.blogs,
      icon: FileText,
    },
    {
      label: "Media",
      value: stats.media,
      icon: Image,
    },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Manage and monitor your portfolio content.</p>
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">AT</div>

          <div>
            <strong>Admin</strong>
            <span>Portfolio Owner</span>
          </div>
        </div>
      </div>

      <section className="stats-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article className="stat-card" key={card.label}>
              <div className="stat-icon">
                <Icon size={20} />
              </div>

              <div>
                <span>{card.label}</span>

                <strong>
                  {loading ? "—" : card.value}
                </strong>
              </div>
            </article>
          );
        })}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <span className="dashboard-eyebrow">CONTENT</span>
            <h2>Recent projects</h2>
          </div>

          <a href="/projects">
            Manage projects
            <ArrowUpRight size={15} />
          </a>
        </div>

        {loading ? (
          <div className="dashboard-empty">
            Loading portfolio data...
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="dashboard-empty">
            No projects have been added yet.
          </div>
        ) : (
          <div className="projects-table">
            <div className="project-row project-table-head">
              <span>Project</span>
              <span>Category</span>
              <span>Status</span>
            </div>

            {recentProjects.map((project) => (
              <div className="project-row" key={project.id}>
                <div>
                  <strong>{project.title}</strong>
                  <span>{project.slug}</span>
                </div>

                <span>{project.category || "Uncategorized"}</span>

                <span
                  className={`status-badge ${
                    project.published ? "published" : "draft"
                  }`}
                >
                  {project.published ? "Published" : "Draft"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

export default Dashboard;