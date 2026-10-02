import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, Upload, Copy } from "lucide-react";
import api from "../api/api";
import "./SimpleCrud.css";

function Media() {
  const [media, setMedia] = useState([]);
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  async function loadMedia() {
    try {
      setLoading(true);

      const response = await api.get("/media");

      setMedia(
        Array.isArray(response.data.data)
          ? response.data.data
          : []
      );
    } catch (error) {
      console.error(error);
      setMessage("Unable to load media.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleUpload(event) {
    event.preventDefault();

    if (!file) {
      setMessage("Please select an image first.");
      return;
    }

    try {
      setUploading(true);
      setMessage("");

      const formData = new FormData();

      formData.append("file", file);

      if (altText.trim()) {
        formData.append("alt_text", altText.trim());
      }

      await api.post("/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setFile(null);
      setAltText("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage("Image uploaded successfully.");

      await loadMedia();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to upload image."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete ${item.file_name}?`
    );

    if (!confirmed) return;

    try {
      setMessage("");

      await api.delete(`/media/${item.id}`);

      setMessage("Image deleted successfully.");

      await loadMedia();
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Unable to delete image."
      );
    }
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Image URL copied.");
    } catch {
      setMessage("Unable to copy URL.");
    }
  }

  function formatSize(bytes) {
    const size = Number(bytes);

    if (!size) return "";

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="crud-page">
      <div className="crud-header">
        <div>
          <p className="crud-kicker">PORTFOLIO CMS</p>
          <h1>Media Library</h1>
          <p>
            Upload and manage images used across your
            portfolio.
          </p>
        </div>
      </div>

      {message && (
        <div className="crud-message">
          {message}
        </div>
      )}

      <form
        className="media-upload-panel"
        onSubmit={handleUpload}
      >
        <div className="media-upload-title">
          <ImagePlus size={20} />

          <div>
            <strong>Upload image</strong>
            <p>
              JPG, PNG, WEBP and other supported image
              formats. Maximum 5 MB.
            </p>
          </div>
        </div>

        <div className="media-upload-fields">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(event) =>
              setFile(event.target.files?.[0] || null)
            }
          />

          <input
            type="text"
            value={altText}
            placeholder="Alternative text (optional)"
            onChange={(event) =>
              setAltText(event.target.value)
            }
          />

          <button
            className="crud-primary-button"
            type="submit"
            disabled={uploading}
          >
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>

      <div className="media-section-heading">
        <div>
          <h2>Uploaded Media</h2>
          <span>{media.length} files</span>
        </div>

        <button
          className="crud-secondary-button"
          onClick={loadMedia}
          type="button"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading media...</p>
      ) : media.length === 0 ? (
        <div className="crud-empty">
          <ImagePlus size={28} />
          <h3>No media uploaded yet</h3>
          <p>
            Upload your first portfolio image above.
          </p>
        </div>
      ) : (
        <div className="media-grid">
          {media.map((item) => (
            <article
              className="media-card"
              key={item.id}
            >
              <div className="media-preview">
                <img
                  src={item.file_url}
                  alt={
                    item.alt_text ||
                    item.file_name ||
                    "Portfolio media"
                  }
                />
              </div>

              <div className="media-card-content">
                <strong title={item.file_name}>
                  {item.file_name}
                </strong>

                <p>
                  {item.file_type || "Image"}
                  {item.file_size
                    ? ` • ${formatSize(item.file_size)}`
                    : ""}
                </p>

                {item.alt_text && (
                  <p className="media-alt">
                    {item.alt_text}
                  </p>
                )}

                <div className="media-actions">
                  <button
                    type="button"
                    onClick={() =>
                      copyUrl(item.file_url)
                    }
                  >
                    <Copy size={14} />
                    Copy URL
                  </button>

                  <button
                    type="button"
                    className="danger"
                    onClick={() =>
                      handleDelete(item)
                    }
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Media;