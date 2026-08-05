"use client";

import React, { useState, useEffect } from "react";

interface YoutubeWidgetProps {
  destination: string;
}

interface Video {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export default function YoutubeWidget({ destination }: YoutubeWidgetProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!destination || destination === "Destination") return;

    const fetchVideos = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/youtube?destination=${encodeURIComponent(destination)}`
        );
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          setVideos(data.videos);
        } else {
          setError("No videos found for this destination.");
        }
      } catch (err: any) {
        setError(err.message || "Could not load travel videos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [destination]);

  if (isLoading) {
    return (
      <div className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 flex items-center justify-center min-h-[140px]">
        <div className="flex flex-col items-center space-y-3">
          <span className="flex h-4 w-4 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
          <p className="text-xs text-red-400 tracking-widest uppercase font-bold animate-pulse">
            Loading travel videos...
          </p>
        </div>
      </div>
    );
  }

  if (error || videos.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-red-600/10">
        <div className="flex items-center space-x-2">
          {/* YouTube Icon */}
          <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-white/80">
            Travel Videos — {destination}
          </h4>
        </div>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">
          YouTube
        </span>
      </div>

      {/* Video Grid */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {videos.map((video) => (
          <div key={video.videoId} className="flex flex-col rounded-xl overflow-hidden border border-white/10 bg-black/30 group">
            {activeVideo === video.videoId ? (
              /* Inline YouTube Embed */
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Thumbnail with Play Button */
              <div
                className="relative w-full cursor-pointer"
                style={{ paddingTop: "56.25%" }}
                onClick={() => setActiveVideo(video.videoId)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)] group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-5 h-5 text-white ml-1" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            )}

            {/* Video Info */}
            <div className="px-3 py-2.5 flex flex-col space-y-1">
              <p
                className="text-white text-xs font-semibold leading-snug line-clamp-2 cursor-pointer hover:text-red-400 transition-colors"
                onClick={() => setActiveVideo(video.videoId)}
                title={video.title}
              >
                {video.title}
              </p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider truncate">
                {video.channelTitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
