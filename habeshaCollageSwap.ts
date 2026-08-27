const HABESHA_COLLAGE_IMAGES = [
  {
    selector: '.collage-img--1',
    src: 'https://images.pexels.com/photos/30690402/pexels-photo-30690402.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&dpr=1&hyaw=20260827-1',
    alt: 'African women collaborating with laptops in a modern office',
  },
  {
    selector: '.collage-img--2',
    src: 'https://images.pexels.com/photos/7993903/pexels-photo-7993903.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&dpr=1&hyaw=20260827-1',
    alt: 'African professionals discussing a project together in the office',
  },
  {
    selector: '.collage-img--3',
    src: 'https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg?auto=compress&cs=tinysrgb&w=900&h=650&dpr=1&hyaw=20260827-1',
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

    // The collage is far below the fold. Eager/high-priority loading was
    // competing with the hero and animation code on mobile.
    image.loading = 'lazy';
    image.decoding = 'async';
    image.setAttribute('fetchpriority', 'low');
    image.dataset.hyawCollageSource = 'habesha-v4';
  });

  return found === HABESHA_COLLAGE_IMAGES.length;
};

const stopObserver = () => {
  observer?.disconnect();
  observer = null;
};

export const initHabeshaCollageSwap = () => {
  if (installed) return;
  installed = true;

  const root = document.getElementById('root') ?? document.documentElement;

  // Only observe long enough for React's first mount. Keeping an attribute
  // MutationObserver alive for the entire site caused work on every animated
  // DOM change and was a major source of mobile jank.
  observer = new MutationObserver(() => {
    if (applyHabeshaCollageSwap()) stopObserver();
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
  });

  if (applyHabeshaCollageSwap()) {
    stopObserver();
    return;
  }

  let attempts = 0;
  const retry = () => {
    if (applyHabeshaCollageSwap()) {
      stopObserver();
      return;
    }

    attempts += 1;
    if (attempts < 120) requestAnimationFrame(retry);
    else stopObserver();
  };

  requestAnimationFrame(retry);
};
