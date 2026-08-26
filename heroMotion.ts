type GsapInstance = {
  timeline: (vars?: Record<string, unknown>) => any;
  set: (targets: any, vars: Record<string, unknown>) => any;
  to: (targets: any, vars: Record<string, unknown>) => any;
  fromTo: (targets: any, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => any;
  utils: {
    random: (min: number, max: number) => number;
  };
};

declare global {
  interface Window {
    gsap?: GsapInstance;
  }
}

const splitHeadlineIntoSand = (headline: HTMLElement) => {
  if (headline.dataset.sandSplit === 'true') return;

  const text = headline.textContent?.trim();
  if (!text) return;

  headline.dataset.sandSplit = 'true';
  headline.setAttribute('aria-label', text);

  const fragment = document.createDocumentFragment();
  const words = text.split(' ');

  words.forEach((word, wordIndex) => {
    const wordElement = document.createElement('span');
    wordElement.className = 'sand-word';
    wordElement.setAttribute('aria-hidden', 'true');

    Array.from(word).forEach((character, characterIndex) => {
      const characterElement = document.createElement('span');
      characterElement.className = 'sand-char';
      characterElement.textContent = character;
      characterElement.style.setProperty('--sand-index', String(characterIndex));
      wordElement.appendChild(characterElement);
    });

    fragment.appendChild(wordElement);
    if (wordIndex < words.length - 1) fragment.appendChild(document.createTextNode(' '));
  });

  headline.replaceChildren(fragment);
};

const startIdleMotion = (
  gsap: GsapInstance,
  codeCanvas: HTMLElement,
  mainCanvas: HTMLElement,
  phoneCanvas: HTMLElement,
  apiCanvas: HTMLElement,
) => {
  gsap.to(codeCanvas, {
    x: -3,
    y: -5,
    rotation: -0.35,
    duration: 4.8,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  gsap.to(mainCanvas, {
    x: 4,
    y: -6,
    rotation: 0.15,
    duration: 5.7,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  gsap.to(phoneCanvas, {
    x: -2,
    y: -8,
    rotation: -0.8,
    duration: 4.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  gsap.to(apiCanvas, {
    x: 4,
    y: -4,
    rotation: 0.35,
    duration: 5.1,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });
};

const waitForHero = (attempt = 0) => {
  const hero = document.querySelector<HTMLElement>('.hero');
  const gsap = window.gsap;

  if (!hero || !gsap) {
    if (attempt < 120) window.requestAnimationFrame(() => waitForHero(attempt + 1));
    return;
  }

  hero.classList.add('hero--motion');
  if (hero.dataset.gsapReady === 'true') return;
  hero.dataset.gsapReady = 'true';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const headline = hero.querySelector<HTMLElement>('h1');
  const eyebrow = hero.querySelector<HTMLElement>('.hero-copy .eyebrow');
  const copy = hero.querySelector<HTMLElement>('.hero-copy > p');
  const actions = hero.querySelectorAll<HTMLElement>('.hero-actions > *');
  const art = hero.querySelector<HTMLElement>('.hero-art');
  const codeCanvas = hero.querySelector<HTMLElement>('.hero-code');
  const mainCanvas = hero.querySelector<HTMLElement>('.hero-window');
  const phoneCanvas = hero.querySelector<HTMLElement>('.hero-art > .phone');
  const apiCanvas = hero.querySelector<HTMLElement>('.hero-mini-card');

  if (!headline || !art || !codeCanvas || !mainCanvas || !phoneCanvas || !apiCanvas) return;

  codeCanvas.setAttribute('aria-label', 'Deployment status: API contracts generated, workers healthy, production release ready.');
  apiCanvas.setAttribute('aria-label', 'Systems API status: active, 18 modules, 99.9 percent uptime.');
  phoneCanvas.setAttribute('aria-label', 'Mobile interface ready state.');

  hero.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    element.classList.add('is-visible');
  });

  if (prefersReducedMotion) {
    hero.classList.add('hero--assembled');
    return;
  }

  splitHeadlineIntoSand(headline);

  const characters = headline.querySelectorAll<HTMLElement>('.sand-char');
  const dashboardLines = mainCanvas.querySelectorAll<HTMLElement>('.ui-heading, .ui-line, .ui-grid span');
  const sidebarItems = mainCanvas.querySelectorAll<HTMLElement>('.interface-sidebar i');
  const chartBars = mainCanvas.querySelectorAll<HTMLElement>('.interface-chart span');

  gsap.set(characters, {
    opacity: 0,
    y: () => gsap.utils.random(48, 108),
    x: () => gsap.utils.random(-22, 22),
    rotation: () => gsap.utils.random(-9, 9),
    scale: () => gsap.utils.random(0.72, 1.04),
    filter: 'blur(6px)',
    transformOrigin: '50% 100%',
    willChange: 'transform, opacity, filter',
  });

  gsap.set([codeCanvas, mainCanvas, phoneCanvas, apiCanvas], {
    opacity: 0,
    willChange: 'transform, opacity',
  });

  const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });

  entrance
    .fromTo(eyebrow, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.42 })
    .to(
      characters,
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.15,
        ease: 'expo.out',
        stagger: { each: 0.016, from: 'random' },
      },
      '-=0.12',
    )
    .fromTo(copy, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.52 }, '-=0.55')
    .fromTo(actions, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.46, stagger: 0.08 }, '-=0.32')
    .fromTo(
      codeCanvas,
      { opacity: 0, x: -36, y: -12, rotation: -2.2, scale: 0.96 },
      { opacity: 1, x: 0, y: 0, rotation: -0.6, scale: 1, duration: 0.62, ease: 'back.out(1.2)' },
      '-=0.12',
    )
    .fromTo(
      mainCanvas,
      { opacity: 0, x: 38, y: 20, rotation: 1.6, scale: 0.96 },
      { opacity: 1, x: 0, y: 0, rotation: 0, scale: 1, duration: 0.72, ease: 'back.out(1.16)' },
      '-=0.28',
    )
    .fromTo(
      sidebarItems,
      { opacity: 0, x: -8, scaleX: 0.45 },
      { opacity: 1, x: 0, scaleX: 1, duration: 0.25, stagger: 0.045 },
      '-=0.33',
    )
    .fromTo(
      dashboardLines,
      { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
      { opacity: 1, scaleX: 1, duration: 0.32, stagger: 0.045 },
      '-=0.28',
    )
    .fromTo(
      chartBars,
      { opacity: 0, scaleY: 0, transformOrigin: 'center bottom' },
      { opacity: 1, scaleY: 1, duration: 0.38, stagger: 0.055, ease: 'back.out(1.35)' },
      '-=0.22',
    )
    .fromTo(
      phoneCanvas,
      { opacity: 0, x: -24, y: 58, rotation: -5, scale: 0.91 },
      { opacity: 1, x: 0, y: 0, rotation: -1.1, scale: 1, duration: 0.58, ease: 'back.out(1.25)' },
      '-=0.2',
    )
    .fromTo(
      apiCanvas,
      { opacity: 0, x: 30, y: -20, rotation: 2.2, scale: 0.92 },
      { opacity: 1, x: 0, y: 0, rotation: 0.5, scale: 1, duration: 0.58, ease: 'back.out(1.22)' },
      '-=0.23',
    )
    .call(() => {
      hero.classList.add('hero--assembled');
      startIdleMotion(gsap, codeCanvas, mainCanvas, phoneCanvas, apiCanvas);
    });
};

export const initHeroMotion = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForHero(), { once: true });
    return;
  }

  window.requestAnimationFrame(() => waitForHero());
};

export {};
