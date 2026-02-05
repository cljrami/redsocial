import { c as createComponent, r as renderComponent, a as renderTemplate } from '../chunks/astro/server_Bkis9C0d.mjs';
import 'piccolore';
import 'html-escaper';
import { $ as $$Layout } from '../chunks/Layout_DSKr1Ere.mjs';
export { renderers } from '../renderers.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Facebook - Iniciar sesi\xF3n o registrarse" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LoginForm", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/components/auth/LoginForm", "client:component-export": "default" })} ` })}`;
}, "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/pages/index.astro", void 0);

const $$file = "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
