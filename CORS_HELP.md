# Guía de Solución de Problemas CORS

## ¿Por qué me da error CORS?

El error CORS (Cross-Origin Resource Sharing) es una medida de seguridad del navegador. Ocurre cuando tu sitio web (ej. `http://localhost:4321`) intenta solicitar recursos a un servidor diferente (ej. `https://api.mi-backend.com`) y ese servidor no responde con los encabezados adecuados que permitan el acceso.

### Estado Actual del Proyecto
He revisado el código actual de este repositorio y **no encontré ninguna petición HTTP (fetch, axios)** en los archivos visibles. Esto sugiere dos posibilidades:
1. El código que causa el error está en tus cambios locales que aún no has subido.
2. Estás intentando acceder a una API externa que no está configurada para aceptar peticiones desde `localhost`.

## ¿Cómo solucionarlo?

Tienes principalmente dos opciones:

### Opción 1: Configurar el Backend (Recomendado)
Si tienes control sobre el servidor API al que estás llamando, debes configurarlo para que devuelva el encabezado `Access-Control-Allow-Origin`.

Por ejemplo, si tu frontend está en `http://localhost:4321`, tu backend debe responder con:
`Access-Control-Allow-Origin: http://localhost:4321`

### Opción 2: Usar un Proxy en Astro (Solo Desarrollo)
Si no puedes cambiar el backend, puedes configurar Astro para que actúe como intermediario (proxy). De esta manera, el navegador hace la petición a Astro (mismo origen) y Astro la reenvía a la API externa.

He añadido un ejemplo de configuración en `astro.config.mjs` que puedes descomentar y ajustar.

```javascript
// astro.config.mjs
export default defineConfig({
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'https://api.externa.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  },
});
```

Con esto, en tu código frontend harías:
```javascript
// En lugar de fetch('https://api.externa.com/datos')
fetch('/api/datos');
```
