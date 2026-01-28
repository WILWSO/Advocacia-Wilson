import { useState } from 'react';

interface UseVideoPlayerReturn {
  playingVideo: boolean;
  setPlayingVideo: (playing: boolean) => void;
  stopVideo: () => void;
}

export const useVideoPlayer = (): UseVideoPlayerReturn => {
  const [playingVideo, setPlayingVideo] = useState(false);

  const stopVideo = () => setPlayingVideo(false);

  return {
    playingVideo,
    setPlayingVideo,
    stopVideo,
  };
};
