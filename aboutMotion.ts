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

  gsap.set(chars, {
    opacity: 0,
    x: () => gsap.utils.random(-22, 22),
    y: () => gsap.utils.random(26, 84),
    rotation: () => gsap.utils.random(-9, 9),
    scale: () => gsap.utils.random(0.78, 1.08),
    filter: 'blur(6px)',
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
      filter: 'blur(0px)',
      duration: 1.05,
      ease: 'expo.out',
      stagger: { each: 0.012, from: 'random' },
    },
    position,
  );
};

const animateHabesha = (gsap: any, section: HTMLElement) => {
  if (section.dataset.aboutAnimated === 'true') return;
  section.dataset.aboutAnimated = 'true';

  const habesha = section.querySelector<HTMLElement>('.habesha-word:not(.habesha-word--second)');
  const builders = section.querySelector<HTMLElement>('.habesha-word--second');
  const captionEyebrow = section.querySelector<HTMLElement>('.habesha-caption .eyebrow');
  const captionTitle = section.querySelector<HTMLElement>('.habesha-caption h2');
  const captionCopy = section.querySelector<HTMLElement>('.habesha-caption p');
  const images = Array.from(section.querySelectorAll<HTMLImageElement>('.collage-img'));

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  runSandReveal(gsap, habesha, timeline, 0);
  runSandReveal(gsap, builders, timeline, '-=0.72');

  timeline
    .fromTo(captionEyebrow, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.48 }, '-=0.48');

  runSandReveal(gsap, captionTitle, timeline, '-=0.28');

  timeline.fromTo(
    captionCopy,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.52 },
    '-=0.42',
  );

  const finalRotations = [-3, 2.5, 4];
  const revealOrigins = [
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
        scale: 1.12,
        clipPath: 'inset(48% 8% 48% 8%)',
        filter: 'blur(10px) saturate(.7)',
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: finalRotations[index] ?? 0,
        scale: 1,
        clipPath: 'inset(0% 0% 0% 0%)',
        filter: 'blur(0px) saturate(1)',
        duration: 0.95,
        ease: 'expo.out',
      },
      index === 0 ? '-=0.45' : '-=0.64',
    );
  });

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
};

const animateFounders = (gsap: any, section: HTMLElement) => {
  if (section.dataset.foundersAnimated === 'true') return;
  section.dataset.foundersAnimated = 'true';

  const eyebrow = section.querySelector<HTMLElement>('.founders-title .eyebrow');
  const title = section.querySelector<HTMLElement>('.founders-title h2');
  const intro = section.querySelector<HTMLElement>('.founders-title p');
  const founders = Array.from(section.querySelectorAll<HTMLElement>('.founder'));
  const founderImages = founders.map((founder) => founder.querySelector<HTMLElement>('img, .founder-placeholder'));
  const founderMetas = founders.map((founder) => founder.querySelector<HTMLElement>('.founder-meta'));
  const quote = section.querySelector<HTMLElement>('blockquote');
  const serious = section.querySelector<HTMLElement>('.serious-type');

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  timeline.fromTo(eyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.46 });
  runSandReveal(gsap, title, timeline, '-=0.18');
  timeline.fromTo(intro, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.52 }, '-=0.42');

  founders.forEach((founder, index) => {
    const image = founderImages[index];
    const meta = founderMetas[index];
    const finalRotation = index === 0 ? -2 : 1.4;

    timeline.fromTo(
      founder,
      {
        opacity: 0,
        x: index === 0 ? -90 : 95,
        y: 75,
        rotation: index === 0 ? -8 : 8,
        scale: 0.9,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        rotation: finalRotation,
        scale: 1,
        duration: 0.9,
        ease: 'expo.out',
      },
      index === 0 ? '-=0.18' : '-=0.54',
    );

    if (image) {
      timeline.fromTo(
        image,
        {
          clipPath: 'inset(52% 0% 48% 0%)',
          filter: 'blur(9px) contrast(.84)',
          scale: 1.09,
        },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          filter: 'blur(0px) contrast(1)',
          scale: 1,
          duration: 0.78,
          ease: 'expo.out',
        },
        '-=0.72',
      );
    }

    if (meta) {
      timeline.fromTo(
        meta,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.42 },
        '-=0.44',
      );
    }
  });

  timeline.fromTo(
    quote,
    { opacity: 0, x: -28, y: 18 },
    { opacity: 1, x: 0, y: 0, duration: 0.62 },
    '-=0.26',
  );

  runSandReveal(gsap, serious, timeline, '-=0.32');

  timeline.call(() => {
    founders.forEach((founder, index) => {
      gsap.to(founder, {
        y: index === 0 ? -9 : 8,
        rotation: (index === 0 ? -2 : 1.4) + (index === 0 ? .6 : -.5),
        duration: index === 0 ? 4.8 : 5.3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  });
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
    { threshold: 0.2 },
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
