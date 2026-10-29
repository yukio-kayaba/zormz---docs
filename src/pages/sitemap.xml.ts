import type { APIRoute } from 'astro';

// Discover actual documentation routes so new guides are included automatically.
const documents = import.meta.glob('./docs/*.md');

export const GET: APIRoute = ({ site }) => {
  if (!site)
    throw new Error('Configure Astro site before generating the sitemap.');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const paths = [
    '/',
    ...Object.keys(documents)
      .sort()
      .map((path) => `/docs/${path.split('/').at(-1)!.replace(/\.md$/, '')}/`),
  ];
  const escapeXml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  const urls = paths
    .map(
      (path) =>
        `<url><loc>${escapeXml(new URL(`${base}${path}`, site).href)}</loc></url>`,
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    {
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    },
  );
};
