import { motion } from 'framer-motion';
import { usePostsCarousel } from '../../../hooks/usePostsCarousel';
import { useVideoPlayer } from '../../../hooks/useVideoPlayer';
import { PostCard } from './PostCard';

export const SocialCard = () => {
  const {
    posts,
    currentPost,
    currentPostIndex,
    isLoading,
    direction,
    setDirection,
    setCurrentPostIndex,
    nextPost,
    prevPost,
  } = usePostsCarousel(5000);

  const { playingVideo, setPlayingVideo, stopVideo } = useVideoPlayer();

  if (isLoading || posts.length === 0) return null;

  const handleNextPost = () => {
    nextPost();
    stopVideo();
  };

  const handlePrevPost = () => {
    prevPost();
    stopVideo();
  };

  const handleSetIndex = (index: number) => {
    setCurrentPostIndex(index);
    stopVideo();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="hidden md:block md:col-span-12 lg:col-span-4 md:mt-8 lg:mt-0"
    >
      {currentPost && (
        <PostCard
          post={currentPost}
          direction={direction}
          currentPostIndex={currentPostIndex}
          postsLength={posts.length}
          playingVideo={playingVideo}
          onPlayVideo={() => setPlayingVideo(true)}
          onPrevPost={handlePrevPost}
          onNextPost={handleNextPost}
          onSetIndex={handleSetIndex}
          onSetDirection={setDirection}
        />
      )}
    </motion.div>
  );
};
