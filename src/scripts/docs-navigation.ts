const menu = document.querySelector<HTMLDetailsElement>(
  '[data-current-reference]',
);

if (menu) {
  const links = [
    ...menu.querySelectorAll<HTMLAnchorElement>('.query-children a'),
  ];
  const overview = links.find((link) => !link.hash);
  const sections = links.flatMap((link) => {
    const heading =
      link.hash &&
      document.getElementById(decodeURIComponent(link.hash.slice(1)));
    return heading ? [{ link, heading }] : [];
  });

  function activate(active: HTMLAnchorElement | undefined) {
    for (const link of links) {
      if (link === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function followScroll() {
    let active = overview;
    for (const { link, heading } of sections) {
      const offset =
        Number.parseFloat(getComputedStyle(heading).scrollMarginTop) || 110;
      if (heading.getBoundingClientRect().top <= offset + 8) active = link;
    }
    activate(active);
  }

  function followHash() {
    const active = links.find((link) => link.hash === window.location.hash);
    if (active) activate(active);
    else followScroll();
  }

  // Coalesce scroll events; keep the URL and browser history untouched.
  let scheduled = false;
  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      followScroll();
    });
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('hashchange', followHash);
  window.addEventListener('pageshow', () => {
    if (window.location.hash) followHash();
    else followScroll();
  });
  followHash();
}
