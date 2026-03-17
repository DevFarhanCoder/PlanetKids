"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Video as VideoIcon,
  Upload,
  Link as LinkIcon,
  X,
} from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnail: string | null;
  duration: string | null;
  videoType: "URL" | "UPLOAD";
  viewCount: number;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    duration: "",
    videoType: "URL" as "URL" | "UPLOAD",
    isActive: true,
    isFeatured: false,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/admin/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      alert("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingVideo
        ? `/api/admin/videos/${editingVideo.id}`
        : "/api/admin/videos";

      const response = await fetch(url, {
        method: editingVideo ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(
          editingVideo
            ? "Video updated successfully!"
            : "Video added successfully!",
        );
        setShowModal(false);
        resetForm();
        fetchVideos();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save video");
      }
    } catch (error) {
      console.error("Error saving video:", error);
      alert("Failed to save video");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;

    try {
      const response = await fetch(`/api/admin/videos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Video deleted successfully!");
        fetchVideos();
      } else {
        alert("Failed to delete video");
      }
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  const handleToggleActive = async (video: Video) => {
    try {
      const response = await fetch(`/api/admin/videos/${video.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...video, isActive: !video.isActive }),
      });

      if (response.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error("Error toggling video status:", error);
    }
  };

  const openEditModal = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail || "",
      duration: video.duration || "",
      videoType: video.videoType,
      isActive: video.isActive,
      isFeatured: video.isFeatured,
      displayOrder: video.displayOrder,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingVideo(null);
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      thumbnail: "",
      duration: "",
      videoType: "URL",
      isActive: true,
      isFeatured: false,
      displayOrder: 0,
    });
  };

  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube watch URL to embed URL
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    try {
      if (url.includes("youtube.com/watch"))
        return new URL(url).searchParams.get("v");
      if (url.includes("youtu.be/"))
        return url.split("youtu.be/")[1]?.split("?")[0] ?? null;
      if (url.includes("youtube.com/shorts/"))
        return url.split("shorts/")[1]?.split("?")[0] ?? null;
      if (url.includes("youtube.com/embed/"))
        return url.split("embed/")[1]?.split("?")[0] ?? null;
    } catch {}
    return null;
  };

  // Auto-set YouTube thumbnail when URL is entered
  const handleVideoUrlChange = (url: string) => {
    setFormData((prev) => {
      const updated = { ...prev, videoUrl: url };
      if (prev.videoType === "URL" && !prev.thumbnail) {
        const ytId = getYouTubeId(url);
        if (ytId)
          updated.thumbnail = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }
      return updated;
    });
  };

  // Handle video file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setUploadProgress("Uploading video to cloud...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/videos/upload", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setFormData((prev) => ({
        ...prev,
        videoUrl: data.videoUrl,
        thumbnail: data.thumbnail || prev.thumbnail,
        duration: data.duration || prev.duration,
      }));
      setUploadProgress("✅ Uploaded successfully!");
      setTimeout(() => setUploadProgress(""), 3000);
    } catch (err) {
      setUploadProgress("❌ Upload failed. Please try again.");
      setTimeout(() => setUploadProgress(""), 4000);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-600 mt-1">
            Manage video content for your store
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Video
        </button>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-gray-100 hover:border-primary-300 transition-all"
          >
            {/* Video Preview */}
            <div className="relative aspect-video bg-gray-100">
              {video.videoType === "URL" ? (
                video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                    <VideoIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )
              ) : (
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Status Badge */}
              <div className="absolute top-2 left-2 flex gap-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    video.isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {video.isActive ? "Active" : "Inactive"}
                </span>
                {video.isFeatured && (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-500 text-white">
                    Featured
                  </span>
                )}
              </div>

              {/* Duration */}
              {video.duration && (
                <div className="absolute bottom-2 right-2 bg-black/75 text-white px-2 py-1 rounded text-xs font-semibold">
                  {video.duration}
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">
                {video.title}
              </h3>
              {video.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {video.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {video.viewCount} views
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {video.videoType}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(video)}
                  className="flex-1 btn-outline py-2 text-sm"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(video)}
                  className="btn-outline py-2 px-3 text-sm"
                  title={video.isActive ? "Deactivate" : "Activate"}
                >
                  {video.isActive ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(video.id)}
                  className="btn-outline py-2 px-3 text-sm text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <VideoIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No videos yet</p>
          <p className="text-gray-400 text-sm">
            Click "Add Video" to get started
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingVideo ? "Edit Video" : "Add New Video"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="input w-full"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Type *
                  </label>
                  <select
                    value={formData.videoType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        videoType: e.target.value as "URL" | "UPLOAD",
                        videoUrl: "",
                        thumbnail: "",
                      })
                    }
                    className="input w-full"
                  >
                    <option value="URL">
                      Video URL (YouTube, Vimeo, etc.)
                    </option>
                    <option value="UPLOAD">Upload Video File</option>
                  </select>
                </div>

                {formData.videoType === "URL" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon className="w-4 h-4 inline mr-1" />
                      YouTube / Video URL *
                    </label>
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => handleVideoUrlChange(e.target.value)}
                      className="input w-full"
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Thumbnail will be auto-filled for YouTube links
                    </p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload className="w-4 h-4 inline mr-1" />
                      Upload Video File *
                    </label>
                    <div
                      onClick={() =>
                        !uploading && fileInputRef.current?.click()
                      }
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                        uploading
                          ? "border-orange-300 bg-orange-50"
                          : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm text-orange-600 font-medium">
                            Uploading...
                          </p>
                        </div>
                      ) : formData.videoUrl ? (
                        <div className="flex flex-col items-center gap-1">
                          <VideoIcon className="w-8 h-8 text-green-500" />
                          <p className="text-sm text-green-600 font-medium">
                            Video uploaded ✅
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-full">
                            {formData.videoUrl}
                          </p>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFormData((p) => ({
                                ...p,
                                videoUrl: "",
                                thumbnail: "",
                              }));
                            }}
                            className="text-xs text-red-500 hover:text-red-700 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="w-8 h-8 text-gray-400" />
                          <p className="text-sm text-gray-600 font-medium">
                            Click to select video file
                          </p>
                          <p className="text-xs text-gray-400">
                            MP4, MOV, AVI, etc.
                          </p>
                        </div>
                      )}
                    </div>
                    {uploadProgress && (
                      <p className="text-xs mt-2 text-gray-600">
                        {uploadProgress}
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail URL
                    {formData.videoType === "URL" && formData.thumbnail && (
                      <span className="ml-2 text-xs text-green-600 font-normal">
                        ✅ Auto-set
                      </span>
                    )}
                  </label>
                  {formData.thumbnail && (
                    <div className="mb-2 relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((p) => ({ ...p, thumbnail: "" }))
                        }
                        className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5 hover:bg-black/70"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  )}
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnail: e.target.value })
                    }
                    className="input w-full"
                    placeholder="https://example.com/thumbnail.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (e.g., 5:32)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="input w-full"
                    placeholder="5:32"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        displayOrder: parseInt(e.target.value) || 0,
                      })
                    }
                    className="input w-full"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active
                    </span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFeatured: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Featured
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingVideo ? "Update Video" : "Add Video"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
