/**
 * Horizontal scroll strips: testimonials, home portfolio strip, gallery rows. Native
 * overflow scrolling + scroll-snap does the work; this adds arrows, mouse drag and dots
 * (style guide §10.7, §10.8). No carousel library, no autoplay.
 *
 * Markup:
 *   <div data-strip>
 *     <div data-strip-track> …slides… </div>
 *     <button data-strip-prev>…</button> <button data-strip-next>…</button>   (optional)
 *     <div data-strip-progress></div>                                          (optional)
 *   </div>
 *
 * Dots are generated into [data-strip-progress], one per "page" of the track, as
 * <button class="strip-seg">. The current one gets .is-active; style them in the component
 * (10px circles, §10.8). Arrows get `disabled` at either end. The track gets .is-grabbing
 * while being dragged.
 */

const pages = (t: HTMLElement) => Math.max(1, Math.ceil((t.scrollWidth - 1) / t.clientWidth));
const current = (t: HTMLElement) => {
  const max = t.scrollWidth - t.clientWidth;
  if (max <= 0) return 0;
  return Math.round((t.scrollLeft / max) * (pages(t) - 1));
};

function init(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('[data-strip-track]');
  if (!track || root.dataset.stripReady) return;
  root.dataset.stripReady = '';

  const prev = root.querySelector<HTMLButtonElement>('[data-strip-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-strip-next]');
  const progress = root.querySelector<HTMLElement>('[data-strip-progress]');

  const step = () => {
    const card = track.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardW = card ? card.getBoundingClientRect().width + gap : track.clientWidth;
    return Math.max(cardW, Math.floor(track.clientWidth / cardW) * cardW);
  };
  prev?.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  const render = () => {
    const max = track.scrollWidth - track.clientWidth;
    if (prev) prev.disabled = track.scrollLeft <= 1;
    if (next) next.disabled = track.scrollLeft >= max - 1;

    if (progress) {
      const n = pages(track);
      progress.hidden = n < 2;
      if (progress.childElementCount !== n) {
        progress.replaceChildren(
          ...Array.from({ length: n }, (_, i) => {
            const seg = document.createElement('button');
            seg.type = 'button';
            seg.className = 'strip-seg';
            seg.setAttribute('aria-label', `Go to page ${i + 1} of ${n}`);
            seg.addEventListener('click', () =>
              track.scrollTo({ left: (i / Math.max(1, n - 1)) * max, behavior: 'smooth' }),
            );
            return seg;
          }),
        );
      }
      const active = current(track);
      [...progress.children].forEach((seg, i) => seg.classList.toggle('is-active', i === active));
    }
  };

  let raf = 0;
  track.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(render);
  }, { passive: true });
  new ResizeObserver(render).observe(track);

  // Mouse drag-to-scroll. Touch and pen already scroll natively.
  let startX = 0;
  let startLeft = 0;
  let moved = false;
  track.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    startX = e.clientX;
    startLeft = track.scrollLeft;
    moved = false;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', (e) => {
    if (!track.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 4) {
      moved = true;
      track.classList.add('is-grabbing');
    }
    if (moved) track.scrollLeft = startLeft - dx;
  });
  const end = (e: PointerEvent) => {
    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    track.classList.remove('is-grabbing');
  };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
  // Swallow the click that ends a drag so cards/links underneath don't fire.
  track.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      e.stopPropagation();
      moved = false;
    }
  }, true);

  render();
}

export function initStrips(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>('[data-strip]').forEach(init);
}

initStrips();
