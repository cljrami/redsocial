import{j as e}from"./jsx-runtime.D_zvdyIk.js";import{r as a}from"./index.DYrVU9rO.js";import{c as t}from"./createLucideIcon.DCJxLUv2.js";/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],x=t("bell",u);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],g=t("chevron-down",p);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],b=t("log-out",f);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]],j=t("moon",k);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],w=t("search",v);/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],N=t("sun",y);function A(){const[n,i]=a.useState(!1),[o,l]=a.useState(!1),[r,h]=a.useState({name:"Administrador",photo:null}),d=()=>{const s=localStorage.getItem("user_session");if(s){const c=JSON.parse(s);h({name:c.name||"Administrador",photo:c.profile_photo||null})}};a.useEffect(()=>{d(),window.addEventListener("user_session_updated",d);const s=localStorage.getItem("theme")==="dark"||!("theme"in localStorage)&&window.matchMedia("(prefers-color-scheme: dark)").matches;return l(s),s&&document.documentElement.classList.add("dark"),()=>window.removeEventListener("user_session_updated",d)},[]);const m=()=>{const s=!o;l(s),document.documentElement.classList.toggle("dark"),localStorage.setItem("theme",s?"dark":"light")};return e.jsxs("nav",{className:"fixed top-0 z-[150] w-full bg-white dark:bg-[#242526] shadow-sm border-b border-gray-200 dark:border-[#3E4042] h-14 flex items-center px-4 justify-between transition-colors",children:[e.jsxs("div",{className:"flex items-center gap-2 flex-1",children:[e.jsx("div",{className:"bg-blue-600 rounded-full p-1 cursor-pointer",onClick:()=>window.location.href="/feed",children:e.jsx("svg",{viewBox:"0 0 24 24",className:"w-8 h-8 text-white fill-current",children:e.jsx("path",{d:"M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"})})}),e.jsxs("div",{className:"hidden md:flex items-center bg-gray-100 dark:bg-[#3A3B3C] rounded-full px-3 py-2 gap-2 w-64",children:[e.jsx(w,{size:18,className:"text-gray-500"}),e.jsx("input",{type:"text",placeholder:"Buscar...",className:"bg-transparent border-none outline-none text-[15px] w-full dark:text-gray-200"})]})]}),e.jsxs("div",{className:"flex items-center gap-2 flex-1 justify-end",children:[e.jsx("button",{className:"p-2 bg-gray-200 dark:bg-[#3A3B3C] dark:text-white rounded-full",children:e.jsx(x,{size:20})}),e.jsxs("div",{className:"relative",children:[e.jsxs("button",{onClick:()=>i(!n),className:"flex items-center gap-1 hover:bg-gray-100 dark:hover:bg-[#4E4F50] p-1 rounded-full relative",children:[e.jsx("div",{className:"w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold border border-gray-200 overflow-hidden shadow-sm",children:r.photo?e.jsx("img",{src:r.photo,className:"w-full h-full object-cover"}):"A"}),e.jsx(g,{size:14,className:"dark:text-white"})]}),n&&e.jsxs("div",{className:"absolute right-0 mt-2 w-80 bg-white dark:bg-[#242526] rounded-xl shadow-2xl border border-gray-200 dark:border-[#3E4042] p-2",children:[e.jsxs("a",{href:"/perfil",className:"flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg",children:[e.jsx("div",{className:"w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-xl overflow-hidden",children:r.photo?e.jsx("img",{src:r.photo,className:"w-full h-full object-cover"}):"A"}),e.jsxs("div",{children:[e.jsx("p",{className:"font-bold dark:text-white",children:r.name}),e.jsx("p",{className:"text-sm text-gray-500",children:"Ver perfil"})]})]}),e.jsx("hr",{className:"my-2 dark:border-[#3E4042]"}),e.jsxs("button",{onClick:m,className:"w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg dark:text-white font-medium",children:[o?e.jsx(N,{size:20}):e.jsx(j,{size:20}),e.jsxs("span",{children:["Modo ",o?"Claro":"Oscuro"]})]}),e.jsxs("button",{className:"w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-[#3A3B3C] rounded-lg text-red-600 font-medium",children:[e.jsx(b,{size:20}),e.jsx("span",{children:"Cerrar sesión"})]})]})]})]})]})}export{A as default};
