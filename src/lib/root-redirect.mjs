// Handle the local origin before Astro applies its deployment base.
export default function rootRedirect(base) {
  const destination = `${base.replace(/\/$/, '')}/`;

  function redirect(request, response, next) {
    const url = new URL(request.url ?? '/', 'http://localhost');
    if (url.pathname !== '/') return next();

    response.writeHead(302, {
      Location: `${destination}${url.search}`,
      'Cache-Control': 'no-store',
    });
    response.end();
  }

  return {
    name: 'zormz-root-redirect',
    enforce: 'post',
    configureServer(server) {
      // Astro prepends its base-path guard after Vite configures the server.
      // Register last, then put this root-only redirect before that guard.
      return () => {
        server.middlewares.stack.unshift({ route: '', handle: redirect });
      };
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}
