import React, { useState, useRef, useEffect } from 'react';
import { X, Users, Loader2 } from 'lucide-react';
import CommentSection from './CommentSection';
import MentionSuggestions from './MentionSuggestions';

export default function CreatePostModal({ isOpen, onClose, onPostSuccess, user, postToView }: any) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [selectedMentions, setSelectedMentions] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (!postToView) {
        setContent('');
        setSelectedMentions([]);
      }
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, postToView]);

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    const cursor = e.target.selectionStart;
    const textBefore = val.substring(0, cursor);
    const lastAt = textBefore.lastIndexOf('@');

    if (lastAt !== -1 && !textBefore.substring(lastAt, cursor).includes(' ')) {
      const query = textBefore.substring(lastAt + 1);
      if (query.length >= 1) {
        const rect = textareaRef.current?.getBoundingClientRect();
        if (rect) {
          setMentionPosition({ top: rect.top + 30, left: rect.left + 10 });
        }
        const res = await fetch(`/api/users/search.php?q=${query}`);
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } else setShowSuggestions(false);
    } else setShowSuggestions(false);
  };

  const insertMention = (u: any) => {
    const cursor = textareaRef.current?.selectionStart || 0;
    const lastAt = content.substring(0, cursor).lastIndexOf('@');
    const textBefore = content.substring(0, lastAt);
    const textAfter = content.substring(cursor);
    
    setContent(textBefore + '@' + u.full_name + ' ' + textAfter);
    setSelectedMentions(prev => [...prev, u]);
    setShowSuggestions(false);
    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  const handlePublish = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);

    let finalContent = content;
    selectedMentions.forEach(m => {
      const mentionTag = `@${m.full_name}`;
      const dbFormat = `@[${m.full_name}](${m.id})`;
      finalContent = finalContent.split(mentionTag).join(dbFormat);
    });

    try {
      const formData = new FormData();
      formData.append('content', finalContent.trim());
      formData.append('user_id', user.id);

      const res = await fetch("/api/posts/save.php", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setContent('');
        setSelectedMentions([]);
        onPostSuccess();
        onClose();
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  if (!isOpen) return null;

  const isViewing = !!postToView;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-scrollbar">
      
      {/* MENCIONES: Se mantienen funcionales */}
      {!isViewing && showSuggestions && (
        <MentionSuggestions 
          users={suggestions} 
          onSelect={insertMention} 
          position={mentionPosition} 
        />
      )}

      <div className="bg-white dark:bg-[#242526] w-full max-w-[600px] rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh] border dark:border-[#3E4042]">
        <div className="p-4 border-b dark:border-[#3E4042] flex justify-between items-center sticky top-0 bg-white dark:bg-[#242526] z-20">
          <h2 className="text-center w-full font-bold text-xl dark:text-white">
            {isViewing ? 'Publicación' : 'Crear publicación'}
          </h2>
          <button onClick={onClose} className="absolute right-4 p-1.5 bg-gray-100 dark:bg-[#3A3B3C] rounded-full dark:text-white cursor-pointer hover:bg-gray-200 transition-colors">
            <X size={20}/>
          </button>
        </div>

        <div className="p-4 overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src={(isViewing ? postToView.profile_photo : user.profile_photo) || '/default-avatar.jpg'} 
              className="w-10 h-10 rounded-full object-cover border cursor-pointer" 
            />
            <div>
              <p className="font-bold dark:text-white cursor-pointer hover:underline">
                {isViewing ? postToView.full_name : user.name}
              </p>
              <span className="flex items-center gap-1 text-[11px] font-bold bg-gray-100 dark:bg-[#3A3B3C] px-2 py-0.5 rounded w-fit dark:text-gray-300">
                <Users size={12}/> Amigos
              </span>
            </div>
          </div>

          {isViewing ? (
            <div className="flex flex-col gap-4">
              <p className="text-[17px] dark:text-white whitespace-pre-wrap leading-snug">
                {postToView.content}
              </p>
              {postToView.image_url && (
                <img src={postToView.image_url} className="w-full rounded-lg border dark:border-[#3E4042]" />
              )}
              <div className="border-t dark:border-[#3E4042] pt-4">
                {/* COMENTARIOS: Aquí se hereda la funcionalidad de ELIMINAR con POPUP */}
                <CommentSection postId={postToView.id} user={user} />
              </div>
            </div>
          ) : (
            <>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleTextChange}
                placeholder={`¿Qué tienes en mente, ${user.name}?`}
                className="w-full min-h-[150px] border-none focus:ring-0 text-lg dark:bg-transparent dark:text-white resize-none no-scrollbar"
              />
              <button 
                onClick={handlePublish}
                disabled={loading || !content.trim()}
                className={`w-full py-2.5 bg-[#1877F2] text-white font-bold rounded-lg mt-4 shadow-lg flex justify-center items-center cursor-pointer hover:bg-blue-600 transition-all ${loading ? 'opacity-70' : ''}`}
              >
                {loading ? <Loader2 className="animate-spin" size={22} /> : 'Publicar'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}