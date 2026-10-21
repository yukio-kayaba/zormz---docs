async function copyCode(button: HTMLButtonElement, code: Element) {
  try {
    await navigator.clipboard.writeText(code.textContent ?? '');
    button.textContent = 'Copiado ✓';
  } catch {
    button.textContent = 'No se pudo copiar';
  }
  window.setTimeout(() => {
    button.textContent = 'Copiar';
  }, 1800);
}

// Markdown and home examples share the same copy behavior.
document.querySelectorAll('.doc-content pre').forEach((pre) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'code-wrap';
  pre.replaceWith(wrapper);
  wrapper.append(pre);
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Copiar';
  button.dataset.copy = '';
  button.setAttribute('aria-label', 'Copiar ejemplo');
  button.setAttribute('aria-live', 'polite');
  wrapper.append(button);
});

document
  .querySelectorAll<HTMLButtonElement>('[data-copy]')
  .forEach((button) => {
    const code = button.parentElement?.querySelector('code');
    if (code) button.addEventListener('click', () => copyCode(button, code));
  });
