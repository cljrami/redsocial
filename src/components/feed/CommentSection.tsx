import React, { useState, useEffect } from 'react';

export default function CommentSection({ postId, user }: any) {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const fetchComments = async () => {
    const res = await fetch(`/api/comments/get.php?post_id=${postId}&user_id=${user.id}`);
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => { 
    fetchComments();
    window.addEventListener('user_session_updated', fetchComments);
    return () => window.removeEventListener('user_session_updated', fetchComments);
  }, [postId]);

  const handleSend = async () => {
    if (!newComment.trim()) return;

    const optimisticComment = {
      id: Date.now(),
      full_name: user.name || "Administrador",
      content: newComment,
      created_at: new Date().toISOString(),
      is_temp: true 
    };

    setComments(prev => [...prev, optimisticComment]);
    const savedText = newComment;
    setNewComment('');

    try {
      await fetch('/api/comments/save.php', {
        method: 'POST',
        body: JSON.stringify({ post_id: postId, user_id: user.id, content: savedText }),
        headers: { 'Content-Type': 'application/json' }
      });
      fetchComments();
    } catch (error) {
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id));
    }
  };

  return (
    <div className="bg-white dark:bg-[#242526] p-4 border-t dark:border-[#3E4042]">
      <div className="space-y-4 mb-4">
        {comments.map((c) => (
          <div key={c.id} className={`flex gap-2 ${c.is_temp ? 'opacity-50' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center text-white text-[12px] font-bold overflow-hidden">
               {user.profile_photo ? <img src={user.profile_photo} className="w-full h-full object-cover" /> : c.full_name[0]}
            </div>
            <div className="flex flex-col">
              <div className="bg-gray-100 dark:bg-[#3A3B3C] rounded-2xl px-3 py-2">
                <p className="text-[13px] font-bold dark:text-white leading-tight">{c.full_name}</p>
                <p className="text-[14px] dark:text-gray-200">{c.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Escribe un comentario..." 
          className="flex-1 bg-gray-100 dark:bg-[#3A3B3C] dark:text-white rounded-full px-4 py-2 outline-none"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
      </div>
    </div>
  );
}