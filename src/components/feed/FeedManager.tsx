import React, { useState, useEffect } from 'react';
import PostInputTrigger from './PostInputTrigger';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';

export default function FeedManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postToView, setPostToView] = useState<any>(null);
  const [user, setUser] = useState({ id: 1, name: "Administrador" });

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/get_all.php?user_id=${user.id}&t=${Date.now()}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  // Función crítica: Abre el modal y le pasa el post seleccionado [cite: 2026-02-04]
  const openComments = (post: any) => {
    setPostToView(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPostToView(null);
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('user_session_updated', fetchPosts);
    return () => window.removeEventListener('user_session_updated', fetchPosts);
  }, []);

  return (
    <div className="max-w-[580px] mx-auto pt-6 px-4">
      <PostInputTrigger 
        onClick={() => setIsModalOpen(true)} 
        userName={user.name} 
      />

      {/* El Modal que ahora recibe el postToView para mostrar comentarios [cite: 2026-02-04] */}
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onPostSuccess={fetchPosts}
        user={user}
        postToView={postToView} 
      />

      <div className="space-y-4 mt-4 pb-10">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onOpenComments={() => openComments(post)} 
            />
          ))
        )}
      </div>
    </div>
  );
}