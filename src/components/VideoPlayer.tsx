
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  return (
    <div className="relative bg-black rounded-xl overflow-hidden">
      <video
        src={videoUrl}
        controls
        autoPlay
        muted
        className="w-full max-h-96 object-contain"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
