export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function withoutBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return path === base
    ? '/'
    : path.startsWith(`${base}/`)
      ? path.slice(base.length)
      : path;
}
