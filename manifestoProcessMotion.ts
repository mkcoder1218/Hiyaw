type GsapLike = {
  timeline: (vars?: Record<string, unknown>) => any;
  set: (targets: any, vars: Record<string, unknown>) => void;
  fromTo: (targets: any, fromVars: Record<string, unknown>, toVars: Record<string, unknown>) => any;
  to: (targets: any, vars: Record<string, unknown>) => any;
};

declare global {
  interface Window {
    gsap?: GsapLike;
  }
}

const waitForGsap = (callback: (gsap: GsapLike) => void, attempt = 0) => {
  const gsap = window.gsap;
  if (gsap) {
    callback(gsap);
    return;
  }

  if (attempt < 120) {
    window.requestAnimationFrame(() => waitForGsap(callback, attempt + 1));
  }
};

const observeOnce = (element: Element, onEnter: () => void, threshold = 0.2) => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      onEnter();
    },
    { threshold, rootMargin: '0px 0px -8% 0px' },
  );

  observer.observe(element);
};

const animateManifesto = (gsap: GsapLike) => {
  const section = document.querySelector<HTMLElement>('.why');
  if (!section || section.dataset.manifestoMotion === 'ready') return;

  section.dataset.manifestoMotion = 'ready';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const label = section.querySelector<HTMLElement>('.why-label');
  const principles = Array.from(section.querySelectorAll<HTMLElement>('.principle'));

  if (!principles.length) return;

  principles.forEach((principle) => principle.classList.add('is-visible'));
  label?.classList.add('is-visible');

  const titleOf = (index: number) => principles[index]?.querySelector<HTMLElement>('h3');
  const numberOf = (index: number) => principles[index]?.querySelector<HTMLElement>(':scope > span');
  const copyOf = (index: number) => principles[index]?.querySelector<HTMLElement>('p');

  gsap.set(principles, { opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (label) {
    tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45 });
  }

  tl.fromTo(
    principles[0],
    { opacity: 0 },
    { opacity: 1, duration: 0.01 },
    '-=0.05',
  )
    .fromTo(
      numberOf(0),
      { opacity: 0, x: -18 },
      { opacity: 1, x: 0, duration: 0.42 },
      '<',
    )
    .fromTo(
      titleOf(0),
      { opacity: 0, y: 46, skewY: 3, clipPath: 'inset(100% 0 0 0)' },
      { opacity: 1, y: 0, skewY: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.82 },
      '-=0.18',
    )
    .fromTo(
      copyOf(0),
      { opacity: 0, x: 26 },
      { opacity: 1, x: 0, duration: 0.55 },
      '-=0.36',
    )
    .fromTo(
      principles[1],
      { opacity: 0, x: 46, y: 12 },
      { opacity: 0.5, x: 0, y: 0, duration: 0.72 },
      '-=0.1',
    )
    .fromTo(
      principles[2],
      { opacity: 0, x: -34, y: 16 },
      { opacity: 1, x: 0, y: 0, duration: 0.62 },
      '-=0.38',
    )
    .fromTo(
      principles[3],
      { opacity: 0, y: 48, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.82, ease: 'back.out(1.18)' },
      '-=0.18',
    );

  tl.call(() => {
    const punchline = titleOf(3);
    if (!punchline) return;

    gsap.to(punchline, {
      y: -5,
      duration: 2.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });
};

const animateProcessState = (gsap: GsapLike, section: HTMLElement) => {
  const copyChildren = Array.from(section.querySelectorAll<HTMLElement>('.process-copy > *'));
  const product = section.querySelector<HTMLElement>('.process-product');
  const productChildren = product ? Array.from(product.children) as HTMLElement[] : [];

  gsap.fromTo(
    copyChildren,
    { opacity: 0, y: 18 },
    { opacity: 1, y: 0, duration: 0.48, stagger: 0.065, ease: 'power3.out' },
  );

  if (!productChildren.length) return;

  const [backplate, data, logic, interfaceLayer] = productChildren;

  if (backplate) {
    gsap.fromTo(
      backplate,
      { opacity: 0, y: 26, scaleX: 0.82 },
      { opacity: 1, y: 0, scaleX: 1, duration: 0.52, ease: 'power3.out' },
    );
  }

  if (data) {
    gsap.fromTo(
      data,
      { opacity: 0, x: 44, y: 12 },
      { opacity: 1, x: 0, y: 0, duration: 0.58, delay: 0.08, ease: 'power3.out' },
    );
  }

  if (logic) {
    gsap.fromTo(
      logic,
      { opacity: 0, x: -42, y: -8 },
      { opacity: 1, x: 0, y: 0, duration: 0.58, delay: 0.16, ease: 'power3.out' },
    );
  }

  if (interfaceLayer) {
    gsap.fromTo(
      interfaceLayer,
      { opacity: 0, y: -30, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.72, delay: 0.22, ease: 'back.out(1.15)' },
    );
  }
};

const animateProcess = (gsap: GsapLike) => {
  const section = document.querySelector<HTMLElement>('.process');
  if (!section || section.dataset.processMotion === 'ready') return;

  section.dataset.processMotion = 'ready';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  const headParts = Array.from(section.querySelectorAll<HTMLElement>('.process-head > *'));
  const navButtons = Array.from(section.querySelectorAll<HTMLButtonElement>('.process-nav button'));
  const stage = section.querySelector<HTMLElement>('.process-stage');

  section.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => element.classList.add('is-visible'));

  const runIntro = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      headParts,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.62, stagger: 0.12 },
    )
      .fromTo(
        navButtons,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.065 },
        '-=0.22',
      )
      .call(() => animateProcessState(gsap, section), undefined, '-=0.05');

    if (stage) {
      gsap.fromTo(
        stage,
        { opacity: 0.94 },
        { opacity: 1, duration: 0.01 },
      );
    }
  };

  observeOnce(section, runIntro, 0.18);

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => animateProcessState(gsap, section));
      });
    });
  });
};

export const initManifestoProcessMotion = () => {
  waitForGsap((gsap) => {
    const manifesto = document.querySelector('.why');
    if (manifesto) {
      observeOnce(manifesto, () => animateManifesto(gsap), 0.16);
    }

    animateProcess(gsap);
  });
};

export {};
