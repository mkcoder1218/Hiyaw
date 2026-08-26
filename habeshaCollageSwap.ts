const HABESHA_COLLAGE_IMAGES = [
  {
    selector: '.collage-img--1',
    src: 'https://images.pexels.com/photos/30690402/pexels-photo-30690402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'African women collaborating with laptops in a modern office',
  },
  {
    selector: '.collage-img--2',
    src: 'https://images.pexels.com/photos/7993903/pexels-photo-7993903.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'African professionals discussing a project together in the office',
  },
  {
    selector: '.collage-img--3',
    src: 'https://images.pexels.com/photos/3894378/pexels-photo-3894378.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'African team members working together around a laptop',
  },
] as const;

const applyHabeshaCollageSwap = () => {
  HABESHA_COLLAGE_IMAGES.forEach(({ selector, src, alt }) => {
    const image = document.querySelector<HTMLImageElement>(selector);
    if (!image) return;

    image.src = src;
    image.alt = alt;
    image.loading = 'lazy';
    image.decoding = 'async';
  });
};

export const initHabeshaCollageSwap = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyHabeshaCollageSwap, { once: true });
    return;
  }

  requestAnimationFrame(applyHabeshaCollageSwap);
};
