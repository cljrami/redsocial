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
  const [user, setUser] = useState({ id: 0, name: "Usuario" });

  const fetchPosts = async () => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    const userId = session.id || 0;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/get_all.php?user_id=${userId}&t=${Date.now()}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) { console.error("Error al cargar posts:", e); } finally { setLoading(false); }
  };

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    if (session.id) setUser(session);
    fetchPosts();
    window.addEventListener('user_session_updated', fetchPosts);
    return () => window.removeEventListener('user_session_updated', fetchPosts);
  }, []);

  // Lógica para Auto-Scroll al recibir un post_id por URL [cite: 2026-02-05]
  useEffect(() => {
    if (!loading && posts.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const targetId = urlParams.get('post_id');
      if (targetId) {
        setTimeout(() => {
          const element = document.getElementById(`post-${targetId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-4', 'ring-blue-500/50'); // Resaltado temporal
            setTimeout(() => element.classList.remove('ring-4', 'ring-blue-500/50'), 3000);
          }
        }, 600);
      }
    }
  }, [loading, posts]);

  const handleOpenComments = (post: any) => {
    setPostToView(post);
    setIsModalOpen(true);
  };

  return (
    <>
      <PostInputTrigger 
        onClick={() => { setPostToView(null); setIsModalOpen(true); }} 
        userName={user.name} 
      />
      
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setPostToView(null); }} 
        onPostSuccess={fetchPosts}
        user={user}
        postToView={postToView} 
      />

      <div className="space-y-4 mt-4 pb-12">
        {loading ? (
          <><PostSkeleton /><PostSkeleton /></>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onOpenComments={() => handleOpenComments(post)} 
            />
          ))
        ) : (
          <div className="bg-white p-12 rounded-xl text-center text-gray-400 border shadow-sm">
            No hay publicaciones en la villa.
          </div>
        )}
      </div>
    </>
  );
}