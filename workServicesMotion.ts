type GsapInstance = {
  timeline: (vars?: Record<string, unknown>) => any;
  set: (targets: any, vars: Record<string, unknown>) => any;
  to: (targets: any, vars: Record<string, unknown>) => any;
  fromTo: (targets: any, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => any;
};

declare global {
  interface Window {
    gsap?: GsapInstance;
  }
}

const revealDataElements = (root: Element) => {
  if (root instanceof HTMLElement && root.matches('[data-reveal]')) {
    root.classList.add('is-visible');
  }

  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
    element.classList.add('is-visible');
  });
};

const animateArchitecture = (section: HTMLElement, gsap: GsapInstance) => {
  if (section.dataset.gsapArchitecture === 'true') return;
  section.dataset.gsapArchitecture = 'true';
  revealDataElements(section);

  const copy = section.querySelector<HTMLElement>('.project-copy');
  const index = copy?.querySelector<HTMLElement>('.project-index');
  const title = copy?.querySelector<HTMLElement>('h3');
  const description = copy?.querySelector<HTMLElement>('p');
  const meta = copy?.querySelector<HTMLElement>('.project-meta');
  const link = copy?.querySelector<HTMLElement>('a');
  const graphic = section.querySelector<HTMLElement>('.architecture-graphic');
  const planes = Array.from(section.querySelectorAll<HTMLElement>('.arch-plane'));
  const labels = Array.from(section.querySelectorAll<HTMLElement>('.arch-label'));

  if (!copy || !graphic || !planes.length) return;

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  timeline
    .fromTo(index, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.42 })
    .fromTo(title, { opacity: 0, y: 54, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.82, ease: 'expo.out' }, '-=0.16')
    .fromTo(description, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.56 }, '-=0.42')
    .fromTo(meta, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45 }, '-=0.32')
    .fromTo(link, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.45 }, '-=0.28')
    .fromTo(graphic, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.35 }, '-=0.35');

  planes.forEach((plane, indexValue) => {
    const label = labels[indexValue];
    const direction = indexValue % 2 === 0 ? -1 : 1;

    timeline.fromTo(
      plane,
      {
        opacity: 0,
        x: direction * 54,
        y: 36,
        scaleX: 0.72,
        scaleY: 0.88,
        rotation: direction * 1.6,
      },
      {
        opacity: 1,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
        duration: 0.62,
        ease: 'back.out(1.35)',
      },
      indexValue === 0 ? '-=0.1' : '-=0.38',
    );

    if (label) {
      timeline.fromTo(
        label,
        { opacity: 0, x: direction * 20, y: 8 },
        { opacity: 1, x: 0, y: 0, duration: 0.34 },
        '-=0.42',
      );
    }
  });

  timeline.call(() => {
    planes.forEach((plane, indexValue) => {
      gsap.to(plane, {
        y: indexValue % 2 === 0 ? -6 : 6,
        duration: 3.6 + indexValue * 0.45,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  });
};

const animateServices = (section: HTMLElement, gsap: GsapInstance) => {
  if (section.dataset.gsapServices === 'true') return;
  section.dataset.gsapServices = 'true';
  revealDataElements(section);

  const intro = section.querySelector<HTMLElement>('.services-intro');
  const eyebrow = intro?.querySelector<HTMLElement>('.eyebrow');
  const title = intro?.querySelector<HTMLElement>('h2');
  const description = intro?.querySelector<HTMLElement>('p');
  const rows = Array.from(section.querySelectorAll<HTMLElement>('.service-row'));
  const orbit = section.querySelector<HTMLElement>('.services-orbit');
  const orbitCards = Array.from(section.querySelectorAll<HTMLElement>('.orbit-card'));

  if (!intro || !rows.length || !orbit) return;

  gsap.set(orbit, { '--orbit-line-scale': 0 } as any);

  const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

  timeline
    .fromTo(eyebrow, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 })
    .fromTo(title, { opacity: 0, y: 56, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.82, ease: 'expo.out' }, '-=0.12')
    .fromTo(description, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.56 }, '-=0.4')
    .fromTo(
      rows,
      { opacity: 0, y: 34 },
      { opacity: 1, y: 0, duration: 0.56, stagger: 0.105 },
      '-=0.22',
    );

  rows.forEach((row, rowIndex) => {
    const number = row.querySelector<HTMLElement>('span');
    const heading = row.querySelector<HTMLElement>('strong');
    const text = row.querySelector<HTMLElement>('p');
    const position = `-=${Math.max(0.48 - rowIndex * 0.02, 0.32)}`;

    timeline
      .fromTo(number, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.28 }, position)
      .fromTo(heading, { opacity: 0, x: -18 }, { opacity: 1, x: 0, duration: 0.36 }, '-=0.2')
      .fromTo(text, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.4 }, '-=0.27');
  });

  timeline
    .to(orbit, { '--orbit-line-scale': 1, duration: 0.9, ease: 'power2.inOut' } as any, '-=0.72')
    .fromTo(
      orbitCards,
      { opacity: 0, scale: 0.72, y: 24 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.15, ease: 'back.out(1.45)' },
      '-=0.54',
    )
    .call(() => {
      orbitCards.forEach((card, indexValue) => {
        gsap.to(card, {
          y: indexValue % 2 === 0 ? -5 : 5,
          duration: 3.3 + indexValue * 0.4,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
      });
    });
};

const waitForSections = (attempt = 0) => {
  const gsap = window.gsap;
  const architecture = document.querySelector<HTMLElement>('.project--architecture');
  const services = document.querySelector<HTMLElement>('.services');

  if (!gsap || !architecture || !services) {
    if (attempt < 120) window.requestAnimationFrame(() => waitForSections(attempt + 1));
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealDataElements(architecture);
    revealDataElements(services);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const target = entry.target as HTMLElement;
        if (target.matches('.project--architecture')) animateArchitecture(target, gsap);
        if (target.matches('.services')) animateServices(target, gsap);
        instance.unobserve(target);
      });
    },
    { threshold: 0.22, rootMargin: '0px 0px -8% 0px' },
  );

  observer.observe(architecture);
  observer.observe(services);
};

export const initWorkServicesMotion = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForSections(), { once: true });
    return;
  }

  window.requestAnimationFrame(() => waitForSections());
};

export {};
