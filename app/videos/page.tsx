"use client";

import { Play, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Video {
  id: string;
  title: string;
  description: string | null;
  videoUrl: string;
  thumbnail: string | null;
  duration: string | null;
  videoType: "URL" | "UPLOAD";
  viewCount: number;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/videos");
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = async (video: Video) => {
    // Increment view count
    try {
      await fetch(`/api/videos/${video.id}/view`, { method: "POST" });
    } catch (error) {
      console.error("Error updating view count:", error);
    }
    setActiveVideo(video);
  };

  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (url.includes("youtube.com/watch")) {
      const videoId = new URL(url).searchParams.get("v");
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : null;
    }
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop()?.split("?")[0];
      return videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : null;
    }
    if (url.includes("youtube.com/embed")) return url;
    return null;
  };

  const getVideoThumbnail = (video: Video) => {
    if (video.thumbnail) return video.thumbnail;

    // Extract YouTube thumbnail
    if (video.videoUrl.includes("youtube.com/watch")) {
      const url = new URL(video.videoUrl);
      const videoId = url.searchParams.get("v");
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    if (video.videoUrl.includes("youtu.be")) {
      const videoId = video.videoUrl.split("/").pop()?.split("?")[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 py-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-900">
              Fun & Educational
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our Fun Videos! 🎥
          </h1>
          <p className="text-xl text-white/95">
            Watch product reviews, unboxings, and fun activities
          </p>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="container-custom py-12">
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const thumbnail = getVideoThumbnail(video);
              return (
                <button
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-gray-100 hover:border-purple-300 text-left w-full"
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-16 h-16 text-gray-400" />
                      </div>
                    )}

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg">
                        <Play
                          className="w-8 h-8 text-purple-600 ml-1"
                          fill="currentColor"
                        />
                      </div>
                    </div>

                    {/* Duration Badge */}
                    {video.duration && (
                      <div className="absolute bottom-3 right-3 bg-black/75 text-white px-2 py-1 rounded text-sm font-semibold">
                        {video.duration}
                      </div>
                    )}
                  </div>

                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {video.viewCount.toLocaleString()} views
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              More Videos Coming Soon!
            </h3>
            <p className="text-gray-600">
              We're working on adding more fun and educational content for your
              kids.
            </p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/90 text-white rounded-full p-1.5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Player */}
            {activeVideo.videoType === "UPLOAD" ||
            !getYouTubeEmbedUrl(activeVideo.videoUrl) ? (
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full aspect-video bg-black"
                controlsList="nodownload"
              />
            ) : (
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.videoUrl)!}
                className="w-full aspect-video"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            )}

            {/* Title */}
            <div className="p-4 bg-gray-900">
              <h3 className="text-white font-bold text-lg">
                {activeVideo.title}
              </h3>
              {activeVideo.description && (
                <p className="text-gray-400 text-sm mt-1">
                  {activeVideo.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
