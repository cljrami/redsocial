import React, { useState, useEffect } from 'react';
import PostInputTrigger from './PostInputTrigger';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';

export default function FeedManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      setTimeout(() => setLoading(false), 800);
    }
  };

  useEffect(() => {
    fetchPosts();
    window.addEventListener('user_session_updated', fetchPosts);
    return () => window.removeEventListener('user_session_updated', fetchPosts);
  }, []);

  return (
    <>
      {/* CUADRO PARA PUBLICAR */}
      <PostInputTrigger 
        onClick={() => setIsModalOpen(true)} 
        userName={user.name} 
      />

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPostSuccess={fetchPosts}
        user={user}
      />

      {/* LISTA DE PUBLICACIONES */}
      <div className="space-y-4 mt-4">
        {loading ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : posts.map((post) => (
          <PostCard key={post.id} post={post} onOpenComments={() => {}} />
        ))}
      </div>
    </>
  );
}