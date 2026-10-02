import { useEffect, useState } from "react";
import {
  Download,
  ExternalLink,
  GitBranch,
  RefreshCw,
} from "lucide-react";

import api from "../api/api";
import "./SimpleCrud.css";

function GitHubImport() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState("");
  const [message, setMessage] = useState("");

  async function loadRepositories() {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get(
        "/github/repos"
      );

      const data = response.data.data;

      setRepos(
        Array.isArray(data)
          ? data
          : Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load GitHub repositories."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepositories();
  }, []);

  async function importRepository(repoName) {
    const confirmed = window.confirm(
      `Import "${repoName}" into Projects?`
    );

    if (!confirmed) return;

    try {
      setImporting(repoName);
      setMessage("");

      await api.post(
        `/github/import/${encodeURIComponent(repoName)}`
      );

      setMessage(
        `${repoName} imported successfully. Open Projects to review and publish it.`
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to import repository."
      );
    } finally {
      setImporting("");
    }
  }

  return (
    <div className="crud-page">
      <div className="crud-header github-header">
        <div>
          <p className="crud-kicker">
            PORTFOLIO CMS
          </p>

          <h1>GitHub Import</h1>

          <p>
            Import GitHub repositories into the CMS and
            convert them into portfolio case studies.
          </p>
        </div>

        <button
          type="button"
          className="crud-secondary-button"
          onClick={loadRepositories}
          disabled={loading}
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {message && (
        <div className="crud-message">
          {message}
        </div>
      )}

      <div className="github-info">
        <GitBranch size={19} />

        <div>
          <strong>
            GitHub → CMS → Portfolio
          </strong>

          <p>
            Import a repository, enrich it from the
            Projects section, and publish it when the case
            study is ready.
          </p>
        </div>
      </div>

      {loading ? (
        <p>Loading repositories...</p>
      ) : repos.length === 0 ? (
        <div className="crud-empty">
          <GitBranch size={28} />

          <h3>No repositories found</h3>

          <p>
            Refresh the page to try loading your GitHub
            repositories again.
          </p>
        </div>
      ) : (
        <div className="github-repo-list">
          {repos.map((repo) => {
            const repoName =
              repo.name ||
              repo.repo_name ||
              repo.full_name;

            const repoUrl =
              repo.html_url ||
              repo.github_url ||
              repo.url;

            return (
              <article
                className="github-repo-card"
                key={repo.id || repoName}
              >
                <div className="github-repo-main">
                  <div className="github-repo-icon">
                    <GitBranch size={18} />
                  </div>

                  <div>
                    <h3>{repoName}</h3>

                    <p>
                      {repo.description ||
                        "No repository description provided."}
                    </p>

                    <div className="github-repo-meta">
                      {repo.language && (
                        <span>{repo.language}</span>
                      )}

                      {repo.stargazers_count !==
                        undefined && (
                        <span>
                          ★ {repo.stargazers_count}
                        </span>
                      )}

                      {repo.private !== undefined && (
                        <span>
                          {repo.private
                            ? "Private"
                            : "Public"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="github-repo-actions">
                  {repoUrl && (
                    <a
                      href={repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="crud-secondary-button"
                    >
                      <ExternalLink size={14} />
                      View
                    </a>
                  )}

                  <button
                    type="button"
                    className="crud-primary-button"
                    disabled={
                      importing === repoName
                    }
                    onClick={() =>
                      importRepository(repoName)
                    }
                  >
                    <Download size={14} />

                    {importing === repoName
                      ? "Importing..."
                      : "Import"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default GitHubImport;