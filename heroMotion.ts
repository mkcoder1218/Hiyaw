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
  const healthCanvas = hero.querySelector<HTMLElement>('.hero-mini-card');

  if (!headline || !art || !codeCanvas || !mainCanvas || !phoneCanvas || !healthCanvas) return;

  hero.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    element.classList.add('is-visible');
  });

  if (prefersReducedMotion) return;

  splitHeadlineIntoSand(headline);

  const characters = headline.querySelectorAll<HTMLElement>('.sand-char');
  const dashboardLines = mainCanvas.querySelectorAll<HTMLElement>('.ui-heading, .ui-line, .ui-grid span');
  const sidebarItems = mainCanvas.querySelectorAll<HTMLElement>('.interface-sidebar i');
  const chartBars = mainCanvas.querySelectorAll<HTMLElement>('.interface-chart span');
  const healthBars = healthCanvas.querySelectorAll<HTMLElement>('.mini-bars i');

  gsap.set(characters, {
    opacity: 0,
    y: () => gsap.utils.random(38, 118),
    x: () => gsap.utils.random(-26, 26),
    rotation: () => gsap.utils.random(-12, 12),
    scale: () => gsap.utils.random(0.72, 1.12),
    filter: 'blur(7px)',
    transformOrigin: '50% 100%',
    willChange: 'transform, opacity, filter',
  });

  gsap.set([codeCanvas, mainCanvas, phoneCanvas, healthCanvas], {
    opacity: 0,
    willChange: 'transform, opacity',
  });

  const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });

  entrance
    .fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55 })
    .to(
      characters,
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.35,
        ease: 'expo.out',
        stagger: { each: 0.018, from: 'random' },
      },
      '-=0.18',
    )
    .fromTo(copy, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.65')
    .fromTo(actions, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.62, stagger: 0.1 }, '-=0.42')
    .fromTo(
      codeCanvas,
      { opacity: 0, x: -120, y: -52, rotation: -4, scale: 0.9 },
      { opacity: 1, x: 0, y: 0, rotation: -1.2, scale: 1, duration: 0.9, ease: 'back.out(1.35)' },
      '-=0.18',
    )
    .fromTo(
      mainCanvas,
      { opacity: 0, x: 150, y: 48, rotation: 3.2, scale: 0.9 },
      { opacity: 1, x: 0, y: 0, rotation: 0.4, scale: 1, duration: 1.05, ease: 'back.out(1.2)' },
      '-=0.48',
    )
    .fromTo(
      sidebarItems,
      { opacity: 0, x: -12, scaleX: 0.35 },
      { opacity: 1, x: 0, scaleX: 1, duration: 0.34, stagger: 0.055 },
      '-=0.48',
    )
    .fromTo(
      dashboardLines,
      { opacity: 0, scaleX: 0, transformOrigin: 'left center' },
      { opacity: 1, scaleX: 1, duration: 0.42, stagger: 0.055 },
      '-=0.42',
    )
    .fromTo(
      chartBars,
      { opacity: 0, scaleY: 0, transformOrigin: 'center bottom' },
      { opacity: 1, scaleY: 1, duration: 0.5, stagger: 0.07, ease: 'back.out(1.4)' },
      '-=0.36',
    )
    .fromTo(
      phoneCanvas,
      { opacity: 0, x: -64, y: 170, rotation: -9, scale: 0.82 },
      { opacity: 1, x: 0, y: 0, rotation: -1.8, scale: 1, duration: 0.92, ease: 'back.out(1.45)' },
      '-=0.42',
    )
    .fromTo(
      healthCanvas,
      { opacity: 0, x: 100, y: 120, rotation: 4, scale: 0.84 },
      { opacity: 1, x: 0, y: 0, rotation: 1, scale: 1, duration: 0.92, ease: 'back.out(1.4)' },
      '-=0.5',
    )
    .fromTo(
      healthBars,
      { scaleY: 0, transformOrigin: 'center bottom' },
      { scaleY: 1, duration: 0.45, stagger: 0.06, ease: 'back.out(1.6)' },
      '-=0.42',
    )
    .call(() => {
      gsap.to(codeCanvas, {
        x: -7,
        y: -11,
        rotation: -0.5,
        duration: 4.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(mainCanvas, {
        x: 6,
        y: -13,
        rotation: -0.25,
        duration: 5.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(phoneCanvas, {
        x: -4,
        y: -17,
        rotation: 1.4,
        duration: 3.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
      gsap.to(healthCanvas, {
        x: 8,
        y: -10,
        rotation: -0.8,
        duration: 4.7,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
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
