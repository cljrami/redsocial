import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bkis9C0d.mjs';
import 'piccolore';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DSKr1Ere.mjs';
import { N as Navbar, F as FeedManager } from '../chunks/FeedManager_DoeIjIL1.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
export { renderers } from '../renderers.mjs';

function ProfileHeader() {
  const [userData, setUserData] = useState({
    profile_photo: "",
    cover_photo: "",
    name: "Administrador"
  });
  const syncData = () => {
    const session = JSON.parse(localStorage.getItem("user_session") || "{}");
    setUserData({
      profile_photo: session.profile_photo || "",
      cover_photo: session.cover_photo || "",
      name: session.name || "Administrador"
    });
  };
  useEffect(() => {
    syncData();
    window.addEventListener("user_session_updated", syncData);
    return () => window.removeEventListener("user_session_updated", syncData);
  }, []);
  const handleUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("type", type);
    formData.append("user_id", "1");
    try {
      const res = await fetch("/api/user/update_photos.php", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        const session = JSON.parse(localStorage.getItem("user_session") || "{}");
        session[type === "profile" ? "profile_photo" : "cover_photo"] = data.url;
        localStorage.setItem("user_session", JSON.stringify(session));
        window.dispatchEvent(new Event("user_session_updated"));
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-white dark:bg-[#242526] shadow-sm border-b dark:border-[#3E4042]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[940px] mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "h-[200px] md:h-[350px] bg-gray-200 dark:bg-[#3A3B3C] relative overflow-hidden md:rounded-b-xl", children: [
      userData.cover_photo && /* @__PURE__ */ jsx("img", { src: userData.cover_photo, className: "w-full h-full object-cover", alt: "Portada" }),
      /* @__PURE__ */ jsxs("label", { className: "absolute bottom-4 right-4 bg-white dark:bg-[#4E4F50] px-4 py-2 rounded-lg shadow-md cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-[#5E5F60] transition-all font-bold dark:text-white z-20", children: [
        /* @__PURE__ */ jsx(Camera, { size: 20 }),
        /* @__PURE__ */ jsx("span", { className: "hidden md:inline text-sm", children: "Editar foto de portada" }),
        /* @__PURE__ */ jsx("input", { type: "file", className: "hidden", onChange: (e) => handleUpload(e, "cover"), accept: "image/*" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 pb-6 flex flex-col items-center md:items-end md:flex-row -mt-12 md:-mt-16 relative z-10 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
        /* @__PURE__ */ jsx("div", { className: "w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-[#242526] bg-gray-800 overflow-hidden shadow-xl flex items-center justify-center text-white text-5xl font-bold", children: userData.profile_photo ? /* @__PURE__ */ jsx("img", { src: userData.profile_photo, className: "w-full h-full object-cover", alt: "Perfil" }) : "A" }),
        /* @__PURE__ */ jsxs("label", { className: "absolute bottom-2 right-2 bg-gray-200 dark:bg-[#3A3B3C] p-2 rounded-full border-4 border-white dark:border-[#242526] cursor-pointer shadow-md hover:scale-110 transition-transform z-20 flex items-center justify-center", children: [
          /* @__PURE__ */ jsx(Camera, { size: 20, className: "dark:text-white text-gray-700" }),
          /* @__PURE__ */ jsx("input", { type: "file", className: "hidden", onChange: (e) => handleUpload(e, "profile"), accept: "image/*" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center md:text-left flex-1 pb-2", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-extrabold dark:text-white", children: "Administrador" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 dark:text-gray-400 font-bold", children: "0 seguidores • 0 seguidos" })
      ] })
    ] })
  ] }) });
}

const $$Perfil = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Perfil de Administrador" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", Navbar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Navbar", "client:component-export": "default" })} ${maybeRenderHead()}<main class="bg-[#F0F2F5] dark:bg-[#18191A] min-h-screen pt-14 pb-10 transition-colors"> ${renderComponent($$result2, "ProfileHeader", ProfileHeader, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/components/profile/ProfileHeader", "client:component-export": "default" })} <div class="max-w-[1030px] mx-auto mt-4 px-4 flex flex-col lg:flex-row gap-4"> <aside class="w-full lg:w-[390px]"> <div class="sticky top-[72px] space-y-4"> <div class="bg-white dark:bg-[#242526] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042]"> <h2 class="text-xl font-bold mb-3 dark:text-white">Detalles</h2> <div class="text-[15px] dark:text-gray-300 space-y-3"> <p class="italic text-gray-500 dark:text-gray-400">
Gestión Profesional de Condominios.
</p> <hr class="dark:border-[#3E4042]"> <div class="flex items-center gap-2">
📍 <span>Vive en <b>Concepción, Chile</b></span> </div> </div> <button class="w-full bg-gray-100 dark:bg-[#3A3B3C] dark:text-white hover:bg-gray-200 py-2 rounded-lg mt-4 font-bold">Editar detalles</button> </div> <div class="bg-white dark:bg-[#242526] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042]"> <div class="flex justify-between items-center mb-3"> <h2 class="text-xl font-bold dark:text-white">Fotos</h2> <button class="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded text-sm font-semibold">Ver todas</button> </div> <div class="grid grid-cols-3 gap-1 rounded-lg overflow-hidden bg-gray-100 dark:bg-[#3A3B3C]"> <div class="aspect-square bg-gray-300 dark:bg-[#4E4F50]"></div> <div class="aspect-square bg-gray-300 dark:bg-[#4E4F50]"></div> <div class="aspect-square bg-gray-300 dark:bg-[#4E4F50]"></div> <div class="aspect-square bg-gray-300 dark:bg-[#4E4F50]"></div> <div class="aspect-square bg-gray-300 dark:bg-[#4E4F50]"></div> <div class="aspect-square bg-gray-300 dark:bg-[#4E4F50]"></div> </div> </div> <div class="bg-white dark:bg-[#242526] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-[#3E4042]"> <div class="flex justify-between items-center mb-1"> <h2 class="text-xl font-bold dark:text-white">Amigos</h2> <button class="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2 py-1 rounded text-sm font-semibold">Ver todos</button> </div> <p class="text-gray-500 dark:text-gray-400 text-sm mb-3">
0 amigos
</p> <div class="grid grid-cols-3 gap-3"> <div class="flex flex-col gap-1"> <div class="aspect-square bg-gray-200 dark:bg-[#3A3B3C] rounded-lg"></div> <span class="text-[12px] font-semibold dark:text-white truncate">Vecino 1</span> </div> </div> </div> </div> </aside> <section class="flex-1 min-w-0"> ${renderComponent($$result2, "FeedManager", FeedManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/components/feed/FeedManager", "client:component-export": "default" })} </section> </div> </main> ` })}`;
}, "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/pages/perfil.astro", void 0);

const $$file = "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/pages/perfil.astro";
const $$url = "/perfil";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Perfil,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
