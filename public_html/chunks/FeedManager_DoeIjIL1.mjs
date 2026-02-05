import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useRef } from 'react';
import { Search, Bell, ChevronDown, Sun, Moon, LogOut, Video, Image, Laugh, X, Users, Globe, FileText } from 'lucide-react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [adminData, setAdminData] = useState({ name: "Administrador", photo: null });
  const loadSession = () => {
    const session = localStorage.getItem("user_session");
    if (session) {
      const userData = JSON.parse(session);
      setAdminData({
        name: userData.name || "Administrador",
        photo: userData.profile_photo || null
      });
    }
  };
  useEffect(() => {
    loadSession();
    window.addEventListener("user_session_updated", loadSession);
    const isDark = localStorage.getItem("theme") === "dark" || !("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(isDark);
    if (isDark) document.documentElement.classList.add("dark");
    return () => window.removeEventListener("user_session_updated", loadSession);
  }, []);
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };
  return /* @__PURE__ */ jsxs("nav", { className: "fixed top-0 z-[150] w-full bg-white dark:bg-[#242526] shadow-sm border-b border-gray-200 dark:border-[#3E4042] h-14 flex items-center px-4 justify-between transition-colors", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-blue-600 rounded-full p-1 cursor-pointer", onClick: () => window.location.href = "/feed", children: /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", className: "w-8 h-8 text-white fill-current", children: /* @__PURE__ */ jsx("path", { d: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex items-center bg-gray-100 dark:bg-[#3A3B3C] rounded-full px-3 py-2 gap-2 w-64", children: [
        /* @__PURE__ */ jsx(Search, { size: 18, className: "text-gray-500" }),
        /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Buscar...", className: "bg-transparent border-none outline-none text-[15px] w-full dark:text-gray-200" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 flex-1 justify-end", children: [
      /* @__PURE__ */ jsx("button", { className: "p-2 bg-gray-200 dark:bg-[#3A3B3C] dark:text-white rounded-full", children: /* @__PURE__ */ jsx(Bell, { size: 20 }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => setIsOpen(!isOpen), className: "flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-[#4E4F50] p-1 rounded-full relative", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-200 overflow-hidden shadow-sm", children: adminData.photo ? /* @__PURE__ */ jsx("img", { src: adminData.photo, className: "w-full h-full object-cover" }) : "A" }),
          /* @__PURE__ */ jsx(ChevronDown, { size: 14, className: "dark:text-white" })
        ] }),
        isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute right-0 mt-2 w-80 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-200 dark:border-[#3E4042] p-2", children: [
          /* @__PURE__ */ jsxs("a", { href: "/perfil", className: "flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl overflow-hidden", children: adminData.photo ? /* @__PURE__ */ jsx("img", { src: adminData.photo, className: "w-full h-full object-cover" }) : "A" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold dark:text-white", children: adminData.name }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Ver perfil" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("hr", { className: "my-2 dark:border-[#3E4042]" }),
          /* @__PURE__ */ jsxs("button", { onClick: toggleDarkMode, className: "w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg dark:text-white font-medium", children: [
            darkMode ? /* @__PURE__ */ jsx(Sun, { size: 20 }) : /* @__PURE__ */ jsx(Moon, { size: 20 }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Modo ",
              darkMode ? "Claro" : "Oscuro"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg text-red-600 font-medium", children: [
            /* @__PURE__ */ jsx(LogOut, { size: 20 }),
            /* @__PURE__ */ jsx("span", { children: "Cerrar sesión" })
          ] })
        ] })
      ] })
    ] })
  ] });
}

function PostInputTrigger({ onClick, userName }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-3", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold", children: userName[0] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick,
          className: "flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2.5 text-left text-gray-500 text-[15px]",
          children: [
            "¿Qué estás pensando, ",
            userName,
            "?"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-1 border-t pt-2", children: [
      /* @__PURE__ */ jsxs("button", { onClick, className: "flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-red-500 font-semibold text-sm transition-colors", children: [
        /* @__PURE__ */ jsx(Video, { size: 20 }),
        " Video en vivo"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick, className: "flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-green-500 font-semibold text-sm transition-colors", children: [
        /* @__PURE__ */ jsx(Image, { size: 20 }),
        " Foto/video"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick, className: "flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-50 rounded-lg text-yellow-500 font-semibold text-sm transition-colors", children: [
        /* @__PURE__ */ jsx(Laugh, { size: 20 }),
        " Sentimiento/actividad"
      ] })
    ] })
  ] });
}

function CommentSection({ postId, user }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const fetchComments = async () => {
    const res = await fetch(`/api/comments/get.php?post_id=${postId}&user_id=${user.id}`);
    const data = await res.json();
    setComments(data);
  };
  useEffect(() => {
    fetchComments();
    window.addEventListener("user_session_updated", fetchComments);
    return () => window.removeEventListener("user_session_updated", fetchComments);
  }, [postId]);
  const handleSend = async () => {
    if (!newComment.trim()) return;
    const optimisticComment = {
      id: Date.now(),
      full_name: user.name || "Administrador",
      content: newComment,
      created_at: (/* @__PURE__ */ new Date()).toISOString(),
      is_temp: true
    };
    setComments((prev) => [...prev, optimisticComment]);
    const savedText = newComment;
    setNewComment("");
    try {
      await fetch("/api/comments/save.php", {
        method: "POST",
        body: JSON.stringify({ post_id: postId, user_id: user.id, content: savedText }),
        headers: { "Content-Type": "application/json" }
      });
      fetchComments();
    } catch (error) {
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id));
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#242526] p-4 border-t dark:border-[#3E4042]", children: [
    /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-4", children: comments.map((c) => /* @__PURE__ */ jsxs("div", { className: `flex gap-2 ${c.is_temp ? "opacity-50" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center text-white text-[12px] font-bold overflow-hidden", children: user.profile_photo ? /* @__PURE__ */ jsx("img", { src: user.profile_photo, className: "w-full h-full object-cover" }) : c.full_name[0] }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-100 dark:bg-[#3A3B3C] rounded-2xl px-3 py-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[13px] font-bold dark:text-white leading-tight", children: c.full_name }),
        /* @__PURE__ */ jsx("p", { className: "text-[14px] dark:text-gray-200", children: c.content })
      ] }) })
    ] }, c.id)) }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx(
      "input",
      {
        type: "text",
        placeholder: "Escribe un comentario...",
        className: "flex-1 bg-gray-100 dark:bg-[#3A3B3C] dark:text-white rounded-full px-4 py-2 outline-none",
        value: newComment,
        onChange: (e) => setNewComment(e.target.value),
        onKeyDown: (e) => e.key === "Enter" && handleSend()
      }
    ) })
  ] });
}

function CreatePostModal({ isOpen, onClose, onPostSuccess, user, postToView }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  if (!isOpen) return null;
  const isViewing = !!postToView;
  const handlePost = async () => {
    if (!content.trim() && !image) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("content", content);
    formData.append("user_id", user.id);
    if (image) formData.append("image", image);
    try {
      const res = await fetch("/api/posts/save.php", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        setContent("");
        setImage(null);
        setPreview(null);
        await onPostSuccess();
        onClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/90 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs("div", { className: "bg-white w-full max-w-[600px] rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative p-4 border-b text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900", children: isViewing ? "Publicación" : "Crear publicación" }),
      /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute right-4 top-3.5 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 overflow-y-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold", children: isViewing ? postToView.full_name[0] : user.name[0] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: isViewing ? postToView.full_name : user.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-md text-[12px] font-bold text-gray-600", children: [
            /* @__PURE__ */ jsx(Users, { size: 12 }),
            " Amigos ",
            /* @__PURE__ */ jsx(Globe, { size: 10 })
          ] })
        ] })
      ] }),
      isViewing ? /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx("p", { className: "text-gray-800 text-lg", children: postToView.content }),
        postToView.image_url && /* @__PURE__ */ jsx("img", { src: postToView.image_url, className: "w-full rounded-xl border" }),
        /* @__PURE__ */ jsx("div", { className: "mt-6 border-t pt-4", children: /* @__PURE__ */ jsx(CommentSection, { postId: postToView.id, user }) })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(
          "textarea",
          {
            autoFocus: true,
            className: "w-full text-xl placeholder-gray-400 border-none focus:ring-0 min-h-[120px] resize-none",
            placeholder: `¿Qué estás pensando, ${user.name}?`,
            value: content,
            onChange: (e) => setContent(e.target.value)
          }
        ),
        preview && /* @__PURE__ */ jsxs("div", { className: "relative mb-4 rounded-xl overflow-hidden border", children: [
          /* @__PURE__ */ jsx("img", { src: preview, className: "w-full h-auto max-h-64 object-cover" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setImage(null);
            setPreview(null);
          }, className: "absolute top-2 right-2 p-1.5 bg-white rounded-full", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border rounded-xl p-3 flex items-center justify-between mb-5", children: [
          /* @__PURE__ */ jsx("span", { className: "font-bold text-[15px]", children: "Agregar a tu publicación" }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsx("input", { type: "file", hidden: true, ref: fileInputRef, accept: "image/*", onChange: (e) => {
              const f = e.target.files?.[0];
              if (f) {
                setImage(f);
                setPreview(URL.createObjectURL(f));
              }
            } }),
            /* @__PURE__ */ jsx("button", { onClick: () => fileInputRef.current?.click(), className: "p-2 text-green-500 hover:bg-gray-100 rounded-full", children: /* @__PURE__ */ jsx(Image, { size: 24 }) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handlePost,
            disabled: loading || !content.trim() && !image,
            className: "w-full py-2.5 rounded-lg font-bold text-white bg-[#1877F2] hover:bg-[#166fe5] disabled:bg-gray-200",
            children: loading ? "Publicando..." : "Publicar"
          }
        )
      ] })
    ] })
  ] }) });
}

function PostCard({ post, onOpenComments }) {
  const isPDF = post.image_url?.toLowerCase().endsWith(".pdf");
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] overflow-hidden mb-4", children: [
    /* @__PURE__ */ jsx("div", { className: "p-4" }),
    /* @__PURE__ */ jsx("div", { className: "px-4 pb-3 text-gray-800 dark:text-gray-200", children: post.content }),
    post.image_url && /* @__PURE__ */ jsx("div", { className: "cursor-pointer bg-gray-50 dark:bg-[#3A3B3C] border-y dark:border-[#3E4042]", onClick: onOpenComments, children: isPDF ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-6 bg-gray-100 dark:bg-[#4E4F50] rounded-xl m-4 border dark:border-[#3E4042]", children: [
      /* @__PURE__ */ jsx("div", { className: "p-3 bg-red-100 rounded-lg text-red-600", children: /* @__PURE__ */ jsx(FileText, { size: 40 }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-hidden", children: [
        /* @__PURE__ */ jsx("p", { className: "font-bold dark:text-white truncate", children: "Documento Adjunto" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "Haga clic para ver detalles" })
      ] })
    ] }) : /* @__PURE__ */ jsx("img", { src: post.image_url, className: "w-full max-h-[500px] object-contain" }) })
  ] });
}

function PostSkeleton() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white dark:bg-[#242526] rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042] p-4 mb-4 animate-pulse", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-gray-200 dark:bg-[#3A3B3C]" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 dark:bg-[#3A3B3C] rounded w-1/3" }),
        /* @__PURE__ */ jsx("div", { className: "h-2 bg-gray-100 dark:bg-[#3E4042] rounded w-1/4" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 dark:bg-[#3A3B3C] rounded w-full" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 bg-gray-200 dark:bg-[#3A3B3C] rounded w-5/6" }),
      /* @__PURE__ */ jsx("div", { className: "h-[300px] bg-gray-100 dark:bg-[#3A3B3C] rounded-xl mt-4" })
    ] })
  ] });
}

function FeedManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [posts, setPosts] = useState([]);
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
    window.addEventListener("user_session_updated", fetchPosts);
    return () => window.removeEventListener("user_session_updated", fetchPosts);
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PostInputTrigger,
      {
        onClick: () => setIsModalOpen(true),
        userName: user.name
      }
    ),
    /* @__PURE__ */ jsx(
      CreatePostModal,
      {
        isOpen: isModalOpen,
        onClose: () => setIsModalOpen(false),
        onPostSuccess: fetchPosts,
        user
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "space-y-4 mt-4", children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PostSkeleton, {}),
      /* @__PURE__ */ jsx(PostSkeleton, {})
    ] }) : posts.map((post) => /* @__PURE__ */ jsx(PostCard, { post, onOpenComments: () => {
    } }, post.id)) })
  ] });
}

export { FeedManager as F, Navbar as N };
