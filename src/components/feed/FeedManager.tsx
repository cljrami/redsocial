import React, { useState, useEffect } from 'react';
import StoriesBar from './StoriesBar';
import PostInputTrigger from './PostInputTrigger';
import CreatePostModal from './CreatePostModal';
import PostCard from './PostCard';
import PostSkeleton from './PostSkeleton';

interface FeedManagerProps {
  showStories?: boolean; // Propiedad para controlar la visibilidad
}

export default function FeedManager({ showStories = true }: FeedManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [postToView, setPostToView] = useState<any>(null);
  const [user, setUser] = useState({ id: 0, name: "Usuario", profile_photo: "" });

  const fetchStories = async () => {
    // Si la prop es falsa, no cargamos nada
    if (!showStories) return;
    
    try {
      const res = await fetch('/api/stories/get_active.php');
      const data = await res.json();
      setStories(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  const fetchPosts = async (isSilent = false) => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    const userId = session.id || 0;
    if (!isSilent) setLoading(true);

    try {
      const res = await fetch(`/api/posts/get_all.php?user_id=${userId}&t=${Date.now()}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    if (session.id) setUser(session);

    fetchStories();
    fetchPosts();

    const handleUpdate = () => {
      fetchPosts(true);
      if (showStories) fetchStories();
    }; 
    window.addEventListener('user_session_updated', handleUpdate);
    return () => window.removeEventListener('user_session_updated', handleUpdate);
  }, [showStories]); // Muy importante: re-ejecutar si la prop cambia

  return (
    <div className="max-w-[680px] mx-auto w-full px-2 md:px-0">
      
      {/* RENDERIZADO CONDICIONAL ESTRICTO */}
      {showStories && (
        <div className="mt-4 mb-4">
          <StoriesBar stories={stories} user={user} />
        </div>
      )}

      <PostInputTrigger 
        onClick={() => { setPostToView(null); setIsModalOpen(true); }} 
        userName={user.name} 
        userPhoto={user.profile_photo}
      />
      
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setPostToView(null); }} 
        onPostSuccess={() => fetchPosts(true)}
        user={user}
        postToView={postToView} 
      />

      <div className="space-y-4 mt-4 pb-12">
        {loading ? (
          <><PostSkeleton /><PostSkeleton /></>
        ) : (
          posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onOpenComments={() => { setPostToView(post); setIsModalOpen(true); }} 
            />
          ))
        )}
      </div>
    </div>
  );
}