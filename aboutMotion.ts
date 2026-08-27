const isCompactMotion = () => window.matchMedia('(max-width: 760px)').matches;

const splitTextForSand = (element: HTMLElement) => {
  if (element.dataset.aboutSandSplit === 'true') return;

  const accessibleText = element.innerText.replace(/\s+/g, ' ').trim();
  if (!accessibleText) return;

  element.dataset.aboutSandSplit = 'true';
  element.setAttribute('aria-label', accessibleText);

  const fragment = document.createDocumentFragment();

  const appendText = (text: string) => {
    const chunks = text.split(/(\s+)/);

    chunks.forEach((chunk) => {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) {
        fragment.appendChild(document.createTextNode(' '));
        return;
      }

      const word = document.createElement('span');
      word.className = 'about-sand-word';
      word.setAttribute('aria-hidden', 'true');

      Array.from(chunk).forEach((character) => {
        const char = document.createElement('span');
        char.className = 'about-sand-char';
        char.textContent = character;
        word.appendChild(char);
      });

      fragment.appendChild(word);
    });
  };

  Array.from(element.childNodes).forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      appendText(node.textContent ?? '');
      return;
    }

    if (node instanceof HTMLBRElement) {
      fragment.appendChild(document.createElement('br'));
      return;
    }

    appendText(node.textContent ?? '');
  });

  element.replaceChildren(fragment);
};

const runSandReveal = (
  gsap: any,
  element: HTMLElement | null,
  timeline: any,
  position?: string | number,
) => {
  if (!element) return;

  splitTextForSand(element);
  const chars = element.querySelectorAll<HTMLElement>('.about-sand-char');
  const compact = isCompactMotion();

  gsap.set(chars, {
    opacity: 0,
    x: () => gsap.utils.random(compact ? -10 : -22, compact ? 10 : 22),
    y: () => gsap.utils.random(compact ? 16 : 26, compact ? 44 : 84),
    rotation: () => gsap.utils.random(compact ? -4 : -9, compact ? 4 : 9),
    scale: () => gsap.utils.random(compact ? 0.9 : 0.78, compact ? 1.04 : 1.08),
    filter: compact ? 'none' : 'blur(6px)',
    transformOrigin: '50% 100%',
  });

  timeline.to(
    chars,
    {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      filter: 'none',
      duration: compact ? 0.72 : 1.05,
      ease: 'expo.out',
      stagger: { each: compact ? 0.008 : 0.012, from: 'random' },
    },
    position,
  );
};

const animateHabesha = (gsap: any, section: HTMLElement) => {
  if (section.dataset.aboutAnimated === 'true') return;
  section.dataset.aboutAnimated = 'true';

  const compact = isCompactMotion();
  const habesha = section.querySelector<HTMLElement>('.habesha-word:not(.habesha-word--second)');
  const builders = section.querySelector<HTMLElement>('.habesha-word--second');
  const captionEyebrow = section.querySelector<HTMLElement>('.habesha-caption .eyebrow');
  const captionTitle = section.querySelector<HTMLElement>('.habesha-caption h2');
  const captionCopy = section.querySelector<HTMLElement>('.habesha-caption p');
  const images = Array.from(section.querySelectorAll<HTMLImageElement>('.collage-img'));

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  runSandReveal(gsap, habesha, timeline, 0);
  runSandReveal(gsap, builders, timeline, compact ? '-=0.48' : '-=0.72');

  timeline.fromTo(
    captionEyebrow,
    { opacity: 0, y: compact ? 10 : 18 },
    { opacity: 1, y: 0, duration: compact ? 0.34 : 0.48 },
    compact ? '-=0.3' : '-=0.48',
  );

  runSandReveal(gsap, captionTitle, timeline, compact ? '-=0.2' : '-=0.28');

  timeline.fromTo(
    captionCopy,
    { opacity: 0, y: compact ? 10 : 18 },
    { opacity: 1, y: 0, duration: compact ? 0.36 : 0.52 },
    compact ? '-=0.28' : '-=0.42',
  );

  const finalRotations = compact ? [-2, 1.5, 2] : [-3, 2.5, 4];
  const revealOrigins = compact
    ? [
        { x: 26, y: 30, rotation: -4 },
        { x: 30, y: 12, rotation: 4 },
        { x: -24, y: 28, rotation: -3 },
      ]
    : [
        { x: 90, y: 70, rotation: -9 },
        { x: 110, y: -10, rotation: 9 },
        { x: -70, y: 80, rotation: -7 },
      ];

  images.forEach((image, index) => {
    const origin = revealOrigins[index] ?? revealOrigins[0];
    timeline.fromTo(
      image,
      {
        opacity: 0,
        x: origin.x,
        y: origin.y,
        rotation: origin.rotation,
        scale: compact ? 1.035 : 1.12,
        clipPath: compact ? 'inset(18% 4% 18% 4%)' : 'inset(48% 8% 48% 8%)',
        filter: compact ? 'none' : 'blur(10px) saturate(.7)',
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: finalRotations[index] ?? 0,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'none',
        duration: compact ? 0.62 : 0.95,
        ease: 'expo.out',
      },
      index === 0 ? (compact ? '-=0.28' : '-=0.45') : (compact ? '-=0.42' : '-=0.64'),
    );
  });

  // Desktop keeps the slow editorial float. Mobile stops after the entrance so
  // this section cannot keep consuming frames after the user scrolls away.
  if (!compact) {
    timeline.call(() => {
      images.forEach((image, index) => {
        gsap.to(image, {
          y: index % 2 === 0 ? -8 : 8,
          x: index === 1 ? 5 : -4,
          rotation: (finalRotations[index] ?? 0) + (index % 2 === 0 ? 0.7 : -0.7),
          duration: 4.6 + index * 0.5,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    });
  }
};

const animateFounders = (gsap: any, section: HTMLElement) => {
  if (section.dataset.foundersAnimated === 'true') return;
  section.dataset.foundersAnimated = 'true';

  const compact = isCompactMotion();
  const eyebrow = section.querySelector<HTMLElement>('.founders-title .eyebrow');
  const title = section.querySelector<HTMLElement>('.founders-title h2');
  const intro = section.querySelector<HTMLElement>('.founders-title p');
  const founders = Array.from(section.querySelectorAll<HTMLElement>('.founder'));
  const founderImages = founders.map((founder) => founder.querySelector<HTMLElement>('img, .founder-placeholder'));
  const founderMetas = founders.map((founder) => founder.querySelector<HTMLElement>('.founder-meta'));
  const quote = section.querySelector<HTMLElement>('blockquote');
  const serious = section.querySelector<HTMLElement>('.serious-type');

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  timeline.fromTo(
    eyebrow,
    { opacity: 0, y: compact ? 10 : 16 },
    { opacity: 1, y: 0, duration: compact ? 0.32 : 0.46 },
  );
  runSandReveal(gsap, title, timeline, compact ? '-=0.12' : '-=0.18');
  timeline.fromTo(
    intro,
    { opacity: 0, y: compact ? 12 : 20 },
    { opacity: 1, y: 0, duration: compact ? 0.36 : 0.52 },
    compact ? '-=0.28' : '-=0.42',
  );

  founders.forEach((founder, index) => {
    const image = founderImages[index];
    const meta = founderMetas[index];
    const finalRotation = compact ? 0 : index === 0 ? -2 : 1.4;

    timeline.fromTo(
      founder,
      {
        opacity: 0,
        x: compact ? (index === 0 ? -22 : 22) : index === 0 ? -90 : 95,
        y: compact ? 34 : 75,
        rotation: compact ? (index === 0 ? -2 : 2) : index === 0 ? -8 : 8,
        scale: compact ? 0.97 : 0.9,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: finalRotation,
        scale: 1,
        duration: compact ? 0.62 : 0.9,
        ease: 'expo.out',
      },
      index === 0 ? (compact ? '-=0.08' : '-=0.18') : (compact ? '-=0.28' : '-=0.54'),
    );

    if (image) {
      timeline.fromTo(
        image,
        {
          clipPath: compact ? 'inset(16% 0% 16% 0%)' : 'inset(52% 0% 48% 0%)',
          filter: compact ? 'none' : 'blur(9px) contrast(.84)',
          scale: compact ? 1.025 : 1.09,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          filter: 'none',
          scale: 1,
          duration: compact ? 0.52 : 0.78,
          ease: 'expo.out',
        },
        compact ? '-=0.48' : '-=0.72',
      );
    }

    if (meta) {
      timeline.fromTo(
        meta,
        { opacity: 0, y: compact ? 10 : 18 },
        { opacity: 1, y: 0, duration: compact ? 0.3 : 0.42 },
        compact ? '-=0.3' : '-=0.44',
      );
    }
  });

  timeline.fromTo(
    quote,
    { opacity: 0, x: compact ? 0 : -28, y: compact ? 12 : 18 },
    { opacity: 1, x: 0, y: 0, duration: compact ? 0.4 : 0.62 },
    compact ? '-=0.14' : '-=0.26',
  );

  runSandReveal(gsap, serious, timeline, compact ? '-=0.2' : '-=0.32');

  if (!compact) {
    timeline.call(() => {
      founders.forEach((founder, index) => {
        gsap.to(founder, {
          y: index === 0 ? -9 : 8,
          rotation: (index === 0 ? -2 : 1.4) + (index === 0 ? 0.6 : -0.5),
          duration: index === 0 ? 4.8 : 5.3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    });
  }
};

const waitForAbout = (attempt = 0) => {
  const about = document.querySelector<HTMLElement>('.about');
  const gsap = (window as any).gsap;

  if (!about || !gsap) {
    if (attempt < 120) requestAnimationFrame(() => waitForAbout(attempt + 1));
    return;
  }

  if (about.dataset.aboutGsapReady === 'true') return;
  about.dataset.aboutGsapReady = 'true';
  about.classList.add('about--motion');

  about.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    element.classList.add('is-visible');
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const collage = about.querySelector<HTMLElement>('.habesha-collage');
  const founders = about.querySelector<HTMLElement>('.founders');

  if (!collage || !founders) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target === collage) animateHabesha(gsap, collage);
        if (entry.target === founders) animateFounders(gsap, founders);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.22 },
  );

  observer.observe(collage);
  observer.observe(founders);
};

export const initAboutMotion = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForAbout(), { once: true });
    return;
  }

  requestAnimationFrame(() => waitForAbout());
};
