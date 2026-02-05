import { c as createComponent, r as renderComponent, a as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_Bkis9C0d.mjs';
import 'piccolore';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DSKr1Ere.mjs';
import { N as Navbar, F as FeedManager } from '../chunks/FeedManager_DoeIjIL1.mjs';
export { renderers } from '../renderers.mjs';

const $$Feed = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Muro de la Comunidad | La Foresta" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Navbar", Navbar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/layouts/Navbar", "client:component-export": "default" })} ${maybeRenderHead()}<main class="bg-[#F0F2F5] dark:bg-[#18191A] min-h-screen pt-14 transition-colors duration-300"> <div class="max-w-[1250px] mx-auto mt-6 px-4 flex flex-col lg:flex-row gap-8"> <aside class="hidden lg:block w-[280px]"> <div class="sticky top-[76px] space-y-4"> <div class="bg-white dark:bg-[#242526] rounded-2xl shadow-sm border border-gray-200 dark:border-[#3E4042] p-4"> <a href="/perfil" class="flex items-center gap-4 p-2 hover:bg-gray-50 dark:hover:bg-[#3A3B3C] rounded-xl group transition-all"> <div class="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl border-2 border-white dark:border-[#4E4F50] overflow-hidden">
A
</div> <div class="overflow-hidden"> <p class="font-bold text-gray-900 dark:text-white truncate">
Administrador
</p> <p class="text-xs text-blue-600 font-bold group-hover:underline">
Mi Perfil
</p> </div> </a> </div> <nav class="space-y-1"> <div class="flex items-center gap-4 p-3 hover:bg-gray-200 dark:hover:bg-[#3A3B3C] rounded-xl cursor-pointer font-semibold dark:text-gray-200 transition-colors"> <span class="text-2xl">👥</span> Vecinos
</div> <div class="flex items-center gap-4 p-3 hover:bg-gray-200 dark:hover:bg-[#3A3B3C] rounded-xl cursor-pointer font-semibold dark:text-gray-200 transition-colors"> <span class="text-2xl">🛒</span> Marketplace
</div> <div class="flex items-center gap-4 p-3 hover:bg-gray-200 dark:hover:bg-[#3A3B3C] rounded-xl cursor-pointer font-bold text-blue-600"> <span class="text-2xl">🛡️</span> S.I. Protection
</div> </nav> </div> </aside> <section class="flex-1 min-w-0 pb-20"> <div class="max-w-[580px] mx-auto">  ${renderComponent($$result2, "FeedManager", FeedManager, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/components/feed/FeedManager", "client:component-export": "default" })} </div> </section> <aside class="hidden xl:block w-[320px]"> <div class="sticky top-[76px] space-y-6"> <div class="bg-white dark:bg-[#242526] rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-[#3E4042]"> <h3 class="text-gray-500 dark:text-gray-400 font-bold text-sm uppercase mb-4 px-1">
Estado del Condominio
</h3> <div class="flex items-center gap-3 p-2 bg-green-50 dark:bg-green-900/10 rounded-xl"> <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div> <span class="text-sm font-bold text-green-700 dark:text-green-400">Conserjería Activa</span> </div> </div> <div class="px-2"> <h3 class="text-gray-500 dark:text-gray-400 font-bold text-sm mb-4 px-2 uppercase tracking-wider">
Publicidad
</h3> <div class="space-y-5"> <div class="group cursor-pointer"> <div class="relative h-44 w-full rounded-2xl overflow-hidden mb-2 shadow-md border dark:border-[#3E4042]"> <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div> <img src="https://images.unsplash.com/photo-1557597774-9d2739f85a94?q=80&w=400" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"> <div class="absolute bottom-3 left-3 z-20"> <span class="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Sponsor</span> <p class="text-white font-bold text-md mt-1">
S.I. Protection
</p> </div> </div> <p class="text-[13px] text-gray-600 dark:text-gray-400 px-2 leading-relaxed">
Protección profesional 24/7. Tu seguridad es nuestra
                  prioridad.
</p> </div> <hr class="border-gray-200 dark:border-[#3E4042] mx-2"> <div class="flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-[#3A3B3C] rounded-xl transition-all cursor-pointer group"> <div class="w-16 h-16 rounded-lg bg-orange-100 flex-shrink-0 overflow-hidden border dark:border-[#3E4042]"> <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=150" class="w-full h-full object-cover group-hover:scale-110 transition-transform"> </div> <div class="flex-1"> <p class="font-bold text-[14px] dark:text-white truncate">
Pizzería La Foresta
</p> <p class="text-xs text-blue-600 font-semibold">Pedir ahora</p> </div> </div> </div> </div> <div class="space-y-3 px-2"> <h3 class="text-gray-500 dark:text-gray-400 font-bold text-sm px-2">
Emergencias
</h3> <div class="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/10 rounded-xl cursor-pointer hover:bg-red-100 transition-colors"> <span class="text-xl">🚑</span> <span class="font-bold text-red-600 dark:text-red-400 text-sm">Ambulancia Directa</span> </div> </div> </div> </aside> </div> </main> ` })}`;
}, "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/pages/feed.astro", void 0);

const $$file = "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/pages/feed.astro";
const $$url = "/feed";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Feed,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
