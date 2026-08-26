const waitForMobileProject = (attempt = 0) => {
  const section = document.querySelector<HTMLElement>('.project--mobile');
  const gsap = (window as Window & { gsap?: any }).gsap;

  if (!section || !gsap) {
    if (attempt < 120) window.requestAnimationFrame(() => waitForMobileProject(attempt + 1));
    return;
  }

  if (section.dataset.mobileGsapReady === 'true') return;
  section.dataset.mobileGsapReady = 'true';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wordmark = section.querySelector<HTMLElement>('.project-wordmark');
  const copy = section.querySelector<HTMLElement>('.project-copy--mobile');
  const index = copy?.querySelector<HTMLElement>('.project-index');
  const title = copy?.querySelector<HTMLElement>('h3');
  const description = copy?.querySelector<HTMLElement>('p');
  const meta = copy?.querySelector<HTMLElement>('.project-meta');
  const link = copy?.querySelector<HTMLElement>('a');
  const phones = Array.from(section.querySelectorAll<HTMLElement>('.phones-cluster .phone'));

  if (!wordmark || !copy || !index || !title || !description || !meta || !link || phones.length < 3) return;

  section.classList.add('project--mobile-motion');

  // The parent article already uses the generic reveal observer. Keep it visible so
  // GSAP owns the movement of this section instead of fighting CSS transitions.
  section.classList.add('is-visible');
  section.style.opacity = '1';
  section.style.transform = 'none';
  section.style.transition = 'none';

  if (prefersReducedMotion) return;

  const [leftPhone, centerPhone, rightPhone] = phones;
  const phoneContent = phones.map((phone) =>
    phone.querySelectorAll<HTMLElement>('.phone-head, .phone-line, .phone-stack span'),
  );

  const resetToInitialState = () => {
    gsap.set(wordmark, { opacity: 0, x: -90, scale: 0.96, transformOrigin: 'left center' });
    gsap.set(index, { opacity: 0, y: -16 });
    gsap.set(title, {
      opacity: 0,
      y: 72,
      clipPath: 'inset(0 0 100% 0)',
      transformOrigin: 'left bottom',
    });
    gsap.set(description, { opacity: 0, y: 28 });
    gsap.set(meta, { opacity: 0, y: 20 });
    gsap.set(link, { opacity: 0, x: -24 });

    gsap.set(leftPhone, {
      opacity: 0,
      x: -170,
      y: 90,
      rotation: -28,
      scale: 0.82,
      transformOrigin: '50% 85%',
    });
    gsap.set(centerPhone, {
      opacity: 0,
      x: 0,
      y: 180,
      rotation: 0,
      scale: 0.82,
      transformOrigin: '50% 85%',
    });
    gsap.set(rightPhone, {
      opacity: 0,
      x: 170,
      y: 100,
      rotation: 28,
      scale: 0.82,
      transformOrigin: '50% 85%',
    });

    phoneContent.forEach((items) => {
      gsap.set(items, { opacity: 0, y: 9, scaleX: 0.72, transformOrigin: 'left center' });
    });
  };

  resetToInitialState();

  let hasPlayed = false;
  let floatStarted = false;

  const startFloating = () => {
    if (floatStarted) return;
    floatStarted = true;

    gsap.to(leftPhone, {
      y: -10,
      rotation: -7.2,
      duration: 3.7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to(centerPhone, {
      y: -14,
      rotation: 0.7,
      duration: 4.2,
      delay: 0.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    gsap.to(rightPhone, {
      y: -9,
      rotation: 8.2,
      duration: 3.9,
      delay: 0.35,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  };

  const play = () => {
    if (hasPlayed) return;
    hasPlayed = true;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(wordmark, {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 1.05,
      ease: 'expo.out',
    })
      .to(
        leftPhone,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: -9,
          scale: 1,
          duration: 1.05,
          ease: 'back.out(1.28)',
        },
        '-=0.55',
      )
      .to(
        centerPhone,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1.08,
          duration: 1.08,
          ease: 'back.out(1.3)',
        },
        '-=0.82',
      )
      .to(
        rightPhone,
        {
          opacity: 1,
          x: 0,
          y: 0,
          rotation: 10,
          scale: 1,
          duration: 1.05,
          ease: 'back.out(1.28)',
        },
        '-=0.8',
      )
      .to(phoneContent[0], { opacity: 1, y: 0, scaleX: 1, duration: 0.32, stagger: 0.045 }, '-=0.56')
      .to(phoneContent[1], { opacity: 1, y: 0, scaleX: 1, duration: 0.32, stagger: 0.045 }, '-=0.46')
      .to(phoneContent[2], { opacity: 1, y: 0, scaleX: 1, duration: 0.32, stagger: 0.045 }, '-=0.44')
      .to(index, { opacity: 1, y: 0, duration: 0.42 }, '-=0.68')
      .to(
        title,
        {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0 0 0% 0)',
          duration: 0.92,
          ease: 'expo.out',
        },
        '-=0.3',
      )
      .to(description, { opacity: 1, y: 0, duration: 0.62 }, '-=0.48')
      .to(meta, { opacity: 1, y: 0, duration: 0.52 }, '-=0.38')
      .to(link, { opacity: 1, x: 0, duration: 0.5 }, '-=0.3')
      .call(startFloating);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          play();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.26, rootMargin: '0px 0px -8% 0px' },
  );

  observer.observe(section);
};

export const initMobileProjectMotion = () => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => waitForMobileProject(), { once: true });
    return;
  }

  window.requestAnimationFrame(() => waitForMobileProject());
};
