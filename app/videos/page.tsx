"use client";

import { Play, Sparkles } from "lucide-react";
import Link from "next/link";

export default function VideosPage() {
  // Placeholder videos - will be replaced with admin-managed content
  const videos = [
    {
      id: "1",
      title: "New Toy Collection Unboxing",
      thumbnail: "🎁",
      duration: "5:32",
      views: "12K",
    },
    {
      id: "2",
      title: "Learning Toys For Toddlers",
      thumbnail: "🧸",
      duration: "4:15",
      views: "8.5K",
    },
    {
      id: "3",
      title: "Building Blocks Fun Activity",
      thumbnail: "🏗️",
      duration: "6:20",
      views: "15K",
    },
    {
      id: "4",
      title: "Arts & Crafts Tutorial",
      thumbnail: "🎨",
      duration: "7:45",
      views: "10K",
    },
    {
      id: "5",
      title: "Outdoor Play Equipment Review",
      thumbnail: "⚽",
      duration: "5:50",
      views: "11K",
    },
    {
      id: "6",
      title: "Educational Games Collection",
      thumbnail: "🎲",
      duration: "8:12",
      views: "9.2K",
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              href="#"
              className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border-2 border-gray-100 hover:border-purple-300"
            >
              {/* Video Thumbnail */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                <span className="text-8xl">{video.thumbnail}</span>

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
                <div className="absolute bottom-3 right-3 bg-black/75 text-white px-2 py-1 rounded text-sm font-semibold">
                  {video.duration}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600">{video.views} views</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="mt-12 text-center bg-white rounded-2xl p-8 shadow-md">
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            More Videos Coming Soon!
          </h3>
          <p className="text-gray-600">
            We're working on adding more fun and educational content for your
            kids.
          </p>
        </div>
      </div>
    </div>
  );
}
