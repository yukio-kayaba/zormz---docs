// Markdown links and inline HTML share the same deployment base as Astro pages.
export default function remarkBaseLinks({ base }) {
  const prefix = (url) =>
    url.startsWith('/') && !url.startsWith('//') && !url.startsWith(`${base}/`)
      ? `${base}${url}`
      : url;
  return (tree) => {
    function visit(node) {
      if ((node.type === 'link' || node.type === 'image') && node.url)
        node.url = prefix(node.url);
      if (node.type === 'html')
        node.value = node.value.replace(
          /\b(href|src)=(['"])(\/[^'"]*)\2/g,
          (_, attribute, quote, url) =>
            `${attribute}=${quote}${prefix(url)}${quote}`,
        );
      node.children?.forEach(visit);
    }
    visit(tree);
  };
}
