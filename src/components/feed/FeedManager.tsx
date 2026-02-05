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
  const [user, setUser] = useState({ id: null, name: "Usuario" });

  const fetchPosts = async (userId: any) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/get_all.php?user_id=${userId}&t=${Date.now()}`);
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  };

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    if (session.id) {
      setUser(session);
      fetchPosts(session.id);
    }
    
    const handleUpdate = () => {
      const updatedSession = JSON.parse(localStorage.getItem("user_session") || "{}");
      setUser(updatedSession);
      fetchPosts(updatedSession.id);
    };

    window.addEventListener('user_session_updated', handleUpdate);
    return () => window.removeEventListener('user_session_updated', handleUpdate);
  }, []);

  return (
    <>
      <PostInputTrigger onClick={() => setIsModalOpen(true)} userName={user.name} />
      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setPostToView(null); }} 
        onPostSuccess={() => fetchPosts(user.id)}
        user={user}
        postToView={postToView}
      />
      <div className="space-y-4 mt-4 pb-10">
        {loading ? (
          <><PostSkeleton /><PostSkeleton /></>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} onOpenComments={() => { setPostToView(post); setIsModalOpen(true); }} />
          ))
        )}
      </div>
    </>
  );
}