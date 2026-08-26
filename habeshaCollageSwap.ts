const HABESHA_COLLAGE_IMAGES = [
  {
    selector: '.collage-img--1',
    src: 'https://images.pexels.com/photos/30690402/pexels-photo-30690402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&hyaw=20260826-2',
    alt: 'African women collaborating with laptops in a modern office',
  },
  {
    selector: '.collage-img--2',
    src: 'https://images.pexels.com/photos/7993903/pexels-photo-7993903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&hyaw=20260826-2',
    alt: 'African professionals discussing a project together in the office',
  },
  {
    selector: '.collage-img--3',
    src: 'https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&hyaw=20260826-2',
    alt: 'African team members working together around a laptop',
  },
] as const;

let installed = false;
let observer: MutationObserver | null = null;

const applyHabeshaCollageSwap = () => {
  let replaced = 0;

  HABESHA_COLLAGE_IMAGES.forEach(({ selector, src, alt }) => {
    const image = document.querySelector<HTMLImageElement>(selector);
    if (!image) return;

    // Remove every browser hint that could keep an older responsive/cached source.
    image.removeAttribute('srcset');
    image.removeAttribute('sizes');

    if (image.src !== src) image.src = src;
    image.alt = alt;
    image.loading = 'eager';
    image.decoding = 'async';
    image.setAttribute('fetchpriority', 'high');
    image.dataset.hyawCollageSource = 'habesha-v2';
    replaced += 1;
  });

  if (replaced === HABESHA_COLLAGE_IMAGES.length) {
    observer?.disconnect();
    observer = null;
    return true;
  }

  return false;
};

export const initHabeshaCollageSwap = () => {
  if (installed) return;
  installed = true;

  // Try immediately in case React has already committed.
  if (applyHabeshaCollageSwap()) return;

  // More importantly, watch BEFORE the React tree is committed. MutationObserver
  // runs in the same render turn, so the old placeholder/Unsplash sources are
  // replaced before they can become the visible collage.
  observer = new MutationObserver(() => {
    applyHabeshaCollageSwap();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });

  // Safety retry for hydration/concurrent rendering timing differences.
  let attempts = 0;
  const retry = () => {
    if (!observer) return;
    if (applyHabeshaCollageSwap()) return;
    attempts += 1;
    if (attempts < 120) requestAnimationFrame(retry);
  };

  requestAnimationFrame(retry);
};
