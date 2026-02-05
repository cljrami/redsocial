import { c as createComponent, b as renderHead, d as renderSlot, a as renderTemplate, e as createAstro } from './astro/server_Bkis9C0d.mjs';
import 'piccolore';
import 'html-escaper';
import 'clsx';
/* empty css                        */

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="description" content="Red Social La Foresta"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><title>${title}</title>${renderHead()}</head> <body class="bg-[#F0F2F5]"> <nav class="bg-white shadow-sm sticky top-0 z-50 h-14 flex items-center px-4"> <div class="max-w-7xl mx-auto w-full flex justify-between items-center"> <h1 class="text-2xl font-bold text-blue-600">la foresta</h1> </div> </nav> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "C:/Users/jrami/Desktop/httpdocs/Proyextos_Personales/laforesta.zona8.cl/redsocial/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
