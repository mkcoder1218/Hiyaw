const HABESHA_COLLAGE_IMAGES = [
  {
    selector: '.collage-img--1',
    src: 'https://images.pexels.com/photos/30690402/pexels-photo-30690402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&hyaw=20260826-3',
    alt: 'African women collaborating with laptops in a modern office',
  },
  {
    selector: '.collage-img--2',
    src: 'https://images.pexels.com/photos/7993903/pexels-photo-7993903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&hyaw=20260826-3',
    alt: 'African professionals discussing a project together in the office',
  },
  {
    selector: '.collage-img--3',
    src: 'https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1&hyaw=20260826-3',
    alt: 'African team members working together around a laptop',
  },
] as const;

let installed = false;
let observer: MutationObserver | null = null;

const normalizeUrl = (value: string) => {
  try {
    return new URL(value, window.location.href).href;
  } catch {
    return value;
  }
};

const applyHabeshaCollageSwap = () => {
  let found = 0;

  HABESHA_COLLAGE_IMAGES.forEach(({ selector, src, alt }) => {
    const image = document.querySelector<HTMLImageElement>(selector);
    if (!image) return;
    found += 1;

    const targetSrc = normalizeUrl(src);
    if (image.src !== targetSrc) image.src = src;

    if (image.hasAttribute('srcset')) image.removeAttribute('srcset');
    if (image.hasAttribute('sizes')) image.removeAttribute('sizes');
    if (image.alt !== alt) image.alt = alt;
    if (image.loading !== 'eager') image.loading = 'eager';
    if (image.decoding !== 'async') image.decoding = 'async';
    if (image.getAttribute('fetchpriority') !== 'high') image.setAttribute('fetchpriority', 'high');
    if (image.dataset.hyawCollageSource !== 'habesha-v3') {
      image.dataset.hyawCollageSource = 'habesha-v3';
    }
  });

  return found === HABESHA_COLLAGE_IMAGES.length;
};

export const initHabeshaCollageSwap = () => {
  if (installed) return;
  installed = true;

  const root = document.getElementById('root') ?? document.documentElement;

  // Keep this observer alive. App.tsx still owns the legacy JSX source values,
  // and React can reconcile those attributes again after any state update.
  // Watching src/srcset changes means the Habesha imagery is restored in the
  // same mutation turn instead of allowing the old photos to come back.
  observer = new MutationObserver(() => {
    applyHabeshaCollageSwap();
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'srcset', 'sizes'],
  });

  applyHabeshaCollageSwap();

  // Concurrent React mounting can happen after this module initializes. Retry
  // briefly for first mount; the persistent observer handles every rerender.
  let attempts = 0;
  const retry = () => {
    if (applyHabeshaCollageSwap()) return;
    attempts += 1;
    if (attempts < 120) requestAnimationFrame(retry);
  };

  requestAnimationFrame(retry);
};
