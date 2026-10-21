const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const pointer = window.matchMedia('(hover: hover) and (pointer: fine)');

document.querySelectorAll<HTMLAnchorElement>('.type-tile').forEach((tile) => {
  let frame = 0;
  tile.addEventListener('pointermove', (event) => {
    if (motion.matches || !pointer.matches) return;
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      const rect = tile.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      tile.style.setProperty('--tilt-x', `${-y * 10}deg`);
      tile.style.setProperty('--tilt-y', `${x * 10}deg`);
    });
  });
  tile.addEventListener('pointerleave', () => {
    window.cancelAnimationFrame(frame);
    tile.style.removeProperty('--tilt-x');
    tile.style.removeProperty('--tilt-y');
  });
});
