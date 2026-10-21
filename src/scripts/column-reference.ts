function revealColumnReference() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (!id) return;

  const target = document.getElementById(id);
  const panel = target?.closest<HTMLDetailsElement>('.column-reference');
  if (panel) panel.open = true;
}

// Direct links and sidebar links reveal the corresponding type automatically.
window.addEventListener('hashchange', revealColumnReference);
revealColumnReference();
